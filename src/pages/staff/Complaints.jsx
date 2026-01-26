import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import UpdateIcon from '@mui/icons-material/Update'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { staffApi } from '@/api/staffApi'
import { complaintApi } from '@/api/complaintApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const statusOptions = ['pending', 'in_progress', 'resolved', 'closed']
const priorityOptions = ['low', 'medium', 'high', 'urgent']

const validationSchema = Yup.object({
  status: Yup.string().oneOf(statusOptions).required('Status is required'),
  notes: Yup.string().required('Notes are required'),
})

const StaffComplaints = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openProgressDialog, setOpenProgressDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  const { data, isLoading, mutate } = useSWR(
    ['/staff/complaints', page, limit, search, statusFilter],
    () => staffApi.getComplaints({ page, limit, search, status: statusFilter }).then(res => res.data)
  )

  const handleOpenViewDialog = (complaint) => {
    setSelectedComplaint(complaint)
    setOpenViewDialog(true)
  }

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false)
    setSelectedComplaint(null)
  }

  const handleOpenProgressDialog = (complaint) => {
    setSelectedComplaint(complaint)
    setOpenProgressDialog(true)
  }

  const handleCloseProgressDialog = () => {
    setOpenProgressDialog(false)
    setSelectedComplaint(null)
  }

  const handleProgressUpdate = async (values, { setSubmitting }) => {
    try {
      await complaintApi.addProgress(selectedComplaint.id, {
        status: values.status,
        notes: values.notes,
      })
      toast.success('Progress updated successfully')
      mutate()
      handleCloseProgressDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
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
    { id: 'unit_number', label: 'Unit' },
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
        <Chip
          label={row.priority}
          color={getPriorityColor(row.priority)}
          size="small"
          variant="outlined"
        />
      ),
    },
    { id: 'created_at', label: 'Created', render: (row) => formatDate(row.created_at) },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleOpenViewDialog(row)}
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update Progress">
            <IconButton
              size="small"
              onClick={() => handleOpenProgressDialog(row)}
              color="secondary"
            >
              <UpdateIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Assigned Complaints
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Manage complaints assigned to you
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <DataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        pagination={data?.pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit)
          setPage(1)
        }}
      />

      {/* View Complaint Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogContent>
          {selectedComplaint && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="body1">{selectedComplaint.title}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">{selectedComplaint.description}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedComplaint.status}
                  color={getStatusColor(selectedComplaint.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Priority
                </Typography>
                <Chip
                  label={selectedComplaint.priority}
                  color={getPriorityColor(selectedComplaint.priority)}
                  size="small"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Unit Number
                </Typography>
                <Typography variant="body1">{selectedComplaint.unit_number || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">{formatDate(selectedComplaint.created_at)}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Update Progress Dialog */}
      <Dialog open={openProgressDialog} onClose={handleCloseProgressDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={{
            status: selectedComplaint?.status || 'pending',
            notes: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleProgressUpdate}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>Update Complaint Progress</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.status && !!errors.status}
                      helperText={touched.status && errors.status}
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Progress Notes"
                      name="notes"
                      multiline
                      rows={4}
                      value={values.notes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.notes && !!errors.notes}
                      helperText={touched.notes && errors.notes || 'Describe the progress made on this complaint'}
                      placeholder="Enter progress notes..."
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseProgressDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Update Progress
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default StaffComplaints
