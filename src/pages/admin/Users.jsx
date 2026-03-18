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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { ROUTES } from '@/utils/constants'
import { userApi } from '@/api/userApi'
import { apartmentApi } from '@/api/apartmentApi'
import { propertyApi } from '@/api/propertyApi'
import { superAdminApi } from '@/api/superAdminApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const getValidationSchema = (isEdit, currentUserRole, passwordOptional = false) => {
  const isUnionAdminEmployee = currentUserRole === 'union_admin'
  const baseSchema = {
    email: isUnionAdminEmployee
      ? Yup.string().nullable()
      : Yup.string().email('Invalid email').required('Email is required'),
    name: Yup.string().required('Name is required'),
    role: Yup.string().required('Role is required'),
  }

  // Password required only on create; optional when super_admin selects a lead that already has union admin details, or union_admin (employees don't log in)
  if (!isEdit) {
    baseSchema.password = (passwordOptional || isUnionAdminEmployee)
      ? Yup.string().nullable()
      : Yup.string()
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
  baseSchema.department = Yup.string().nullable()
  baseSchema.salary_rupees = Yup.number().nullable().transform((v, o) => (o === '' || o == null ? null : v))

  return Yup.object(baseSchema)
}

const passwordSchema = Yup.object({
  new_password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const EMPLOYEE_DESIGNATIONS = ['Supervisor', 'Guard', 'Sweeper', 'Other']

const Users = () => {
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()

  // Union admins use the dedicated Employees page
  useEffect(() => {
    if (currentUser?.role === 'union_admin') {
      navigate(ROUTES.ADMIN_EMPLOYEES, { replace: true })
    }
  }, [currentUser?.role, navigate])

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [designationFilter, setDesignationFilter] = useState('')
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
  /** Email uniqueness: null | 'checking' | 'available' | 'taken' */
  const [emailCheckStatus, setEmailCheckStatus] = useState(null)
  /** Toggle password visibility in Add/Edit User dialog */
  const [showPassword, setShowPassword] = useState(false)
  /** Toggle new password visibility in Change Password dialog */
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [actionMenuRow, setActionMenuRow] = useState(null)
  const [createJobRow, setCreateJobRow] = useState(null)
  const [createJobDialogMode, setCreateJobDialogMode] = useState('view') // 'view' | 'create'
  const [selectedPlanIdForJob, setSelectedPlanIdForJob] = useState('')
  const [givingSubscription, setGivingSubscription] = useState(false)

  const { data, isLoading, mutate } = useSWR(
    ['/users', page, limit, search, currentUser?.role === 'union_admin' ? 'staff' : roleFilter, designationFilter],
    () => {
      const params = { page, limit, search }
      if (currentUser?.role === 'union_admin') {
        params.role = 'staff'
        if (designationFilter) params.work_title = designationFilter
      } else {
        if (roleFilter) params.role = roleFilter
      }
      return userApi.getAll(params).then(res => res.data)
    }
  )

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

  // Fetch societies (for Union Admin - their own society; Super Admin uses allSocietiesData for apartment dropdown)
  const { data: societiesData } = useSWR(
    currentUser?.role === 'super_admin' ? null :
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

  const handleOpenDialog = () => {
    setEditingUser(null)
    setSelectedSocietyId(null)
    setEmailCheckStatus(null)
    setShowPassword(false)
    setOpenDialog(true)
  }

  /** Load full user from API so edit form has all saved fields (list rows omit some columns). */
  const handleOpenEditDialog = async (row) => {
    setActionMenuAnchor(null)
    setActionMenuRow(null)
    setEmailCheckStatus(null)
    setShowPassword(false)
    const toastId = toast.loading('Loading user…')
    try {
      const res = await userApi.getById(row.id)
      const full = res?.data?.data ?? res?.data
      if (!full?.id) {
        throw new Error('Invalid user response')
      }
      setEditingUser(full)
      setSelectedSocietyId(full.society_apartment_id ?? null)
      setOpenDialog(true)
      toast.dismiss(toastId)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to load user', { id: toastId })
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
    setSelectedSocietyId(null)
    setEmailCheckStatus(null)
    setShowPassword(false)
  }

  const handleOpenPasswordDialog = (user) => {
    setSelectedUser(user)
    setShowNewPassword(false)
    setOpenPasswordDialog(true)
  }

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false)
    setSelectedUser(null)
    setShowNewPassword(false)
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

      if (editingUser) {
        delete submitData.password
        // Avoid sending read-only join fields back as ambiguous updates
        delete submitData.designation
      }

      // Union admin employee form: do not send email/password (backend will use placeholders); omit work/address fields
      if (currentUser?.role === 'union_admin') {
        delete submitData.email
        delete submitData.password
        submitData.work_employer = null
        submitData.work_phone = null
        submitData.address = null
        submitData.city = null
        submitData.postal_code = null
      }

      // Clean up empty strings - convert to null for optional fields
      const optionalFields = [
        'society_apartment_id',
        'unit_id',
        'cnic',
        'contact_number',
        'emergency_contact',
        'address',
        'city',
        'postal_code',
        'work_employer',
        'work_title',
        'work_phone',
        'department',
      ]
      optionalFields.forEach((field) => {
        if (submitData[field] === '' || submitData[field] === undefined) {
          submitData[field] = null
        }
        if (submitData[field] && (field === 'society_apartment_id' || field === 'unit_id')) {
          submitData[field] = parseInt(submitData[field], 10)
        }
      })
      if (submitData.salary_rupees === '' || submitData.salary_rupees === undefined) {
        submitData.salary_rupees = null
      } else if (submitData.salary_rupees != null && submitData.salary_rupees !== '') {
        const n = Number(submitData.salary_rupees)
        submitData.salary_rupees = Number.isNaN(n) ? null : n
      }

      // Employees table uses designation; mirror work_title after cleanup
      if (currentUser?.role === 'union_admin') {
        submitData.designation = submitData.work_title || null
      } else if (editingUser && submitData.role === 'staff') {
        submitData.designation = submitData.work_title || null
      }

      // For Union Admin creating users, auto-assign their society if not provided
      if (!editingUser && currentUser?.role === 'union_admin' && !submitData.society_apartment_id) {
        submitData.society_apartment_id = currentUser.society_apartment_id
      }

      // Union admin page is employees only: always send role = staff
      if (currentUser?.role === 'union_admin') {
        submitData.role = 'staff'
      }

      // For Super Admin, society_apartment_id can be null (for super_admin role)
      // For union_admin, resident, and staff, it must be set
      if (submitData.role === 'super_admin') {
        submitData.society_apartment_id = null
      }

      // When Super Admin adds user by selecting a lead, create pending subscription so plan is set via Create Job, not automatically
      if (!editingUser && currentUser?.role === 'super_admin' && submitData.role === 'union_admin' && submitData.society_apartment_id) {
        submitData.subscription_status = 'pending'
      }

      if (editingUser) {
        await userApi.update(editingUser.id, submitData)
        toast.success(currentUser?.role === 'union_admin' ? 'Employee updated successfully' : 'User updated successfully')
      } else {
        const res = await userApi.create(submitData)
        const createdUser = res?.data?.data ?? res?.data
        toast.success(currentUser?.role === 'union_admin' ? 'Employee created successfully' : 'User created successfully')
        // Close Add User dialog first so it always dismisses; then refresh and optionally open Create Job
        handleCloseDialog()
        setSelectedSocietyId(null)
        mutate()
        const openedFromLead =
          currentUser?.role === 'super_admin' &&
          submitData.role === 'union_admin' &&
          submitData.society_apartment_id
        if (openedFromLead && createdUser?.id) {
          setTimeout(() => {
            setCreateJobDialogMode('create')
            setCreateJobRow({
              id: createdUser.id,
              name: createdUser.name,
              email: createdUser.email,
              role: createdUser.role,
              society_apartment_id: createdUser.society_apartment_id,
              unit_id: createdUser.unit_id ?? null,
              contact_number: submitData.contact_number ?? null,
            })
          }, 0)
        }
        return
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

  const handleOpenCreateJob = (row, mode = 'view') => {
    setActionMenuAnchor(null)
    setActionMenuRow(null)
    if (!row.society_apartment_id) {
      toast.error('User has no apartment assigned.')
      return
    }
    if (mode === 'view') {
      if (currentUser?.role === 'super_admin') {
        navigate(`${ROUTES.SUPER_ADMIN_VIEW_DETAILS}?user_id=${row.id}&from=users`)
        return
      }
      setCreateJobRow(row)
      setCreateJobDialogMode('view')
      setSelectedPlanIdForJob('')
      return
    }
    setCreateJobRow(row)
    setCreateJobDialogMode(mode)
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
      setCreateJobDialogMode('view')
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
            onClick={() => handleOpenCreateJob(row, 'view')}
          >
            {row.name || '—'}
          </Typography>
        ) : (
          <Typography variant="body2">{row.name || '—'}</Typography>
        )
      },
    },
    ...(currentUser?.role !== 'union_admin' ? [{ id: 'email', label: 'Email', minWidth: 200 }] : []),
    ...(currentUser?.role === 'union_admin'
      ? [{
          id: 'work_title',
          label: 'Designation',
          minWidth: 120,
          render: (row) => row.work_title || '—',
        }, {
          id: 'department',
          label: 'Department',
          minWidth: 120,
          render: (row) => row.department || '—',
        }, {
          id: 'salary_rupees',
          label: 'Salary (PKR)',
          minWidth: 110,
          render: (row) => row.salary_rupees != null && row.salary_rupees !== '' ? Number(row.salary_rupees).toLocaleString() : '—',
        }]
      : [{
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
        }]),
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
            onClick={() => handleOpenCreateJob(row, 'view')}
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
        role: currentUser?.role === 'union_admin' ? 'staff' : (editingUser.role || (currentUser?.role === 'super_admin' ? 'union_admin' : 'resident')),
        society_apartment_id: editingUser.society_apartment_id || (currentUser?.role === 'union_admin' ? currentUser.society_apartment_id : null),
        unit_id: editingUser.unit_id != null ? editingUser.unit_id : null,
        cnic: editingUser.cnic != null ? String(editingUser.cnic) : '',
        contact_number: editingUser.contact_number != null ? String(editingUser.contact_number) : '',
        emergency_contact: editingUser.emergency_contact != null ? String(editingUser.emergency_contact) : '',
        address: editingUser.address != null ? String(editingUser.address) : '',
        city: editingUser.city != null ? String(editingUser.city) : '',
        postal_code: editingUser.postal_code != null ? String(editingUser.postal_code) : '',
        work_employer: editingUser.work_employer != null ? String(editingUser.work_employer) : '',
        work_title: (editingUser.work_title || editingUser.designation || '') != null ? String(editingUser.work_title || editingUser.designation || '') : '',
        work_phone: editingUser.work_phone != null ? String(editingUser.work_phone) : '',
        department: editingUser.department != null ? String(editingUser.department) : '',
        salary_rupees: editingUser.salary_rupees != null && editingUser.salary_rupees !== '' ? editingUser.salary_rupees : '',
        is_active: editingUser.is_active !== undefined ? Boolean(editingUser.is_active) : true,
      }
    : {
        email: '',
        password: '',
        name: '',
        // Super Admin: new users default to Union Admin (can change to Resident/Staff)
        role: currentUser?.role === 'union_admin' ? 'staff' : (currentUser?.role === 'super_admin' ? 'union_admin' : 'resident'),
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
        department: '',
        salary_rupees: '',
        is_active: true,
      }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {currentUser?.role === 'union_admin' ? 'Employees Management' : 'Users Management'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          {currentUser?.role === 'union_admin' ? 'Add Employee' : 'Add User'}
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder={currentUser?.role === 'union_admin' ? 'Search employees...' : 'Search users...'}
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
        {currentUser?.role === 'super_admin' && (
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
        )}
        {currentUser?.role === 'union_admin' && (
          <TextField
            select
            label="Designation"
            value={designationFilter}
            onChange={(e) => {
              setDesignationFilter(e.target.value)
              setPage(1)
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            {EMPLOYEE_DESIGNATIONS.map((d) => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
          </TextField>
        )}
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
                if (actionMenuRow) handleOpenEditDialog(actionMenuRow)
              }}
            >
              <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            {!(currentUser?.role === 'union_admin' && actionMenuRow.role === 'staff') && (
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
            )}
            {currentUser?.role === 'super_admin' && actionMenuRow.role === 'union_admin' && actionMenuRow.society_apartment_id && (
              <MenuItem onClick={() => handleOpenCreateJob(actionMenuRow, 'create')}>
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
        onClose={() => { setCreateJobRow(null); setCreateJobDialogMode('view'); setSelectedPlanIdForJob('') }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {createJobDialogMode === 'create' ? 'Create Job — Apartment & Union Admin details' : 'View — Apartment & Union Admin details'}
        </DialogTitle>
        <DialogContent dividers>
          {createJobRow && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
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

              {createJobDialogMode === 'create' && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Give subscription (1 month)</Typography>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    value={
                      selectedPlanIdForJob && subscriptionPlans.some((p) => p.id === selectedPlanIdForJob)
                        ? selectedPlanIdForJob
                        : subscriptionPlans[0]?.id ?? ''
                    }
                    onChange={(e) => setSelectedPlanIdForJob(e.target.value)}
                  >
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
                    {adminsWithSubsList.find((a) => a.id === createJobRow.id)?.subscription_id
                      ? 'This user already has a subscription. This will update the plan and apply to next month only.'
                      : 'Subscription and first billing are available for the current month.'}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCreateJobRow(null); setCreateJobDialogMode('view'); setSelectedPlanIdForJob('') }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          key={editingUser ? `edit-${editingUser.id}` : 'add-new'}
          initialValues={initialValues}
          validationSchema={(values) => {
            if (!values) return getValidationSchema(!!editingUser, currentUser?.role, false)
            const lead = values.society_apartment_id ? (unassignedLeads || []).find((l) => l.id === values.society_apartment_id) : null
            const passwordOptional =
              (currentUser?.role === 'super_admin' && values.society_apartment_id && lead && lead.union_admin_email) ||
              currentUser?.role === 'union_admin'
            return getValidationSchema(!!editingUser, currentUser?.role, passwordOptional)
          }}
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
            const isSocietyEditable = currentUser?.role === 'super_admin' || (!editingUser && currentUser?.role !== 'union_admin')
            const isSocietyDisabled = currentUser?.role === 'union_admin' && !editingUser
            const simpleApartmentOptions = currentUser?.role === 'super_admin' ? (allSocietiesData?.data ?? []) : (societiesData?.data ?? [])
            const selectedLead = values.society_apartment_id ? (unassignedLeads || []).find((l) => l.id === values.society_apartment_id) : null
            const leadHasUnionAdminDetails = selectedLead && !!selectedLead.union_admin_email
            const showPasswordField = !editingUser && currentUser?.role !== 'union_admin' && !(currentUser?.role === 'super_admin' && leadHasUnionAdminDetails)

            return (
              <Form autoComplete="off">
                <DialogTitle>
                  {currentUser?.role === 'union_admin'
                    ? (editingUser ? 'Edit Employee' : 'Add New Employee')
                    : (editingUser ? 'Edit User' : 'Add New User')}
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
                          value={
                            values.society_apartment_id != null &&
                            unassignedLeads.some((l) => l.id === values.society_apartment_id)
                              ? values.society_apartment_id
                              : ''
                          }
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
                              setFieldValue('role', 'union_admin')
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
                        label="Full Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    {currentUser?.role !== 'union_admin' && (
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
                    )}
                    {showPasswordField && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.password && !!errors.password}
                          helperText={touched.password && errors.password}
                          autoComplete="new-password"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                                  onClick={() => setShowPassword((prev) => !prev)}
                                  onMouseDown={(e) => e.preventDefault()}
                                  edge="end"
                                  size="small"
                                >
                                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    )}
                    {/* Role selection: only for super_admin (union_admin page is employees only) */}
                    {currentUser?.role === 'super_admin' && (
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
                            }
                          }}
                          onBlur={handleBlur}
                          error={touched.role && !!errors.role}
                          helperText={touched.role && errors.role}
                        >
                          <MenuItem value="union_admin">Union Admin</MenuItem>
                          <MenuItem value="resident">Resident</MenuItem>
                          <MenuItem value="staff">Staff</MenuItem>
                        </TextField>
                      </Grid>
                    )}
                    {/* Designation: only for union_admin (employees) */}
                    {currentUser?.role === 'union_admin' && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          label="Designation"
                          name="work_title"
                          value={values.work_title || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.work_title && !!errors.work_title}
                          helperText={touched.work_title && errors.work_title}
                        >
                          <MenuItem value="">— None —</MenuItem>
                          {EMPLOYEE_DESIGNATIONS.map((d) => (
                            <MenuItem key={d} value={d}>{d}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    )}
                    {currentUser?.role === 'union_admin' && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Department"
                            name="department"
                            value={values.department || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.department && !!errors.department}
                            helperText={touched.department && errors.department}
                            placeholder="e.g. Security, Maintenance"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Salary (PKR)"
                            name="salary_rupees"
                            type="number"
                            inputProps={{ min: 0, step: 1 }}
                            value={values.salary_rupees ?? ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.salary_rupees && !!errors.salary_rupees}
                            helperText={touched.salary_rupees && errors.salary_rupees}
                            placeholder="Rupees"
                          />
                        </Grid>
                      </>
                    )}
                    {showSocietyField && currentUser?.role !== 'super_admin' && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          label="Apartment"
                          name="society_apartment_id"
                          value={
                            values.society_apartment_id != null &&
                            simpleApartmentOptions.some((s) => s.id === values.society_apartment_id)
                              ? values.society_apartment_id
                              : ''
                          }
                          onChange={handleSocietyChange}
                          onBlur={handleBlur}
                          error={touched.society_apartment_id && !!errors.society_apartment_id}
                          helperText={(touched.society_apartment_id && errors.society_apartment_id) || (currentUser?.role === 'super_admin' ? 'Optional — assign later from leads or Add Apartment' : null)}
                          disabled={isSocietyDisabled || !isSocietyEditable}
                          required={currentUser?.role !== 'super_admin'}
                        >
                          <MenuItem value="">Select Apartment</MenuItem>
                          {simpleApartmentOptions.map((society) => (
                            <MenuItem key={society.id} value={society.id}>
                              {society.name}{society.area ? ` (${society.area})` : ''}
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
                          value={
                            values.unit_id != null &&
                            (unitsData?.data ?? []).some((u) => u.id === values.unit_id)
                              ? values.unit_id
                              : ''
                          }
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
                    {currentUser?.role !== 'union_admin' && (
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
                    )}
                    {currentUser?.role !== 'union_admin' && (
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
                    )}
                    {currentUser?.role !== 'union_admin' && (
                    <>
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
                    </>
                    )}
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
                      type={showNewPassword ? 'text' : 'password'}
                      value={values.new_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.new_password && !!errors.new_password}
                      helperText={touched.new_password && errors.new_password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                              onClick={() => setShowNewPassword((prev) => !prev)}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                              size="small"
                            >
                              {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
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
