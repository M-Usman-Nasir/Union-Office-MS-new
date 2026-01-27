import { useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
  Button,
  ButtonGroup,
} from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { financeApi } from '@/api/financeApi'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import LineChart from '@/components/charts/LineChart'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import TableChartIcon from '@mui/icons-material/TableChart'

const FinancialReports = ({ reportType = 'monthly' }) => {
  const { user } = useAuth()
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const societyId = user?.society_apartment_id

  // Fetch monthly report
  const { data: monthlyData, isLoading: monthlyLoading, error: monthlyError } = useSWR(
    reportType === 'monthly' && societyId
      ? ['/finance/reports/monthly', selectedMonth, selectedYear, societyId]
      : null,
    () =>
      financeApi
        .getMonthlyReport(selectedMonth, selectedYear, { society_id: societyId })
        .then((res) => res.data)
  )

  // Fetch yearly report
  const { data: yearlyData, isLoading: yearlyLoading, error: yearlyError } = useSWR(
    reportType === 'yearly' && societyId
      ? ['/finance/reports/yearly', selectedYear, societyId]
      : null,
    () =>
      financeApi
        .getYearlyReport(selectedYear, { society_id: societyId })
        .then((res) => res.data)
  )

  const isLoading = monthlyLoading || yearlyLoading
  const error = monthlyError || yearlyError
  const reportData = reportType === 'monthly' ? monthlyData?.data : yearlyData?.data

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount || 0)
  }

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Alert severity="error">
          {error.response?.data?.message || 'Failed to load financial reports. Please try again.'}
        </Alert>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    )
  }

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    // This would typically use a library like jsPDF or react-to-print
    console.log('Export PDF - To be implemented')
    // Example: window.print() or generate PDF using jsPDF
  }

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
    // This would typically use a library like xlsx or exceljs
    console.log('Export Excel - To be implemented')
    // Example: Generate Excel file using xlsx library
  }

  return (
    <Box>
      {/* Date Selectors and Export Buttons */}
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        {reportType === 'monthly' && (
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {monthOptions.map((month) => (
                <MenuItem key={month} value={month}>
                  {monthNames[month - 1]}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {yearOptions.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ButtonGroup variant="outlined" size="small" fullWidth>
            <Button
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportPDF}
              disabled={isLoading || !reportData}
              title="Export as PDF (Coming Soon)"
            >
              PDF
            </Button>
            <Button
              startIcon={<TableChartIcon />}
              onClick={handleExportExcel}
              disabled={isLoading || !reportData}
              title="Export as Excel (Coming Soon)"
            >
              Excel
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>

      {/* Summary Cards */}
      {reportData && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Total Income
                      </Typography>
                      <Typography variant="h5" color="success.main">
                        {formatCurrency(reportData.total_income)}
                      </Typography>
                    </Box>
                    <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Total Expenses
                      </Typography>
                      <Typography variant="h5" color="error.main">
                        {formatCurrency(reportData.total_expenses)}
                      </Typography>
                    </Box>
                    <TrendingDownIcon sx={{ fontSize: 40, color: 'error.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Net Income
                      </Typography>
                      <Typography variant="h5" color="primary.main">
                        {formatCurrency(reportData.net_income)}
                      </Typography>
                    </Box>
                    <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Transactions
                    </Typography>
                    <Typography variant="h5">
                      {reportData.total_transactions || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* Income vs Expense Comparison */}
            {reportData.income_vs_expense && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Income vs Expenses
                    </Typography>
                    <BarChart
                      data={[
                        { category: 'Income', value: reportData.total_income || 0 },
                        { category: 'Expenses', value: reportData.total_expenses || 0 },
                      ]}
                      title=""
                      xLabel="Type"
                      yLabel="Amount (PKR)"
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Income Type Breakdown */}
            {reportData.income_by_type && Object.keys(reportData.income_by_type).length > 0 && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Income by Type
                    </Typography>
                    <PieChart
                      data={Object.entries(reportData.income_by_type).map(([type, amount]) => ({
                        label: type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                        value: amount || 0,
                      }))}
                      title=""
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Expense Type Breakdown */}
            {reportData.expense_by_type && Object.keys(reportData.expense_by_type).length > 0 && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Expenses by Type
                    </Typography>
                    <PieChart
                      data={Object.entries(reportData.expense_by_type).map(([type, amount]) => ({
                        label: type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                        value: amount || 0,
                      }))}
                      title=""
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Monthly Trend (for yearly report) */}
            {reportType === 'yearly' &&
              reportData.monthly_trend &&
              reportData.monthly_trend.length > 0 && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Monthly Trend
                      </Typography>
                      <LineChart
                        data={reportData.monthly_trend.map((item) => ({
                          category: monthNames[item.month - 1] || `Month ${item.month}`,
                          value: item.net_income || 0,
                        }))}
                        title=""
                        xLabel="Month"
                        yLabel="Net Income (PKR)"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}
          </Grid>

          {/* Empty State */}
          {(!reportData.income_vs_expense &&
            (!reportData.income_by_type || Object.keys(reportData.income_by_type).length === 0) &&
            (!reportData.expense_by_type || Object.keys(reportData.expense_by_type).length === 0)) && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No data available for the selected period
                </Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  )
}

export default FinancialReports
