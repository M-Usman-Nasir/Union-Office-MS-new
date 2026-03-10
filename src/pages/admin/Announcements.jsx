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
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { announcementApi } from '@/api/announcementApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  type: Yup.string(),
  audience: Yup.string(),
  announcement_date: Yup.string(),
  scheduled_publish_at: Yup.string().nullable(),
})

const audienceOptions = [
  { value: 'all', label: 'All (everyone)' },
  { value: 'resident', label: 'Residents only' },
  { value: 'staff', label: 'Staff only' },
  { value: 'union_admin', label: 'Union admins only' },
]

const Announcements = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null)

  const societyId = user?.society_apartment_id != null ? Number(user.society_apartment_id) : null
  const fetchParams = { page, limit, search }
  if (societyId != null && Number.isFinite(societyId)) {
    fetchParams.society_id = societyId
  }

  const { data, isLoading, mutate } = useSWR(
    user ? ['/announcements', page, limit, search, societyId] : null,
    () => announcementApi.getAll(fetchParams).then(res => res.data)
  )

  const handleOpenDialog = (announcement = null) => {
    setEditingAnnouncement(announcement)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingAnnouncement(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        ...values,
        scheduled_publish_at: values.scheduled_publish_at?.trim() ? values.scheduled_publish_at : null,
      }
      if (editingAnnouncement) {
        await announcementApi.update(editingAnnouncement.id, payload)
        toast.success('Announcement updated successfully')
      } else {
        await announcementApi.create({ ...payload, society_apartment_id: societyId })
        toast.success('Announcement created successfully')
      }
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (id) => {
    setIdToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!idToDelete) return
    try {
      await announcementApi.remove(idToDelete)
      toast.success('Announcement deleted successfully')
      mutate()
      setDeleteConfirmOpen(false)
      setIdToDelete(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    setIdToDelete(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return dayjs(dateString).format('DD/MM/YYYY')
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    return dayjs(dateString).format('DD/MM/YYYY HH:mm')
  }

  const columns = [
    { id: 'title', label: 'Title' },
    { id: 'audience', label: 'Audience', render: (row) => {
      const opt = audienceOptions.find(o => o.value === row.audience)
      if (opt) return opt.label
      // Legacy values
      if (row.audience === 'all_residents') return 'All residents'
      if (row.audience === 'selected_residents') return 'Selected residents'
      return row.audience || 'All (everyone)'
    }},
    { id: 'description', label: 'Description', render: (row) => (
      <Typography variant="body2" noWrap sx={{ maxWidth: '100%', display: 'block' }} title={row.description}>
        {row.description}
      </Typography>
    )},
    { id: 'type', label: 'Type', render: (row) => row.type || '-' },
    {
      id: 'scheduled_publish_at',
      label: 'Publish',
      render: (row) => {
        if (!row.scheduled_publish_at) return <Chip size="small" label="Immediate" variant="outlined" />
        const at = dayjs(row.scheduled_publish_at)
        const isFuture = at.isAfter(dayjs())
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip size="small" label={isFuture ? 'Scheduled' : 'Published'} color={isFuture ? 'warning' : 'default'} variant={isFuture ? 'filled' : 'outlined'} />
            <Typography variant="caption" color="text.secondary">{formatDateTime(row.scheduled_publish_at)}</Typography>
          </Box>
        )
      },
    },
    { id: 'created_at', label: 'Created', render: (row) => formatDate(row.created_at) },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenDialog(row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDeleteClick(row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const announcementTypes = ['meeting', 'payment', 'notice', 'update', 'other']

  const initialValues = editingAnnouncement
    ? {
        title: editingAnnouncement.title || '',
        description: editingAnnouncement.description || '',
        type: editingAnnouncement.type || '',
        audience: editingAnnouncement.audience || 'all',
        announcement_date: editingAnnouncement.announcement_date
          ? dayjs(editingAnnouncement.announcement_date).format('YYYY-MM-DD')
          : dayjs().format('YYYY-MM-DD'),
        scheduled_publish_at: editingAnnouncement.scheduled_publish_at
          ? dayjs(editingAnnouncement.scheduled_publish_at).format('YYYY-MM-DDTHH:mm')
          : '',
      }
    : {
        title: '',
        description: '',
        type: '',
        audience: 'all',
        announcement_date: dayjs().format('YYYY-MM-DD'),
        scheduled_publish_at: '',
      }

  return (
    <Container maxWidth="lg" sx={{ py: 4, overflowX: 'hidden' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Announcements Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Announcement
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search announcements..."
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

      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete announcement?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this announcement? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>
                {editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date"
                      name="announcement_date"
                      type="date"
                      value={values.announcement_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.announcement_date && !!errors.announcement_date}
                      helperText={touched.announcement_date && errors.announcement_date}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Publish at (optional)"
                      name="scheduled_publish_at"
                      type="datetime-local"
                      value={values.scheduled_publish_at || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText="Allows announcements to be posted automatically at the chosen date and time. Leave empty to publish immediately."
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
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
                      label="Type"
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="">Select Type</MenuItem>
                      {announcementTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Audience"
                      name="audience"
                      value={values.audience || 'all'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText="Sends targeted updates to specific user groups."
                    >
                      {audienceOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
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
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {editingAnnouncement ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default Announcements
