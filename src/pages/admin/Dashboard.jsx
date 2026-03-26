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
  IconButton,
  Button,
  Paper,
  Collapse,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material'
import dayjs from 'dayjs'
import { alpha } from '@mui/material/styles'
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
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import PercentIcon from '@mui/icons-material/Percent'
import ReportIcon from '@mui/icons-material/Report'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import ApartmentIcon from '@mui/icons-material/Apartment'
import HomeIcon from '@mui/icons-material/Home'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import toast from 'react-hot-toast'
import { ROUTES } from '@/utils/constants'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const glassCardSx = {
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: (t) => alpha(t.palette.background.paper, 0.8),
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  boxShadow: (t) => `0 12px 28px ${alpha(t.palette.common.black, 0.08)}`,
  transition: 'transform 220ms ease, box-shadow 220ms ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: (t) => `0 16px 34px ${alpha(t.palette.primary.main, 0.14)}`,
  },
}

const sectionHeaderPaperSx = {
  py: 1.25,
  px: 2,
  mb: 1.5,
  borderRadius: 2,
  borderColor: 'divider',
  bgcolor: (t) =>
    t.palette.mode === 'dark'
      ? alpha(t.palette.primary.main, 0.14)
      : alpha(t.palette.primary.main, 0.07),
}

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [announcementsOpen, setAnnouncementsOpen] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(() => dayjs().month() + 1)
  const [selectedYear, setSelectedYear] = useState(() => dayjs().year())
  const [isExporting, setIsExporting] = useState(false)

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
  const { data: monthlyReport } = useSWR(
    societyId ? ['/finance/reports/monthly', selectedMonth, selectedYear, societyId] : null,
    () => financeApi.getMonthlyReport(selectedMonth, selectedYear, { society_id: societyId }).then((res) => res.data?.data)
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

  const { data: announcementsData, isLoading: announcementsLoading } = useSWR(
    '/announcements/recent',
    () => announcementApi.getAll({ limit: 5, page: 1 }).then(res => res.data)
  )

  const { data: apartmentData } = useSWR(
    user?.society_apartment_id ? ['/society', user.society_apartment_id] : null,
    () => apartmentApi.getById(user.society_apartment_id).then(res => res.data)
  )
  const apartmentName = apartmentData?.data?.name

  const isLoading = financeLoading || defaulterLoading || residentsLoading

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

  // Show overview cards and charts only when there is at least some data
  const hasAnySummaryData =
    totalFlats > 0 ||
    totalComplaints > 0 ||
    defaultersCount > 0 ||
    paymentsReceivedMonth > 0 ||
    pendingPaymentsMonth > 0 ||
    (monthlyIncome > 0 || monthlyExpense > 0)

  const monthlyExpenseBreakdown = (monthlyReport?.expenseBreakdown || [])
    .map((item) => ({
      label: item.expense_type || 'Other',
      amount: Number(item.total) || 0,
    }))
    .sort((a, b) => b.amount - a.amount)
  const reserveBalance = Number(apartmentData?.data?.reserve_balance || 0)
  const monthlyDeficit = Math.max(monthlyExpense - monthlyIncome, 0)
  const selectedMonthName = MONTHS[(selectedMonth || 1) - 1] || MONTHS[0]

  const handleExportDashboardReport = () => {
    try {
      setIsExporting(true)

      const escapeCsv = (value) => {
        const str = String(value ?? '')
        return `"${str.replace(/"/g, '""')}"`
      }

      const lines = []
      lines.push('Dashboard Report')
      lines.push(`Period,${escapeCsv(`${selectedMonthName} ${selectedYear}`)}`)
      lines.push(`Society,${escapeCsv(apartmentName || 'N/A')}`)
      lines.push('')
      lines.push('Maintenance Collection')
      lines.push('Metric,Value')
      lines.push(`Collected This Month,${escapeCsv(formatCurrency(paymentsReceivedMonth))}`)
      lines.push(`Pending Collection This Month,${escapeCsv(formatCurrency(pendingPaymentsMonth))}`)
      lines.push(`Defaulters Rate,${escapeCsv(`${defaultersRate}%`)}`)
      lines.push(`No of Defaulters,${escapeCsv(defaultersCount)}`)
      lines.push('')
      lines.push('Expenses by Type')
      lines.push('Category,Amount')
      if (monthlyExpenseBreakdown.length > 0) {
        monthlyExpenseBreakdown.slice(0, 4).forEach((item) => {
          lines.push(`${escapeCsv(item.label)},${escapeCsv(formatCurrency(item.amount))}`)
        })
      } else {
        lines.push('No data,0')
      }
      lines.push('')
      lines.push('Monthly Financial Summary')
      lines.push('Metric,Value')
      lines.push(`Total Income,${escapeCsv(formatCurrency(monthlyIncome))}`)
      lines.push(`Total Expense,${escapeCsv(formatCurrency(monthlyExpense))}`)
      lines.push(`Monthly Deficit,${escapeCsv(formatCurrency(monthlyDeficit))}`)
      lines.push(`Reserve Balance,${escapeCsv(formatCurrency(reserveBalance))}`)
      lines.push('')
      lines.push('Complaints')
      lines.push('Metric,Value')
      lines.push(`Total Complaints,${escapeCsv(totalComplaints)}`)
      lines.push(`Pending Complaints,${escapeCsv(pendingComplaints)}`)
      lines.push(`Solved Complaints,${escapeCsv(solvedComplaints)}`)
      lines.push(`Resolve Rate,${escapeCsv(`${resolveRate}%`)}`)
      lines.push('')
      lines.push('Apartment Summary')
      lines.push('Metric,Value')
      lines.push(`Total Flats,${escapeCsv(totalFlats)}`)
      lines.push(`Occupied Flats,${escapeCsv(occupiedFlats)}`)
      lines.push(`Defaulters,${escapeCsv(defaultersCount)}`)
      lines.push(`Defaulters Amount,${escapeCsv(formatCurrency(defaultersAmount))}`)

      const csvContent = '\uFEFF' + lines.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `dashboard-report-${selectedYear}-${String(selectedMonth).padStart(2, '0')}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Dashboard report exported successfully')
    } catch (error) {
      console.error('Export dashboard report error:', error)
      toast.error('Failed to export dashboard report')
    } finally {
      setIsExporting(false)
    }
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
        '& .MuiCardContent-root .MuiTypography-caption': {
          fontWeight: 600,
          letterSpacing: 0.2,
        },
      }}
    >
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
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
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
          <Paper variant="outlined" sx={{ mt: 2, p: 2, ...glassCardSx }}>
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
          {!hasAnySummaryData ? (
            <Paper variant="outlined" sx={{ p: 4, mb: 4, textAlign: 'center', ...glassCardSx }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No data yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add finance, maintenance, or complaints to see the dashboard overview and charts.
              </Typography>
            </Paper>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">View Stats For:</Typography>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                    {MONTHS.map((name, i) => (
                      <MenuItem key={i} value={i + 1}>{name} {selectedYear}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 110 }}>
                  <Select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                    <MenuItem value={dayjs().year()}>{dayjs().year()}</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Paper variant="outlined" sx={sectionHeaderPaperSx}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Maintenance Collection (Expected: Rs 712,000 fixed per month)
                </Typography>
              </Paper>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">COLLECTED THIS MONTH</Typography><Typography variant="h6">{monthlyFinanceLoading ? '—' : formatCurrency(paymentsReceivedMonth)}</Typography><Typography variant="caption" color="success.main">Total collected</Typography></Box><CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} /></Box></CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">PENDING COLLECTION THIS MONTH</Typography><Typography variant="h6">{monthlyFinanceLoading ? '—' : formatCurrency(pendingPaymentsMonth)}</Typography><Typography variant="caption" color="warning.main">Still pending</Typography></Box><PendingActionsIcon sx={{ fontSize: 18, color: 'warning.main' }} /></Box></CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">DEFAULTERS RATE</Typography><Typography variant="h6">{defaultersRate}%</Typography><Typography variant="caption" color="success.main">Collection efficiency</Typography></Box><PercentIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></Box></CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">NO OF DEFAULTERS</Typography><Typography variant="h6">{defaultersCount}</Typography><Typography variant="caption" color="text.secondary">Pending payment units</Typography></Box><WarningIcon sx={{ fontSize: 18, color: 'warning.main' }} /></Box></CardContent></Card>
                </Grid>
              </Grid>

              <Paper variant="outlined" sx={sectionHeaderPaperSx}>
                <Typography variant="subtitle1" fontWeight="bold">Expenses by Type (This Month)</Typography>
              </Paper>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {(monthlyExpenseBreakdown.length ? monthlyExpenseBreakdown.slice(0, 4) : [{ label: 'N/A', amount: 0 }]).map((item, idx) => (
                  <Grid item xs={12} sm={6} md={3} key={`${item.label}-${idx}`}>
                    <Card variant="outlined" sx={glassCardSx}>
                      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                        <Typography variant="caption" color="text.secondary">{String(item.label).toUpperCase()}</Typography>
                        <Typography variant="h6">{formatCurrency(item.amount)}</Typography>
                        <Typography variant="caption" color="success.main">
                          {monthlyExpense > 0 ? `${Math.round((item.amount / monthlyExpense) * 100)}% of total expenses` : '0% of total expenses'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Paper variant="outlined" sx={sectionHeaderPaperSx}>
                <Typography variant="subtitle1" fontWeight="bold">Monthly Financial Summary</Typography>
              </Paper>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">TOTAL INCOME (THIS MONTH)</Typography><Typography variant="h6">{monthlyFinanceLoading ? '—' : formatCurrency(monthlyIncome)}</Typography><Typography variant="caption" color="success.main">Maintenance collected</Typography></Box><TrendingUpIcon sx={{ fontSize: 18, color: 'success.main' }} /></Box></CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">TOTAL EXPENSE (THIS MONTH)</Typography><Typography variant="h6">{monthlyFinanceLoading ? '—' : formatCurrency(monthlyExpense)}</Typography><Typography variant="caption" color="success.main">All operational costs</Typography></Box><TrendingDownIcon sx={{ fontSize: 18, color: 'error.main' }} /></Box></CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">MONTHLY DEFICIT</Typography><Typography variant="h6">-{formatCurrency(monthlyDeficit)}</Typography><Typography variant="caption" color="success.main">Shortfall this month</Typography></Box><WarningIcon sx={{ fontSize: 18, color: 'warning.main' }} /></Box></CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">RESERVE BALANCE</Typography><Typography variant="h6">{formatCurrency(reserveBalance)}</Typography><Typography variant="caption" color="success.main">Available funds</Typography></Box><AccountBalanceIcon sx={{ fontSize: 18, color: 'success.main' }} /></Box></CardContent></Card>
                </Grid>
              </Grid>

              <Paper variant="outlined" sx={sectionHeaderPaperSx}>
                <Typography variant="subtitle1" fontWeight="bold">Complaints</Typography>
              </Paper>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">TOTAL COMPLAINTS</Typography><Typography variant="h6">{totalComplaints}</Typography></Box><ReportIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></Box></CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">PENDING COMPLAINTS</Typography><Typography variant="h6">{pendingComplaints}</Typography></Box><PendingActionsIcon sx={{ fontSize: 18, color: 'warning.main' }} /></Box></CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">SOLVED COMPLAINTS</Typography><Typography variant="h6">{solvedComplaints}</Typography></Box><CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} /></Box></CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">RESOLVE RATE</Typography><Typography variant="h6">{resolveRate}%</Typography></Box><PercentIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></Box></CardContent></Card>
                </Grid>
              </Grid>

              <Paper variant="outlined" sx={sectionHeaderPaperSx}>
                <Typography variant="subtitle1" fontWeight="bold">{apartmentName ? `${apartmentName} Summary` : 'Apartment Summary'}</Typography>
              </Paper>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">TOTAL FLATS</Typography><Typography variant="h6">{totalFlats}</Typography></Box><ApartmentIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></Box></CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">OCCUPIED FLATS</Typography><Typography variant="h6">{occupiedFlats}</Typography></Box><HomeIcon sx={{ fontSize: 18, color: 'success.main' }} /></Box></CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">DEFAULTERS</Typography><Typography variant="h6">{defaultersCount}</Typography></Box><WarningIcon sx={{ fontSize: 18, color: 'warning.main' }} /></Box></CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={glassCardSx}><CardContent sx={{ '&:last-child': { pb: 2 } }}><Box display="flex" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">DEFAULTERS AMOUNT</Typography><Typography variant="h6">{formatCurrency(defaultersAmount)}</Typography></Box><AccountBalanceIcon sx={{ fontSize: 18, color: 'warning.main' }} /></Box></CardContent></Card>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExportDashboardReport}
                  disabled={isExporting}
                >
                  {isExporting ? 'Exporting...' : 'Export Dashboard Report'}
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </Container>
  )
}

export default AdminDashboard
