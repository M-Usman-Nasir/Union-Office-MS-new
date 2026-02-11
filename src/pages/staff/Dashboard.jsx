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
  Button,
} from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { staffApi } from '@/api/staffApi'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PaymentIcon from '@mui/icons-material/Payment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'

const StaffDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Fetch staff-specific data
  const { data: complaintsData, isLoading: complaintsLoading } = useSWR(
    user ? '/staff/complaints' : null,
    () => staffApi.getComplaints({ limit: 100 }).then(res => res.data)
  )

  const { data: paymentsData, isLoading: paymentsLoading } = useSWR(
    user ? '/staff/payments' : null,
    () => staffApi.getPayments({ limit: 100 }).then(res => res.data)
  )

  const isLoading = complaintsLoading || paymentsLoading

  const complaints = complaintsData?.data || []
  const payments = paymentsData?.data || []

  // Calculate statistics
  const assignedComplaints = complaints.length
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length
  const paymentsToUpdate = payments.filter(p => p.status === 'pending').length

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
      case 'paid':
        return 'success'
      case 'in_progress':
        return 'info'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Staff Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.name || 'Staff Member'}
        </Typography>
      </Box>

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
                        Assigned Complaints
                      </Typography>
                      <Typography variant="h4">{assignedComplaints}</Typography>
                    </Box>
                    <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
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
                        Pending Complaints
                      </Typography>
                      <Typography variant="h4">{pendingComplaints}</Typography>
                    </Box>
                    <PendingIcon sx={{ fontSize: 40, color: 'warning.main' }} />
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
                        Resolved Complaints
                      </Typography>
                      <Typography variant="h4">{resolvedComplaints}</Typography>
                    </Box>
                    <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
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
                        Payments to Update
                      </Typography>
                      <Typography variant="h4">{paymentsToUpdate}</Typography>
                    </Box>
                    <PaymentIcon sx={{ fontSize: 40, color: 'info.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate(ROUTES.STAFF_COMPLAINTS)}
              startIcon={<AssignmentIcon />}
            >
              View All Complaints
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(ROUTES.STAFF_PAYMENTS)}
              startIcon={<PaymentIcon />}
            >
              Update Payments
            </Button>
          </Box>

          {/* Recent Complaints */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Assigned Complaints
                  </Typography>
                  {complaints.length === 0 ? (
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      No complaints assigned yet
                    </Typography>
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {complaints.slice(0, 5).map((complaint) => (
                            <TableRow key={complaint.id}>
                              <TableCell>{complaint.title}</TableCell>
                              <TableCell>
                                <Chip
                                  label={complaint.status}
                                  color={getStatusColor(complaint.status)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={complaint.priority}
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>{formatDate(complaint.created_at)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Payments */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Payments
                  </Typography>
                  {payments.length === 0 ? (
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      No payments to update
                    </Typography>
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Unit</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Month/Year</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {payments.slice(0, 5).map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{payment.unit_number || 'N/A'}</TableCell>
                              <TableCell>PKR {parseFloat(payment.total_amount || 0).toLocaleString()}</TableCell>
                              <TableCell>
                                <Chip
                                  label={payment.status}
                                  color={getStatusColor(payment.status)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {payment.month}/{payment.year}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
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

export default StaffDashboard
