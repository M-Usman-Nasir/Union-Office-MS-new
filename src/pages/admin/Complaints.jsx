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
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import UpdateIcon from '@mui/icons-material/Update'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { complaintApi } from '@/api/complaintApi'
import { userApi } from '@/api/userApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { Autocomplete } from '@mui/material'
import ProgressTimeline from '@/components/complaints/ProgressTimeline'

const statusOptions = ['pending', 'in_progress', 'resolved', 'closed']
const priorityOptions = ['low', 'medium', 'high', 'urgent']

const Complaints = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openAssignDialog, setOpenAssignDialog] = useState(false)
  const [openProgressDialog, setOpenProgressDialog] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [societyId] = useState(user?.society_apartment_id)

  const { data, isLoading, mutate } = useSWR(
    ['/complaints', page, limit, search, statusFilter, societyId],
    () => complaintApi.getAll({ page, limit, search, status: statusFilter, society_id: societyId }).then(res => res.data)
  )

  // Fetch staff list for assignment
  const { data: staffList } = useSWR(
    user ? '/users/staff' : null,
    () => userApi.getAll({ role: 'staff', limit: 100 }).then(res => res.data)
  )

  // Fetch progress history for selected complaint
  const { data: progressData } = useSWR(
    selectedComplaint && openViewDialog ? `/complaints/${selectedComplaint.id}/progress` : null,
    () => complaintApi.getProgress(selectedComplaint.id).then(res => res.data)
  )

  const handleOpenViewDialog = (complaint) => {
    setSelectedComplaint(complaint)
    setOpenViewDialog(true)
  }

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false)
    setSelectedComplaint(null)
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await complaintApi.updateStatus(id, { status })
      toast.success('Complaint status updated successfully')
      mutate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await complaintApi.remove(id)
        toast.success('Complaint deleted successfully')
        mutate()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed')
      }
    }
  }

  const handleOpenAssignDialog = (complaint) => {
    setSelectedComplaint(complaint)
    setOpenAssignDialog(true)
  }

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false)
    setSelectedComplaint(null)
  }

  const handleAssignStaff = async (staffId) => {
    try {
      await complaintApi.assignStaff(selectedComplaint.id, staffId)
      toast.success('Staff assigned successfully')
      mutate()
      handleCloseAssignDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed')
    }
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
    { id: 'description', label: 'Description', render: (row) => (
      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
        {row.description}
      </Typography>
    )},
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
      id: 'assigned_to_name',
      label: 'Assigned To',
      render: (row) => (
        <Typography variant="body2">
          {row.assigned_to_name || 'Unassigned'}
        </Typography>
      ),
    },
    { id: 'created_at', label: 'Created', render: (row) => formatDate(row.created_at) },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleOpenViewDialog(row)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Assign Staff">
            <IconButton size="small" onClick={() => handleOpenAssignDialog(row)} color="primary">
              <PersonAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update Progress">
            <IconButton size="small" onClick={() => handleOpenProgressDialog(row)} color="secondary">
              <UpdateIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
              <DeleteIcon fontSize="small" />
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
          Complaints Management
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
          label="Status Filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
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

      {/* View Dialog */}
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
                <Chip label={selectedComplaint.status} color={getStatusColor(selectedComplaint.status)} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Priority
                </Typography>
                <Chip label={selectedComplaint.priority} color={getPriorityColor(selectedComplaint.priority)} variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Assigned To
                </Typography>
                <Typography variant="body1">
                  {selectedComplaint.assigned_to_name || 'Unassigned'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">{formatDate(selectedComplaint.created_at)}</Typography>
              </Grid>
              {progressData?.data && progressData.data.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Progress History
                  </Typography>
                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <ProgressTimeline progressEntries={progressData.data} />
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Staff Dialog */}
      <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Staff to Complaint</DialogTitle>
        <DialogContent>
          {selectedComplaint && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Complaint: {selectedComplaint.title}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  options={staffList?.data || []}
                  getOptionLabel={(option) => `${option.name} (${option.email})`}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handleAssignStaff(newValue.id)
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Staff Member"
                      placeholder="Search staff..."
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Add Progress Dialog */}
      <Dialog open={openProgressDialog} onClose={handleCloseProgressDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={{
            status: selectedComplaint?.status || 'pending',
            notes: '',
          }}
          validationSchema={Yup.object({
            status: Yup.string().oneOf(statusOptions).required('Status is required'),
            notes: Yup.string().required('Notes are required'),
          })}
          onSubmit={handleProgressUpdate}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>Add Progress Update</DialogTitle>
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

export default Complaints
