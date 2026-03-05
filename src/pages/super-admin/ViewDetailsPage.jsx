import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Paper,
  Box,
  Chip,
  Divider,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ApartmentIcon from '@mui/icons-material/Apartment'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import LayersIcon from '@mui/icons-material/Layers'
import DomainIcon from '@mui/icons-material/Domain'
import useSWR from 'swr'
import { apartmentApi } from '@/api/apartmentApi'
import { superAdminApi } from '@/api/superAdminApi'
import { ROUTES } from '@/utils/constants'
import PropTypes from 'prop-types'

const showCount = (v) => (v == null || v === '') ? '—' : v

const DetailRow = ({ label, value, fullWidth }) => (
  <Grid item xs={12} sm={fullWidth ? 12 : 6} md={fullWidth ? 12 : 4}>
    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={500}>
      {value || '—'}
    </Typography>
  </Grid>
)
DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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

const ViewDetailsPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const societyId = searchParams.get('society_id')
  const userId = searchParams.get('user_id')
  const from = searchParams.get('from') || 'leads'

  const isBySociety = Boolean(societyId)
  const isByUser = Boolean(userId)

  const { data: apartmentRes, isLoading: apartmentLoading } = useSWR(
    societyId ? ['/view-details-apartment', societyId] : null,
    () => apartmentApi.getById(societyId).then((res) => res.data)
  )
  const { data: adminsRes } = useSWR(
    '/super-admin/subscription/admins',
    () => superAdminApi.getAdminsWithSubscriptions().then((res) => res.data)
  )
  const admins = adminsRes?.data ?? []

  const userRow = isByUser ? admins.find((a) => String(a.id) === userId) : null
  const societyIdFromUser = userRow?.society_apartment_id

  const { data: apartmentByUserRes, isLoading: apartmentByUserLoading } = useSWR(
    isByUser && societyIdFromUser ? ['/view-details-apartment-user', societyIdFromUser] : null,
    () => apartmentApi.getById(societyIdFromUser).then((res) => res.data)
  )

  const apartment = isBySociety ? apartmentRes?.data : apartmentByUserRes?.data
  const isLoading = isBySociety ? apartmentLoading : (isByUser && !userRow) || apartmentByUserLoading
  const effectiveSocietyId = isBySociety ? societyId : societyIdFromUser
  const admin = effectiveSocietyId ? admins.find((a) => String(a.society_apartment_id) === String(effectiveSocietyId)) : userRow

  const handleBack = () => {
    if (from === 'users') {
      navigate(ROUTES.SUPER_ADMIN_USERS)
    } else {
      navigate(ROUTES.SUPER_ADMIN_SOCIETIES)
    }
  }

  if ((isBySociety && !societyId) || (isByUser && !userId)) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="text.secondary">Missing society_id or user_id.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
          Back
        </Button>
      </Container>
    )
  }

  if (isByUser && admins.length > 0 && !userRow) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="text.secondary">User not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
          Back
        </Button>
      </Container>
    )
  }

  if (isLoading && !apartment && !userRow) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  const viewApartment = {}
  if (isByUser && userRow && apartment) {
    viewApartment.name = apartment.name
    viewApartment.address = apartment.address
    viewApartment.city = apartment.city
    viewApartment.area = apartment.area
    viewApartment.total_blocks = apartment.total_blocks
    viewApartment.total_floors = apartment.total_floors
    viewApartment.total_units = apartment.total_units
  } else if (apartment) {
    Object.assign(viewApartment, apartment)
  }

  const isLeadView = isBySociety

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
            View details
          </Typography>
          {viewApartment.name && (
            <Chip
              label={viewApartment.name}
              size="medium"
              sx={{ fontWeight: 600 }}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Lead / Apartment section */}
        <Grid item xs={12} md={isLeadView ? 6 : 12}>
          <SectionCard
            title={isLeadView ? 'Lead' : 'Apartment'}
            icon={isLeadView ? BusinessIcon : ApartmentIcon}
          >
            <Grid container spacing={2}>
              <DetailRow label={isLeadView ? 'Lead name' : 'Apartment Name'} value={viewApartment.name} fullWidth />
              <DetailRow label="Address" value={viewApartment.address} fullWidth />
              <DetailRow label="City" value={viewApartment.city} />
              <DetailRow label="Area" value={viewApartment.area} />
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Quick links
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    icon={<AccountTreeIcon sx={{ fontSize: 18 }} />}
                    label={`Blocks: ${showCount(viewApartment.total_blocks)}`}
                    onClick={() => navigate(`/super-admin/blocks?society_id=${effectiveSocietyId}`)}
                    variant="outlined"
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip
                    icon={<LayersIcon sx={{ fontSize: 18 }} />}
                    label={`Floors: ${showCount(viewApartment.total_floors)}`}
                    onClick={() => navigate(`/super-admin/floors?society_id=${effectiveSocietyId}`)}
                    variant="outlined"
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip
                    icon={<DomainIcon sx={{ fontSize: 18 }} />}
                    label={`Units: ${showCount(viewApartment.total_units)}`}
                    onClick={() => navigate(`/super-admin/units?society_id=${effectiveSocietyId}`)}
                    variant="outlined"
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </SectionCard>
        </Grid>

        {/* Lead details (only when from Leads) */}
        {isLeadView && (
          <Grid item xs={12} md={6}>
            <SectionCard title="Lead details" icon={CalendarTodayIcon}>
              <Grid container spacing={2}>
                <DetailRow label="Lead Source" value={viewApartment.lead_source} />
                <DetailRow label="Current Status" value={viewApartment.current_status} />
                <DetailRow
                  label="Next Follow-up Date"
                  value={viewApartment.next_followup_date ? new Date(viewApartment.next_followup_date).toLocaleDateString() : null}
                />
                <DetailRow
                  label="Last Interaction Date"
                  value={viewApartment.last_interaction_date ? new Date(viewApartment.last_interaction_date).toLocaleDateString() : null}
                />
                <DetailRow label="Priority" value={viewApartment.priority} />
                {viewApartment.notes && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                      Notes
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }} fontWeight={500}>
                      {viewApartment.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </SectionCard>
          </Grid>
        )}

        {/* Union Admin section */}
        <Grid item xs={12}>
          <SectionCard title="Union Admin" icon={PersonIcon}>
            {!admin ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    No Union Admin assigned.
                  </Typography>
                </Grid>
                {(viewApartment.union_admin_name || viewApartment.union_admin_email || viewApartment.union_admin_phone) && (
                  <>
                    <DetailRow label="Lead contact name" value={viewApartment.union_admin_name} />
                    <DetailRow label="Lead contact email" value={viewApartment.union_admin_email} />
                    <DetailRow label="Lead contact phone" value={viewApartment.union_admin_phone} />
                  </>
                )}
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <DetailRow label="Name" value={admin.name} />
                <DetailRow label="Email" value={admin.email} />
                <DetailRow label="Phone Number" value={admin.contact_number} />
                {['active', 'trial'].includes((admin.subscription_status || '').toLowerCase()) && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Subscription
                      </Typography>
                    </Grid>
                    <DetailRow label="Status" value={admin.subscription_status} />
                    <DetailRow
                      label="Plan"
                      value={admin.plan_name ? `${admin.plan_name} (${admin.plan_amount ?? 0} PKR)` : null}
                    />
                    <DetailRow
                      label="Next Billing Date"
                      value={admin.next_billing_date ? new Date(admin.next_billing_date).toLocaleDateString() : null}
                    />
                  </>
                )}
              </Grid>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ViewDetailsPage
