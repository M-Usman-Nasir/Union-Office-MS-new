import { useState, useMemo, useCallback } from 'react'
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
  Menu,
  IconButton,
  Tooltip,
  Chip,
  Card,
  CardContent,
  Alert,
  Tabs,
  Tab,
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useAuth } from '@/contexts/AuthContext'
import useSWR, { useSWRConfig } from 'swr'
import { financeApi } from '@/api/financeApi'
import { employeesApi } from '@/api/employeesApi'
import { apartmentApi } from '@/api/apartmentApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { jsPDF } from 'jspdf'
import {
  INCOME_TYPES,
  INCOME_TYPE_LABELS,
  PAYMENT_MODE_OPTIONS,
  MONTH_OPTIONS,
  FINANCE_STATUS_OPTIONS,
  getFinanceYearOptions,
} from '@/utils/constants'

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

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
  }).format(amount || 0)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return dayjs(dateString).format('DD/MM/YYYY')
}

const Finance = () => {
  const { user } = useAuth()
  const currentMonth = dayjs().month() + 1
  const currentYear = dayjs().year()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null)
  const [activeTab, setActiveTab] = useState(0) // 0=All, 1=Income, 2=Expense
  const [openDialog, setOpenDialog] = useState(false)
  const [editingFinance, setEditingFinance] = useState(null)
  const [societyId] = useState(user?.society_apartment_id)
  const { mutate: mutateGlobal } = useSWRConfig()

  const revalidateFinanceCaches = useCallback(async () => {
    await Promise.all([
      mutateGlobal(
        (key) => Array.isArray(key) && key[0] === '/finance/reports/monthly',
        undefined,
        { revalidate: true }
      ),
    ])
  }, [mutateGlobal])

  const { data, isLoading, error, mutate } = useSWR(
    ['/finance', page, limit, search, societyId, selectedMonth, selectedYear],
    () =>
      financeApi
        .getAll({
          page,
          limit,
          search,
          society_id: societyId,
          month: selectedMonth || undefined,
          year: selectedYear || undefined,
        })
        .then(res => res.data)
        .catch(err => {
          console.error('Finance API error:', err)
          toast.error(err.response?.data?.message || 'Failed to load finance data')
          throw err
        })
  )

  const { data: monthlyReportData, error: reportError } = useSWR(
    societyId ? ['/finance/reports/monthly', selectedMonth, selectedYear, societyId] : null,
    () => financeApi.getMonthlyReport(selectedMonth, selectedYear, { society_id: societyId }).then((res) => res.data)
  )
  const { data: apartmentData } = useSWR(
    societyId ? ['/society', societyId] : null,
    () => apartmentApi.getById(societyId).then((res) => res.data)
  )

  const { data: employeesData } = useSWR(
    openDialog && societyId ? ['/employees/list', societyId] : null,
    () => employeesApi.getAll({ limit: 500 }).then(res => res.data)
  )
  const employeesList = employeesData?.data ?? []

  const handleOpenDialog = useCallback((finance = null) => {
    setEditingFinance(finance)
    setOpenDialog(true)
  }, [])

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
      if (values.transaction_type === 'expense' && values.expense_type?.trim() === 'Salary') {
        payload.employee_id = values.employee_id || null
      } else {
        payload.employee_id = null
      }
      if (editingFinance) {
        await financeApi.update(editingFinance.id, payload)
        toast.success('Finance record updated successfully')
      } else {
        await financeApi.create({ ...payload, society_apartment_id: societyId, added_by: user.id })
        toast.success('Finance record created successfully')
      }
      await Promise.all([mutate(), revalidateFinanceCaches()])
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm('Are you sure you want to delete this finance record?')) {
        try {
          await financeApi.remove(id)
          toast.success('Finance record deleted successfully')
          await Promise.all([mutate(), revalidateFinanceCaches()])
        } catch (error) {
          toast.error(error.response?.data?.message || 'Delete failed')
        }
      }
    },
    [mutate, revalidateFinanceCaches]
  )

  const yearOptions = getFinanceYearOptions()
  const reportSummary = monthlyReportData?.data?.summary
  const monthName = MONTH_OPTIONS.find((m) => Number(m.value) === Number(selectedMonth))?.label || dayjs().format('MMMM')
  const totalIncome = Number(reportSummary?.total_income) || 0
  const totalExpenses = Number(reportSummary?.total_expenses) || 0
  const deficit = totalExpenses - totalIncome
  const maxMetric = Math.max(totalIncome, totalExpenses, Math.abs(deficit), 1)
  const expenseBreakdown = (monthlyReportData?.data?.expenseBreakdown || [])
    .map((item) => ({
      category: item.expense_type || 'Other',
      amount: Number(item.total) || 0,
      count: Number(item.count) || 0,
    }))
    .sort((a, b) => b.amount - a.amount)
  const societyDisplayName = apartmentData?.data?.name || 'Homeland Apartments'

  const columns = useMemo(() => {
    const dateCol = {
      id: 'transaction_date',
      label: 'Date',
      minWidth: 102,
      noWrapHeader: true,
      render: (row) => formatDate(row.transaction_date),
    }
    const typeCol = {
      id: 'transaction_type',
      label: 'Type',
      minWidth: 96,
      render: (row) => (
        <Chip
          label={row.transaction_type}
          color={row.transaction_type === 'income' ? 'success' : 'error'}
          size="small"
          icon={row.transaction_type === 'income' ? <TrendingUpIcon /> : <TrendingDownIcon />}
        />
      ),
    }
    const categoryCol = {
      id: 'category',
      label: 'Category',
      minWidth: 128,
      render: (row) =>
        row.transaction_type === 'income' ? row.income_type || '—' : row.expense_type || '—',
    }
    const employeeCol = {
      id: 'employee_name',
      label: 'Employee',
      minWidth: 110,
      render: (row) =>
        row.transaction_type === 'expense' && row.expense_type === 'Salary' && row.employee_name
          ? row.employee_name
          : '—',
    }
    const descCol = {
      id: 'description',
      label: 'Description',
      minWidth: 140,
      maxWidth: 240,
      cellSx: { maxWidth: 240, overflow: 'hidden' },
      render: (row) => {
        const text = row.description || '—'
        return row.description ? (
          <Tooltip title={row.description} placement="top-start">
            <Typography variant="body2" noWrap component="span" display="block">
              {text}
            </Typography>
          </Tooltip>
        ) : (
          text
        )
      },
    }
    const paymentCol = {
      id: 'payment_mode',
      label: 'Payment',
      minWidth: 96,
      render: (row) => row.payment_mode || '—',
    }
    const statusCol = {
      id: 'status',
      label: 'Status',
      minWidth: 92,
      render: (row) => (
        <Chip
          label={(row.status || 'paid').charAt(0).toUpperCase() + (row.status || 'paid').slice(1)}
          size="small"
          color={row.status === 'paid' ? 'success' : row.status === 'pending' ? 'warning' : 'default'}
        />
      ),
    }
    const remarksCol = {
      id: 'remarks',
      label: 'Remarks',
      minWidth: 100,
      maxWidth: 140,
      cellSx: { maxWidth: 140, overflow: 'hidden' },
      render: (row) =>
        row.remarks ? (
          <Tooltip title={row.remarks} placement="top-start">
            <Typography variant="body2" noWrap component="span" display="block">
              {row.remarks}
            </Typography>
          </Tooltip>
        ) : (
          '—'
        ),
    }
    const amountCol = {
      id: 'amount',
      label: 'Amount',
      align: 'right',
      minWidth: 112,
      noWrapHeader: true,
      render: (row) => formatCurrency(row.amount),
    }
    const actionsCol = {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      minWidth: 100,
      render: (row) => (
        <Box sx={{ display: 'inline-flex', gap: 0.25 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenDialog(row)} aria-label="Edit transaction">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row.id)}
              aria-label="Delete transaction"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    }

    if (activeTab === 1) {
      return [dateCol, categoryCol, descCol, paymentCol, statusCol, remarksCol, amountCol, actionsCol]
    }
    if (activeTab === 2) {
      return [dateCol, categoryCol, employeeCol, descCol, paymentCol, statusCol, remarksCol, amountCol, actionsCol]
    }
    return [dateCol, typeCol, categoryCol, employeeCol, descCol, paymentCol, statusCol, remarksCol, amountCol, actionsCol]
  }, [activeTab, handleOpenDialog, handleDelete])

  const incomeTypeOptions = [
    { value: INCOME_TYPES.FINES, label: INCOME_TYPE_LABELS[INCOME_TYPES.FINES] },
    { value: INCOME_TYPES.ADDITIONAL_CHARGES, label: INCOME_TYPE_LABELS[INCOME_TYPES.ADDITIONAL_CHARGES] },
    { value: INCOME_TYPES.MAINTENANCE, label: INCOME_TYPE_LABELS[INCOME_TYPES.MAINTENANCE] },
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
        employee_id: editingFinance.employee_id ?? '',
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
        employee_id: '',
        amount: 0,
        description: '',
        transaction_date: dayjs().format('YYYY-MM-DD'),
        payment_mode: '',
        month: defaultDate.month() + 1,
        year: defaultDate.year(),
        status: 'paid',
        remarks: '',
      }

  const handleExportFinanceReport = async () => {
    try {
      setIsExporting(true)

      const [reportRes, txRes] = await Promise.all([
        financeApi.getMonthlyReport(selectedMonth, selectedYear, { society_id: societyId }),
        financeApi.getAll({
          page: 1,
          limit: 5000,
          society_id: societyId,
          month: selectedMonth,
          year: selectedYear,
        }),
      ])

      const summaryData = reportRes?.data?.data?.summary || {}
      const breakdownData = reportRes?.data?.data?.expenseBreakdown || []
      const transactions = txRes?.data?.data || []
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const left = 10
      const right = pageWidth - 10
      const bottom = pageHeight - 10
      let y = 15

      const clipText = (value, max = 20) => {
        const text = String(value ?? '-')
        return text.length > max ? `${text.slice(0, max - 1)}...` : text
      }
      const ensureSpace = (spaceNeeded = 8) => {
        if (y + spaceNeeded > bottom) {
          doc.addPage('a4', 'landscape')
          y = 15
        }
      }
      const drawRow = (cells, widths, rowHeight = 7) => {
        ensureSpace(rowHeight + 1)
        let x = left
        cells.forEach((cell, idx) => {
          doc.text(String(cell ?? '-'), x + 1, y + 5)
          x += widths[idx]
        })
        y += rowHeight
      }

      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.text(societyDisplayName, pageWidth / 2, y, { align: 'center' })
      y += 7
      doc.setFontSize(12)
      doc.text('Finance Report', pageWidth / 2, y, { align: 'center' })
      y += 6
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)
      doc.text(`Period: ${monthName} ${selectedYear}`, left, y)
      doc.text(`Generated: ${dayjs().format('DD MMM YYYY HH:mm')}`, right, y, { align: 'right' })
      y += 5
      doc.line(left, y, right, y)
      y += 7

      doc.setFont(undefined, 'bold')
      doc.setFontSize(11)
      doc.text('Summary', left, y)
      y += 6
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)
      const summaryRows = [
        ['Total Income', formatCurrency(Number(summaryData.total_income) || 0)],
        ['Total Expenses', formatCurrency(Number(summaryData.total_expenses) || 0)],
        ['Net Income', formatCurrency(Number(summaryData.net_income) || 0)],
        ['Income Transactions', String(summaryData.income_count || 0)],
        ['Expense Transactions', String(summaryData.expense_count || 0)],
      ]
      summaryRows.forEach(([label, value]) => {
        ensureSpace(6)
        doc.text(`${label}:`, left, y)
        doc.text(value, left + 55, y)
        y += 5
      })
      y += 3

      doc.setFont(undefined, 'bold')
      doc.setFontSize(11)
      doc.text('Expense Breakdown', left, y)
      y += 6
      const breakdownWidths = [90, 45, 30]
      doc.setFontSize(9)
      drawRow(['Category', 'Amount', 'Count'], breakdownWidths)
      doc.line(left, y - 1, left + breakdownWidths.reduce((sum, w) => sum + w, 0), y - 1)
      doc.setFont(undefined, 'normal')
      if (breakdownData.length) {
        breakdownData.forEach((item) => {
          drawRow(
            [
              clipText(item.expense_type || 'Other', 36),
              clipText(formatCurrency(Number(item.total) || 0), 22),
              String(item.count || 0),
            ],
            breakdownWidths
          )
        })
      } else {
        drawRow(['No expense breakdown data', '-', '-'], breakdownWidths)
      }
      y += 4

      const transactionWidths = [20, 18, 52, 30, 32, 30, 20, 45]
      const transactionHeader = ['Date', 'Type', 'Description', 'Amount', 'Category', 'Payment', 'Status', 'Remarks']
      const drawTransactionHeader = () => {
        doc.setFont(undefined, 'bold')
        drawRow(transactionHeader, transactionWidths)
        doc.line(left, y - 1, left + transactionWidths.reduce((sum, w) => sum + w, 0), y - 1)
        doc.setFont(undefined, 'normal')
      }

      ensureSpace(12)
      doc.setFont(undefined, 'bold')
      doc.setFontSize(11)
      doc.text('Transactions', left, y)
      y += 6
      doc.setFontSize(9)
      drawTransactionHeader()

      if (transactions.length) {
        transactions.forEach((row) => {
          if (y + 8 > bottom) {
            doc.addPage('a4', 'landscape')
            y = 15
            drawTransactionHeader()
          }
          const category = row.transaction_type === 'income' ? row.income_type : row.expense_type
          drawRow(
            [
              clipText(formatDate(row.transaction_date), 10),
              clipText(row.transaction_type || '-', 8),
              clipText(row.description || '-', 28),
              clipText(formatCurrency(Number(row.amount) || 0), 16),
              clipText(category || '-', 18),
              clipText(row.payment_mode || '-', 14),
              clipText(row.status || '-', 8),
              clipText(row.remarks || '-', 24),
            ],
            transactionWidths
          )
        })
      } else {
        drawRow(['No transactions for this period', '-', '-', '-', '-', '-', '-', '-'], transactionWidths)
      }

      doc.save(`finance-report-${selectedYear}-${String(selectedMonth).padStart(2, '0')}.pdf`)
      toast.success('Finance report exported as PDF')
    } catch (err) {
      console.error('Export finance report error:', err)
      toast.error(err.response?.data?.message || 'Failed to export finance PDF report')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportFinanceCsv = async () => {
    try {
      setIsExportingCsv(true)

      const [reportRes, txRes] = await Promise.all([
        financeApi.getMonthlyReport(selectedMonth, selectedYear, { society_id: societyId }),
        financeApi.getAll({
          page: 1,
          limit: 5000,
          society_id: societyId,
          month: selectedMonth,
          year: selectedYear,
        }),
      ])

      const summaryData = reportRes?.data?.data?.summary || {}
      const breakdownData = reportRes?.data?.data?.expenseBreakdown || []
      const transactions = txRes?.data?.data || []

      const escapeCsv = (value) => {
        const str = String(value ?? '')
        return `"${str.replace(/"/g, '""')}"`
      }

      const lines = []
      lines.push(escapeCsv(societyDisplayName))
      lines.push('Finance Report')
      lines.push(`Period,${escapeCsv(`${monthName} ${selectedYear}`)}`)
      lines.push(`Generated On,${escapeCsv(dayjs().format('DD MMM YYYY HH:mm'))}`)
      lines.push('')
      lines.push('Summary')
      lines.push('Metric,Value')
      lines.push(`Total Income,${escapeCsv(formatCurrency(Number(summaryData.total_income) || 0))}`)
      lines.push(`Total Expenses,${escapeCsv(formatCurrency(Number(summaryData.total_expenses) || 0))}`)
      lines.push(`Net Income,${escapeCsv(formatCurrency(Number(summaryData.net_income) || 0))}`)
      lines.push(`Income Transactions,${escapeCsv(summaryData.income_count || 0)}`)
      lines.push(`Expense Transactions,${escapeCsv(summaryData.expense_count || 0)}`)
      lines.push('')
      lines.push('Expense Breakdown')
      lines.push('Category,Amount,Count')
      if (breakdownData.length) {
        breakdownData.forEach((item) => {
          lines.push(
            [
              escapeCsv(item.expense_type || 'Other'),
              escapeCsv(formatCurrency(Number(item.total) || 0)),
              escapeCsv(item.count || 0),
            ].join(',')
          )
        })
      } else {
        lines.push('No expense breakdown data,,')
      }
      lines.push('')
      lines.push('Transactions')
      lines.push('Date,Type,Description,Amount,Category,Payment Mode,Status,Remarks')
      if (transactions.length) {
        transactions.forEach((row) => {
          const category = row.transaction_type === 'income' ? row.income_type : row.expense_type
          lines.push(
            [
              escapeCsv(formatDate(row.transaction_date)),
              escapeCsv(row.transaction_type),
              escapeCsv(row.description || ''),
              escapeCsv(formatCurrency(row.amount)),
              escapeCsv(category || ''),
              escapeCsv(row.payment_mode || ''),
              escapeCsv(row.status || ''),
              escapeCsv(row.remarks || ''),
            ].join(',')
          )
        })
      } else {
        lines.push('No transactions for this period,,,,,,,')
      }

      const csvContent = '\uFEFF' + lines.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `finance-report-${selectedYear}-${String(selectedMonth).padStart(2, '0')}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Finance report exported as CSV')
    } catch (err) {
      console.error('Export finance CSV error:', err)
      toast.error(err.response?.data?.message || 'Failed to export finance CSV report')
    } finally {
      setIsExportingCsv(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1">
            Finance Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete Financial Overview - Income vs Expense Analysis
          </Typography>
        </Box>
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

      {reportError && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error">
            {reportError.response?.data?.message || 'Failed to load monthly report data.'}
          </Alert>
        </Box>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} md={2}>
              <Typography variant="body2" color="text.secondary">
                View Stats For:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                fullWidth
                select
                size="small"
                label="Month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(Number(e.target.value))
                  setPage(1)
                }}
              >
                {MONTH_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label} {selectedYear}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                fullWidth
                select
                size="small"
                label="Year"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value))
                  setPage(1)
                }}
              >
                {yearOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            Dashboard totals and exports use the selected month and year (each transaction&apos;s stored period, kept in sync when you change Transaction Date).
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {monthName} {selectedYear} — Income vs expenses
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Total income
                  </Typography>
                  <Typography variant="h5" color="success.main" sx={{ mt: 1 }}>
                    {formatCurrency(totalIncome)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    All income types in this period
                  </Typography>
                </Box>
                <TrendingUpIcon color="success" fontSize="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Total Expenses
                  </Typography>
                  <Typography variant="h5" color="error.main" sx={{ mt: 1 }}>
                    {formatCurrency(totalExpenses)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Operational cost this month
                  </Typography>
                </Box>
                <TrendingDownIcon color="error" fontSize="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Monthly Deficit/Surplus
                  </Typography>
                  <Typography variant="h5" color={deficit > 0 ? 'error.main' : 'success.main'} sx={{ mt: 1 }}>
                    {deficit > 0 ? '-' : ''}{formatCurrency(Math.abs(deficit))}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {deficit > 0 ? 'Amount to cover from reserves' : 'Current month surplus'}
                  </Typography>
                </Box>
                <WarningAmberIcon color={deficit > 0 ? 'warning' : 'success'} fontSize="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Expense Breakdown - {monthName} {selectedYear}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {expenseBreakdown.length > 0 ? expenseBreakdown.map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} key={`${item.category}-${idx}`}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  {item.category}
                </Typography>
                <Typography variant="h5" color="primary.main" sx={{ mt: 1 }}>
                  {formatCurrency(item.amount)}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {totalExpenses ? `${Math.round((item.amount / totalExpenses) * 100)}% of expenses` : '0% of expenses'}
                  {item.count > 0 ? ` · ${item.count} transaction${item.count === 1 ? '' : 's'}` : ''}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )) : (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  No expense data available for selected month.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Income vs Expenses Comparison - {monthName} {selectedYear}
          </Typography>
          <Grid container spacing={1}>
            {[
              { label: 'Income', amount: totalIncome, color: '#1d4ed8' },
              { label: 'Expense', amount: totalExpenses, color: '#2563eb' },
              { label: 'Deficit', amount: Math.abs(deficit), color: '#ef4444' },
            ].map((metric) => (
              <Grid item xs={12} md={4} key={metric.label}>
                <Box sx={{ px: 0.5 }}>
                  <Box
                    sx={{
                      height: 12,
                      borderRadius: 1,
                      bgcolor: `${metric.color}22`,
                      overflow: 'hidden',
                      mb: 0.75,
                    }}
                  >
                    <Box
                      sx={{
                        width: `${Math.max((metric.amount / maxMetric) * 100, 8)}%`,
                        height: '100%',
                        bgcolor: metric.color,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {metric.label}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(metric.amount)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Typography variant="h6">Transactions</Typography>
        <Box sx={{ display: 'inline-flex', flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add transaction
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            endIcon={<KeyboardArrowDownIcon />}
            disabled={isExportingCsv || isExporting || !societyId}
            onClick={(e) => setExportMenuAnchor(e.currentTarget)}
          >
            {isExportingCsv || isExporting ? 'Exporting...' : 'Export report'}
          </Button>
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={() => setExportMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              disabled={isExportingCsv || isExporting}
              onClick={() => {
                setExportMenuAnchor(null)
                handleExportFinanceCsv()
              }}
            >
              Download as CSV
            </MenuItem>
            <MenuItem
              disabled={isExporting || isExportingCsv}
              onClick={() => {
                setExportMenuAnchor(null)
                handleExportFinanceReport()
              }}
            >
              Download as PDF
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => {
          setActiveTab(newValue)
          setPage(1)
        }}>
          <Tab label="All" />
          <Tab label="Income" />
          <Tab label="Expense" />
        </Tabs>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search finance records..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
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
              ? (data?.data || []).filter((item) => item.transaction_type === 'income')
              : (data?.data || []).filter((item) => item.transaction_type === 'expense')
        }
        loading={isLoading}
        dense
        minTableWidth={1040}
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
                      <Autocomplete
                        freeSolo
                        options={expenseTypes}
                        value={values.expense_type || null}
                        inputValue={values.expense_type ?? ''}
                        onInputChange={(_, newInputValue) => {
                          setFieldValue('expense_type', newInputValue || '')
                          if (newInputValue?.trim() !== 'Salary') setFieldValue('employee_id', '')
                        }}
                        onChange={(_, newValue) => {
                          const val = typeof newValue === 'string' ? newValue : newValue || ''
                          setFieldValue('expense_type', val)
                          if (val !== 'Salary') setFieldValue('employee_id', '')
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="expense_type"
                            label="Expense Type"
                            required
                            error={touched.expense_type && !!errors.expense_type}
                            helperText={touched.expense_type && errors.expense_type}
                            onBlur={handleBlur}
                          />
                        )}
                      />
                    </Grid>
                  )}
                  {values.transaction_type === 'expense' && values.expense_type?.trim() === 'Salary' && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        label="Employee (Salary to)"
                        name="employee_id"
                        value={values.employee_id ?? ''}
                        onChange={(e) => setFieldValue('employee_id', e.target.value)}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="">Select employee</MenuItem>
                        {employeesList.map((emp) => (
                          <MenuItem key={emp.employee_id ?? emp.id} value={emp.employee_id ?? emp.id}>
                            {emp.name} {emp.designation ? `(${emp.designation})` : ''}
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
                    <Typography variant="caption" color="text.secondary">
                      Month and year set the accounting period for reports and totals. Changing Transaction Date updates them automatically; you can override manually if needed.
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
