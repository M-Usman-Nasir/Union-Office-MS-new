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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CancelIcon from '@mui/icons-material/Cancel'
import HistoryIcon from '@mui/icons-material/History'
import useSWR from 'swr'
import { superAdminApi } from '@/api/superAdminApi'
import { ROUTES } from '@/utils/constants'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'

const SubscriptionManagement = () => {
  const navigate = useNavigate()
  const [renewingId, setRenewingId] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const [confirmRenew, setConfirmRenew] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(null)

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

  const paymentStatusByUserId = useMemo(() => {
    const map = {}
    admins.forEach((a) => {
      map[a.id] = 'Paid'
    })
    invoices.forEach((inv) => {
      if (inv.user_id && (inv.status === 'draft' || inv.status === 'sent')) {
        map[inv.user_id] = 'Pending'
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

  const canRenew = (row) =>
    row.subscription_id &&
    ['active', 'trial'].includes((row.subscription_status || '').toLowerCase())

  const canCancel = (row) =>
    row.subscription_id &&
    ['active', 'trial', 'pending'].includes((row.subscription_status || '').toLowerCase())

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
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Apartment Name</TableCell>
                <TableCell>Package Tier</TableCell>
                <TableCell>Subscription Start Date</TableCell>
                <TableCell>Subscription End Date</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Next Renewal Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.apartment_name || '—'}</TableCell>
                  <TableCell>
                    {row.plan_name ? (
                      <>
                        {row.plan_name}
                        {row.interval_months != null && (
                          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                            ({row.interval_months} mo)
                          </Typography>
                        )}
                      </>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    {row.start_date
                      ? dayjs(row.start_date).format('DD/MM/YYYY')
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {row.end_date
                      ? dayjs(row.end_date).format('DD/MM/YYYY')
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {row.subscription_id ? (
                      <Chip
                        label={paymentStatusByUserId[row.id] || '—'}
                        color={paymentStatusByUserId[row.id] === 'Pending' ? 'warning' : 'success'}
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    {row.next_billing_date
                      ? dayjs(row.next_billing_date).format('DD/MM/YYYY')
                      : '—'}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, flexWrap: 'wrap' }}>
                      {canRenew(row) && (
                        <Tooltip title="Renew subscription">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleRenew(row)}
                            disabled={renewingId === row.subscription_id}
                          >
                            {renewingId === row.subscription_id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <AutorenewIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      )}
                      {canCancel(row) && (
                        <Tooltip title="Cancel subscription">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleCancel(row)}
                            disabled={cancellingId === row.subscription_id}
                          >
                            {cancellingId === row.subscription_id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <CancelIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="View invoice history">
                        <IconButton
                          size="small"
                          onClick={() => handleViewHistory(row.id)}
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
