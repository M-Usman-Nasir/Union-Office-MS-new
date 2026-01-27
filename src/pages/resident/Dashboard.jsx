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
} from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { complaintApi } from '@/api/complaintApi'
import { maintenanceApi } from '@/api/maintenanceApi'
import { announcementApi } from '@/api/announcementApi'
import { defaulterApi } from '@/api/defaulterApi'
import { settingsApi } from '@/api/settingsApi'

const ResidentDashboard = () => {
  const { user } = useAuth()

  // Fetch resident-specific data
  const { data: complaintsData, isLoading: complaintsLoading } = useSWR(
    user ? '/complaints/my' : null,
    () => complaintApi.getAll({ limit: 5, page: 1 }).then(res => res.data)
  )

  const { data: maintenanceData, isLoading: maintenanceLoading } = useSWR(
    user ? '/maintenance/my' : null,
    () => maintenanceApi.getAll({ limit: 5, page: 1 }).then(res => res.data)
  )

  const { data: announcementsData, isLoading: announcementsLoading } = useSWR(
    '/announcements/recent',
    () => announcementApi.getAll({ limit: 5, page: 1 }).then(res => res.data)
  )

  const societyId = user?.society_apartment_id

  // Check visibility settings
  const { data: settingsData } = useSWR(
    societyId ? `/settings/${societyId}` : null,
    () => settingsApi.getSettings(societyId).then((res) => res.data.data || res.data).catch(() => null)
  )

  const defaulterListVisible = settingsData?.defaulter_list_visible !== false

  const { data: defaulterData, isLoading: defaulterLoading } = useSWR(
    user && defaulterListVisible ? '/defaulters/my' : null,
    () => defaulterApi.getAll({ unit_id: user?.unit_id }).then(res => res.data)
  )

  const isLoading = complaintsLoading || maintenanceLoading || announcementsLoading

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resident Dashboard
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
          {/* Status Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    My Complaints
                  </Typography>
                  <Typography variant="h4" component="div">
                    {complaintsData?.pagination?.total || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total complaints submitted
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pending Maintenance
                  </Typography>
                  <Typography variant="h4" component="div">
                    {maintenanceData?.data?.filter(m => m.status === 'pending').length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unpaid maintenance fees
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {defaulterListVisible && (
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Defaulter Status
                    </Typography>
                    {defaulterData?.data && defaulterData.data.length > 0 ? (
                      <>
                        <Typography variant="h6" color="error" component="div">
                          {formatCurrency(defaulterData.data[0].amount_due)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Amount due
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="h6" color="success.main" component="div">
                          Clear
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          No pending dues
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {/* My Complaints */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    My Complaints
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

            {/* My Maintenance */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    My Maintenance
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
                            <TableCell>Type</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {maintenanceData?.data?.slice(0, 5).map((maintenance) => (
                            <TableRow key={maintenance.id}>
                              <TableCell>{maintenance.type}</TableCell>
                              <TableCell>{formatCurrency(maintenance.amount)}</TableCell>
                              <TableCell>{formatDate(maintenance.due_date)}</TableCell>
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
          </Grid>

          {/* Announcements */}
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
        </>
      )}
    </Container>
  )
}

export default ResidentDashboard
