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
  Card,
  CardContent,
  Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { financeApi } from '@/api/financeApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const validationSchema = Yup.object({
  transaction_type: Yup.string().oneOf(['income', 'expense']).required('Transaction type is required'),
  amount: Yup.number().min(0).required('Amount is required'),
  transaction_date: Yup.date().required('Date is required'),
  description: Yup.string().required('Description is required'),
})

const Finance = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingFinance, setEditingFinance] = useState(null)
  const [societyId] = useState(user?.society_apartment_id)

  const { data, isLoading, error, mutate } = useSWR(
    ['/finance', page, limit, search, societyId],
    () => financeApi.getAll({ page, limit, search, society_id: societyId }).then(res => res.data).catch(err => {
      console.error('Finance API error:', err)
      toast.error(err.response?.data?.message || 'Failed to load finance data')
      throw err
    })
  )

  const { data: summary, error: summaryError } = useSWR(
    ['/finance/summary', societyId],
    () => financeApi.getSummary({ society_id: societyId }).then(res => res.data.data).catch(err => {
      console.error('Finance summary error:', err)
      return null
    })
  )

  const handleOpenDialog = (finance = null) => {
    setEditingFinance(finance)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingFinance(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingFinance) {
        await financeApi.update(editingFinance.id, values)
        toast.success('Finance record updated successfully')
      } else {
        await financeApi.create({ ...values, society_apartment_id: societyId, added_by: user.id })
        toast.success('Finance record created successfully')
      }
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this finance record?')) {
      try {
        await financeApi.remove(id)
        toast.success('Finance record deleted successfully')
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
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return dayjs(dateString).format('DD/MM/YYYY')
  }

  const columns = [
    { id: 'transaction_date', label: 'Date', render: (row) => formatDate(row.transaction_date) },
    { id: 'transaction_type', label: 'Type', render: (row) => (
      <Chip
        label={row.transaction_type}
        color={row.transaction_type === 'income' ? 'success' : 'error'}
        size="small"
        icon={row.transaction_type === 'income' ? <TrendingUpIcon /> : <TrendingDownIcon />}
      />
    )},
    { id: 'income_type', label: 'Income Type', render: (row) => row.income_type || '-' },
    { id: 'expense_type', label: 'Expense Type', render: (row) => row.expense_type || '-' },
    { id: 'description', label: 'Description' },
    { id: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
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
            <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const incomeTypes = ['Maintenance Collection', 'Rent', 'Other Income']
  const expenseTypes = ['Utility Payment', 'Salary', 'Repairs', 'Security', 'Cleaning', 'Maintenance']

  const initialValues = editingFinance
    ? {
        transaction_type: editingFinance.transaction_type || 'income',
        income_type: editingFinance.income_type || '',
        expense_type: editingFinance.expense_type || '',
        amount: editingFinance.amount || 0,
        description: editingFinance.description || '',
        transaction_date: editingFinance.transaction_date ? dayjs(editingFinance.transaction_date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        payment_mode: editingFinance.payment_mode || '',
      }
    : {
        transaction_type: 'income',
        income_type: '',
        expense_type: '',
        amount: 0,
        description: '',
        transaction_date: dayjs().format('YYYY-MM-DD'),
        payment_mode: '',
      }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Finance Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error">
            {error.response?.data?.message || 'Failed to load finance data. Please try again.'}
          </Alert>
        </Box>
      )}

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(summary.total_income)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Income
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="error.main">
                  {formatCurrency(summary.total_expense)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Expense
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary.main">
                  {formatCurrency(summary.balance)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Balance
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {summary.total_transactions || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search finance records..."
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
            <Form>
              <DialogTitle>
                {editingFinance ? 'Edit Transaction' : 'Add New Transaction'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Transaction Type"
                      name="transaction_type"
                      value={values.transaction_type}
                      onChange={(e) => {
                        handleChange(e)
                        setFieldValue('income_type', '')
                        setFieldValue('expense_type', '')
                      }}
                      onBlur={handleBlur}
                      error={touched.transaction_type && !!errors.transaction_type}
                      helperText={touched.transaction_type && errors.transaction_type}
                    >
                      <MenuItem value="income">Income</MenuItem>
                      <MenuItem value="expense">Expense</MenuItem>
                    </TextField>
                  </Grid>
                  {values.transaction_type === 'income' && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        label="Income Type"
                        name="income_type"
                        value={values.income_type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="">Select Income Type</MenuItem>
                        {incomeTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}
                  {values.transaction_type === 'expense' && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        label="Expense Type"
                        name="expense_type"
                        value={values.expense_type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="">Select Expense Type</MenuItem>
                        {expenseTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount"
                      name="amount"
                      type="number"
                      value={values.amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.amount && !!errors.amount}
                      helperText={touched.amount && errors.amount}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      multiline
                      rows={3}
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.description && !!errors.description}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Transaction Date"
                      name="transaction_date"
                      type="date"
                      value={values.transaction_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.transaction_date && !!errors.transaction_date}
                      helperText={touched.transaction_date && errors.transaction_date}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Payment Mode"
                      name="payment_mode"
                      value={values.payment_mode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {editingFinance ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default Finance
