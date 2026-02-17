import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LockIcon from '@mui/icons-material/Lock'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { userApi } from '@/api/userApi'
import { apartmentApi } from '@/api/apartmentApi'
import { propertyApi } from '@/api/propertyApi'
import { superAdminApi } from '@/api/superAdminApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

// Common areas per city (shown in Area dropdown when API has none; Pakistan)
const AREAS_BY_CITY = {
  Karachi: ['DHA', 'Clifton', 'Gulshan-e-Iqbal', 'Defence', 'Saddar', 'Korangi', 'North Nazimabad', 'Malir', 'Landhi', 'Gulistan-e-Jauhar', 'Bahria Town'],
  Lahore: ['DHA', 'Gulberg', 'Model Town', 'Johar Town', 'Bahria Town', 'Wapda Town', 'Ferozepur Road', 'Cantt', 'Garden Town', 'Iqbal Town'],
  Islamabad: ['F-6', 'F-7', 'F-8', 'E-11', 'DHA', 'Bahria Town', 'Blue Area', 'Sector G-9', 'Sector I-8', 'Margalla'],
  Rawalpindi: ['DHA', 'Bahria Town', 'Satellite Town', 'Raja Bazaar', 'Saddar', 'Westridge', 'Lalazar'],
  Faisalabad: ['DHA', 'Satellite Town', 'Madina Town', 'Jinnah Colony', 'Lyallpur Town', 'Samanabad'],
  Multan: ['DHA', 'Bosan Road', 'Shah Rukn-e-Alam', 'Housing Scheme', 'Gulgasht'],
  Peshawar: ['University Town', 'Hayatabad', 'Cantonment', 'Saddar', 'Gulbahar'],
  Quetta: ['Jinnah Town', 'Satellite Town', 'Sariab Road', 'Cantonment'],
  Hyderabad: ['Qasimabad', 'Latifabad', 'Hirabad', 'Saddar'],
  Gujranwala: ['DHA', 'Satellite Town', 'Model Town', 'Nandipura'],
  Sialkot: ['DHA', 'Satellite Town', 'Cantt'],
  Other: ['Central', 'North', 'South', 'East', 'West'],
}

const getValidationSchema = (isEdit, currentUserRole) => {
  const baseSchema = {
    email: Yup.string().email('Invalid email').required('Email is required'),
    name: Yup.string().required('Name is required'),
    role: Yup.string().required('Role is required'),
  }

  // Password required only on create
  if (!isEdit) {
    baseSchema.password = Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  }

  // Apartment: required for union_admin/resident/staff when current user is union_admin; optional for super_admin (can assign later from leads or Add Apartment)
  baseSchema.society_apartment_id = Yup.number().when('role', {
    is: (role) => role === 'union_admin' || role === 'resident' || role === 'staff',
    then: (schema) =>
      currentUserRole === 'super_admin' ? schema.nullable() : schema.required('Apartment is required'),
    otherwise: (schema) => schema.nullable(),
  })

  // Unit optional (only for residents)
  baseSchema.unit_id = Yup.number().nullable()
  baseSchema.cnic = Yup.string().nullable()
  baseSchema.contact_number = Yup.string().nullable()
  baseSchema.emergency_contact = Yup.string().nullable()
  baseSchema.address = Yup.string().nullable()
  baseSchema.city = Yup.string().nullable()
  baseSchema.postal_code = Yup.string().nullable()
  baseSchema.work_employer = Yup.string().nullable()
  baseSchema.work_title = Yup.string().nullable()
  baseSchema.work_phone = Yup.string().nullable()

  return Yup.object(baseSchema)
}

