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
  CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PaymentIcon from '@mui/icons-material/Payment'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { maintenanceApi } from '@/api/maintenanceApi'
import { propertyApi } from '@/api/propertyApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const validationSchema = Yup.object({
  unit_id: Yup.number().required('Unit is required'),
  month: Yup.number().min(1).max(12).required('Month is required'),
  year: Yup.number().required('Year is required'),
  base_amount: Yup.number().min(0).required('Base amount is required'),
  total_amount: Yup.number().min(0).required('Total amount is required'),
})

const Maintenance = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false)
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState(null)
  const [selectedMaintenance, setSelectedMaintenance] = useState(null)
  const [societyId] = useState(user?.society_apartment_id)

  const { data, isLoading, mutate } = useSWR(
    ['/maintenance', page, limit, search, societyId],
    () => maintenanceApi.getAll({ page, limit, search, society_id: societyId }).then(res => res.data)
  )

  const { data: unitsData } = useSWR(
    societyId ? ['/units', societyId] : null,
    () => propertyApi.getUnits({ society_id: societyId }).then(res => res.data)
  )

  const handleOpenDialog = (maintenance = null) => {
    setEditingMaintenance(maintenance)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingMaintenance(null)
  }

  const handleOpenPaymentDialog = (maintenance) => {
    setSelectedMaintenance(maintenance)
    setOpenPaymentDialog(true)
  }

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false)
    setSelectedMaintenance(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingMaintenance) {
        await maintenanceApi.update(editingMaintenance.id, values)
        toast.success('Maintenance record updated successfully')
      } else {
        await maintenanceApi.create({ ...values, society_apartment_id: societyId })
        toast.success('Maintenance record created successfully')
      }
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = async (values, { setSubmitting }) => {
    try {
      await maintenanceApi.recordPayment(selectedMaintenance.id, values)
      toast.success('Payment recorded successfully')
      mutate()
      handleClosePaymentDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await maintenanceApi.remove(id)
        toast.success('Maintenance record deleted successfully')
        mutate()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed')
      }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success'
      case 'partially_paid':
        return 'warning'
      case 'pending':
        return 'error'
      default:
        return 'default'
    }
  }

  const columns = [
    { id: 'unit_number', label: 'Unit', render: (row) => row.unit_number || 'N/A' },
    { id: 'month', label: 'Month/Year', render: (row) => `${row.month}/${row.year}` },
    { id: 'base_amount', label: 'Base Amount', render: (row) => formatCurrency(row.base_amount) },
    { id: 'total_amount', label: 'Total Amount', render: (row) => formatCurrency(row.total_amount) },
    { id: 'amount_paid', label: 'Amount Paid', render: (row) => formatCurrency(row.amount_paid || 0) },
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
        <Box>
          {row.status !== 'paid' && (
            <Tooltip title="Record Payment">
              <IconButton size="small" color="success" onClick={() => handleOpenPaymentDialog(row)}>
                <PaymentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenDialog(row)}>
              <EditIcon fontSize="small" />
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

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const initialValues = editingMaintenance
    ? {
        unit_id: editingMaintenance.unit_id || '',
        month: editingMaintenance.month || currentMonth,
        year: editingMaintenance.year || currentYear,
        base_amount: editingMaintenance.base_amount || 0,
        total_amount: editingMaintenance.total_amount || 0,
      }
    : {
        unit_id: '',
        month: currentMonth,
        year: currentYear,
        base_amount: 0,
        total_amount: 0,
      }

  const handleGenerateMonthlyDues = async () => {
    if (!window.confirm('Generate monthly dues for all active units? This will create maintenance records for the current month.')) {
      return
    }

    setGenerating(true)
    try {
      await maintenanceApi.generateMonthlyDues()
      toast.success('Monthly dues generated successfully')
      mutate()
      setOpenGenerateDialog(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate monthly dues')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Maintenance Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CalendarTodayIcon />}
            onClick={() => setOpenGenerateDialog(true)}
            color="primary"
          >
            Generate Monthly Dues
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Maintenance
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search maintenance records..."
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

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>
                {editingMaintenance ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Unit"
                      name="unit_id"
                      value={values.unit_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.unit_id && !!errors.unit_id}
                      helperText={touched.unit_id && errors.unit_id}
                    >
                      <MenuItem value="">Select Unit</MenuItem>
                      {unitsData?.data?.map((unit) => (
                        <MenuItem key={unit.id} value={unit.id}>
                          {unit.block_name} - Floor {unit.floor_number} - Unit {unit.unit_number}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      select
                      label="Month"
                      name="month"
                      value={values.month}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.month && !!errors.month}
                      helperText={touched.month && errors.month}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                        <MenuItem key={m} value={m}>
                          {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Year"
                      name="year"
                      type="number"
                      value={values.year}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.year && !!errors.year}
                      helperText={touched.year && errors.year}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Base Amount"
                      name="base_amount"
                      type="number"
                      value={values.base_amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.base_amount && !!errors.base_amount}
                      helperText={touched.base_amount && errors.base_amount}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Total Amount"
                      name="total_amount"
                      type="number"
                      value={values.total_amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.total_amount && !!errors.total_amount}
                      helperText={touched.total_amount && errors.total_amount}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {editingMaintenance ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={handleClosePaymentDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={{ amount_paid: selectedMaintenance?.total_amount || 0 }}
          onSubmit={handlePayment}
        >
          {({ values, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Total Amount: {formatCurrency(selectedMaintenance?.total_amount || 0)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount Paid"
                      name="amount_paid"
                      type="number"
                      value={values.amount_paid}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePaymentDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Record Payment
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Generate Monthly Dues Dialog */}
      <Dialog open={openGenerateDialog} onClose={() => setOpenGenerateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Monthly Dues</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This will generate maintenance dues for all active units for the current month ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}).
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Only units without existing maintenance records for this month will be processed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGenerateDialog(false)} disabled={generating}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerateMonthlyDues}
            disabled={generating}
            startIcon={generating ? <CircularProgress size={20} /> : null}
          >
            {generating ? 'Generating...' : 'Generate Dues'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Maintenance
