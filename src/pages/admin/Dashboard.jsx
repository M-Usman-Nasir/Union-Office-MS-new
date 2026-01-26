import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { dashboardApi } from '@/api/dashboardApi'
import { financeApi } from '@/api/financeApi'
import { defaulterApi } from '@/api/defaulterApi'
import { complaintApi } from '@/api/complaintApi'
import { maintenanceApi } from '@/api/maintenanceApi'
import { announcementApi } from '@/api/announcementApi'
import { residentApi } from '@/api/residentApi'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import WarningIcon from '@mui/icons-material/Warning'
import FeedbackIcon from '@mui/icons-material/Feedback'
import PaymentIcon from '@mui/icons-material/Payment'
import FinanceChart from '@/components/charts/FinanceChart'
import PieChart from '@/components/charts/PieChart'
import BarChart from '@/components/charts/BarChart'

const AdminDashboard = () => {
  const { user } = useAuth()

  // Fetch dashboard data
  const { data: financeSummary, isLoading: financeLoading } = useSWR(
    '/finance/summary',
    () => financeApi.getSummary().then(res => res.data.data)
  )

  const { data: defaulterStats, isLoading: defaulterLoading } = useSWR(
    '/defaulters/statistics',
    () => defaulterApi.getStatistics().then(res => res.data.data)
  )

  const { data: residentsData, isLoading: residentsLoading } = useSWR(
    '/residents',
    () => residentApi.getAll({ limit: 1, page: 1 }).then(res => res.data)
  )

  const { data: complaintsData, isLoading: complaintsLoading } = useSWR(
    '/complaints/recent',
    () => complaintApi.getAll({ limit: 5, page: 1 }).then(res => res.data)
  )

  const { data: maintenanceData, isLoading: maintenanceLoading } = useSWR(
    '/maintenance/recent',
    () => maintenanceApi.getAll({ limit: 5, page: 1 }).then(res => res.data)
  )

  const { data: announcementsData, isLoading: announcementsLoading } = useSWR(
    '/announcements/recent',
    () => announcementApi.getAll({ limit: 5, page: 1 }).then(res => res.data)
  )

  const { data: financeData } = useSWR(
    '/finance/all',
    () => financeApi.getAll({ limit: 30, page: 1, society_id: user?.society_apartment_id }).then(res => res.data)
  )

  const isLoading = financeLoading || defaulterLoading || residentsLoading

  // Prepare chart data
  const complaintStatusData = complaintsData?.data
    ? [
        { label: 'Pending', value: complaintsData.data.filter(c => c.status === 'pending').length },
        { label: 'In Progress', value: complaintsData.data.filter(c => c.status === 'in_progress').length },
        { label: 'Resolved', value: complaintsData.data.filter(c => c.status === 'resolved').length },
        { label: 'Closed', value: complaintsData.data.filter(c => c.status === 'closed').length },
      ].filter(item => item.value > 0)
    : []

  const maintenanceStatusData = maintenanceData?.data
    ? [
        { label: 'Paid', value: maintenanceData.data.filter(m => m.status === 'paid').length },
        { label: 'Pending', value: maintenanceData.data.filter(m => m.status === 'pending').length },
        { label: 'Partially Paid', value: maintenanceData.data.filter(m => m.status === 'partially_paid').length },
      ].filter(item => item.value > 0)
    : []

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
      case 'resolved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'in_progress':
        return 'info'
      default:
        return 'default'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.name || user?.email}
        </Typography>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div">
                        {residentsData?.pagination?.total || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Residents
                      </Typography>
                    </Box>
                    <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div">
                        {formatCurrency(financeSummary?.total_income || 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Income
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
                      <Typography variant="h4" component="div">
                        {defaulterStats?.total_defaulters || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Defaulters
                      </Typography>
                    </Box>
                    <WarningIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div">
                        {formatCurrency(defaulterStats?.total_amount_due || 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Amount Due
                      </Typography>
                    </Box>
                    <AccountBalanceIcon sx={{ fontSize: 40, color: 'error.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Finance Chart */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Finance Overview
                  </Typography>
                  {financeData?.data ? (
                    <FinanceChart data={financeData.data} />
                  ) : (
                    <Box display="flex" justifyContent="center" p={4}>
                      <CircularProgress />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Complaint Status Chart */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  {complaintStatusData.length > 0 ? (
                    <PieChart data={complaintStatusData} title="Complaints by Status" />
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                      No complaint data available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Maintenance Status Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  {maintenanceStatusData.length > 0 ? (
                    <PieChart data={maintenanceStatusData} title="Maintenance by Status" />
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                      No maintenance data available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Defaulter Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  {defaulterStats && (
                    <BarChart
                      data={[
                        { category: 'Active', value: defaulterStats.active_count || 0 },
                        { category: 'Resolved', value: defaulterStats.resolved_count || 0 },
                        { category: 'Escalated', value: defaulterStats.escalated_count || 0 },
                      ]}
                      title="Defaulters by Status"
                      xLabel="Status"
                      yLabel="Count"
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Data Tables */}
          <Grid container spacing={3}>
            {/* Recent Complaints */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Complaints
                  </Typography>
                  {complaintsLoading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Priority</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {complaintsData?.data?.slice(0, 5).map((complaint) => (
                            <TableRow key={complaint.id}>
                              <TableCell>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                  {complaint.description}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={complaint.status}
                                  color={getStatusColor(complaint.status)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Chip label={complaint.priority} size="small" variant="outlined" />
                              </TableCell>
                            </TableRow>
                          ))}
                          {(!complaintsData?.data || complaintsData.data.length === 0) && (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                <Typography variant="body2" color="text.secondary">
                                  No complaints found
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Maintenance */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Maintenance
                  </Typography>
                  {maintenanceLoading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Month/Year</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Amount Paid</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {maintenanceData?.data?.slice(0, 5).map((maintenance) => (
                            <TableRow key={maintenance.id}>
                              <TableCell>{maintenance.month}/{maintenance.year}</TableCell>
                              <TableCell>{formatCurrency(maintenance.total_amount)}</TableCell>
                              <TableCell>{formatCurrency(maintenance.amount_paid || 0)}</TableCell>
                              <TableCell>
                                <Chip
                                  label={maintenance.status}
                                  color={getStatusColor(maintenance.status)}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                          {(!maintenanceData?.data || maintenanceData.data.length === 0) && (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                <Typography variant="body2" color="text.secondary">
                                  No maintenance records found
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Announcements */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Announcements
                  </Typography>
                  {announcementsLoading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {announcementsData?.data?.slice(0, 3).map((announcement) => (
                        <Grid item xs={12} md={4} key={announcement.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {announcement.title}
                                </Typography>
                                {announcement.type && (
                                  <Chip
                                    label={announcement.type}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {announcement.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                      {(!announcementsData?.data || announcementsData.data.length === 0) && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary" align="center">
                            No announcements found
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  )
}

export default AdminDashboard
