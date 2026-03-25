import { useState, useEffect } from 'react'
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
  FormHelperText,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Rating,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ReportEscalationIcon from '@mui/icons-material/Report'
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
import { useLocation } from 'react-router-dom'

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  priority: Yup.string().oneOf(['low', 'medium', 'high', 'urgent']).required('Priority is required'),
})

const SUGGESTED_COMPLAINT_TITLES = [
  { title: 'Plumbing Issue', description: 'e.g. Leaks, clogged drains, no water supply, low pressure, broken taps or pipes.' },
  { title: 'Electrical Problem', description: 'e.g. Power cuts, fuse trips, faulty switches, lighting issues, socket not working.' },
  { title: 'Pest / Insect Issue', description: 'e.g. Cockroaches, ants, mosquitoes, rodents, or other pests in common areas or unit.' },
  { title: 'Lift / Elevator Not Working', description: 'e.g. Lift stuck, not stopping at floors, door malfunction, or safety concerns.' },
  { title: 'Parking or Common Area', description: 'e.g. Unauthorized parking, damaged common area, corridor or lobby maintenance.' },
  { title: 'Noise or Nuisance', description: 'e.g. Loud music, construction noise, neighbour disturbance, or other nuisance.' },
  { title: 'Security or Access', description: 'e.g. Gate not working, key/card issue, CCTV concern, or access control.' },
  { title: 'Cleaning or Garbage', description: 'e.g. Garbage not collected, common area dirty, bin overflow, or hygiene issue.' },
  { title: 'Other', description: 'Describe your complaint in detail below.' },
]

