import { useState, useRef, useMemo, useEffect } from 'react'
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
  Link,
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
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Stack,
  Menu,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AddIcon from '@mui/icons-material/Add'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import PersonIcon from '@mui/icons-material/Person'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import useSWR from 'swr'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { superAdminApi } from '@/api/superAdminApi'
import { ROUTES } from '@/utils/constants'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '')
const getPaymentProofUrl = (path) => (path ? `${API_BASE}${path}` : null)

const formatDate = (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '—')
const formatCurrency = (value) => (value != null ? `PKR ${Number(value).toLocaleString()}` : '—')

const tableHeadSx = {
  bgcolor: (theme) =>
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'grey.100',
  fontWeight: 700,
  fontSize: '0.6875rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'text.secondary',
  whiteSpace: 'nowrap',
  borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
  py: 1,
  px: 1.25,
}

const INITIAL_COL_VISIBILITY = {
  id: true,
  apartment: true,
  admin: true,
  email: true,
  invDate: true,
  due: true,
  period: true,
  plan: true,
  amount: true,
  total: true,
  status: true,
  paidOn: true,
  method: true,
  ref: true,
  notes: true,
  actions: true,
}

const COLUMN_OPTIONS = [
  { key: 'id', label: 'Invoice ID' },
  { key: 'apartment', label: 'Apartment' },
  { key: 'admin', label: 'Admin name' },
  { key: 'email', label: 'Email' },
  { key: 'invDate', label: 'Invoice date' },
  { key: 'due', label: 'Due date' },
  { key: 'period', label: 'Billing period' },
  { key: 'plan', label: 'Plan' },
  { key: 'amount', label: 'Amount' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Status' },
  { key: 'paidOn', label: 'Paid on' },
  { key: 'method', label: 'Payment method' },
  { key: 'ref', label: 'Reference no.' },
  { key: 'notes', label: 'Notes' },
  { key: 'actions', label: 'Actions', locked: true },
]

const toggleColumnVisibility = (prev, key) => {
  const next = { ...prev, [key]: !prev[key] }
  const dataKeys = COLUMN_OPTIONS.filter((o) => !o.locked).map((o) => o.key)
  const anyDataVisible = dataKeys.some((k) => next[k])
  if (!anyDataVisible) {
    toast.error('Keep at least one column visible (besides Actions).')
    return prev
  }
  return next
}

const SuperAdminInvoices = () => {
  const theme = useTheme()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const userIdFromUrl = searchParams.get('user_id') || ''
  const [statusFilter, setStatusFilter] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [autoGenerating, setAutoGenerating] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadInvoice, setUploadInvoice] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadMarkPaid, setUploadMarkPaid] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [statusChangingId, setStatusChangingId] = useState(null)
  const [colVisibility, setColVisibility] = useState(() => ({ ...INITIAL_COL_VISIBILITY }))
  const [columnsMenuAnchor, setColumnsMenuAnchor] = useState(null)
  const tableScrollRef = useRef(null)
  const [tableScrollsX, setTableScrollsX] = useState(false)
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
    ['/super-admin/invoices', statusFilter, userIdFromUrl],
    () =>
      superAdminApi
        .listInvoices({
          limit: 100,
          ...(statusFilter ? { status: statusFilter } : {}),
          ...(userIdFromUrl ? { user_id: userIdFromUrl } : {}),
        })
        .then((res) => res.data)
  )
  const { data: adminsData } = useSWR(
    '/super-admin/subscription/admins',
    () => superAdminApi.getAdminsWithSubscriptions().then((res) => res.data)
  )

  const invoices = useMemo(() => invoicesRes?.data ?? [], [invoicesRes?.data])
  const admins = useMemo(() => adminsData?.data ?? [], [adminsData?.data])
  const adminById = useMemo(
    () =>
      admins.reduce((acc, a) => {
        acc[a.id] = a
        return acc
      }, {}),
    [admins]
  )

  useEffect(() => {
    const el = tableScrollRef.current
    if (!el) return
    const measure = () => setTableScrollsX(el.scrollWidth > el.clientWidth + 2)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    el.addEventListener('scroll', measure, { passive: true })
    return () => {
      ro.disconnect()
      el.removeEventListener('scroll', measure)
    }
  }, [invoices, colVisibility, isLoading])

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

  const handleStatusChange = async (inv, newStatus) => {
    if (!inv) return
    if (newStatus === 'paid' && !inv.payment_proof_path) {
      setUploadInvoice(inv)
      setSelectedFile(null)
      setUploadMarkPaid(true)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setUploadOpen(true)
      return
    }
    setStatusChangingId(inv.id)
    try {
      await superAdminApi.updateInvoiceStatus(inv.id, newStatus)
      toast.success('Status updated')
      mutate()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setStatusChangingId(null)
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

  const openUploadDialog = (inv) => {
    setUploadInvoice(inv)
    setSelectedFile(null)
    setUploadMarkPaid(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setUploadOpen(true)
  }

  const closeUploadDialog = () => {
    setUploadOpen(false)
    setUploadInvoice(null)
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUploadPaymentProof = async () => {
    if (!uploadInvoice || !selectedFile) {
      toast.error('Please select a file (image or PDF)')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('mark_paid', uploadMarkPaid ? 'true' : 'false')
      const res = await superAdminApi.uploadInvoicePaymentProof(uploadInvoice.id, formData)
      toast.success(res.data?.message || 'Payment proof uploaded')
      mutate()
      closeUploadDialog()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const openAdminProfile = (userId) => {
    navigate(`${ROUTES.SUPER_ADMIN_VIEW_DETAILS}?user_id=${userId}&from=users`)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReceiptLongIcon fontSize="large" color="primary" />
        <Typography variant="h4" component="h1">
          Invoices
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        All invoices for union admins. Create invoices manually or run auto-generation to create monthly invoices from active subscriptions.
      </Typography>

      {userIdFromUrl && (
        <Alert
          severity="info"
          onClose={() => navigate(ROUTES.SUPER_ADMIN_INVOICES)}
          sx={{ mb: 2 }}
        >
          Showing invoices for: <strong>{admins.find((a) => String(a.id) === userIdFromUrl)?.name || userIdFromUrl}</strong>. Close to show all.
        </Alert>
      )}

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

      <Card
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : invoices.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 6, px: 3, textAlign: 'center' }}>
              No invoices yet. Create one manually or run auto-generate.
            </Typography>
          ) : (
            <>
              <Box
                sx={{
                  px: 2,
                  py: 0.875,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  flexWrap: 'wrap',
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.05),
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, flex: 1 }}>
                  <SwapHorizIcon color="primary" sx={{ fontSize: 22, flexShrink: 0, opacity: 0.85 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.45 }}>
                    {tableScrollsX ? (
                      <>
                        More columns are off-screen — use the <strong>horizontal scrollbar</strong> below (wider track) or{' '}
                        <strong>Shift + mouse wheel</strong> to scroll sideways.
                      </>
                    ) : (
                      <>
                        Wide table: use <strong>Columns</strong> to hide fields you do not need; scrollbars appear when content
                        overflows.
                      </>
                    )}
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<ViewColumnIcon />}
                  onClick={(e) => setColumnsMenuAnchor(e.currentTarget)}
                  sx={{ flexShrink: 0 }}
                >
                  Columns
                </Button>
              </Box>
              <Menu
                anchorEl={columnsMenuAnchor}
                open={Boolean(columnsMenuAnchor)}
                onClose={() => setColumnsMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { mt: 0.5 } }}
              >
                <Box sx={{ px: 2, py: 1.5, minWidth: 260 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Visible columns
                  </Typography>
                  <Stack spacing={0.25}>
                    {COLUMN_OPTIONS.map((opt) => (
                      <FormControlLabel
                        key={opt.key}
                        sx={{ mr: 0, ml: 0 }}
                        control={
                          <Checkbox
                            size="small"
                            checked={colVisibility[opt.key]}
                            disabled={Boolean(opt.locked)}
                            onChange={() => {
                              if (opt.locked) return
                              setColVisibility((v) => toggleColumnVisibility(v, opt.key))
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" color={opt.locked ? 'text.secondary' : 'text.primary'}>
                            {opt.label}
                            {opt.locked ? ' (always on)' : ''}
                          </Typography>
                        }
                      />
                    ))}
                  </Stack>
                  <Button
                    fullWidth
                    size="small"
                    variant="text"
                    sx={{ mt: 1 }}
                    onClick={() => {
                      setColVisibility({ ...INITIAL_COL_VISIBILITY })
                    }}
                  >
                    Reset to default
                  </Button>
                </Box>
              </Menu>
              <TableContainer
                ref={tableScrollRef}
                component={Paper}
                variant="outlined"
                sx={{
                  maxHeight: 'min(72vh, 800px)',
                  overflowX: 'auto',
                  overflowY: 'auto',
                  scrollbarGutter: 'stable',
                  scrollbarWidth: 'thin',
                  scrollbarColor: `${alpha(theme.palette.primary.main, 0.5)} ${alpha(theme.palette.primary.main, 0.08)}`,
                  '&::-webkit-scrollbar': {
                    height: 12,
                    width: 12,
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    borderRadius: 6,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.45),
                    borderRadius: 6,
                    border: `3px solid ${alpha(theme.palette.primary.main, 0.06)}`,
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.65),
                  },
                  border: 0,
                  borderRadius: 0,
                  boxShadow: 'none',
                }}
              >
                <Table
                  size="small"
                  stickyHeader
                  sx={{
                    tableLayout: 'fixed',
                    minWidth: 1180,
                    '& .MuiTableCell-root': {
                      py: 0.875,
                      px: 1.25,
                      verticalAlign: 'middle',
                      borderColor: 'divider',
                    },
                    '& .MuiTableCell-head': tableHeadSx,
                    '& .MuiTableCell-body': {
                      fontSize: '0.8125rem',
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {colVisibility.id && <TableCell sx={{ width: 72 }}>Invoice ID</TableCell>}
                      {colVisibility.apartment && <TableCell sx={{ width: 140 }}>Apartment</TableCell>}
                      {colVisibility.admin && <TableCell sx={{ width: 120 }}>Admin</TableCell>}
                      {colVisibility.email && <TableCell sx={{ width: 160 }}>Email</TableCell>}
                      {colVisibility.invDate && <TableCell sx={{ width: 88 }}>Inv. date</TableCell>}
                      {colVisibility.due && <TableCell sx={{ width: 88 }}>Due</TableCell>}
                      {colVisibility.period && <TableCell sx={{ width: 150 }}>Billing period</TableCell>}
                      {colVisibility.plan && <TableCell sx={{ width: 110 }}>Plan</TableCell>}
                      {colVisibility.amount && (
                        <TableCell align="right" sx={{ width: 100 }}>
                          Amount
                        </TableCell>
                      )}
                      {colVisibility.total && (
                        <TableCell align="right" sx={{ width: 100 }}>
                          Total
                        </TableCell>
                      )}
                      {colVisibility.status && <TableCell sx={{ width: 132 }}>Status</TableCell>}
                      {colVisibility.paidOn && <TableCell sx={{ width: 88 }}>Paid on</TableCell>}
                      {colVisibility.method && <TableCell sx={{ width: 88 }}>Method</TableCell>}
                      {colVisibility.ref && <TableCell sx={{ width: 88 }}>Ref.</TableCell>}
                      {colVisibility.notes && <TableCell sx={{ minWidth: 120 }}>Notes</TableCell>}
                      {colVisibility.actions && (
                        <TableCell align="right" sx={{ width: 88 }}>
                          Actions
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((inv) => (
                      <TableRow
                        key={inv.id}
                        hover
                        sx={{
                          '&:nth-of-type(even)': {
                            bgcolor: (t) =>
                              t.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'grey.50',
                          },
                        }}
                      >
                        {colVisibility.id && (
                          <TableCell>
                            <Typography
                              component="span"
                              variant="body2"
                              fontWeight={600}
                              sx={{ fontVariantNumeric: 'tabular-nums' }}
                            >
                              #{inv.id}
                            </Typography>
                          </TableCell>
                        )}
                        {colVisibility.apartment && (
                          <TableCell>
                            {inv.apartment_name ? (
                              <Stack spacing={0.25} alignItems="flex-start">
                                <Link
                                  component="button"
                                  type="button"
                                  variant="body2"
                                  underline="hover"
                                  onClick={() => openAdminProfile(inv.user_id)}
                                  sx={{
                                    fontWeight: 600,
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    p: 0,
                                    border: 0,
                                    bgcolor: 'transparent',
                                    color: 'primary.main',
                                  }}
                                >
                                  {inv.apartment_name}
                                </Link>
                                {(inv.city || inv.area) && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    noWrap
                                    display="block"
                                    sx={{ maxWidth: 132 }}
                                  >
                                    {[inv.city, inv.area].filter(Boolean).join(' · ')}
                                  </Typography>
                                )}
                              </Stack>
                            ) : (
                              '—'
                            )}
                          </TableCell>
                        )}
                        {colVisibility.admin && (
                          <TableCell>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 120 }} title={inv.user_name || ''}>
                              {inv.user_name || '—'}
                            </Typography>
                          </TableCell>
                        )}
                        {colVisibility.email && (
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                              sx={{ maxWidth: 160 }}
                              title={inv.user_email || ''}
                            >
                              {inv.user_email || '—'}
                            </Typography>
                          </TableCell>
                        )}
                        {colVisibility.invDate && (
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}>
                            {formatDate(inv.created_at)}
                          </TableCell>
                        )}
                        {colVisibility.due && (
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>{formatDate(inv.due_date)}</TableCell>
                        )}
                        {colVisibility.period && (
                          <TableCell>
                            <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', lineHeight: 1.35 }}>
                              {formatDate(inv.period_start)}
                              <Typography component="span" variant="caption" color="text.secondary" display="block">
                                to {formatDate(inv.period_end)}
                              </Typography>
                            </Typography>
                          </TableCell>
                        )}
                        {colVisibility.plan && (
                          <TableCell>
                            <Typography variant="body2" noWrap title={adminById[inv.user_id]?.plan_name || ''}>
                              {adminById[inv.user_id]?.plan_name || '—'}
                            </Typography>
                          </TableCell>
                        )}
                        {colVisibility.amount && (
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600} sx={{ fontVariantNumeric: 'tabular-nums' }}>
                              {formatCurrency(inv.amount)}
                            </Typography>
                          </TableCell>
                        )}
                        {colVisibility.total && (
                          <TableCell align="right">
                            <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                              {formatCurrency(inv.amount)}
                            </Typography>
                          </TableCell>
                        )}
                        {colVisibility.status && (
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <FormControl size="small" fullWidth sx={{ minWidth: 0 }}>
                                <Select
                                  value={inv.status || ''}
                                  onChange={(e) => handleStatusChange(inv, e.target.value)}
                                  disabled={statusChangingId === inv.id}
                                  displayEmpty
                                  renderValue={(v) =>
                                    v ? v.charAt(0).toUpperCase() + v.slice(1) : '—'
                                  }
                                  sx={{
                                    borderRadius: 1,
                                    '& .MuiSelect-select': {
                                      py: 0.5,
                                      pr: 3,
                                      fontSize: '0.8125rem',
                                      fontWeight: 500,
                                    },
                                  }}
                                >
                                  <MenuItem value="draft">Draft</MenuItem>
                                  <MenuItem value="sent">Sent</MenuItem>
                                  <MenuItem value="paid">Paid</MenuItem>
                                  <MenuItem value="cancelled">Cancelled</MenuItem>
                                </Select>
                              </FormControl>
                              <Tooltip title="Upload payment proof">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => openUploadDialog(inv)}
                                  sx={{ flexShrink: 0 }}
                                >
                                  <UploadFileIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        )}
                        {colVisibility.paidOn && (
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}>
                            {formatDate(
                              inv.status === 'paid'
                                ? inv.payment_proof_uploaded_at || inv.updated_at
                                : null
                            )}
                          </TableCell>
                        )}
                        {colVisibility.method && <TableCell sx={{ color: 'text.disabled' }}>—</TableCell>}
                        {colVisibility.ref && <TableCell sx={{ color: 'text.disabled' }}>—</TableCell>}
                        {colVisibility.notes && (
                          <TableCell>
                            {inv.notes ? (
                              <Tooltip title={inv.notes} placement="top-start">
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: 1.35,
                                  }}
                                >
                                  {inv.notes}
                                </Typography>
                              </Tooltip>
                            ) : (
                              <Typography variant="body2" color="text.disabled">
                                —
                              </Typography>
                            )}
                          </TableCell>
                        )}
                        {colVisibility.actions && (
                          <TableCell align="right">
                            <Stack direction="row" spacing={0} justifyContent="flex-end">
                              <Tooltip title="Admin profile & details">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => openAdminProfile(inv.user_id)}
                                >
                                  <PersonIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {inv.payment_proof_path && (
                                <Tooltip title="Open payment proof">
                                  <IconButton
                                    size="small"
                                    component="a"
                                    href={getPaymentProofUrl(inv.payment_proof_path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <OpenInNewIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
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

      <Dialog open={uploadOpen} onClose={closeUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Upload payment proof</DialogTitle>
        <DialogContent>
          {uploadInvoice && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Invoice for {uploadInvoice.user_name} (ID: {uploadInvoice.user_id}) – PKR {uploadInvoice.amount}. Upload a screenshot or document to confirm payment received.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    fullWidth
                  >
                    {selectedFile ? selectedFile.name : 'Choose image or PDF'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/*,.pdf,image/jpeg,image/png,image/gif,image/webp,application/pdf"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  </Button>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    Max 5MB. Images (JPEG, PNG, GIF, WebP) or PDF.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={uploadMarkPaid}
                        onChange={(e) => setUploadMarkPaid(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Mark invoice as paid after upload"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUploadDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUploadPaymentProof}
            disabled={!selectedFile || uploading}
            startIcon={uploading ? <CircularProgress size={18} /> : <UploadFileIcon />}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default SuperAdminInvoices
