import { useState } from 'react'
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
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR, { useSWRConfig } from 'swr'
import { residentApi } from '@/api/residentApi'
import { ROUTES } from '@/utils/constants'
import toast from 'react-hot-toast'

const ResidentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { mutate: mutateSWR } = useSWRConfig()
  const [familyMemberName, setFamilyMemberName] = useState('')
  const [familyMemberRelation, setFamilyMemberRelation] = useState('')
  const [addFamilyMemberLoading, setAddFamilyMemberLoading] = useState(false)

  const { data: residentData, error, isLoading, mutate } = useSWR(
    id ? ['/residents', id] : null,
    () => residentApi.getById(id).then(res => res.data?.data ?? res.data)
  )

  const { data: familyMembersData, mutate: mutateFamily } = useSWR(
    id ? ['/family-members', id] : null,
    () => residentApi.getFamilyMembers(id).then(res => res.data)
  )

  const resident = residentData
  const familyMembers = familyMembersData?.data || []

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Back to Residents
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        Resident details
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {resident.name || '—'} · Unit {resident.unit_number || '—'}
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Full Name</Typography>
            <Typography variant="body1">{resident.name || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Unit No.</Typography>
            <Typography variant="body1">{resident.unit_number || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Phone No.</Typography>
            <Typography variant="body1">{resident.contact_number || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Email</Typography>
            <Typography variant="body1">{resident.email || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Role</Typography>
            <Typography variant="body1">{resident.role === 'union_admin' ? 'Union Admin' : 'Resident'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <Box>
              <Chip
                size="small"
                label={resident.is_active !== false ? 'Active' : 'Inactive'}
                color={resident.is_active !== false ? 'success' : 'default'}
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>Utilities</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">K-Electric</Typography>
            <Typography variant="body1">{resident.k_electric_account || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Gas</Typography>
            <Typography variant="body1">{resident.gas_account || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Water</Typography>
            <Typography variant="body1">{resident.water_account || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Phone/TV</Typography>
            <Typography variant="body1">{resident.phone_tv_account || '-'}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>Vehicles</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">Cars No.</Typography>
            <Typography variant="body1">{resident.number_of_cars ?? '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">Make &amp; Model</Typography>
            <Typography variant="body1">{resident.car_make_model || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">License Plate</Typography>
            <Typography variant="body1">{resident.license_plate || '-'}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>Defaulter</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <Typography variant="body1">
              {resident.defaulter_status
                ? `${resident.defaulter_status}${resident.defaulter_amount_due != null ? ` (Amount due: ${resident.defaulter_amount_due})` : ''}${resident.defaulter_months_overdue != null ? `, ${resident.defaulter_months_overdue} mo. overdue` : ''}`
                : 'Not a defaulter'}
            </Typography>
          </Grid>

          {(Array.isArray(resident.telephone_bills) && resident.telephone_bills.length > 0) ||
           (Array.isArray(resident.other_bills) && resident.other_bills.length > 0) ? (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>Bills</Typography>
              </Grid>
              {Array.isArray(resident.telephone_bills) && resident.telephone_bills.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Telephone</Typography>
                  <Typography variant="body1" component="span">
                    {resident.telephone_bills.map((b) => `${b.provider || 'N/A'} ${b.account_number || ''} (${b.amount ?? 0})`).join(', ') || '-'}
                  </Typography>
                </Grid>
              )}
              {Array.isArray(resident.other_bills) && resident.other_bills.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Other</Typography>
                  <Typography variant="body1" component="span">
                    {resident.other_bills.map((b) => `${b.type || 'N/A'} ${b.provider || ''} (${b.amount ?? 0})`).join(', ') || '-'}
                  </Typography>
                </Grid>
              )}
            </>
          ) : null}

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>Family Members</Typography>
          </Grid>
          <Grid item xs={12}>
            {familyMembers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No family members added.</Typography>
            ) : (
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {familyMembers.map((fm) => (
                  <li key={fm.id}>
                    <Typography variant="body1">{fm.name}{fm.relation ? ` (${fm.relation})` : ''}</Typography>
                  </li>
                ))}
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'flex-start', mt: 1 }}>
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
    </Container>
  )
}

export default ResidentDetails
