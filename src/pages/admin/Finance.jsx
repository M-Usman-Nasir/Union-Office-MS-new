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
  Tabs,
  Tab,
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
import {
  INCOME_TYPES,
  INCOME_TYPE_LABELS,
  PAYMENT_MODE_OPTIONS,
  MONTH_OPTIONS,
  FINANCE_STATUS_OPTIONS,
  getFinanceYearOptions,
} from '@/utils/constants'
import FinancialReports from '@/components/finance/FinancialReports'

const validationSchema = Yup.object({
  transaction_type: Yup.string().oneOf(['income', 'expense']).required('Transaction type is required'),
  income_type: Yup.string().when('transaction_type', {
    is: 'income',
    then: (schema) => schema.required('Income type is required'),
    otherwise: (schema) => schema,
  }),
  expense_type: Yup.string().when('transaction_type', {
    is: 'expense',
    then: (schema) => schema.required('Expense type is required'),
    otherwise: (schema) => schema,
  }),
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
  const [activeTab, setActiveTab] = useState(0)

  const { data, isLoading, error, mutate } = useSWR(
    ['/finance', page, limit, search, societyId],
    () => financeApi.getAll({ page, limit, search, society_id: societyId }).then(res => res.data).catch(err => {
      console.error('Finance API error:', err)
      toast.error(err.response?.data?.message || 'Failed to load finance data')
      throw err
    })
  )

  const { data: summary, mutate: mutateSummary } = useSWR(
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
      const payload = {
        ...values,
        month: Number(values.month),
        year: Number(values.year),
        status: values.status || 'paid',
      }
      if (editingFinance) {
        await financeApi.update(editingFinance.id, payload)
        toast.success('Finance record updated successfully')
      } else {
        await financeApi.create({ ...payload, society_apartment_id: societyId, added_by: user.id })
        toast.success('Finance record created successfully')
      }
      await Promise.all([mutate(), mutateSummary(undefined, { revalidate: true })])
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
        await Promise.all([mutate(), mutateSummary(undefined, { revalidate: true })])
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

  const yearOptions = getFinanceYearOptions()

  const columns = [
    { id: 'transaction_date', label: 'Date', render: (row) => formatDate(row.transaction_date) },
    {
      id: 'month_year',
      label: 'Month / Year',
      render: (row) => {
        const monthName = MONTH_OPTIONS.find((m) => m.value === row.month)?.label || row.month
        return `${monthName || '-'} ${row.year || ''}`.trim() || '-'
      },
    },
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
    { id: 'payment_mode', label: 'Payment Mode', render: (row) => row.payment_mode || '-' },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip
          label={(row.status || 'paid').charAt(0).toUpperCase() + (row.status || 'paid').slice(1)}
          size="small"
          color={row.status === 'paid' ? 'success' : row.status === 'pending' ? 'warning' : 'default'}
        />
      ),
    },
    {
      id: 'remarks',
      label: 'Remarks',
      render: (row) =>
        row.remarks ? (
          <Tooltip title={row.remarks} placement="top-start">
            <Typography variant="body2" sx={{ maxWidth: 160 }} noWrap>
              {row.remarks}
            </Typography>
          </Tooltip>
        ) : (
          '-'
        ),
    },
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

  const incomeTypeOptions = [
    { value: INCOME_TYPES.FINES, label: INCOME_TYPE_LABELS[INCOME_TYPES.FINES] },
    { value: INCOME_TYPES.ADDITIONAL_CHARGES, label: INCOME_TYPE_LABELS[INCOME_TYPES.ADDITIONAL_CHARGES] },
    { value: INCOME_TYPES.OTHER_INCOME, label: INCOME_TYPE_LABELS[INCOME_TYPES.OTHER_INCOME] },
  ]
  const expenseTypes = ['Utility Payment', 'Salary', 'Repairs', 'Security', 'Cleaning', 'Maintenance']

  const defaultDate = editingFinance?.transaction_date
    ? dayjs(editingFinance.transaction_date)
    : dayjs()
  const defaultMonth = editingFinance?.month ?? defaultDate.month() + 1
  const defaultYear = editingFinance?.year ?? defaultDate.year()

  const initialValues = editingFinance
    ? {
        transaction_type: editingFinance.transaction_type || 'income',
        income_type: editingFinance.income_type || '',
        expense_type: editingFinance.expense_type || '',
        amount: editingFinance.amount || 0,
        description: editingFinance.description || '',
        transaction_date: editingFinance.transaction_date ? dayjs(editingFinance.transaction_date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        payment_mode: editingFinance.payment_mode || '',
        month: editingFinance.month ?? defaultMonth,
        year: editingFinance.year ?? defaultYear,
        status: editingFinance.status || 'paid',
        remarks: editingFinance.remarks || '',
      }
    : {
        transaction_type: 'income',
        income_type: '',
        expense_type: '',
        amount: 0,
        description: '',
        transaction_date: dayjs().format('YYYY-MM-DD'),
        payment_mode: '',
        month: defaultDate.month() + 1,
        year: defaultDate.year(),
        status: 'paid',
        remarks: '',
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

      {/* Summary Cards - backend returns income, expense, balance, income_count, expense_count */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(summary.income)}
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
                  {formatCurrency(summary.expense)}
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
                  {(summary.income_count || 0) + (summary.expense_count || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="All Transactions" />
          <Tab label="Expenses" />
          <Tab label="Income" />
          <Tab label="Reports" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 3 ? (
        // Reports Tab
        <FinancialReports reportType="monthly" />
      ) : (
        // Transactions Tabs (All, Expenses, Income)
        <>
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
            data={
              activeTab === 0
                ? data?.data || []
                : activeTab === 1
                ? (data?.data || []).filter((item) => item.transaction_type === 'expense')
                : (data?.data || []).filter((item) => item.transaction_type === 'income')
            }
            loading={isLoading}
            pagination={data?.pagination}
            onPageChange={setPage}
            onRowsPerPageChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1)
            }}
          />
        </>
      )}

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
                        error={touched.income_type && !!errors.income_type}
                        helperText={touched.income_type && errors.income_type}
                        required
                      >
                        <MenuItem value="">Select Income Type</MenuItem>
                        {incomeTypeOptions.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
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
                        error={touched.expense_type && !!errors.expense_type}
                        helperText={touched.expense_type && errors.expense_type}
                        required
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
                      inputProps={{ min: 0 }}
                      value={values.amount}
                      onChange={(e) => {
                        const raw = e.target.value
                        if (raw === '') {
                          handleChange(e)
                          return
                        }
                        const num = Math.max(0, parseFloat(raw) || 0)
                        handleChange({ target: { name: e.target.name, value: num } })
                      }}
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
                      onChange={(e) => {
                        handleChange(e)
                        const d = dayjs(e.target.value)
                        if (d.isValid()) {
                          setFieldValue('month', d.month() + 1)
                          setFieldValue('year', d.year())
                        }
                      }}
                      onBlur={handleBlur}
                      error={touched.transaction_date && !!errors.transaction_date}
                      helperText={touched.transaction_date && errors.transaction_date}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Month"
                      name="month"
                      value={values.month}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {MONTH_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Year"
                      name="year"
                      value={values.year}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {yearOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {FINANCE_STATUS_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Payment Mode"
                      name="payment_mode"
                      value={values.payment_mode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="">Select Payment Mode</MenuItem>
                      {PAYMENT_MODE_OPTIONS.map((mode) => (
                        <MenuItem key={mode.value} value={mode.value}>
                          {mode.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Remarks"
                      name="remarks"
                      placeholder="Extra notes, additional comments..."
                      multiline
                      rows={2}
                      value={values.remarks}
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
