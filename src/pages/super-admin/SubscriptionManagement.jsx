import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CancelIcon from '@mui/icons-material/Cancel'
import HistoryIcon from '@mui/icons-material/History'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PersonIcon from '@mui/icons-material/Person'
import useSWR from 'swr'
import { superAdminApi } from '@/api/superAdminApi'
import { ROUTES } from '@/utils/constants'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'

const formatDate = (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '—')
const toTitleCase = (value) => {
  const normalized = (value || '').toLowerCase()
  if (!normalized) return '—'
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const SubscriptionManagement = () => {
  const navigate = useNavigate()
  const [renewingId, setRenewingId] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const [confirmRenew, setConfirmRenew] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(null)
  const [actionMenu, setActionMenu] = useState(null)

  const { data: adminsData, isLoading, mutate } = useSWR(
    '/super-admin/subscription/admins',
    () => superAdminApi.getAdminsWithSubscriptions().then((res) => res.data)
  )
  const { data: invoicesData } = useSWR(
    '/super-admin/invoices-for-subscription-management',
    () => superAdminApi.listInvoices({ limit: 500 }).then((res) => res.data)
  )

  const admins = adminsData?.data ?? []
  const invoices = invoicesData?.data ?? []

  const latestInvoiceByUserId = useMemo(() => {
    const map = {}
    invoices.forEach((inv) => {
      if (!inv.user_id) return
      const existing = map[inv.user_id]
      const invCreatedAt = dayjs(inv.created_at || 0)
      const existingCreatedAt = dayjs(existing?.created_at || 0)
      if (!existing || invCreatedAt.isAfter(existingCreatedAt)) {
        map[inv.user_id] = inv
      }
    })
    return map
  }, [invoices])

  const latestPaidInvoiceByUserId = useMemo(() => {
    const map = {}
    invoices.forEach((inv) => {
      if (!inv.user_id || inv.status !== 'paid') return
      const existing = map[inv.user_id]
      const invUpdatedAt = dayjs(inv.updated_at || inv.created_at || 0)
      const existingUpdatedAt = dayjs(existing?.updated_at || existing?.created_at || 0)
      if (!existing || invUpdatedAt.isAfter(existingUpdatedAt)) {
        map[inv.user_id] = inv
      }
    })
    return map
  }, [invoices])

  const paymentStatusByUserId = useMemo(() => {
    const map = {}
    admins.forEach((a) => {
      map[a.id] = 'Paid'
    })
    invoices.forEach((inv) => {
      if (inv.user_id && (inv.status === 'draft' || inv.status === 'sent')) {
        map[inv.user_id] = 'Pending'
      } else if (inv.user_id && inv.status === 'paid') {
        map[inv.user_id] = 'Paid'
      }
    })
    return map
  }, [admins, invoices])

  const handleRenew = (row) => {
    setConfirmRenew(row)
  }

  const doRenew = async () => {
    if (!confirmRenew?.subscription_id) return
    const row = confirmRenew
    setRenewingId(row.subscription_id)
    try {
      const baseDate = row.next_billing_date || row.start_date
      const months = Math.max(1, parseInt(row.interval_months, 10) || 1)
      const nextBilling = dayjs(baseDate).add(months, 'month').format('YYYY-MM-DD')
      await superAdminApi.updateSubscriptionStatus(row.subscription_id, {
        status: 'active',
        next_billing_date: nextBilling,
      })
      toast.success(`Subscription renewed. Next renewal: ${dayjs(nextBilling).format('DD/MM/YYYY')}`)
      mutate()
      setConfirmRenew(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Renew failed')
    } finally {
      setRenewingId(null)
    }
  }

  const handleCancel = (row) => {
    setConfirmCancel(row)
  }

  const doCancel = async () => {
    if (!confirmCancel?.subscription_id) return
    const id = confirmCancel.subscription_id
    setCancellingId(id)
    try {
      await superAdminApi.updateSubscriptionStatus(id, {
        status: 'cancelled',
        end_date: dayjs().format('YYYY-MM-DD'),
      })
      toast.success('Subscription cancelled')
      mutate()
      setConfirmCancel(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed')
    } finally {
      setCancellingId(null)
    }
  }

  const handleViewHistory = (userId) => {
    navigate(`${ROUTES.SUPER_ADMIN_INVOICES}?user_id=${userId}`)
  }
  const handleViewAdminProfile = (userId) => {
    navigate(`${ROUTES.SUPER_ADMIN_VIEW_DETAILS}?user_id=${userId}&from=users`)
  }

  const canRenew = (row) =>
    row.subscription_id &&
    ['active', 'trial'].includes((row.subscription_status || '').toLowerCase())

  const canCancel = (row) =>
    row.subscription_id &&
    ['active', 'trial', 'pending'].includes((row.subscription_status || '').toLowerCase())

  const closeActionMenu = () => setActionMenu(null)

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CardMembershipIcon fontSize="large" color="primary" />
        <Typography variant="h4" component="h1">
          Subscription Management
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage union admin subscriptions: renew, cancel, or view invoice history. Payment status is derived from current invoices.
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="280px">
          <CircularProgress />
        </Box>
      ) : admins.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              No Union Admins yet. Add clients and assign apartments from Leads or Clients, then give them a subscription.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: 2,
            borderColor: 'divider',
            overflow: 'hidden',
            boxShadow: (theme) => `0 10px 28px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(15,23,42,0.08)'}`,
            maxHeight: '70vh',
            overflowX: 'auto',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
          }}
        >
          <Table
            size="small"
            stickyHeader
            sx={{
              minWidth: 1280,
              '& .MuiTableCell-root': {
                py: 1.1,
                px: 1.25,
                borderColor: 'divider',
                whiteSpace: 'nowrap',
                fontSize: '0.8125rem',
              },
              '& .MuiTableCell-head': {
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'grey.100'),
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 700,
                fontSize: '0.68rem',
                borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Subscription ID</TableCell>
                <TableCell>Apartment Name</TableCell>
                <TableCell>Admin Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Plan Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Billing Cycle</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Last Payment Date</TableCell>
                <TableCell>Next Billing Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    '&:nth-of-type(even)': {
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'grey.50'),
                    },
                    '&:hover': {
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(59,130,246,0.10)' : 'rgba(59,130,246,0.06)'),
                    },
                  }}
                >
                  <TableCell>{row.subscription_id || '—'}</TableCell>
                  <TableCell>
                    {row.apartment_name ? (
                      <Link
                        component="button"
                        variant="body2"
                        underline="hover"
                        onClick={() => handleViewAdminProfile(row.id)}
                      >
                        {row.apartment_name}
                      </Link>
                    ) : '—'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.name || '—'}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{row.email || '—'}</TableCell>
                  <TableCell>{row.plan_name || '—'}</TableCell>
                  <TableCell>
                    {formatDate(row.start_date)}
                  </TableCell>
                  <TableCell>
                    {formatDate(row.end_date)}
                  </TableCell>
                  <TableCell>
                    {row.interval_months != null ? `${row.interval_months} month(s)` : '—'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {row.plan_amount != null ? `PKR ${Number(row.plan_amount).toLocaleString()}` : '—'}
                  </TableCell>
                  <TableCell>
                    {row.subscription_id ? (
                      <Chip
                        label={paymentStatusByUserId[row.id] || '—'}
                        color={paymentStatusByUserId[row.id] === 'Pending' ? 'warning' : 'success'}
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDate(latestPaidInvoiceByUserId[row.id]?.updated_at || latestPaidInvoiceByUserId[row.id]?.created_at)}
                  </TableCell>
                  <TableCell>
                    {formatDate(row.next_billing_date)}
                  </TableCell>
                  <TableCell>
                    {row.subscription_status ? (
                      <Chip
                        label={toTitleCase(row.subscription_status)}
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                        color={
                          row.subscription_status === 'active'
                            ? 'success'
                            : row.subscription_status === 'trial'
                            ? 'info'
                            : row.subscription_status === 'pending'
                            ? 'warning'
                            : 'default'
                        }
                      />
                    ) : '—'}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {latestInvoiceByUserId[row.id]?.notes || '—'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Actions">
                      <IconButton
                        size="small"
                        aria-label="Open actions menu"
                        onClick={(e) => setActionMenu({ anchorEl: e.currentTarget, row })}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Menu
        anchorEl={actionMenu?.anchorEl}
        open={Boolean(actionMenu)}
        onClose={closeActionMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            if (actionMenu?.row) handleViewAdminProfile(actionMenu.row.id)
            closeActionMenu()
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View admin profile</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (actionMenu?.row) handleViewHistory(actionMenu.row.id)
            closeActionMenu()
          }}
        >
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View invoice history</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={!actionMenu?.row || !canRenew(actionMenu.row) || renewingId === actionMenu?.row?.subscription_id}
          onClick={() => {
            const r = actionMenu?.row
            closeActionMenu()
            if (r && canRenew(r)) handleRenew(r)
          }}
        >
          <ListItemIcon>
            {actionMenu?.row && renewingId === actionMenu.row.subscription_id ? (
              <CircularProgress size={18} />
            ) : (
              <AutorenewIcon fontSize="small" color="primary" />
            )}
          </ListItemIcon>
          <ListItemText>Renew subscription</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={!actionMenu?.row || !canCancel(actionMenu.row) || cancellingId === actionMenu?.row?.subscription_id}
          onClick={() => {
            const r = actionMenu?.row
            closeActionMenu()
            if (r && canCancel(r)) handleCancel(r)
          }}
        >
          <ListItemIcon>
            {actionMenu?.row && cancellingId === actionMenu.row.subscription_id ? (
              <CircularProgress size={18} />
            ) : (
              <CancelIcon fontSize="small" color="error" />
            )}
          </ListItemIcon>
          <ListItemText>Cancel subscription</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={Boolean(confirmRenew)} onClose={() => setConfirmRenew(null)}>
        <DialogTitle>Renew subscription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmRenew && (
              <>
                Extend subscription for <strong>{confirmRenew.apartment_name}</strong> by{' '}
                {confirmRenew.interval_months || 1} month(s)? Next renewal date will be set accordingly.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRenew(null)}>Cancel</Button>
          <Button variant="contained" onClick={doRenew} disabled={renewingId != null}>
            Renew
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(confirmCancel)} onClose={() => setConfirmCancel(null)}>
        <DialogTitle>Cancel subscription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmCancel && (
              <>
                Cancel subscription for <strong>{confirmCancel.apartment_name}</strong>? The client will no longer have access until a new subscription is given.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancel(null)}>Keep</Button>
          <Button variant="contained" color="error" onClick={doCancel} disabled={cancellingId != null}>
            Cancel subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default SubscriptionManagement
