import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import useSWR, { useSWRConfig } from 'swr'
import { residentApi } from '@/api/residentApi'
import { maintenanceApi } from '@/api/maintenanceApi'
import DataTable from '@/components/common/DataTable'
import { ROUTES } from '@/utils/constants'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const ResidentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { mutate: mutateSWR } = useSWRConfig()
  const [familyMemberName, setFamilyMemberName] = useState('')
  const [familyMemberRelation, setFamilyMemberRelation] = useState('')
  const [addFamilyMemberLoading, setAddFamilyMemberLoading] = useState(false)
  const [openMaintenanceDialog, setOpenMaintenanceDialog] = useState(false)
  const [maintenanceDialogYear, setMaintenanceDialogYear] = useState(() => new Date().getFullYear())

  const { data: residentData, error, isLoading } = useSWR(
    id ? ['/residents', id] : null,
    () => residentApi.getById(id).then(res => res.data?.data ?? res.data)
  )

  const { data: familyMembersData, mutate: mutateFamily } = useSWR(
    id ? ['/family-members', id] : null,
    () => residentApi.getFamilyMembers(id).then(res => res.data)
  )

  const { data: maintenanceData, isLoading: maintenanceLoading } = useSWR(
    id && residentData?.unit_id ? ['/maintenance-resident', id, residentData.unit_id] : null,
    () =>
      maintenanceApi
        .getAll({
          unit_id: residentData.unit_id,
          society_id: residentData.society_apartment_id,
          limit: 200,
        })
        .then(res => res.data)
  )

  const { data: maintenanceYearData, isLoading: maintenanceYearLoading } = useSWR(
    residentData?.unit_id && openMaintenanceDialog ? ['/maintenance-year', residentData.unit_id, maintenanceDialogYear] : null,
    () =>
      maintenanceApi
        .getAll({
          unit_id: residentData.unit_id,
          year: maintenanceDialogYear,
          society_id: residentData.society_apartment_id,
          limit: 12,
        })
        .then(res => res.data)
  )

  useEffect(() => {
    const state = location.state
    if (!state?.openMaintenanceDialog || !residentData?.unit_id) return
    setMaintenanceDialogYear(state.maintenanceYear ?? new Date().getFullYear())
    setOpenMaintenanceDialog(true)
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.state?.openMaintenanceDialog, location.pathname, navigate, residentData?.unit_id])

  const resident = residentData
  const familyMembers = familyMembersData?.data || []
  const maintenanceList = maintenanceData?.data ?? []

  const handleBack = () => {
    navigate(ROUTES.ADMIN_RESIDENTS)
  }

  const handleAddFamilyMember = async () => {
    const name = familyMemberName.trim()
    if (!name) {
      toast.error('Name is required')
      return
    }
    if (!id) return
    setAddFamilyMemberLoading(true)
    try {
      await residentApi.createFamilyMember(id, {
        name,
        relation: familyMemberRelation.trim() || undefined,
      })
      toast.success('Family member added')
      setFamilyMemberName('')
      setFamilyMemberRelation('')
      await mutateFamily()
      await mutateSWR(['/family-members', id])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add family member')
    } finally {
      setAddFamilyMemberLoading(false)
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount ?? 0)

  const maintenanceColumns = [
    {
      id: 'period',
      label: 'Month / Year',
      render: (row) => `${MONTH_LABELS[(row.month || 1) - 1]} ${row.year ?? '-'}`,
    },
    {
      id: 'total_amount',
      label: 'Total Amount',
      render: (row) => formatCurrency(row.total_amount),
    },
    {
      id: 'amount_paid',
      label: 'Amount Paid',
      render: (row) => formatCurrency(row.amount_paid),
    },
    {
      id: 'due',
      label: 'Due',
      render: (row) => formatCurrency(Math.max(0, (Number(row.total_amount) || 0) - (Number(row.amount_paid) || 0))),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => {
        const s = row.status || 'pending'
        const label = s === 'paid' ? 'Paid' : s === 'partially_paid' ? 'Partially paid' : 'Pending'
        const color = s === 'paid' ? 'success' : s === 'partially_paid' ? 'warning' : 'default'
        return <Chip size="small" label={label} color={color} variant="outlined" />
      },
    },
    {
      id: 'payment_date',
      label: 'Payment Date',
      render: (row) => (row.payment_date ? dayjs(row.payment_date).format('DD MMM YYYY') : '-'),
    },
  ]

  if (isLoading || !residentData && !error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !resident) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography color="error">Resident not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
          Back to Residents
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          size="small"
          sx={{ minWidth: 'auto', p: 0.5 }}
        >
          Back
        </Button>
        <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
          Resident details
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {resident.name || '—'} · Unit {resident.unit_number || '—'}
      </Typography>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <Typography variant="caption" color="primary.main" display="block">Full Name</Typography>
            <Typography variant="body2">{resident.name || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="primary.main" display="block">Unit No.</Typography>
            <Typography variant="body2">{resident.unit_number || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="primary.main" display="block">Phone No.</Typography>
            <Typography variant="body2">{resident.contact_number || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="primary.main" display="block">Email</Typography>
            <Typography variant="body2">{resident.email || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="primary.main" display="block">Role</Typography>
            <Typography variant="body2">{resident.role === 'union_admin' ? 'Union Admin' : 'Resident'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="primary.main" display="block">Status</Typography>
            <Chip
              size="small"
              label={resident.is_active !== false ? 'Active' : 'Inactive'}
              color={resident.is_active !== false ? 'success' : 'default'}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>
              Utilities
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="primary.main" display="block">K-Electric</Typography>
            <Typography variant="body2">{resident.k_electric_account || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="primary.main" display="block">Gas</Typography>
            <Typography variant="body2">{resident.gas_account || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="primary.main" display="block">Water</Typography>
            <Typography variant="body2">{resident.water_account || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="primary.main" display="block">Phone/TV</Typography>
            <Typography variant="body2">{resident.phone_tv_account || '-'}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>
              Vehicles
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>Car</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" display="block">Cars No.</Typography>
            <Typography variant="body2">{resident.number_of_cars ?? '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" display="block">Make &amp; Model</Typography>
            <Typography variant="body2">{resident.car_make_model || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" display="block">License Plate</Typography>
            <Typography variant="body2">{resident.license_plate || '-'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>Bike</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" display="block">Bikes No.</Typography>
            <Typography variant="body2">{resident.number_of_bikes ?? '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" display="block">Make &amp; Model</Typography>
            <Typography variant="body2">{resident.bike_make_model || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" display="block">License Plate</Typography>
            <Typography variant="body2">{resident.bike_license_plate || '-'}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>
              Defaulter
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              {resident.defaulter_status
                ? `${resident.defaulter_status}${resident.defaulter_amount_due != null ? ` (Amount due: ${resident.defaulter_amount_due})` : ''}${resident.defaulter_months_overdue != null ? `, ${resident.defaulter_months_overdue} mo. overdue` : ''}`
                : 'Not a defaulter'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>
              Maintenance Records
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {!resident.unit_id ? (
              <Typography variant="body2" color="text.secondary">No unit assigned.</Typography>
            ) : (
              <Box sx={{ mt: 0.5 }}>
                <DataTable
                  columns={maintenanceColumns}
                  data={maintenanceList}
                  loading={maintenanceLoading}
                  emptyMessage="No maintenance records."
                  dense
                />
              </Box>
            )}
          </Grid>

          {(Array.isArray(resident.telephone_bills) && resident.telephone_bills.length > 0) ||
           (Array.isArray(resident.other_bills) && resident.other_bills.length > 0) ? (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>
                  Bills
                </Typography>
              </Grid>
              {Array.isArray(resident.telephone_bills) && resident.telephone_bills.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">Telephone</Typography>
                  <Typography variant="body2" component="span">
                    {resident.telephone_bills.map((b) => `${b.provider || 'N/A'} ${b.account_number || ''} (${b.amount ?? 0})`).join(', ') || '-'}
                  </Typography>
                </Grid>
              )}
              {Array.isArray(resident.other_bills) && resident.other_bills.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">Other</Typography>
                  <Typography variant="body2" component="span">
                    {resident.other_bills.map((b) => `${b.type || 'N/A'} ${b.provider || ''} (${b.amount ?? 0})`).join(', ') || '-'}
                  </Typography>
                </Grid>
              )}
            </>
          ) : null}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>
              Family Members
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {familyMembers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No family members added.</Typography>
            ) : (
              <Box component="ul" sx={{ m: 0, pl: 2, py: 0.25 }}>
                {familyMembers.map((fm) => (
                  <li key={fm.id}>
                    <Typography variant="body2">{fm.name}{fm.relation ? ` (${fm.relation})` : ''}</Typography>
                  </li>
                ))}
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Name"
                value={familyMemberName}
                onChange={(e) => setFamilyMemberName(e.target.value)}
                sx={{ minWidth: 140 }}
                disabled={addFamilyMemberLoading}
              />
              <TextField
                size="small"
                placeholder="Relation (e.g. Spouse, Child)"
                value={familyMemberRelation}
                onChange={(e) => setFamilyMemberRelation(e.target.value)}
                sx={{ minWidth: 160 }}
                disabled={addFamilyMemberLoading}
              />
              <Button
                size="small"
                variant="outlined"
                startIcon={addFamilyMemberLoading ? <CircularProgress size={16} /> : <AddIcon />}
                onClick={handleAddFamilyMember}
                disabled={addFamilyMemberLoading}
              >
                Add family member
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={openMaintenanceDialog}
        onClose={() => setOpenMaintenanceDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Unit {resident?.unit_number ?? '—'} – {resident?.name || 'No resident'} · Maintenance for {maintenanceDialogYear}
        </DialogTitle>
        <DialogContent>
          {!resident?.unit_id ? (
            <Typography variant="body2" color="text.secondary">
              No unit assigned.
            </Typography>
          ) : maintenanceYearLoading ? (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress />
            </Box>
          ) : !(maintenanceYearData?.data ?? maintenanceYearData)?.length ? (
            <Typography variant="body2" color="text.secondary">
              No maintenance records for this unit in {maintenanceDialogYear}.
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Paid</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Due</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {((maintenanceYearData?.data ?? maintenanceYearData) || [])
                    .slice()
                    .sort((a, b) => (a.month ?? 0) - (b.month ?? 0))
                    .map((record) => {
                      const due = (Number(record.total_amount) || 0) - (Number(record.amount_paid) || 0)
                      const monthName = record.month
                        ? new Date(2000, record.month - 1).toLocaleString('default', { month: 'short' })
                        : '—'
                      return (
                        <TableRow key={record.id}>
                          <TableCell>{monthName}</TableCell>
                          <TableCell align="right">{formatCurrency(Number(record.total_amount) || 0)}</TableCell>
                          <TableCell align="right">{formatCurrency(Number(record.amount_paid) || 0)}</TableCell>
                          <TableCell align="right">{formatCurrency(due)}</TableCell>
                          <TableCell>{record.status || 'pending'}</TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<OpenInNewIcon />}
            onClick={() => {
              setOpenMaintenanceDialog(false)
              navigate(ROUTES.ADMIN_MAINTENANCE, {
                state: { openUnitId: resident?.unit_id, openYear: maintenanceDialogYear },
              })
            }}
            disabled={!resident?.unit_id}
          >
            Open in Maintenance page
          </Button>
          <Button onClick={() => setOpenMaintenanceDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ResidentDetails
