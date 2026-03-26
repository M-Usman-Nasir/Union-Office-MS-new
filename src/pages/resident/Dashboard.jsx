import { useEffect } from 'react'
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
  CardActionArea,
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import BuildIcon from '@mui/icons-material/Build'
import CampaignIcon from '@mui/icons-material/Campaign'
import PeopleIcon from '@mui/icons-material/People'
import HistoryIcon from '@mui/icons-material/History'
import PaymentIcon from '@mui/icons-material/Payment'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { complaintApi } from '@/api/complaintApi'
import { maintenanceApi } from '@/api/maintenanceApi'
import { announcementApi } from '@/api/announcementApi'
import { defaulterApi } from '@/api/defaulterApi'
import { settingsApi } from '@/api/settingsApi'
import { ROUTES } from '@/utils/constants'
import { propertyApi } from '@/api/propertyApi'
import { alpha } from '@mui/material/styles'

const glassCardSx = {
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: (t) => alpha(t.palette.background.paper, 0.8),
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  boxShadow: (t) => `0 10px 24px ${alpha(t.palette.common.black, 0.08)}`,
  transition: 'transform 220ms ease, box-shadow 220ms ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: (t) => `0 14px 30px ${alpha(t.palette.primary.main, 0.14)}`,
  },
}