const passwordSchema = Yup.object({
  new_password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const Users = () => {
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const roleFilterDefaultSet = useRef(false)

  // Default Role Filter to "Union Admin" for super admin only (once on load)
  useEffect(() => {
    if (currentUser?.role === 'super_admin' && !roleFilterDefaultSet.current) {
      roleFilterDefaultSet.current = true
      setRoleFilter('union_admin')
    }
  }, [currentUser?.role])

  const [openDialog, setOpenDialog] = useState(false)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedSocietyId, setSelectedSocietyId] = useState(null)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedBlockId, setSelectedBlockId] = useState('')
  /** Email uniqueness: null | 'checking' | 'available' | 'taken' */
  const [emailCheckStatus, setEmailCheckStatus] = useState(null)
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [actionMenuRow, setActionMenuRow] = useState(null)
  const [activatingSubscriptionId, setActivatingSubscriptionId] = useState(null)
  const [createJobRow, setCreateJobRow] = useState(null)
  const [selectedPlanIdForJob, setSelectedPlanIdForJob] = useState('')
  const [givingSubscription, setGivingSubscription] = useState(false)

  const { data, isLoading, mutate } = useSWR(
    ['/users', page, limit, search, roleFilter],
    () => userApi.getAll({ page, limit, search, role: roleFilter }).then(res => res.data)
  )

  // Cities list (Super Admin - for City → Area → Apartment cascading)
  const { data: citiesData } = useSWR(
    currentUser?.role === 'super_admin' ? '/societies/cities' : null,
    () => apartmentApi.getCities().then(res => res.data)
  )
  const cities = citiesData?.data ?? []

  // Areas list (Super Admin - filtered by selected city)
  const { data: areasData } = useSWR(
    currentUser?.role === 'super_admin' && selectedCity ? ['/societies/areas', selectedCity] : null,
    () => apartmentApi.getAreas(selectedCity).then(res => res.data)
  )
  const areasFromApi = areasData?.data ?? []
  // Merge API areas with static areas for this city so dropdown always has options
  const areas = selectedCity
    ? [...new Set([...areasFromApi, ...(AREAS_BY_CITY[selectedCity] || AREAS_BY_CITY.Other || [])])].sort((a, b) => a.localeCompare(b))
    : areasFromApi

  // Union admins with subscription (Super Admin - for Activate subscription in Actions)
  const { data: adminsWithSubsData, mutate: mutateAdminsWithSubs } = useSWR(
    currentUser?.role === 'super_admin' ? '/super-admin/subscription/admins' : null,
    () => superAdminApi.getAdminsWithSubscriptions().then(res => res.data)
  )
  const subscriptionByUserId = useMemo(() => {
    const list = adminsWithSubsData?.data ?? []
    return Object.fromEntries(list.filter((a) => a.subscription_id).map((a) => [a.id, { subscription_id: a.subscription_id, subscription_status: a.subscription_status }]))
  }, [adminsWithSubsData])
  const adminsWithSubsList = adminsWithSubsData?.data ?? []

  // Apartment detail for Create Job dialog (apartment + union admin details)
  const { data: createJobApartmentData } = useSWR(
    createJobRow?.society_apartment_id ? ['/apartment-detail', createJobRow.society_apartment_id] : null,
    () => apartmentApi.getById(createJobRow.society_apartment_id).then(res => res.data)
  )
  const createJobApartment = createJobApartmentData?.data

  // Subscription plans for Create Job "Give subscription" dropdown
  const { data: subscriptionPlansData } = useSWR(
    createJobRow && currentUser?.role === 'super_admin' ? '/super-admin/subscription-plans' : null,
    () => superAdminApi.getSubscriptionPlans().then(res => res.data)
  )
  const subscriptionPlans = subscriptionPlansData?.data ?? []

  // Blocks by city/area (for City → Area → Block → Apartment flow)
  const { data: blocksByLocationData } = useSWR(
    currentUser?.role === 'super_admin' && selectedCity && selectedArea !== undefined
      ? ['/properties/blocks-by-location', selectedCity, selectedArea]
      : null,
    () =>
      propertyApi.getBlocks({ city: selectedCity, area: selectedArea || '' }).then(res => res.data)
  )
  const blocksByLocation = blocksByLocationData?.data ?? []

  // Apartments by city/area (fallback when no blocks; Super Admin)
  const { data: apartmentsByLocationData } = useSWR(
    currentUser?.role === 'super_admin' && selectedCity ? ['/societies/by-location', selectedCity, selectedArea] : null,
    () => apartmentApi.getAll({ city: selectedCity, area: selectedArea || undefined, limit: 200 }).then(res => res.data)
  )
  const apartmentsByLocation = apartmentsByLocationData?.data ?? []

  // Fetch societies (for Union Admin - their own society; for Super Admin fallback when no cascading)
  const { data: societiesData } = useSWR(
    currentUser?.role === 'super_admin' ? (selectedCity ? null : '/societies') : 
    (currentUser?.role === 'union_admin' && currentUser?.society_apartment_id ? `/societies/${currentUser.society_apartment_id}` : null),
    () => {
      if (currentUser?.role === 'super_admin') {
        return apartmentApi.getAll({ limit: 100 }).then(res => res.data)
      } else if (currentUser?.role === 'union_admin' && currentUser?.society_apartment_id) {
        return apartmentApi.getById(currentUser.society_apartment_id).then(res => ({
          data: [res.data.data]
        }))
      }
      return null
    }
  )

  // Fetch all societies for display in table (Super Admin only)
  const { data: allSocietiesData } = useSWR(
    currentUser?.role === 'super_admin' ? '/societies/all' : null,
    () => apartmentApi.getAll({ limit: 1000 }).then(res => res.data)
  )

  // Leads (apartments) for "Select Lead" in Add User – only when dialog open and super_admin
  const { data: leadsData } = useSWR(
    openDialog && currentUser?.role === 'super_admin' ? '/societies/leads' : null,
    () => apartmentApi.getAll({ limit: 500 }).then(res => res.data)
  )
  const { data: unionAdminsData } = useSWR(
    openDialog && currentUser?.role === 'super_admin' ? '/users/union-admins-for-leads' : null,
    () => userApi.getAll({ role: 'union_admin', limit: 500 }).then(res => res.data)
  )
  const assignedSocietyIds = new Set(
    (unionAdminsData?.data ?? [])
      .map((u) => u.society_apartment_id)
      .filter(Boolean)
  )
  const unassignedLeads = (leadsData?.data ?? []).filter((a) => !assignedSocietyIds.has(a.id))

  // Fetch units (filtered by selected society)
  const { data: unitsData } = useSWR(
    selectedSocietyId ? ['/units', selectedSocietyId] : null,
    () => propertyApi.getUnits({ society_id: selectedSocietyId }).then(res => res.data)
  )

  // When editing a user with an apartment, set City/Area/Block for cascading (Super Admin)
  useEffect(() => {
    if (!openDialog || !editingUser?.society_apartment_id || currentUser?.role !== 'super_admin') return
    const list = allSocietiesData?.data ?? societiesData?.data ?? []
    const apartment = (Array.isArray(list) ? list : []).find(a => a.id === editingUser.society_apartment_id)
    if (apartment) {
      if (apartment.city) setSelectedCity(apartment.city)
      if (apartment.area) setSelectedArea(apartment.area)
    }
  }, [openDialog, editingUser?.society_apartment_id, currentUser?.role, allSocietiesData?.data, societiesData?.data])

  // When blocks load and we're editing, select the block that matches user's apartment
  useEffect(() => {
    if (!editingUser?.society_apartment_id || blocksByLocation.length === 0) return
    const block = blocksByLocation.find(b => b.society_apartment_id === editingUser.society_apartment_id)
    if (block) setSelectedBlockId(String(block.id))
  }, [editingUser?.society_apartment_id, blocksByLocation])

  const handleOpenDialog = (user = null) => {
    setEditingUser(user)
    setEmailCheckStatus(null)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
    setSelectedSocietyId(null)
    setSelectedCity('')
    setSelectedArea('')
    setSelectedBlockId('')
    setEmailCheckStatus(null)
  }

  const handleOpenPasswordDialog = (user) => {
    setSelectedUser(user)
    setOpenPasswordDialog(true)
  }

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false)
    setSelectedUser(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!editingUser && emailCheckStatus === 'taken') {
        toast.error('This email is already registered. Please use a different email.')
        setSubmitting(false)
        return
      }
      // Prepare data for backend
      const submitData = { ...values }

      // Clean up empty strings - convert to null for optional fields
      const optionalFields = ['society_apartment_id', 'unit_id', 'cnic', 'contact_number', 'emergency_contact', 'address', 'city', 'postal_code', 'work_employer', 'work_title', 'work_phone']
      optionalFields.forEach(field => {
        if (submitData[field] === '' || submitData[field] === undefined) {
          submitData[field] = null
        }
        // Convert string numbers to integers
        if (submitData[field] && (field === 'society_apartment_id' || field === 'unit_id')) {
          submitData[field] = parseInt(submitData[field])
        }
      })

      // For Union Admin creating users, auto-assign their society if not provided
      if (!editingUser && currentUser?.role === 'union_admin' && !submitData.society_apartment_id) {
        submitData.society_apartment_id = currentUser.society_apartment_id
      }

      // For Super Admin, society_apartment_id can be null (for super_admin role)
      // For union_admin, resident, and staff, it must be set
      if (submitData.role === 'super_admin') {
        submitData.society_apartment_id = null
      }

      if (editingUser) {
        await userApi.update(editingUser.id, submitData)
        toast.success('User updated successfully')
      } else {
        await userApi.create(submitData)
        toast.success('User created successfully')
      }
      mutate()
      handleCloseDialog()
      setSelectedSocietyId(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePasswordUpdate = async (values, { setSubmitting }) => {
    try {
      await userApi.updatePassword(selectedUser.id, values)
      toast.success('Password updated successfully')
      handleClosePasswordDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password update failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, dismissToastId) => {
    if (dismissToastId) toast.dismiss(dismissToastId)
    try {
      await userApi.remove(id)
      toast.success('User deleted successfully')
      mutate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const confirmDelete = (id) => {
    toast.custom(
      (t) => (
        <Box
          sx={{
            background: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            minWidth: 280,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Delete this user?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button size="small" variant="outlined" onClick={() => toast.dismiss(t.id)}>
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleDelete(id, t.id)}
            >
              Delete
            </Button>
          </Box>
        </Box>
      ),
      { duration: Infinity }
    )
  }

  const handleActivateSubscription = async (subscriptionId) => {
    if (!subscriptionId) return
    setActivatingSubscriptionId(subscriptionId)
    setActionMenuAnchor(null)
    setActionMenuRow(null)
    try {
      await superAdminApi.updateSubscriptionStatus(subscriptionId, { status: 'active' })
      toast.success('Subscription activated. Client can now log in.')
      await Promise.all([mutate(), mutateAdminsWithSubs()])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to activate subscription')
    } finally {
      setActivatingSubscriptionId(null)
    }
  }

  const handleOpenCreateJob = (row) => {
    setActionMenuAnchor(null)
    setActionMenuRow(null)
    if (!row.society_apartment_id) {
      toast.error('User has no apartment assigned.')
      return
    }
    const hasExistingSubscription = !!subscriptionByUserId[row.id]?.subscription_id
    if (hasExistingSubscription) {
      toast.custom(
        (t) => (
          <Box
            sx={{
              background: (theme) => theme.palette.background.paper,
              color: (theme) => theme.palette.text.primary,
              p: 2,
              borderRadius: 2,
              boxShadow: 3,
              minWidth: 320,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Re-create Job?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This user already has a subscription. Do you want to open Create Job to renew or update it?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button size="small" variant="outlined" onClick={() => toast.dismiss(t.id)}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  setCreateJobRow(row)
                  setSelectedPlanIdForJob('')
                  toast.dismiss(t.id)
                }}
              >
                Open
              </Button>
            </Box>
          </Box>
        ),
        { duration: Infinity }
      )
      return
    }
    setCreateJobRow(row)
    setSelectedPlanIdForJob('')
  }

  const doGiveSubscriptionForMonth = async () => {
    if (!createJobRow?.society_apartment_id || !createJobRow?.id) return
    setGivingSubscription(true)
    try {
      const planId = selectedPlanIdForJob || subscriptionPlans.find((p) => p.is_active)?.id || null
      await superAdminApi.createSubscription({
        user_id: createJobRow.id,
        society_apartment_id: createJobRow.society_apartment_id,
        plan_id: planId || undefined,
      })
      const nextBilling = new Date()
      nextBilling.setMonth(nextBilling.getMonth() + 1)
      toast.success(`Subscription set. Next billing date: ${nextBilling.toLocaleDateString()}.`)
      await Promise.all([mutate(), mutateAdminsWithSubs()])
      setCreateJobRow(null)
      setSelectedPlanIdForJob('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to give subscription')
    } finally {
      setGivingSubscription(false)
    }
  }

  const handleGiveSubscriptionForMonth = async () => {
    if (!createJobRow?.society_apartment_id || !createJobRow?.id) return
    const hasExistingSubscription = !!subscriptionByUserId[createJobRow.id]?.subscription_id
    if (hasExistingSubscription) {
      toast.custom(
        (t) => (
          <Box
            sx={{
              background: (theme) => theme.palette.background.paper,
              color: (theme) => theme.palette.text.primary,
              p: 2,
              borderRadius: 2,
              boxShadow: 3,
              minWidth: 320,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Update existing subscription?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This user already has a subscription. This will update the plan and set next billing date to one month from today.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button size="small" variant="outlined" onClick={() => toast.dismiss(t.id)}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  toast.dismiss(t.id)
                  doGiveSubscriptionForMonth()
                }}
              >
                Yes, update
              </Button>
            </Box>
          </Box>
        ),
        { duration: Infinity }
      )
      return
    }
    await doGiveSubscriptionForMonth()
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'error'
      case 'union_admin':
        return 'primary'
      case 'resident':
        return 'success'
      case 'staff':
        return 'info'
      default:
        return 'default'
    }
  }

  const getSocietyName = (societyId) => {
    if (!societyId) return 'N/A'
    const society = allSocietiesData?.data?.find(s => s.id === societyId)
    return society?.name || `Apartment #${societyId}`
  }

  const canOpenCreateJob = (row) =>
    currentUser?.role === 'super_admin' && row.role === 'union_admin' && row.society_apartment_id

  const columns = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 140,
      render: (row) => {
        const clickable = canOpenCreateJob(row)
        return clickable ? (
          <Typography
            variant="body2"
            sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => handleOpenCreateJob(row)}
          >
            {row.name || '—'}
          </Typography>
        ) : (
          <Typography variant="body2">{row.name || '—'}</Typography>
        )
      },
    },
    { id: 'email', label: 'Email', minWidth: 200 },
    {
      id: 'role',
      label: 'Role',
      minWidth: 120,
      render: (row) => (
        <Chip
          label={row.role === 'super_admin' ? 'Super Admin' : row.role === 'union_admin' ? 'Union Admin' : row.role === 'staff' ? 'Staff' : 'Resident'}
          color={getRoleColor(row.role)}
          size="small"
        />
      ),
    },
    ...(currentUser?.role === 'super_admin' ? [{
      id: 'society_apartment_id',
      label: 'Apartment',
      minWidth: 140,
      render: (row) => {
        const label = row.society_apartment_id ? getSocietyName(row.society_apartment_id) : 'N/A'
        const clickable = canOpenCreateJob(row)
        return clickable ? (
          <Typography
            variant="body2"
            sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => handleOpenCreateJob(row)}
          >
            {label}
          </Typography>
        ) : (
          <Typography variant="body2">{label}</Typography>
        )
      },
    }] : []),
    {
      id: 'is_active',
      label: 'Status',
      minWidth: 90,
      render: (row) => (
        <Chip
          label={row.is_active ? 'Active' : 'Inactive'}
          color={row.is_active ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      minWidth: 56,
      render: (row) => (
        <Tooltip title="Actions">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              setActionMenuAnchor(e.currentTarget)
              setActionMenuRow(row)
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  const initialValues = editingUser
    ? {
        email: editingUser.email || '',
        name: editingUser.name || '',
        role: editingUser.role || (currentUser?.role === 'super_admin' ? 'union_admin' : 'resident'),
        society_apartment_id: editingUser.society_apartment_id || null,
        unit_id: editingUser.unit_id || null,
        cnic: editingUser.cnic || '',
        contact_number: editingUser.contact_number || '',
        emergency_contact: editingUser.emergency_contact || '',
        address: editingUser.address || '',
        city: editingUser.city || '',
        postal_code: editingUser.postal_code || '',
        work_employer: editingUser.work_employer || '',
        work_title: editingUser.work_title || '',
        work_phone: editingUser.work_phone || '',
        is_active: editingUser.is_active !== undefined ? editingUser.is_active : true,
      }
    : {
        email: '',
        password: '',
        name: '',
        role: currentUser?.role === 'super_admin' ? 'union_admin' : 'resident',
        society_apartment_id: currentUser?.role === 'union_admin' ? currentUser.society_apartment_id : null,
        unit_id: null,
        cnic: '',
        contact_number: '',
        emergency_contact: '',
        address: '',
        city: '',
        postal_code: '',
        work_employer: '',
        work_title: '',
        work_phone: '',
        is_active: true,
      }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Users Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Role Filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="super_admin">Super Admin</MenuItem>
          <MenuItem value="union_admin">Union Admin</MenuItem>
          <MenuItem value="resident">Resident</MenuItem>
          <MenuItem value="staff">Staff</MenuItem>
        </TextField>
      </Box>

      <DataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        pagination={data?.pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit)
          setPage(1)
        }}
      />

      {/* Row actions menu (single instance) */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={() => { setActionMenuAnchor(null); setActionMenuRow(null) }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {actionMenuRow && (
          <>
            <MenuItem
              onClick={() => {
                setActionMenuAnchor(null)
                setActionMenuRow(null)
                handleOpenDialog(actionMenuRow)
              }}
            >
              <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setActionMenuAnchor(null)
                setActionMenuRow(null)
                handleOpenPasswordDialog(actionMenuRow)
              }}
            >
              <ListItemIcon><LockIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Change Password</ListItemText>
            </MenuItem>
            {currentUser?.role === 'super_admin' && actionMenuRow.role === 'union_admin' && (subscriptionByUserId[actionMenuRow.id]?.subscription_status || '').toLowerCase() === 'pending' && subscriptionByUserId[actionMenuRow.id]?.subscription_id && (
              <MenuItem
                onClick={() => handleActivateSubscription(subscriptionByUserId[actionMenuRow.id].subscription_id)}
                disabled={activatingSubscriptionId === subscriptionByUserId[actionMenuRow.id]?.subscription_id}
              >
                <ListItemIcon><PlayArrowIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Activate subscription</ListItemText>
              </MenuItem>
            )}
            {currentUser?.role === 'super_admin' && actionMenuRow.role === 'union_admin' && actionMenuRow.society_apartment_id && (
              <MenuItem onClick={() => handleOpenCreateJob(actionMenuRow)}>
                <ListItemIcon><WorkOutlineIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Create Job</ListItemText>
              </MenuItem>
            )}
            {actionMenuRow.id !== currentUser?.id && (
              <MenuItem
                onClick={() => {
                  setActionMenuAnchor(null)
                  setActionMenuRow(null)
                  confirmDelete(actionMenuRow.id)
                }}
                sx={{ color: 'error.main' }}
              >
                <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      {/* Create Job dialog – Apartment & Union Admin details + package + Give subscription */}
      <Dialog
        open={Boolean(createJobRow)}
        onClose={() => { setCreateJobRow(null); setSelectedPlanIdForJob('') }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Job — Apartment &amp; Union Admin details</DialogTitle>
        <DialogContent dividers>
          {createJobRow && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              {adminsWithSubsList.find((a) => a.id === createJobRow.id)?.subscription_id && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 1 }}>
                    This user already has a subscription. Giving subscription again will update the plan and set next billing date to one month from today.
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Apartment</Typography>
              </Grid>
              {createJobApartment ? (
                <>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Apartment Name</Typography>
                    <Typography variant="body1">{createJobApartment.name || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography variant="body1">{createJobApartment.address || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">City</Typography>
                    <Typography variant="body1">{createJobApartment.city || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Area</Typography>
                    <Typography variant="body1">{createJobApartment.area || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Total Blocks</Typography>
                    <Typography
                      variant="body1"
                      sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => {
                        setCreateJobRow(null)
                        navigate(`/super-admin/blocks?society_id=${createJobRow.society_apartment_id}`)
                      }}
                    >
                      {createJobApartment.total_blocks ?? '—'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Total Floors</Typography>
                    <Typography
                      variant="body1"
                      sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => {
                        setCreateJobRow(null)
                        navigate(`/super-admin/floors?society_id=${createJobRow.society_apartment_id}`)
                      }}
                    >
                      {createJobApartment.total_floors ?? '—'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Total Units</Typography>
                    <Typography
                      variant="body1"
                      sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => {
                        setCreateJobRow(null)
                        navigate(`/super-admin/units?society_id=${createJobRow.society_apartment_id}`)
                      }}
                    >
                      {createJobApartment.total_units ?? '—'}
                    </Typography>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <CircularProgress size={24} />
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Union Admin</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Name</Typography>
                <Typography variant="body1">{createJobRow.name || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{createJobRow.email || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                <Typography variant="body1">{createJobRow.contact_number || '—'}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Package</Typography>
              </Grid>
              {(() => {
                const adminDetail = adminsWithSubsList.find((a) => a.id === createJobRow.id)
                const planName = adminDetail?.plan_name
                const planAmount = adminDetail?.plan_amount
                const nextBilling = adminDetail?.next_billing_date
                return (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Plan</Typography>
                      <Typography variant="body1">
                        {planName ? `${planName} (${planAmount ?? 0} PKR)` : '—'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Next Billing Date</Typography>
                      <Typography variant="body1">
                        {nextBilling ? new Date(nextBilling).toLocaleDateString() : '—'}
                      </Typography>
                    </Grid>
                  </>
                )
              })()}

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Give subscription (1 month)</Typography>
                <TextField
                  fullWidth
                  select
                  size="small"
                  // label="Select plan"
                  value={selectedPlanIdForJob}
                  onChange={(e) => setSelectedPlanIdForJob(e.target.value)}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="">Default / first active plan</MenuItem>
                  {subscriptionPlans.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name} — {p.amount ?? 0} PKR
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleGiveSubscriptionForMonth}
                  disabled={givingSubscription}
                >
                  {givingSubscription ? <CircularProgress size={20} /> : 'Give subscription for 1 month'}
                </Button>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                  Next billing will be set to one month from today.
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCreateJobRow(null); setSelectedPlanIdForJob('') }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          key={editingUser ? `edit-${editingUser.id}` : 'add-new'}
          initialValues={initialValues}
          validationSchema={getValidationSchema(!!editingUser, currentUser?.role)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
            // Update selectedSocietyId when society changes
            const handleSocietyChange = (e) => {
              const newSocietyId = e.target.value ? parseInt(e.target.value) : null
              setSelectedSocietyId(newSocietyId)
              handleChange(e)
              // Reset unit when society changes
              if (newSocietyId !== values.society_apartment_id) {
                setFieldValue('unit_id', null)
              }
            }

            // Set selectedSocietyId when editing user
            if (editingUser && !selectedSocietyId && values.society_apartment_id) {
              setSelectedSocietyId(values.society_apartment_id)
            }

            // Determine if society field should be shown and editable
            // Apartment required for union_admin, resident, and staff roles
            const showSocietyField = values.role === 'union_admin' || values.role === 'resident' || values.role === 'staff'
            const isSocietyEditable = currentUser?.role === 'super_admin' || !editingUser
            const isSocietyDisabled = currentUser?.role === 'union_admin' && !editingUser
            const useCascading = currentUser?.role === 'super_admin' && showSocietyField
            const apartmentOptions = useCascading ? apartmentsByLocation : (societiesData?.data ?? [])

            return (
              <Form autoComplete="off">
                <DialogTitle>
                  {editingUser ? 'Edit User' : 'Add New User'}
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {!editingUser && currentUser?.role === 'super_admin' && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }} color="text.secondary">
                          Select Lead (Apartment)
                        </Typography>
                        <TextField
                          fullWidth
                          select
                          // label="Assign to lead (apartments without Union Admin)"
                          value={values.society_apartment_id ?? ''}
                          onChange={(e) => {
                            const id = e.target.value ? parseInt(e.target.value, 10) : null
                            const lead = unassignedLeads.find((l) => l.id === id)
                            setFieldValue('society_apartment_id', id)
                            setFieldValue('unit_id', null)
                            setSelectedSocietyId(id)
                            if (lead) {
                              if (lead.union_admin_name) setFieldValue('name', lead.union_admin_name)
                              if (lead.union_admin_email) setFieldValue('email', lead.union_admin_email)
                              if (lead.union_admin_phone) setFieldValue('contact_number', lead.union_admin_phone)
                              if (lead.city) setSelectedCity(lead.city)
                              if (lead.area !== undefined) setSelectedArea(lead.area || '')
                              setFieldValue('role', 'union_admin')
                            } else {
                              setSelectedCity('')
                              setSelectedArea('')
                            }
                          }}
                          SelectProps={{ displayEmpty: true }}
                        >
                          <MenuItem value="">— None (create new without lead) —</MenuItem>
                          {unassignedLeads.map((lead) => (
                            <MenuItem key={lead.id} value={lead.id}>
                              {lead.name}
                              {lead.city ? ` — ${lead.city}` : ''}
                              {lead.area ? `, ${lead.area}` : ''}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="User Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={(e) => {
                          setEmailCheckStatus(null)
                          handleChange(e)
                        }}
                        onBlur={async (e) => {
                          handleBlur(e)
                          const email = (values.email || '').trim()
                          if (!email || !!editingUser) return
                          const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                          if (!validEmailRegex.test(email)) return
                          setEmailCheckStatus('checking')
                          try {
                            const res = await userApi.checkEmail(email, editingUser?.id)
                            setEmailCheckStatus(res?.data?.available ? 'available' : 'taken')
                          } catch {
                            setEmailCheckStatus(null)
                          }
                        }}
                        error={(touched.email && !!errors.email) || emailCheckStatus === 'taken'}
                        helperText={
                          (touched.email && errors.email) ||
                          (emailCheckStatus === 'taken' ? 'This email is already registered in the system.' : null)
                        }
                        disabled={!!editingUser}
                        autoComplete="off"
                        InputProps={{
                          endAdornment:
                            emailCheckStatus === 'checking' ? (
                              <InputAdornment position="end">
                                <CircularProgress size={22} />
                              </InputAdornment>
                            ) : emailCheckStatus === 'available' ? (
                              <InputAdornment position="end">
                                <CheckCircleIcon color="success" fontSize="small" titleAccess="Email is available" />
                              </InputAdornment>
                            ) : emailCheckStatus === 'taken' ? (
                              <InputAdornment position="end">
                                <ErrorIcon color="error" fontSize="small" titleAccess="Email already registered" />
                              </InputAdornment>
                            ) : null,
                        }}
                      />
                    </Grid>
                    {!editingUser && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          type="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.password && !!errors.password}
                          helperText={touched.password && errors.password}
                          autoComplete="new-password"
                        />
                      </Grid>
                    )}
                    {/* Role selection: hidden for super_admin (always union_admin) */}
                    {currentUser?.role !== 'super_admin' && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          label="Role"
                          name="role"
                          value={values.role}
                          onChange={(e) => {
                            handleChange(e)
                            if (e.target.value === 'super_admin') {
                              setFieldValue('society_apartment_id', null)
                              setFieldValue('unit_id', null)
                              setSelectedSocietyId(null)
                              setSelectedCity('')
                              setSelectedArea('')
                            }
                          }}
                          onBlur={handleBlur}
                          error={touched.role && !!errors.role}
                          helperText={touched.role && errors.role}
                        >
                          <MenuItem value="resident">Resident</MenuItem>
                          <MenuItem value="union_admin">Union Admin</MenuItem>
                          <MenuItem value="staff">Staff</MenuItem>
                        </TextField>
                      </Grid>
                    )}
                    {showSocietyField && useCascading && (
                      <>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            select
                            label="City"
                            value={selectedCity}
                            onChange={(e) => {
                              setSelectedCity(e.target.value)
                              setSelectedArea('')
                              setSelectedBlockId('')
                              setFieldValue('society_apartment_id', null)
                              setSelectedSocietyId(null)
                            }}
                            disabled={isSocietyDisabled || !isSocietyEditable}
                          >
                            <MenuItem value="">Select City</MenuItem>
                            {cities.map((city) => (
                              <MenuItem key={city} value={city}>{city}</MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            select
                            label="Area"
                            value={areas.length > 0 ? selectedArea : ''}
                            onChange={(e) => {
                              setSelectedArea(e.target.value)
                              setSelectedBlockId('')
                              setFieldValue('society_apartment_id', null)
                              setSelectedSocietyId(null)
                            }}
                            disabled={!selectedCity || isSocietyDisabled || !isSocietyEditable}
                            helperText={
                              areas.length > 0
                                ? "Select an area or leave 'All areas' to see all apartments in this city."
                                : 'No areas in this city yet; all apartments listed below.'
                            }
                          >
                            <MenuItem value="">All areas</MenuItem>
                            {areas.map((area) => (
                              <MenuItem key={area} value={area}>{area}</MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        {blocksByLocation.length > 0 && (
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              select
                              label="Block"
                              value={selectedBlockId}
                              onChange={(e) => {
                                const blockId = e.target.value
                                setSelectedBlockId(blockId)
                                const block = blocksByLocation.find((b) => String(b.id) === blockId)
                                if (block) {
                                  setFieldValue('society_apartment_id', block.society_apartment_id)
                                  setSelectedSocietyId(block.society_apartment_id)
                                }
                              }}
                              disabled={!selectedCity || isSocietyDisabled || !isSocietyEditable}
                              helperText="Select a block; apartment is set automatically."
                            >
                              <MenuItem value="">Select Block</MenuItem>
                              {blocksByLocation.map((block) => (
                                <MenuItem key={block.id} value={String(block.id)}>
                                  {block.name} ({block.society_name})
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                        )}
                        <Grid item xs={12} sm={blocksByLocation.length > 0 ? 6 : 4}>
                          {blocksByLocation.length > 0 ? (
                            <TextField
                              fullWidth
                              label="Apartment"
                              value={
                                selectedBlockId
                                  ? (blocksByLocation.find((b) => String(b.id) === selectedBlockId)?.society_name || '')
                                  : ''
                              }
                              disabled
                              helperText="Set by selected block."
                            />
                          ) : (
                            <TextField
                              fullWidth
                              select
                              label="Apartment"
                              name="society_apartment_id"
                              value={values.society_apartment_id || ''}
                              onChange={handleSocietyChange}
                              onBlur={handleBlur}
                              error={touched.society_apartment_id && !!errors.society_apartment_id}
                              helperText={(touched.society_apartment_id && errors.society_apartment_id) || (currentUser?.role === 'super_admin' ? 'Optional — assign later from leads or Add Apartment' : null)}
                              disabled={!selectedCity || isSocietyDisabled || !isSocietyEditable}
                              required={currentUser?.role !== 'super_admin'}
                            >
                              <MenuItem value="">Select Apartment</MenuItem>
                              {apartmentOptions.map((society) => (
                                <MenuItem key={society.id} value={society.id}>
                                  {society.name}{society.area ? ` (${society.area})` : ''}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        </Grid>
                      </>
                    )}
                    {showSocietyField && !useCascading && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          label="Apartment"
                          name="society_apartment_id"
                          value={values.society_apartment_id || ''}
                          onChange={handleSocietyChange}
                          onBlur={handleBlur}
                          error={touched.society_apartment_id && !!errors.society_apartment_id}
                          helperText={(touched.society_apartment_id && errors.society_apartment_id) || (currentUser?.role === 'super_admin' ? 'Optional — assign later from leads or Add Apartment' : null)}
                          disabled={isSocietyDisabled || !isSocietyEditable}
                          required={currentUser?.role !== 'super_admin'}
                        >
                          <MenuItem value="">Select Apartment</MenuItem>
                          {(societiesData?.data ?? []).map((society) => (
                            <MenuItem key={society.id} value={society.id}>
                              {society.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    )}
                    {values.role === 'resident' && selectedSocietyId && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          label="Unit (Optional)"
                          name="unit_id"
                          value={values.unit_id || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.unit_id && !!errors.unit_id}
                          helperText={touched.unit_id && errors.unit_id}
                        >
                          <MenuItem value="">No Unit</MenuItem>
                          {unitsData?.data?.map((unit) => (
                            <MenuItem key={unit.id} value={unit.id}>
                              {unit.unit_number} {unit.block_name ? `(${unit.block_name})` : ''}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    )}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Contact Number"
                        name="contact_number"
                        value={values.contact_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.contact_number && !!errors.contact_number}
                        helperText={touched.contact_number && errors.contact_number}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Emergency Contact"
                        name="emergency_contact"
                        value={values.emergency_contact}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.emergency_contact && !!errors.emergency_contact}
                        helperText={touched.emergency_contact && errors.emergency_contact}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="CNIC"
                        name="cnic"
                        value={values.cnic}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.cnic && !!errors.cnic}
                        helperText={touched.cnic && errors.cnic}
                        placeholder="e.g., 12345-1234567-1"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
                        Work Information (optional)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Employer"
                        name="work_employer"
                        value={values.work_employer}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.work_employer && !!errors.work_employer}
                        helperText={touched.work_employer && errors.work_employer}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        name="work_title"
                        value={values.work_title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.work_title && !!errors.work_title}
                        helperText={touched.work_title && errors.work_title}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Work Phone"
                        name="work_phone"
                        value={values.work_phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.work_phone && !!errors.work_phone}
                        helperText={touched.work_phone && errors.work_phone}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
                        Address Information (optional)
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.address && !!errors.address}
                        helperText={touched.address && errors.address}
                        placeholder="Street, building, area"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.city && !!errors.city}
                        helperText={touched.city && errors.city}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Postal Code"
                        name="postal_code"
                        value={values.postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.postal_code && !!errors.postal_code}
                        helperText={touched.postal_code && errors.postal_code}
                      />
                    </Grid>
                    {editingUser && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          label="Status"
                          name="is_active"
                          value={values.is_active}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <MenuItem value={true}>Active</MenuItem>
                          <MenuItem value={false}>Inactive</MenuItem>
                        </TextField>
                      </Grid>
                    )}
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {editingUser ? 'Update' : 'Create'}
                  </Button>
                </DialogActions>
              </Form>
            )
          }}
        </Formik>
      </Dialog>

      {/* Password Update Dialog */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={{ new_password: '' }}
          validationSchema={passwordSchema}
          onSubmit={handlePasswordUpdate}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>Change Password</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      User: {selectedUser?.name} ({selectedUser?.email})
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="new_password"
                      type="password"
                      value={values.new_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.new_password && !!errors.new_password}
                      helperText={touched.new_password && errors.new_password}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePasswordDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Update Password
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default Users
