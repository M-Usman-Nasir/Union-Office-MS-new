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
} from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { superAdminApi } from '@/api/superAdminApi'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AssignmentIcon from '@mui/icons-material/Assignment'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

const GlobalReports = () => {
  const { user } = useAuth()
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  // Generate year options (current year and 5 years back)
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i)

  const { data, isLoading, error } = useSWR(
    ['/super-admin/reports/global', selectedYear],
    () => superAdminApi.getGlobalReports(selectedYear).then(res => res.data)
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount || 0)
  }

  const reports = data?.data || {}

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Global Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cross-society analytics and statistics
          </Typography>
        </Box>
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

      {error && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error">
            {error.response?.data?.message || 'Failed to load global reports. Please try again.'}
          </Alert>
        </Box>
      )}

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
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
                        {formatCurrency(reports.total_income)}
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
                        {formatCurrency(reports.total_expenses)}
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
                        {formatCurrency(reports.net_income)}
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
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Total Complaints
                      </Typography>
                      <Typography variant="h5">
                        {reports.total_complaints || 0}
                      </Typography>
                    </Box>
                    <AssignmentIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3}>
            {/* Financial Summary by Society */}
            {reports.society_financials && reports.society_financials.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Financial Summary by Society
                    </Typography>
                    <BarChart
                      data={reports.society_financials.map(society => ({
                        category: society.society_name || 'Unknown',
                        value: society.total_income || 0,
                      }))}
                      title="Income by Society"
                      xLabel="Society"
                      yLabel="Income (PKR)"
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Complaint Statistics */}
            {reports.complaint_statistics && Object.keys(reports.complaint_statistics).length > 0 && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Complaint Statistics
                    </Typography>
                    <PieChart
                      data={Object.entries(reports.complaint_statistics).map(([status, count]) => ({
                        label: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
                        value: count || 0,
                      }))}
                      title="Complaints by Status"
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Society-wise Breakdown */}
            {reports.society_breakdown && reports.society_breakdown.length > 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Society-wise Breakdown
                    </Typography>
                    <Grid container spacing={2}>
                      {reports.society_breakdown.map((society, index) => (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                {society.society_name || 'Unknown Society'}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Income:</strong> {formatCurrency(society.income || 0)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Expenses:</strong> {formatCurrency(society.expenses || 0)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Net:</strong> {formatCurrency(society.net_income || 0)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Complaints:</strong> {society.complaints || 0}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Empty State */}
            {(!reports.society_financials || reports.society_financials.length === 0) &&
              (!reports.complaint_statistics || Object.keys(reports.complaint_statistics).length === 0) && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                        No data available for the selected year
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
          </Grid>
        </>
      )}
    </Container>
  )
}

export default GlobalReports
