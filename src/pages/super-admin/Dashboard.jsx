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
  Button,
} from '@mui/material'
import { Link } from 'react-router-dom'
import PeopleIcon from '@mui/icons-material/People'
import ApartmentIcon from '@mui/icons-material/Apartment'
import HomeIcon from '@mui/icons-material/Home'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { apartmentApi } from '@/api/apartmentApi'
import { propertyApi } from '@/api/propertyApi'
import { superAdminApi } from '@/api/superAdminApi'
import PieChart from '@/components/charts/PieChart'
import { ROUTES } from '@/utils/constants'
import dayjs from 'dayjs'

const subscriptionStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'trial':
      return 'info'
    case 'expired':
      return 'error'
    case 'cancelled':
      return 'default'
    case 'pending':
      return 'warning'
    default:
      return 'default'
  }
}

const SuperAdminDashboard = () => {
  const { user } = useAuth()

  const { data: societiesData, isLoading: societiesLoading } = useSWR(
    '/societies',
    () => apartmentApi.getAll({ limit: 500 }).then(res => res.data)
  )

  const { data: unitsData, isLoading: unitsLoading } = useSWR(
    '/properties/units',
    () => propertyApi.getUnits({ limit: 1 }).then(res => res.data)
  )

  const { data: adminsData, isLoading: adminsLoading } = useSWR(
    '/super-admin/subscription/admins',
    () => superAdminApi.getAdminsWithSubscriptions().then(res => res.data)
  )

  const isLoading = societiesLoading || adminsLoading
  const societies = societiesData?.data ?? []
  const admins = adminsData?.data ?? []
  const totalClients = societiesData?.pagination?.total ?? societies.length
  const totalUnits =
    unitsData?.pagination?.total ??
    unitsData?.data?.length ??
    societies.reduce((sum, s) => sum + (Number(s.total_units) || 0), 0)

  const activeSubscribers = admins.filter(
    (a) => (a.subscription_status || '').toLowerCase() === 'active' || (a.subscription_status || '').toLowerCase() === 'trial'
  ).length
  const subscriptionAlerts = admins.filter(
    (a) => ['expired', 'pending', 'cancelled'].includes((a.subscription_status || '').toLowerCase())
  ).length

  const subscriptionByStatus = admins.reduce((acc, a) => {
    const s = (a.subscription_status || 'inactive').toLowerCase()
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})

  const recentSubscribers = admins.slice(0, 8)
  const recentClients = societies.slice(0, 8)

  return (
    <Container maxWidth={false} disableGutters sx={{ py: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap', rowGap: 0.5 }}>

        <Typography component="span" variant="body1" color="text.secondary" sx={{ mx: 0.5 }}>
          Welcome back,
        </Typography>
        <Typography
          component="span"
          variant="body1"
          fontWeight={600}
          sx={{
            color: 'primary.main',
            px: 1.25,
            py: 0.25,
            borderRadius: 1,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(25, 118, 210, 0.08)',
          }}
        >
          {user?.name || user?.email}
        </Typography>
        <Typography component="span" variant="caption" color="text.secondary">
          {dayjs().format('dddd, D MMMM YYYY')}
        </Typography>
      </Box>
      <Typography variant="h4" component="h1" fontWeight={600} sx={{ mt: 2 }}>
          Subscribers & Clients
        </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="320px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" component="div">
                      {totalClients}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Clients
                    </Typography>
                  </Box>
                  <ApartmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
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
                      {activeSubscribers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Subscribers
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, color: 'success.main' }} />
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
                      {subscriptionAlerts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expired / Pending
                    </Typography>
                  </Box>
                  <WarningAmberIcon sx={{ fontSize: 40, color: 'warning.main' }} />
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
                      {unitsLoading ? '—' : totalUnits}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Units
                    </Typography>
                  </Box>
                  <HomeIcon sx={{ fontSize: 40, color: 'info.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Subscribers (Union Admins)
                  </Typography>
                  <Button
                    component={Link}
                    to={ROUTES.SUPER_ADMIN_ADMINS}
                    size="small"
                    endIcon={<ChevronRightIcon />}
                  >
                    View all
                  </Button>
                </Box>
                {recentSubscribers.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No subscribers yet. Add Union Admins and assign apartments from Users.
                  </Typography>
                ) : (
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ maxHeight: 320, overflowX: 'hidden' }}
                  >
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Apartment</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Next Billing</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentSubscribers.map((row, index) => (
                          <TableRow
                            key={row.id}
                            hover
                            sx={{
                              backgroundColor: (theme) =>
                                index % 2 === 1
                                  ? theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.03)'
                                    : 'rgba(0,0,0,0.02)'
                                  : 'transparent',
                              '&:not(:last-child) td': { borderBottom: 1, borderColor: 'divider' },
                            }}
                          >
                            <TableCell sx={{ py: 1.25 }}>{row.name || '—'}</TableCell>
                            <TableCell sx={{ py: 1.25 }}>{row.apartment_name || '—'}</TableCell>
                            <TableCell sx={{ py: 1.25 }}>
                              <Chip
                                label={row.subscription_status || '—'}
                                color={subscriptionStatusColor(row.subscription_status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1.25 }}>
                              {row.next_billing_date
                                ? dayjs(row.next_billing_date).format('DD/MM/YYYY')
                                : '—'}
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

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Clients (Apartments)
                  </Typography>
                  <Button
                    component={Link}
                    to={ROUTES.SUPER_ADMIN_SOCIETIES}
                    size="small"
                    endIcon={<ChevronRightIcon />}
                  >
                    View all
                  </Button>
                </Box>
                {recentClients.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No clients yet. Create apartments to get started.
                  </Typography>
                ) : (
                  <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 320 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 1.5 }}>City</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Units</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentClients.map((row, index) => (
                          <TableRow
                            key={row.id}
                            hover
                            sx={{
                              backgroundColor: (theme) =>
                                index % 2 === 1
                                  ? theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.03)'
                                    : 'rgba(0,0,0,0.02)'
                                  : 'transparent',
                              '&:not(:last-child) td': { borderBottom: 1, borderColor: 'divider' },
                            }}
                          >
                            <TableCell sx={{ py: 1.25 }}>{row.name || '—'}</TableCell>
                            <TableCell sx={{ py: 1.25 }}>{row.city || '—'}</TableCell>
                            <TableCell sx={{ py: 1.25 }}>{row.total_units ?? 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>

          {Object.keys(subscriptionByStatus).length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Subscriptions by status
                  </Typography>
                  <PieChart
                    data={Object.entries(subscriptionByStatus).map(([status, count]) => ({
                      label: status.charAt(0).toUpperCase() + status.slice(1),
                      value: count || 0,
                    }))}
                    title=""
                  />
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  )
}

export default SuperAdminDashboard
