import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  IconButton,
  Button,
  Paper,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import dayjs from 'dayjs'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { financeApi } from '@/api/financeApi'
import { defaulterApi } from '@/api/defaulterApi'
import { complaintApi } from '@/api/complaintApi'
import { maintenanceApi } from '@/api/maintenanceApi'
import { announcementApi } from '@/api/announcementApi'
import { residentApi } from '@/api/residentApi'
import { apartmentApi } from '@/api/apartmentApi'
import { propertyApi } from '@/api/propertyApi'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import WarningIcon from '@mui/icons-material/Warning'
import AnnouncementIcon from '@mui/icons-material/Campaign'
import PaymentIcon from '@mui/icons-material/Payment'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import PercentIcon from '@mui/icons-material/Percent'
import ReportIcon from '@mui/icons-material/Report'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import ApartmentIcon from '@mui/icons-material/Apartment'
import HomeIcon from '@mui/icons-material/Home'
import FinanceChart from '@/components/charts/FinanceChart'
import PieChart from '@/components/charts/PieChart'
import BarChart from '@/components/charts/BarChart'
import { ROUTES } from '@/utils/constants'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [announcementsOpen, setAnnouncementsOpen] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(() => dayjs().month() + 1)
  const [selectedYear, setSelectedYear] = useState(() => dayjs().year())

  const societyId = user?.society_apartment_id

  // Fetch dashboard data
  const { isLoading: financeLoading } = useSWR(
    '/finance/summary',
    () => financeApi.getSummary().then(res => res.data.data)
  )

  // Month-based finance summary for new cards
  const { data: monthlyFinance, isLoading: monthlyFinanceLoading } = useSWR(
    societyId ? ['/finance/summary', selectedMonth, selectedYear, societyId] : null,
    () => financeApi.getSummary({
      month: selectedMonth,
      year: selectedYear,
      society_id: societyId,
    }).then(res => res.data.data)
  )

  // Complaints list for summary counts (total, pending, solved)
  const { data: complaintsSummaryRes } = useSWR(
    societyId ? ['/complaints/summary', societyId] : null,
    () => complaintApi.getAll({ society_id: societyId, limit: 500, page: 1 }).then(res => res.data)
  )

  // Units for occupied count (apartment summary)
  const { data: unitsData } = useSWR(
    societyId ? ['/properties/units', societyId] : null,
    () => propertyApi.getUnits({ society_id: societyId }).then(res => res.data)
  )

  // Maintenance for selected month (payments received / pending)
  const { data: maintenanceMonthRes } = useSWR(
    societyId ? ['/maintenance/month', selectedMonth, selectedYear, societyId] : null,
    () => maintenanceApi.getAll({
      society_id: societyId,
      month: selectedMonth,
      year: selectedYear,
      limit: 1000,
      page: 1,
    }).then(res => res.data)
  )

  const { data: defaulterStats, isLoading: defaulterLoading } = useSWR(
    societyId ? ['/defaulters/statistics', societyId] : null,
    () => defaulterApi.getStatistics({ society_id: societyId }).then(res => res.data.data)
  )

  const { isLoading: residentsLoading } = useSWR(
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

  const { data: apartmentData } = useSWR(
    user?.society_apartment_id ? ['/society', user.society_apartment_id] : null,
    () => apartmentApi.getById(user.society_apartment_id).then(res => res.data)
  )
  const apartmentName = apartmentData?.data?.name

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

  const latestAnnouncements = announcementsData?.data?.slice(0, 3) || []

  // Derived data for new summary cards
  const complaintsList = complaintsSummaryRes?.data || []
  const totalComplaints = complaintsList.length
  const pendingComplaints = complaintsList.filter(
    c => c.status === 'pending' || c.status === 'in_progress'
  ).length
  const solvedComplaints = complaintsList.filter(
    c => c.status === 'resolved' || c.status === 'closed'
  ).length
  const resolveRate = totalComplaints > 0
    ? Math.round((solvedComplaints / totalComplaints) * 100)
    : 0

  const totalFlats = apartmentData?.data?.total_units ?? 0
  const unitsList = unitsData?.data || []
  const occupiedFlats = unitsList.filter(u => u.is_occupied).length

  const maintenanceMonthList = maintenanceMonthRes?.data || []
  const paymentsReceivedMonth = maintenanceMonthList.reduce(
    (sum, m) => sum + (parseFloat(m.amount_paid) || 0),
    0
  )
  const pendingPaymentsMonth = maintenanceMonthList.reduce(
    (sum, m) => sum + (parseFloat(m.total_amount) || 0) - (parseFloat(m.amount_paid) || 0),
    0
  )

  const defaultersCount = defaulterStats?.total_defaulters ?? 0
  const defaultersAmount = parseFloat(defaulterStats?.total_amount_due || 0) || 0
  const defaultersRate = totalFlats > 0 ? Math.round((defaultersCount / totalFlats) * 100) : 0

  const monthlyIncome = monthlyFinance?.income ?? 0
  const monthlyExpense = monthlyFinance?.expense ?? 0
  const monthlyBalance = monthlyFinance?.balance ?? 0

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Union Admin Dashboard
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
                <Typography component="span" variant="body1" color="text.secondary">
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
                {apartmentName && (
                  <>
                    <Typography component="span" variant="body1" color="text.secondary">
                      -
                    </Typography>
                    <Typography
                      component="span"
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      {apartmentName}
                    </Typography>
                  </>
                )}
              </Box>
              <Typography variant="body1" color="text.secondary">
                {dayjs().format('dddd, D MMMM YYYY')}
              </Typography>
            </Box>
          </Box>
          <IconButton
            color="primary"
            onClick={() => setAnnouncementsOpen((o) => !o)}
            aria-label={announcementsOpen ? 'Close announcements' : 'Open announcements'}
            sx={{
              border: 1,
              borderColor: 'divider',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <AnnouncementIcon />
          </IconButton>
        </Box>

        <Collapse in={announcementsOpen}>
          <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>
              Announcements
            </Typography>
            {announcementsLoading ? (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            ) : latestAnnouncements.length > 0 ? (
              <>
                <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 1 } }}>
                  {latestAnnouncements.map((announcement) => (
                    <Typography key={announcement.id} component="li" variant="body2" color="text.secondary">
                      <strong>{announcement.title}</strong>
                      {announcement.description && ` — ${announcement.description}`}
                    </Typography>
                  ))}
                </Box>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => navigate(ROUTES.ADMIN_ANNOUNCEMENTS)}
                  sx={{ mt: 1, px: 0 }}
                >
                  View all
                </Button>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No announcements yet.
              </Typography>
            )}
          </Paper>
        </Collapse>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Month/Year selector and monthly summary cards */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="dashboard-month-label">Month</InputLabel>
                <Select
                  labelId="dashboard-month-label"
                  value={selectedMonth}
                  label="Month"
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {MONTHS.map((name, i) => (
                    <MenuItem key={i} value={i + 1}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="dashboard-year-label">Year</InputLabel>
                <Select
                  labelId="dashboard-year-label"
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i).map((y) => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Section A: Monthly summary cards (3 rows x 4) */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Payments Received</Typography>
                        <Typography variant="h6">
                          {monthlyFinanceLoading ? '—' : formatCurrency(paymentsReceivedMonth)}
                        </Typography>
                      </Box>
                      <PaymentIcon sx={{ fontSize: 20, color: 'success.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Pending Payments</Typography>
                        <Typography variant="h6">
                          {monthlyFinanceLoading ? '—' : formatCurrency(pendingPaymentsMonth)}
                        </Typography>
                      </Box>
                      <PendingActionsIcon sx={{ fontSize: 20, color: 'warning.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Defaulters Rate</Typography>
                        <Typography variant="h6">{defaultersRate}%</Typography>
                      </Box>
                      <PercentIcon sx={{ fontSize: 20, color: 'text.secondary', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>No of Defaulters</Typography>
                        <Typography variant="h6">{defaultersCount}</Typography>
                      </Box>
                      <WarningIcon sx={{ fontSize: 20, color: 'warning.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Total Complaints</Typography>
                        <Typography variant="h6">{totalComplaints}</Typography>
                      </Box>
                      <ReportIcon sx={{ fontSize: 20, color: 'info.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Pending Complaints</Typography>
                        <Typography variant="h6">{pendingComplaints}</Typography>
                      </Box>
                      <ScheduleIcon sx={{ fontSize: 20, color: 'warning.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Solved Complaints</Typography>
                        <Typography variant="h6">{solvedComplaints}</Typography>
                      </Box>
                      <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Resolve Rate</Typography>
                        <Typography variant="h6">{resolveRate}%</Typography>
                      </Box>
                      <PercentIcon sx={{ fontSize: 20, color: 'success.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Total Income</Typography>
                        <Typography variant="h6">
                          {monthlyFinanceLoading ? '—' : formatCurrency(monthlyIncome)}
                        </Typography>
                      </Box>
                      <TrendingUpIcon sx={{ fontSize: 20, color: 'success.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Total Expense</Typography>
                        <Typography variant="h6">
                          {monthlyFinanceLoading ? '—' : formatCurrency(monthlyExpense)}
                        </Typography>
                      </Box>
                      <TrendingDownIcon sx={{ fontSize: 20, color: 'error.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Net Balance</Typography>
                        <Typography variant="h6">
                          {monthlyFinanceLoading ? '—' : formatCurrency(monthlyBalance)}
                        </Typography>
                      </Box>
                      <AccountBalanceIcon sx={{ fontSize: 20, color: 'primary.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Remaining Dues</Typography>
                        <Typography variant="h6">{formatCurrency(defaultersAmount)}</Typography>
                      </Box>
                      <WarningIcon sx={{ fontSize: 20, color: 'error.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Section B: Apartment summary (heading from admin's society) */}
            <Paper variant="outlined" sx={{ bgcolor: 'action.hover', py: 1.5, px: 2, mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" align="center">
                {apartmentName ? `${apartmentName} Summary` : 'Apartment Summary'}
              </Typography>
            </Paper>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Total Flats</Typography>
                        <Typography variant="h6">{totalFlats}</Typography>
                      </Box>
                      <ApartmentIcon sx={{ fontSize: 20, color: 'text.secondary', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Occupied Flats</Typography>
                        <Typography variant="h6">{occupiedFlats}</Typography>
                      </Box>
                      <HomeIcon sx={{ fontSize: 20, color: 'success.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Defaulters</Typography>
                        <Typography variant="h6">{defaultersCount}</Typography>
                      </Box>
                      <WarningIcon sx={{ fontSize: 20, color: 'warning.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Defaulters Amount</Typography>
                        <Typography variant="h6">{formatCurrency(defaultersAmount)}</Typography>
                      </Box>
                      <AccountBalanceIcon sx={{ fontSize: 20, color: 'error.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Total Complaints</Typography>
                        <Typography variant="h6">{totalComplaints}</Typography>
                      </Box>
                      <ReportIcon sx={{ fontSize: 20, color: 'info.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Pending Complaints</Typography>
                        <Typography variant="h6">{pendingComplaints}</Typography>
                      </Box>
                      <ScheduleIcon sx={{ fontSize: 20, color: 'warning.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Solved Complaints</Typography>
                        <Typography variant="h6">{solvedComplaints}</Typography>
                      </Box>
                      <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Resolve Rate</Typography>
                        <Typography variant="h6">{resolveRate}%</Typography>
                      </Box>
                      <PercentIcon sx={{ fontSize: 20, color: 'success.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Total Income</Typography>
                        <Typography variant="h6">{formatCurrency(monthlyIncome)}</Typography>
                      </Box>
                      <TrendingUpIcon sx={{ fontSize: 20, color: 'success.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Total Expense</Typography>
                        <Typography variant="h6">{formatCurrency(monthlyExpense)}</Typography>
                      </Box>
                      <TrendingDownIcon sx={{ fontSize: 20, color: 'error.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Net Balance</Typography>
                        <Typography variant="h6">{formatCurrency(monthlyBalance)}</Typography>
                      </Box>
                      <AccountBalanceIcon sx={{ fontSize: 20, color: 'primary.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box flex={1} minWidth={0}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Remaining Dues</Typography>
                        <Typography variant="h6">{formatCurrency(defaultersAmount)}</Typography>
                      </Box>
                      <WarningIcon sx={{ fontSize: 20, color: 'error.main', flexShrink: 0 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

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