const ResidentComplaints = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [openDialog, setOpenDialog] = useState(false)
  const [attachmentFiles, setAttachmentFiles] = useState([])
  const [filterType, setFilterType] = useState('my') // 'all', 'my', 'public' — default to My Complaints
  const [escalateDialog, setEscalateDialog] = useState({ open: false, complaint: null, reason: '' })
  const [escalating, setEscalating] = useState(false)
  const [feedbackDialog, setFeedbackDialog] = useState({
    open: false,
    complaint: null,
    rating: 5,
    comment: '',
  })
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
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

  // Fetch more complaints for stats (my complaints only)
  const { data: statsData } = useSWR(
    complaintLogsVisible && user ? ['/complaints/my-stats', user.id] : null,
    () => complaintApi.getAll({ limit: 200, page: 1 }).then(res => res.data)
  )
  const myComplaintsForStats = (statsData?.data ?? []).filter((c) => Number(c.submitted_by) === Number(user?.id))
  const stats = {
    total: myComplaintsForStats.length,
    pending: myComplaintsForStats.filter((c) => c.status === 'pending').length,
    inProgress: myComplaintsForStats.filter((c) => c.status === 'in_progress').length,
    resolved: myComplaintsForStats.filter((c) => c.status === 'resolved' || c.status === 'closed').length,
    escalated: myComplaintsForStats.filter((c) => c.escalated_at).length,
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setAttachmentFiles([])
  }

  useEffect(() => {
    if (location.state?.openSubmit) {
      setOpenDialog(true)
      window.history.replaceState({}, '', location.pathname)
    }
  }, [location.state?.openSubmit, location.pathname])

  const handleOpenEscalate = (complaint) => setEscalateDialog({ open: true, complaint, reason: '' })
  const closeEscalateDialog = () => setEscalateDialog({ open: false, complaint: null, reason: '' })
  const handleEscalate = async () => {
    if (!escalateDialog.complaint?.id) return
    setEscalating(true)
    try {
      await complaintApi.escalate(escalateDialog.complaint.id, { reason: escalateDialog.reason || undefined })
      toast.success('Complaint escalated. Platform admin will review.')
      mutate()
      closeEscalateDialog()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Escalation failed')
    } finally {
      setEscalating(false)
    }
  }

  const handleOpenFeedback = (complaint) => {
    setFeedbackDialog({
      open: true,
      complaint,
      rating: Number(complaint?.feedback_rating) || 5,
      comment: complaint?.feedback_comment || '',
    })
  }

  const handleCloseFeedback = () => {
    setFeedbackDialog({
      open: false,
      complaint: null,
      rating: 5,
      comment: '',
    })
  }

  const handleSubmitFeedback = async () => {
    if (!feedbackDialog.complaint?.id) return
    setSubmittingFeedback(true)
    try {
      await complaintApi.submitFeedback(feedbackDialog.complaint.id, {
        feedback_rating: feedbackDialog.rating,
        feedback_comment: feedbackDialog.comment?.trim() || null,
      })
      toast.success('Feedback submitted. Thank you!')
      mutate()
      handleCloseFeedback()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setSubmittingFeedback(false)
    }
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
    // Server may send UTC as ISO with Z, or as datetime without timezone (e.g. from PostgreSQL).
    // Treat datetimes without Z as UTC so the displayed time is correct in the user's timezone.
    const str =
      typeof dateString === 'string' && dateString.trim() && !/Z$/i.test(dateString.trim())
        ? dateString.trim().replace(' ', 'T') + 'Z'
        : dateString
    return dayjs(str).format('DD/MM/YYYY HH:mm')
  }

  const columns = [
    { id: 'id', label: 'Complaint ID', minWidth: 100, render: (row) => row.id ?? '—' },
    { id: 'title', label: 'Title' },
    { id: 'description', label: 'Description', render: (row) => (
      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
        {row.description}
      </Typography>
    )},
    {
      id: 'unit_number',
      label: 'Unit No.',
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
    {
      id: 'escalate',
      label: ' ',
      align: 'right',
      render: (row) =>
        row.submitted_by === user?.id && !row.escalated_at ? (
          <Button
            size="small"
            variant="outlined"
            color="warning"
            onClick={() => handleOpenEscalate(row)}
          >
            Escalate to platform
          </Button>
        ) : row.escalated_at ? (
          <Chip size="small" label="Escalated" color="info" />
        ) : null,
    },
    {
      id: 'feedback',
      label: 'Feedback',
      align: 'right',
      render: (row) => {
        const isOwnComplaint = Number(row.submitted_by) === Number(user?.id)
        const isResolved = row.status === 'resolved' || row.status === 'closed'
        if (!isOwnComplaint || !isResolved) return '—'

        if (row.feedback_rating) {
          return (
            <Chip
              size="small"
              color="success"
              variant="outlined"
              label={`Rated ${row.feedback_rating}/5`}
              onClick={() => handleOpenFeedback(row)}
            />
          )
        }

        return (
          <Button size="small" variant="outlined" onClick={() => handleOpenFeedback(row)}>
            Add feedback
          </Button>
        )
      },
    },
  ]

  // Filter complaints based on selected filter (use submitted_by for "my" so it works even when complaint.unit_id is null)
  const filteredData = data?.data ? data.data.filter((complaint) => {
    if (filterType === 'my') {
      return complaint.submitted_by === user?.id
    } else if (filterType === 'public') {
      return complaint.submitted_by !== user?.id && complaint.is_public
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
          {/* Summary cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <AssignmentIcon sx={{ color: 'primary.main', mt: 0.25 }} fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      My Complaints
                    </Typography>
                    <Typography variant="h6">{stats.total}</Typography>
                    <Typography variant="caption" color="text.secondary">total submitted</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <ScheduleIcon sx={{ color: 'warning.main', mt: 0.25 }} fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Pending
                    </Typography>
                    <Typography variant="h6">{stats.pending}</Typography>
                    <Typography variant="caption" color="text.secondary">awaiting action</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <TrendingUpIcon sx={{ color: 'info.main', mt: 0.25 }} fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      In Progress
                    </Typography>
                    <Typography variant="h6">{stats.inProgress}</Typography>
                    <Typography variant="caption" color="text.secondary">being worked on</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleOutlineIcon sx={{ color: 'success.main', mt: 0.25 }} fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Resolved
                    </Typography>
                    <Typography variant="h6">{stats.resolved}</Typography>
                    <Typography variant="caption" color="text.secondary">closed / resolved</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <ReportEscalationIcon sx={{ color: 'secondary.main', mt: 0.25 }} fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Escalated
                    </Typography>
                    <Typography variant="h6">{stats.escalated}</Typography>
                    <Typography variant="caption" color="text.secondary">sent to platform</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filter Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={filterType} onChange={(e, newValue) => setFilterType(newValue)}>
              <Tab label="All Complaints" value="all" />
              <Tab label="My Complaints" value="my" />
              <Tab label="Public Complaints" value="public" />
            </Tabs>
          </Box>

          <DataTable
            dense
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { overflowX: 'hidden' } }}>
        <Formik
          initialValues={{
            title: '',
            description: '',
            priority: 'medium',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
            const selectedSuggestion = SUGGESTED_COMPLAINT_TITLES.find(s => s.title === values.title)
            return (
            <Form>
              <DialogTitle>Submit New Complaint</DialogTitle>
              <DialogContent sx={{ overflowX: 'hidden', minWidth: 0 }}>
                <Grid container spacing={2} sx={{ mt: 1, minWidth: 0 }}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Suggested titles (click to use)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                      {SUGGESTED_COMPLAINT_TITLES.map((s) => (
                        <Chip
                          key={s.title}
                          label={s.title}
                          onClick={() => {
                            setFieldValue('title', s.title)
                            setFieldValue('description', s.description)
                          }}
                          variant={values.title === s.title ? 'filled' : 'outlined'}
                          color={values.title === s.title ? 'primary' : 'default'}
                          size="small"
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                    <TextField
                      fullWidth
                      label="Title"
                      name="title"
                      placeholder="Or type your own title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.title && !!errors.title}
                      helperText={touched.title && errors.title}
                    />
                    {selectedSuggestion && (
                      <FormHelperText sx={{ mt: 0.5, display: 'block' }}>
                        {selectedSuggestion.description}
                      </FormHelperText>
                    )}
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
                    <Button variant="outlined" component="label" size="small" startIcon={<AttachFileIcon />}>
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
                      <List dense disablePadding sx={{ mt: 1, bgcolor: 'action.hover', borderRadius: 1, py: 0 }}>
                        {attachmentFiles.map((file, index) => (
                          <ListItem
                            key={`${file.name}-${index}`}
                            sx={{ py: 0.5 }}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                size="small"
                                aria-label={`Remove ${file.name}`}
                                onClick={() => setAttachmentFiles((prev) => prev.filter((_, i) => i !== index))}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            }
                          >
                            <ListItemText
                              primary={file.name}
                              secondary={file.size != null ? (file.size >= 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(1)} KB`) : null}
                              primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItem>
                        ))}
                      </List>
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
            )
          }}
        </Formik>
      </Dialog>

      <Dialog open={escalateDialog.open} onClose={closeEscalateDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Escalate to platform</DialogTitle>
        <DialogContent>
          {escalateDialog.complaint && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Complaint: {escalateDialog.complaint.title || escalateDialog.complaint.id}
            </Typography>
          )}
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Reason (optional)"
            value={escalateDialog.reason}
            onChange={(e) => setEscalateDialog((d) => ({ ...d, reason: e.target.value }))}
            placeholder="Why are you escalating? Platform admin will review."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEscalateDialog}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleEscalate} disabled={escalating}>
            {escalating ? 'Escalating…' : 'Escalate'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={feedbackDialog.open} onClose={handleCloseFeedback} maxWidth="sm" fullWidth>
        <DialogTitle>Rate resolution</DialogTitle>
        <DialogContent>
          {feedbackDialog.complaint && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Complaint: {feedbackDialog.complaint.title || feedbackDialog.complaint.id}
            </Typography>
          )}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Your rating
            </Typography>
            <Rating
              name="complaint-feedback-rating"
              value={feedbackDialog.rating}
              onChange={(_, value) =>
                setFeedbackDialog((prev) => ({ ...prev, rating: value || 1 }))
              }
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Comment (optional)"
            value={feedbackDialog.comment}
            onChange={(e) =>
              setFeedbackDialog((prev) => ({ ...prev, comment: e.target.value }))
            }
            placeholder="How satisfied are you with the resolution?"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedback}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitFeedback}
            disabled={submittingFeedback}
          >
            {submittingFeedback ? 'Submitting...' : 'Submit feedback'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ResidentComplaints