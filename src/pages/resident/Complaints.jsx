import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { complaintApi } from '@/api/complaintApi'
import { settingsApi } from '@/api/settingsApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { getBaseUrl } from '@/utils/constants'

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  priority: Yup.string().oneOf(['low', 'medium', 'high', 'urgent']).required('Priority is required'),
})

const ResidentComplaints = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [openDialog, setOpenDialog] = useState(false)
  const [attachmentFiles, setAttachmentFiles] = useState([])
  const [filterType, setFilterType] = useState('all') // 'all', 'my', 'public'
  const societyId = user?.society_apartment_id

  // Check visibility settings
  const { data: settingsData } = useSWR(
    societyId ? `/settings/${societyId}` : null,
    () => settingsApi.getSettings(societyId).then((res) => res.data.data || res.data).catch(() => null)
  )

  const complaintLogsVisible = settingsData?.complaint_logs_visible !== false

  // Fetch complaints - backend should return own complaints + public complaints
  const { data, isLoading, mutate } = useSWR(
    complaintLogsVisible ? ['/complaints/my', page, limit] : null,
    () => complaintApi.getAll({ page, limit }).then(res => res.data)
  )

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setAttachmentFiles([])
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const hasAttachments = attachmentFiles.length > 0
      if (hasAttachments) {
        const formData = new FormData()
        formData.append('title', values.title)
        formData.append('description', values.description)
        formData.append('priority', values.priority)
        formData.append('unit_id', user?.unit_id ?? '')
        formData.append('society_apartment_id', user?.society_apartment_id ?? '')
        attachmentFiles.forEach((file) => {
          formData.append('attachments', file)
        })
        await complaintApi.createWithAttachments(formData)
      } else {
        await complaintApi.create({
          ...values,
          unit_id: user?.unit_id,
          society_apartment_id: user?.society_apartment_id,
        })
      }
      toast.success('Complaint submitted successfully')
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'success'
      case 'in_progress':
        return 'info'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'error'
      case 'high':
        return 'warning'
      case 'medium':
        return 'info'
      case 'low':
        return 'default'
      default:
        return 'default'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return dayjs(dateString).format('DD/MM/YYYY HH:mm')
  }

  const columns = [
    { id: 'title', label: 'Title' },
    { id: 'description', label: 'Description', render: (row) => (
      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
        {row.description}
      </Typography>
    )},
    {
      id: 'unit_number',
      label: 'Unit',
      render: (row) => row.unit_number || 'N/A',
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
      ),
    },
    {
      id: 'priority',
      label: 'Priority',
      render: (row) => (
        <Chip label={row.priority} color={getPriorityColor(row.priority)} size="small" variant="outlined" />
      ),
    },
    {
      id: 'attachments',
      label: 'Attachments',
      render: (row) => {
        const att = row.attachments
        if (!att || !Array.isArray(att) || att.length === 0) return '—'
        const base = getBaseUrl()
        return (
          <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {att.map((path, i) => (
              <Button key={i} size="small" href={`${base}${path}`} target="_blank" rel="noopener noreferrer" sx={{ minWidth: 0, py: 0 }}>
                File {i + 1}
              </Button>
            ))}
          </Box>
        )
      },
    },
    { id: 'created_at', label: 'Submitted', render: (row) => formatDate(row.created_at) },
  ]

  // Filter complaints based on selected filter
  const filteredData = data?.data ? data.data.filter((complaint) => {
    if (filterType === 'my') {
      return complaint.unit_id === user?.unit_id
    } else if (filterType === 'public') {
      return complaint.unit_id !== user?.unit_id && complaint.is_public
    }
    return true // 'all' - show all complaints
  }) : []

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Complaints
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Submit Complaint
        </Button>
      </Box>

      {!complaintLogsVisible && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Complaint logs are currently not visible. Please contact your administrator if you need access.
        </Alert>
      )}

      {complaintLogsVisible && (
        <>
          {/* Filter Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={filterType} onChange={(e, newValue) => setFilterType(newValue)}>
              <Tab label="All Complaints" value="all" />
              <Tab label="My Complaints" value="my" />
              <Tab label="Public Complaints" value="public" />
            </Tabs>
          </Box>

          <DataTable
            columns={columns}
            data={filteredData}
            loading={isLoading}
            pagination={{
              ...data?.pagination,
              total: filteredData.length,
            }}
            onPageChange={setPage}
            onRowsPerPageChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1)
            }}
          />
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <Formik
          initialValues={{
            title: '',
            description: '',
            priority: 'medium',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>Submit New Complaint</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.title && !!errors.title}
                      helperText={touched.title && errors.title}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Priority"
                      name="priority"
                      value={values.priority}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.priority && !!errors.priority}
                      helperText={touched.priority && errors.priority}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      multiline
                      rows={6}
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.description && !!errors.description}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Attachments (optional): Images or PDF, max 5 files, 5MB each
                    </Typography>
                    <Button variant="outlined" component="label" size="small">
                      Choose files
                      <input
                        type="file"
                        hidden
                        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,image/*,application/pdf"
                        multiple
                        onChange={(e) => setAttachmentFiles(Array.from(e.target.files || []).slice(0, 5))}
                      />
                    </Button>
                    {attachmentFiles.length > 0 && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {attachmentFiles.length} file(s) selected
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Submit
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default ResidentComplaints
