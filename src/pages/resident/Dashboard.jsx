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

  const societyId = user?.society_apartment_id
  const unitId = user?.unit_id

  const { data: maintenanceData, isLoading: maintenanceLoading } = useSWR(
    user && unitId ? ['/maintenance/my', unitId] : null,
    () => maintenanceApi.getAll({ limit: 5, page: 1, unit_id: unitId }).then(res => res.data)
  )

  const { data: announcementsData, isLoading: announcementsLoading } = useSWR(
    societyId ? ['/announcements/recent', societyId] : null,
    () => announcementApi.getAll({ limit: 5, page: 1, society_id: societyId }).then(res => res.data)
  )

  // Check visibility settings
  const { data: settingsData } = useSWR(
    societyId ? `/settings/${societyId}` : null,
    () => settingsApi.getSettings(societyId).then((res) => res.data.data || res.data).catch(() => null)
  )

  const defaulterListVisible = settingsData?.defaulter_list_visible !== false

  const { data: defaulterData, isLoading: defaulterLoading } = useSWR(
    user && defaulterListVisible && societyId ? ['/defaulters/my', societyId] : null,
    () => defaulterApi.getAll({ society_id: societyId, limit: 100 }).then(res => res.data)
  )

  // Resident's own defaulter row (backend returns society defaulters; we show only this unit's status)
  const myDefaulter = defaulterData?.data?.find((d) => Number(d.unit_id) === Number(unitId)) ?? null

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
                    {defaulterLoading ? (
                      <Box display="flex" justifyContent="center" py={2}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : myDefaulter ? (
                      <>
                        <Typography variant="h6" color="error" component="div">
                          {formatCurrency(myDefaulter.amount_due)}
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
                            <TableCell>Period</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {maintenanceData?.data?.slice(0, 5).map((maintenance) => {
                            const periodLabel =
                              maintenance.month && maintenance.year
                                ? new Date(2000, maintenance.month - 1).toLocaleString('default', { month: 'short' }) + ' ' + maintenance.year
                                : '—'
                            const dueDisplay = maintenance.due_date
                              ? formatDate(maintenance.due_date)
                              : periodLabel !== '—'
                                ? periodLabel
                                : 'N/A'
                            return (
                            <TableRow key={maintenance.id}>
                              <TableCell>{periodLabel}</TableCell>
                              <TableCell>{formatCurrency(maintenance.total_amount ?? 0)}</TableCell>
                              <TableCell>{dueDisplay}</TableCell>
                              <TableCell>
                                <Chip
                                  label={maintenance.status}
                                  color={getStatusColor(maintenance.status)}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                            )
                          })}
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
