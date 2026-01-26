import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { defaulterApi } from '@/api/defaulterApi'
import { settingsApi } from '@/api/settingsApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const Defaulters = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDefaulter, setSelectedDefaulter] = useState(null)
  const [societyId] = useState(user?.society_apartment_id)

  const { data, isLoading, error, mutate } = useSWR(
    ['/defaulters', page, limit, search, statusFilter, societyId],
    () => defaulterApi.getAll({ page, limit, search, status: statusFilter, society_id: societyId }).then(res => res.data).catch(err => {
      console.error('Defaulters API error:', err)
      toast.error(err.response?.data?.message || 'Failed to load defaulters data')
      throw err
    })
  )

  const { data: stats, error: statsError } = useSWR(
    ['/defaulters/statistics', societyId],
    () => defaulterApi.getStatistics({ society_id: societyId }).then(res => res.data.data).catch(err => {
      console.error('Defaulters statistics error:', err)
      return null
    })
  )

  // Check visibility settings (for admin view - to show message if disabled)
  const { data: settings } = useSWR(
    societyId ? `/settings/${societyId}` : null,
    () => settingsApi.getSettings(societyId).then(res => res.data.data || res.data).catch(() => null)
  )

  const handleOpenDialog = (defaulter) => {
    setSelectedDefaulter(defaulter)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedDefaulter(null)
  }

  const handleStatusUpdate = async (values) => {
    try {
      await defaulterApi.updateStatus(selectedDefaulter.id, values)
      toast.success('Defaulter status updated successfully')
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return dayjs(dateString).format('DD/MM/YYYY')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'success'
      case 'escalated':
        return 'error'
      case 'active':
        return 'warning'
      default:
        return 'default'
    }
  }

  const columns = [
    { id: 'unit_number', label: 'Unit', render: (row) => row.unit_number || 'N/A' },
    { id: 'owner_name', label: 'Owner', render: (row) => row.owner_name || 'N/A' },
    { id: 'resident_name', label: 'Resident', render: (row) => row.resident_name || 'N/A' },
    { id: 'amount_due', label: 'Amount Due', render: (row) => formatCurrency(row.amount_due) },
    { id: 'months_overdue', label: 'Months Overdue' },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Tooltip title="Update Status">
          <IconButton size="small" onClick={() => handleOpenDialog(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Defaulters Management
        </Typography>
      </Box>

      {/* Error Message */}
      {error && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error">
            {error.response?.data?.message || 'Failed to load defaulters data. Please try again.'}
          </Alert>
        </Box>
      )}

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {stats.total_defaulters || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Defaulters
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="error.main">
                  {formatCurrency(stats.total_amount_due)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Amount Due
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {stats.active_count || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Defaulters
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  {stats.avg_months_overdue != null 
                    ? (typeof stats.avg_months_overdue === 'number' 
                        ? stats.avg_months_overdue.toFixed(1) 
                        : parseFloat(stats.avg_months_overdue || 0).toFixed(1))
                    : '0.0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Months Overdue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search defaulters..."
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
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
          <MenuItem value="escalated">Escalated</MenuItem>
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

      {/* Status Update Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={{ status: selectedDefaulter?.status || 'active' }}
          onSubmit={handleStatusUpdate}
          enableReinitialize
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <DialogTitle>Update Defaulter Status</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Unit: {selectedDefaulter?.unit_number || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Amount Due: {formatCurrency(selectedDefaulter?.amount_due)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="escalated">Escalated</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Update
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default Defaulters
