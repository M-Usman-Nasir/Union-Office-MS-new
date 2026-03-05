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
import PersonIcon from '@mui/icons-material/Person'
import BuildIcon from '@mui/icons-material/Build'
import BoltIcon from '@mui/icons-material/Bolt'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import GroupIcon from '@mui/icons-material/Group'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import useSWR, { useSWRConfig } from 'swr'
import { residentApi } from '@/api/residentApi'
import { maintenanceApi } from '@/api/maintenanceApi'
import DataTable from '@/components/common/DataTable'
import { ROUTES } from '@/utils/constants'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const DetailRow = ({ label, value, fullWidth }) => (
  <Grid item xs={12} sm={fullWidth ? 12 : 6} md={fullWidth ? 12 : 4} sx={{ minWidth: 0 }}>
    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
      {label}
    </Typography>
    <Typography
      variant="body1"
      fontWeight={500}
      sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
    >
      {value ?? '—'}
    </Typography>
  </Grid>
)
DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  fullWidth: PropTypes.bool,
}

const SectionCard = ({ title, icon: Icon, children }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 3,
      height: '100%',
      borderRadius: 2,
      borderColor: (theme) => (theme.palette.mode === 'dark' ? 'divider' : 'rgba(0,0,0,0.08)'),
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50'),
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        {Icon && <Icon fontSize="small" />}
      </Box>
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>
    </Box>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Paper>
)
SectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.node,
}

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run when dialog flag from navigation state
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

  if (isLoading || (!residentData && !error)) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={280}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !resident) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">Resident not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} variant="outlined" sx={{ mt: 2 }}>
          Back to Residents
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
            size="medium"
            sx={{ minWidth: 0 }}
          >
            Back
          </Button>
          <Divider orientation="vertical" flexItem />
          <Typography variant="h5" fontWeight={700} component="h1">
            Resident details
          </Typography>
          <Chip
            label={resident.name || '—'}
            size="medium"
            sx={{ fontWeight: 600 }}
            color="primary"
            variant="outlined"
          />
          <Typography variant="body2" color="text.secondary">
            Unit {resident.unit_number || '—'}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Profile */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Profile" icon={PersonIcon}>
            <Grid container spacing={2}>
              <DetailRow label="Full Name" value={resident.name} fullWidth />
              <DetailRow label="Unit No." value={resident.unit_number} />
              <DetailRow label="Phone No." value={resident.contact_number} />
              <DetailRow label="Email" value={resident.email} />
              <DetailRow label="Role" value={resident.role === 'union_admin' ? 'Union Admin' : 'Resident'} />
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                  Status
                </Typography>
                <Chip
                  size="small"
                  label={resident.is_active !== false ? 'Active' : 'Inactive'}
                  color={resident.is_active !== false ? 'success' : 'default'}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </SectionCard>
        </Grid>

        {/* Utilities */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Utilities" icon={BoltIcon}>
            <Grid container spacing={2}>
              <DetailRow label="K-Electric" value={resident.k_electric_account} />
              <DetailRow label="Gas" value={resident.gas_account} />
              <DetailRow label="Water" value={resident.water_account} />
              <DetailRow label="Phone / TV" value={resident.phone_tv_account} />
            </Grid>
          </SectionCard>
        </Grid>

        {/* Vehicles */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Car" icon={DirectionsCarIcon}>
            <Grid container spacing={2}>
              <DetailRow label="Number of cars" value={resident.number_of_cars} />
              <DetailRow label="Make & Model" value={resident.car_make_model} />
              <DetailRow label="License Plate" value={resident.license_plate} />
            </Grid>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard title="Bike" icon={TwoWheelerIcon}>
            <Grid container spacing={2}>
              <DetailRow label="Number of bikes" value={resident.number_of_bikes} />
              <DetailRow label="Make & Model" value={resident.bike_make_model} />
              <DetailRow label="License Plate" value={resident.bike_license_plate} />
            </Grid>
          </SectionCard>
        </Grid>

        {/* Defaulter */}
        <Grid item xs={12} md={6}>
          <SectionCard title="Defaulter" icon={WarningAmberIcon}>
            <Typography variant="body1" fontWeight={500}>
              {resident.defaulter_status
                ? `${resident.defaulter_status}${resident.defaulter_amount_due != null ? ` (Amount due: ${resident.defaulter_amount_due})` : ''}${resident.defaulter_months_overdue != null ? `, ${resident.defaulter_months_overdue} mo. overdue` : ''}`
                : 'Not a defaulter'}
            </Typography>
          </SectionCard>
        </Grid>

        {/* Bills (conditional) */}
        {(Array.isArray(resident.telephone_bills) && resident.telephone_bills.length > 0) ||
        (Array.isArray(resident.other_bills) && resident.other_bills.length > 0) ? (
          <Grid item xs={12} md={6}>
            <SectionCard title="Bills" icon={ReceiptLongIcon}>
              <Grid container spacing={2}>
                {Array.isArray(resident.telephone_bills) && resident.telephone_bills.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                      Telephone
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {resident.telephone_bills.map((b) => `${b.provider || 'N/A'} ${b.account_number || ''} (${b.amount ?? 0})`).join(', ') || '—'}
                    </Typography>
                  </Grid>
                )}
                {Array.isArray(resident.other_bills) && resident.other_bills.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                      Other
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {resident.other_bills.map((b) => `${b.type || 'N/A'} ${b.provider || ''} (${b.amount ?? 0})`).join(', ') || '—'}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </SectionCard>
          </Grid>
        ) : null}

        {/* Maintenance Records */}
        <Grid item xs={12}>
          <SectionCard title="Maintenance Records" icon={BuildIcon}>
            {!resident.unit_id ? (
              <Typography variant="body2" color="text.secondary">
                No unit assigned.
              </Typography>
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
          </SectionCard>
        </Grid>

        {/* Family Members */}
        <Grid item xs={12}>
          <SectionCard title="Family Members" icon={GroupIcon}>
            {familyMembers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No family members added.
              </Typography>
            ) : (
              <Box component="ul" sx={{ m: 0, pl: 2.5, py: 0 }}>
                {familyMembers.map((fm) => (
                  <li key={fm.id} style={{ marginBottom: 4 }}>
                    <Typography variant="body1" fontWeight={500}>
                      {fm.name}{fm.relation ? ` (${fm.relation})` : ''}
                    </Typography>
                  </li>
                ))}
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Add family member
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Name"
                value={familyMemberName}
                onChange={(e) => setFamilyMemberName(e.target.value)}
                sx={{ minWidth: 160 }}
                disabled={addFamilyMemberLoading}
              />
              <TextField
                size="small"
                placeholder="Relation (e.g. Spouse, Child)"
                value={familyMemberRelation}
                onChange={(e) => setFamilyMemberRelation(e.target.value)}
                sx={{ minWidth: 180 }}
                disabled={addFamilyMemberLoading}
              />
              <Button
                size="small"
                variant="contained"
                startIcon={addFamilyMemberLoading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
                onClick={handleAddFamilyMember}
                disabled={addFamilyMemberLoading}
              >
                Add family member
              </Button>
            </Box>
          </SectionCard>
        </Grid>
      </Grid>

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
            <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto', borderRadius: 1 }}>
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
