import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  TextField,
  Alert,
  Tabs,
  Tab,
} from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { financeApi } from '@/api/financeApi'
import { settingsApi } from '@/api/settingsApi'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'

const ResidentFinancialSummary = () => {
  const { user } = useAuth()
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [reportType, setReportType] = useState('monthly') // 'monthly' or 'yearly'

  const societyId = user?.society_apartment_id

  // Check visibility settings
  const { data: settingsData } = useSWR(
    societyId ? `/settings/${societyId}` : null,
    () => settingsApi.getSettings(societyId).then((res) => res.data.data || res.data).catch(() => null)
  )

  const isVisible = settingsData?.financial_reports_visible !== false

  // Fetch public summary - monthly
  const { data: monthlyData, isLoading: monthlyLoading, error: monthlyError } = useSWR(
    isVisible && societyId && reportType === 'monthly'
      ? ['/finance/public-summary', selectedMonth, selectedYear, societyId, 'monthly']
      : null,
    () =>
      financeApi
        .getPublicSummary(selectedMonth, selectedYear, { society_id: societyId })
        .then((res) => res.data)
  )

  // Fetch public summary - yearly
  const { data: yearlyData, isLoading: yearlyLoading, error: yearlyError } = useSWR(
    isVisible && societyId && reportType === 'yearly'
      ? ['/finance/public-summary', selectedYear, societyId, 'yearly']
      : null,
    () =>
      financeApi
        .getYearlyReport(selectedYear, { society_id: societyId })
        .then((res) => res.data)
        .catch(() => null)
  )

  const isLoading = monthlyLoading || yearlyLoading
  const error = monthlyError || yearlyError
  const summary = reportType === 'monthly' ? monthlyData?.data : yearlyData?.data

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount || 0)
  }

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

  if (!isVisible) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mt: 2 }}>
          Financial reports are currently not visible. Please contact your administrator if you need access.
        </Alert>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Financial Summary
          </Typography>
        </Box>
        <Alert severity="error">
          {error.response?.status === 403
            ? 'You do not have permission to view financial reports.'
            : error.response?.data?.message || 'Failed to load financial summary. Please try again.'}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Financial Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View your society's financial overview
          </Typography>
        </Box>
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={reportType} onChange={(e, newValue) => setReportType(newValue)}>
              <Tab label="Monthly Summary" value="monthly" />
              <Tab label="Yearly Summary" value="yearly" />
            </Tabs>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {reportType === 'monthly' && (
              <TextField
                select
                label="Month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                sx={{ minWidth: 150 }}
              >
                {monthOptions.map((month) => (
                  <MenuItem key={month} value={month}>
                    {monthNames[month - 1]}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField
              select
              label="Year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              sx={{ minWidth: 120 }}
            >
              {yearOptions.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Total Income
                      </Typography>
                      <Typography variant="h5" color="success.main">
                        {formatCurrency(summary.total_income)}
                      </Typography>
                    </Box>
                    <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Total Expenses
                      </Typography>
                      <Typography variant="h5" color="error.main">
                        {formatCurrency(summary.total_expenses)}
                      </Typography>
                    </Box>
                    <TrendingDownIcon sx={{ fontSize: 40, color: 'error.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Net Income
                      </Typography>
                      <Typography variant="h5" color="primary.main">
                        {formatCurrency(summary.net_income)}
                      </Typography>
                    </Box>
                    <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          {summary.total_income !== undefined && summary.total_expenses !== undefined && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Income vs Expenses
                    </Typography>
                    <BarChart
                      data={[
                        { category: 'Income', value: summary.total_income || 0 },
                        { category: 'Expenses', value: summary.total_expenses || 0 },
                      ]}
                      title=""
                      xLabel="Type"
                      yLabel="Amount (PKR)"
                    />
                  </CardContent>
                </Card>
              </Grid>
              {reportType === 'yearly' && summary.monthly_trend && summary.monthly_trend.length > 0 && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Monthly Trend
                      </Typography>
                      <LineChart
                        data={summary.monthly_trend.map((item) => ({
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
          )}

          {/* Empty State */}
          {summary.total_income === undefined && summary.total_expenses === undefined && (
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No financial data available for the selected period
                </Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Container>
  )
}

export default ResidentFinancialSummary
