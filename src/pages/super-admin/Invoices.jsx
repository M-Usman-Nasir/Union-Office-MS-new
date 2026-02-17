import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Alert,
} from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AddIcon from '@mui/icons-material/Add'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import useSWR from 'swr'
import { superAdminApi } from '@/api/superAdminApi'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'

const statusColor = (status) => {
  switch (status) {
    case 'paid':
      return 'success'
    case 'sent':
      return 'info'
    case 'draft':
      return 'default'
    case 'cancelled':
      return 'error'
    default:
      return 'default'
  }
}

const SuperAdminInvoices = () => {
  const [statusFilter, setStatusFilter] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [autoGenerating, setAutoGenerating] = useState(false)
  const [createForm, setCreateForm] = useState({
    user_id: '',
    society_apartment_id: '',
    amount: '',
    due_date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    period_start: dayjs().startOf('month').format('YYYY-MM-DD'),
    period_end: dayjs().endOf('month').format('YYYY-MM-DD'),
    notes: '',
  })

  const { data: invoicesRes, isLoading, mutate } = useSWR(
    ['/super-admin/invoices', statusFilter],
    () =>
      superAdminApi
        .listInvoices({ limit: 100, ...(statusFilter ? { status: statusFilter } : {}) })
        .then((res) => res.data)
  )
  const { data: adminsData } = useSWR(
    '/super-admin/subscription/admins',
    () => superAdminApi.getAdminsWithSubscriptions().then((res) => res.data)
  )

  const invoices = invoicesRes?.data ?? []
  const total = invoicesRes?.total ?? invoices.length
  const admins = adminsData?.data ?? []

  const handleCreateInvoice = async () => {
    const { user_id, society_apartment_id, amount } = createForm
    if (!user_id || !society_apartment_id || !amount || parseFloat(amount) < 0) {
      toast.error('Select union admin, society, and enter amount')
      return
    }
    try {
      await superAdminApi.createInvoice({
        user_id: parseInt(user_id, 10),
        society_apartment_id: parseInt(society_apartment_id, 10),
        amount: parseFloat(createForm.amount),
        due_date: createForm.due_date,
        period_start: createForm.period_start,
        period_end: createForm.period_end,
        notes: createForm.notes || undefined,
      })
      toast.success('Invoice created')
      mutate()
      setCreateOpen(false)
      setCreateForm({
        user_id: '',
        society_apartment_id: '',
        amount: '',
        due_date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
        period_start: dayjs().startOf('month').format('YYYY-MM-DD'),
        period_end: dayjs().endOf('month').format('YYYY-MM-DD'),
        notes: '',
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create invoice')
    }
  }

  const handleAutoGenerate = async () => {
    setAutoGenerating(true)
    try {
      const res = await superAdminApi.autoGenerateInvoices()
      const created = res.data?.created?.length ?? 0
      toast.success(res.data?.message || `Created ${created} invoice(s)`)
      mutate()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Auto-generate failed')
    } finally {
      setAutoGenerating(false)
    }
  }

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      await superAdminApi.updateInvoiceStatus(invoiceId, newStatus)
      toast.success('Status updated')
      mutate()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  }

  const onSelectAdmin = (userId) => {
    const admin = admins.find((a) => a.id === parseInt(userId, 10))
    setCreateForm((f) => ({
      ...f,
      user_id: userId,
      society_apartment_id: admin?.society_apartment_id ? String(admin.society_apartment_id) : '',
      amount: admin?.plan_amount != null ? String(admin.plan_amount) : f.amount,
    }))
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReceiptLongIcon fontSize="large" color="primary" />
        <Typography variant="h4" component="h1">
          Invoices
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        All invoices for union admins. Create invoices manually or run auto-generation to create monthly invoices from active subscriptions.
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="sent">Sent</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Create invoice
        </Button>
        <Button
          variant="outlined"
          startIcon={autoGenerating ? <CircularProgress size={18} /> : <AutoFixHighIcon />}
          disabled={autoGenerating}
          onClick={handleAutoGenerate}
        >
          {autoGenerating ? 'Running...' : 'Auto-generate monthly invoices'}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        Auto-generate creates draft invoices for union admins with active subscriptions and a plan amount &gt; 0 whose next billing date is due. Run it monthly (e.g. on the 1st) or as needed.
      </Alert>

      <Card>
        <CardContent>
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : invoices.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No invoices yet. Create one manually or run auto-generate.
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Union admin</TableCell>
                    <TableCell>Society</TableCell>
                    <TableCell align="right">Amount (PKR)</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Due date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <Typography variant="body2">{inv.user_name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {inv.user_email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {inv.apartment_name}
                        {inv.city && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            {inv.city}
                            {inv.area ? `, ${inv.area}` : ''}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">{inv.amount}</TableCell>
                      <TableCell>
                        {inv.period_start && dayjs(inv.period_start).format('DD/MM/YYYY')} –{' '}
                        {inv.period_end && dayjs(inv.period_end).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>{inv.due_date && dayjs(inv.due_date).format('DD/MM/YYYY')}</TableCell>
                      <TableCell>
                        <Chip label={inv.status} color={statusColor(inv.status)} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        {inv.status === 'draft' && (
                          <>
                            <Button
                              size="small"
                              onClick={() => handleStatusChange(inv.id, 'sent')}
                            >
                              Mark sent
                            </Button>
                            <Button
                              size="small"
                              color="success"
                              onClick={() => handleStatusChange(inv.id, 'paid')}
                            >
                              Mark paid
                            </Button>
                          </>
                        )}
                        {inv.status === 'sent' && (
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleStatusChange(inv.id, 'paid')}
                          >
                            Mark paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create invoice</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Union admin</InputLabel>
                <Select
                  value={createForm.user_id}
                  label="Union admin"
                  onChange={(e) => onSelectAdmin(e.target.value)}
                >
                  <MenuItem value="">— Select —</MenuItem>
                  {admins.map((a) => (
                    <MenuItem key={a.id} value={String(a.id)}>
                      {a.name} ({a.apartment_name})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Society (apartment)"
                value={createForm.society_apartment_id}
                InputProps={{ readOnly: true }}
                helperText="Set by selected union admin"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Amount (PKR)"
                type="number"
                inputProps={{ min: 0, step: 100 }}
                value={createForm.amount}
                onChange={(e) => setCreateForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Due date"
                type="date"
                value={createForm.due_date}
                onChange={(e) => setCreateForm((f) => ({ ...f, due_date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Period start"
                type="date"
                value={createForm.period_start}
                onChange={(e) => setCreateForm((f) => ({ ...f, period_start: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Period end"
                type="date"
                value={createForm.period_end}
                onChange={(e) => setCreateForm((f) => ({ ...f, period_end: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Notes"
                multiline
                rows={2}
                value={createForm.notes}
                onChange={(e) => setCreateForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateInvoice}
            disabled={!createForm.user_id || !createForm.society_apartment_id || !createForm.amount}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default SuperAdminInvoices