const ResidentDashboard = () => {
  const { user } = useAuth()

  // Fetch resident-specific data
  const { data: complaintsData, isLoading: complaintsLoading } = useSWR(
    user ? '/complaints/my' : null,
    () => complaintApi.getAll({ limit: 50, page: 1 }).then(res => res.data)
  )

  const societyId = user?.society_apartment_id
  const unitId = user?.unit_id

  const { data: maintenanceData, isLoading: maintenanceLoading } = useSWR(
    user && unitId ? ['/maintenance/my', unitId] : null,
    () => maintenanceApi.getAll({ limit: 20, page: 1, unit_id: unitId }).then(res => res.data)
  )

  const { data: paymentRequestsData } = useSWR(
    user ? '/maintenance/payment-requests/mine' : null,
    () => maintenanceApi.getMyPaymentRequests().then(res => res.data).catch(() => ({ data: [] }))
  )
  const pendingApprovalCount = paymentRequestsData?.data?.filter(r => r.status === 'pending').length ?? 0

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

  const { data: unitData } = useSWR(
    user?.unit_id ? ['/properties/units', user.unit_id] : null,
    () => propertyApi.getUnitById(user.unit_id).then(res => res.data.data).catch(() => null)
  )
  const unit = unitData ?? null

  // Resident's own defaulter row (backend returns society defaulters; we show only this unit's status)
  const myDefaulter = defaulterData?.data?.find((d) => Number(d.unit_id) === Number(unitId)) ?? null

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#announcements') {
      const el = document.getElementById('announcements')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash])

  // Derived stats for overview cards (all from real backend data)
  const complaintsList = complaintsData?.data ?? []
  const myComplaintsList = complaintsList.filter((c) => Number(c.submitted_by) === Number(user?.id))
  const activeComplaintsCount = myComplaintsList.filter(c => c.status !== 'resolved' && c.status !== 'closed').length
  const inProgressComplaintsCount = myComplaintsList.filter(c => c.status === 'in_progress').length
  const maintenanceList = maintenanceData?.data ?? []
  const maintenanceTotalCount = maintenanceData?.pagination?.total ?? maintenanceList.length
  const lastPaidMaintenance = maintenanceList
    .filter(m => m.status === 'paid' && (m.payment_date || m.updated_at))
    .sort((a, b) => new Date(b.payment_date || b.updated_at) - new Date(a.payment_date || a.updated_at))[0]

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
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        px: { xs: 1.5, sm: 2.5, md: 3 },
        '& .MuiCardContent-root .MuiTypography-h6': {
          fontWeight: 700,
          lineHeight: 1.2,
        },
        '& .MuiCardContent-root .MuiTypography-subtitle2': {
          fontWeight: 700,
        },
        '& .MuiCardContent-root .MuiTypography-caption': {
          fontWeight: 600,
          letterSpacing: 0.2,
        },
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resident Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
          Welcome, {user?.name || user?.email}
        </Typography>
        {(unit || user?.created_at) && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
            {unit && (
              <Typography variant="body2" color="text.secondary">
                {[unit.unit_number, unit.block_name].filter(Boolean).join(' · ')}
              </Typography>
            )}
            {user?.created_at && (
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(user.created_at).getFullYear()}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Overview Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: 'flex' }}>
              <Card sx={{ ...glassCardSx, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 118 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                  <PaymentIcon sx={{ color: 'primary.main', mt: 0.25 }} fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Pending Dues
                    </Typography>
                    {defaulterListVisible && defaulterLoading ? (
                      <CircularProgress size={24} />
                    ) : myDefaulter ? (
                      <Typography variant="h6" color="error">
                        {formatCurrency(myDefaulter.amount_due)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="success.main">
                        No outstanding payments
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: 'flex' }}>
              <Card sx={{ ...glassCardSx, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 118 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                  <ReportProblemOutlinedIcon sx={{ color: 'warning.main', mt: 0.25 }} fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Active Complaints
                    </Typography>
                    <Typography variant="h6">{activeComplaintsCount}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: 'flex' }}>
              <Card sx={{ ...glassCardSx, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 118 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                  <HourglassEmptyIcon sx={{ color: 'info.main', mt: 0.25 }} fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      In Progress
                    </Typography>
                    <Typography variant="h6">{inProgressComplaintsCount}</Typography>
                    <Typography variant="caption" color="text.secondary">complaints</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: 'flex' }}>
              <Card sx={{ ...glassCardSx, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 118 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                  <HomeRepairServiceIcon sx={{ color: 'primary.main', mt: 0.25 }} fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Maintenance Requests
                    </Typography>
                    <Typography variant="h6">{maintenanceTotalCount}</Typography>
                    <Typography variant="caption" color="text.secondary">total records</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: 'flex' }}>
              <Card sx={{ ...glassCardSx, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 118 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                  <PendingActionsIcon sx={{ color: 'warning.main', mt: 0.25 }} fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Pending Approval
                    </Typography>
                    <Typography variant="h6">{pendingApprovalCount}</Typography>
                    <Typography variant="caption" color="text.secondary">payment proof</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: 'flex' }}>
              <Card sx={{ ...glassCardSx, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 118 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                  <ReceiptLongIcon sx={{ color: 'success.main', mt: 0.25 }} fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Last Payment
                    </Typography>
                    {lastPaidMaintenance ? (
                      <>
                        <Typography variant="h6">{formatCurrency(lastPaidMaintenance.total_amount ?? lastPaidMaintenance.amount_paid)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(lastPaidMaintenance.payment_date || lastPaidMaintenance.updated_at)}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">—</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Payment History link card */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Card sx={glassCardSx}>
                <CardActionArea
                  onClick={() => navigate(ROUTES.RESIDENT_FINANCIAL_SUMMARY)}
                  sx={{
                    '&:hover': { backgroundColor: 'primary.light' },
                    '&:hover .MuiTypography-root': { color: 'primary.dark' },
                    '&:hover .MuiSvgIcon-root': { color: 'primary.dark' },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <HistoryIcon color="action" />
                    <Box flex={1}>
                      <Typography variant="subtitle1">Payment history</Typography>
                      <Typography variant="body2" color="text.secondary">
                        View full financial summary and payment history
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Card sx={{ ...glassCardSx, flex: 1, display: 'flex', minHeight: 88 }}>
                <CardActionArea
                  onClick={() => navigate(ROUTES.RESIDENT_COMPLAINTS, { state: { openSubmit: true } })}
                  sx={{
                    flex: 1,
                    '&:hover': { backgroundColor: 'primary.light' },
                    '&:hover .MuiTypography-root': { color: 'primary.dark' },
                    '&:hover .MuiSvgIcon-root': { color: 'primary.dark' },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AssignmentIcon color="primary" />
                    <Typography>Submit Complaint</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Card sx={{ ...glassCardSx, flex: 1, display: 'flex', minHeight: 88 }}>
                <CardActionArea
                  onClick={() => navigate(ROUTES.RESIDENT_DASHBOARD + '#announcements')}
                  sx={{
                    flex: 1,
                    '&:hover': { backgroundColor: 'primary.light' },
                    '&:hover .MuiTypography-root': { color: 'primary.dark' },
                    '&:hover .MuiSvgIcon-root': { color: 'primary.dark' },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CampaignIcon color="primary" />
                    <Typography>View Announcements</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Card sx={{ ...glassCardSx, flex: 1, display: 'flex', minHeight: 88 }}>
                <CardActionArea
                  onClick={() => navigate(ROUTES.RESIDENT_MAINTENANCE)}
                  sx={{
                    flex: 1,
                    '&:hover': { backgroundColor: 'primary.light' },
                    '&:hover .MuiTypography-root': { color: 'primary.dark' },
                    '&:hover .MuiSvgIcon-root': { color: 'primary.dark' },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BuildIcon color="primary" />
                    <Typography>Maintenance Request</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Card sx={{ ...glassCardSx, flex: 1, display: 'flex', minHeight: 88 }}>
                <CardActionArea
                  onClick={() => navigate(ROUTES.RESIDENT_UNION_MEMBERS)}
                  sx={{
                    flex: 1,
                    '&:hover': { backgroundColor: 'primary.light' },
                    '&:hover .MuiTypography-root': { color: 'primary.dark' },
                    '&:hover .MuiSvgIcon-root': { color: 'primary.dark' },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PeopleIcon color="primary" />
                    <Typography>Union Members</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>

          {/* My Complaints */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
              <Card sx={{ ...glassCardSx, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 320 }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                          {myComplaintsList.slice(0, 5).map((complaint) => (
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
                          {myComplaintsList.length === 0 && (
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
            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
              <Card sx={{ ...glassCardSx, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 320 }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
          <Grid item xs={12} id="announcements">
            <Card sx={glassCardSx}>
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
                        <Card variant="outlined" sx={glassCardSx}>
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
