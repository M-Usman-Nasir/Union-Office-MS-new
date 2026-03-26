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
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { apartmentApi } from '@/api/apartmentApi'
import { superAdminApi } from '@/api/superAdminApi'
import PieChart from '@/components/charts/PieChart'
import BarChart from '@/components/charts/BarChart'
import { ROUTES } from '@/utils/constants'
import dayjs from 'dayjs'
import { alpha, keyframes } from '@mui/material/styles'

const riseIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`

const classicTableHeadSx = {
  bgcolor: (theme) =>
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'grey.100',
  fontWeight: 700,
  fontSize: '0.68rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'text.secondary',
  borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
  py: 1.25,
}

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

  const { data: adminsData, isLoading: adminsLoading } = useSWR(
    '/super-admin/subscription/admins',
    () => superAdminApi.getAdminsWithSubscriptions().then(res => res.data)
  )

  const isLoading = societiesLoading || adminsLoading
  const societies = societiesData?.data ?? []
  const admins = adminsData?.data ?? []
  const totalClients = societiesData?.pagination?.total ?? societies.length
  const totalAdmins = adminsData?.pagination?.total ?? admins.length
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
  const topClientsByUnits = [...societies]
    .sort((a, b) => (Number(b.total_units) || 0) - (Number(a.total_units) || 0))
    .slice(0, 8)
    .map((s) => ({ category: s.name || '—', value: Number(s.total_units) || 0 }))

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        py: 2,
        px: { xs: 1.5, sm: 2.5, md: 3 },
        animation: `${riseIn} 420ms ease-out`,
        '& .MuiCardContent-root .MuiTypography-h4': {
          fontWeight: 700,
          lineHeight: 1.15,
        },
        '& .MuiCardContent-root .MuiTypography-h6': {
          fontWeight: 700,
          letterSpacing: 0.2,
        },
        '& .MuiCardContent-root .MuiTypography-caption': {
          fontWeight: 600,
          letterSpacing: 0.2,
        },
      }}
    >
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
        <Typography component="span" variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {dayjs().format('dddd, D MMMM YYYY')}
        </Typography>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="320px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (t) => alpha(t.palette.background.paper, 0.78),
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: (t) => `0 14px 30px ${alpha(t.palette.common.black, 0.08)}`,
                transition: 'transform 220ms ease, box-shadow 220ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (t) => `0 18px 36px ${alpha(t.palette.primary.main, 0.16)}`,
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" component="div">
                      {totalClients}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Apartments
                    </Typography>
                  </Box>
                  <ApartmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (t) => alpha(t.palette.background.paper, 0.78),
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: (t) => `0 14px 30px ${alpha(t.palette.common.black, 0.08)}`,
                transition: 'transform 220ms ease, box-shadow 220ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (t) => `0 18px 36px ${alpha(t.palette.success.main, 0.16)}`,
                },
              }}
            >
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
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (t) => alpha(t.palette.background.paper, 0.78),
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: (t) => `0 14px 30px ${alpha(t.palette.common.black, 0.08)}`,
                transition: 'transform 220ms ease, box-shadow 220ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (t) => `0 18px 36px ${alpha(t.palette.warning.main, 0.18)}`,
                },
              }}
            >
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
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (t) => alpha(t.palette.background.paper, 0.78),
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: (t) => `0 14px 30px ${alpha(t.palette.common.black, 0.08)}`,
                transition: 'transform 220ms ease, box-shadow 220ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (t) => `0 18px 36px ${alpha(t.palette.primary.main, 0.16)}`,
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" component="div">
                      {totalAdmins !== undefined ? totalAdmins : '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Union Admins
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (t) => alpha(t.palette.background.paper, 0.8),
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
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
                    sx={{
                      maxHeight: 320,
                      overflowX: 'hidden',
                      borderRadius: 2,
                      borderColor: 'divider',
                      boxShadow: (t) => `0 8px 22px ${alpha(t.palette.common.black, 0.07)}`,
                    }}
                  >
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={classicTableHeadSx}>Name</TableCell>
                          <TableCell sx={classicTableHeadSx}>Apartment</TableCell>
                          <TableCell sx={classicTableHeadSx}>Status</TableCell>
                          <TableCell sx={classicTableHeadSx}>Next Billing</TableCell>
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
                              '&:hover': {
                                bgcolor: (theme) =>
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(59,130,246,0.11)'
                                    : 'rgba(59,130,246,0.07)',
                              },
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
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (t) => alpha(t.palette.background.paper, 0.8),
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
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
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{
                      maxHeight: 320,
                      borderRadius: 2,
                      borderColor: 'divider',
                      boxShadow: (t) => `0 8px 22px ${alpha(t.palette.common.black, 0.07)}`,
                    }}
                  >
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={classicTableHeadSx}>Name</TableCell>
                          <TableCell sx={classicTableHeadSx}>City</TableCell>
                          <TableCell sx={classicTableHeadSx}>Units</TableCell>
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
                              '&:hover': {
                                bgcolor: (theme) =>
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(59,130,246,0.11)'
                                    : 'rgba(59,130,246,0.07)',
                              },
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
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: (t) => alpha(t.palette.background.paper, 0.8),
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
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

          {topClientsByUnits.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: (t) => alpha(t.palette.background.paper, 0.8),
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Units by client (top 8)
                  </Typography>
                  <BarChart
                    data={topClientsByUnits}
                    title=""
                    xLabel="Client"
                    yLabel="Units"
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
