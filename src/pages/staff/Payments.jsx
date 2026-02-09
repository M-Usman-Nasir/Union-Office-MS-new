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
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { staffApi } from '@/api/staffApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const statusOptions = ['pending', 'paid', 'partially_paid']

const validationSchema = Yup.object({
  status: Yup.string().oneOf(statusOptions).required('Status is required'),
  amount_paid: Yup.number().min(0).required('Amount paid is required'),
})

const StaffPayments = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)

  const { data, isLoading, mutate } = useSWR(
    ['/staff/payments', page, limit, search, statusFilter],
    () => staffApi.getPayments({ page, limit, search, status: statusFilter }).then(res => res.data)
  )

  const handleOpenDialog = (payment) => {
    setSelectedPayment(payment)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedPayment(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await staffApi.updatePaymentStatus(selectedPayment.id, {
        status: values.status,
        amount_paid: values.amount_paid,
      })
      toast.success('Payment status updated successfully')
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success'
      case 'partially_paid':
        return 'info'
      case 'pending':
        return 'warning'
      default:
        return 'default'
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

  const columns = [
    { id: 'unit_number', label: 'Unit Number' },
    {
      id: 'month_year',
      label: 'Month/Year',
      render: (row) => `${row.month}/${row.year}`,
    },
    {
      id: 'total_amount',
      label: 'Total Amount',
      render: (row) => formatCurrency(row.total_amount),
    },
    {
      id: 'amount_paid',
      label: 'Amount Paid',
      render: (row) => formatCurrency(row.amount_paid),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
      ),
    },
    {
      id: 'due_date',
      label: 'Due Date',
      render: (row) => formatDate(row.due_date),
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Tooltip title="Update Status">
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Payment Updates
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Update payment statuses for maintenance records
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by unit number..."
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

      {/* Update Payment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={{
            status: selectedPayment?.status || 'pending',
            amount_paid: selectedPayment?.amount_paid || 0,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>Update Payment Status</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Unit: {selectedPayment?.unit_number || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Month/Year: {selectedPayment?.month}/{selectedPayment?.year}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Total Amount: {formatCurrency(selectedPayment?.total_amount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Payment Status"
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
                      label="Amount Paid"
                      name="amount_paid"
                      type="number"
                      value={values.amount_paid}
                      onChange={(e) => {
                        const raw = e.target.value
                        if (raw === '') {
                          handleChange(e)
                          return
                        }
                        const maxVal = selectedPayment?.total_amount ?? Infinity
                        const num = Math.min(maxVal, Math.max(0, parseFloat(raw) || 0))
                        handleChange({ target: { name: e.target.name, value: num } })
                      }}
                      onBlur={handleBlur}
                      error={touched.amount_paid && !!errors.amount_paid}
                      helperText={touched.amount_paid && errors.amount_paid || `Maximum: ${formatCurrency(selectedPayment?.total_amount)}`}
                      inputProps={{ min: 0, max: selectedPayment?.total_amount }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Remaining: {formatCurrency((selectedPayment?.total_amount || 0) - (values.amount_paid || 0))}
                    </Typography>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Update Payment
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default StaffPayments
