import { useState, useMemo, useEffect } from 'react'
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
  Tooltip,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Autocomplete,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  TableSortLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import LayersIcon from '@mui/icons-material/Layers'
import DomainIcon from '@mui/icons-material/Domain'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TuneIcon from '@mui/icons-material/Tune'
import useSWR, { useSWRConfig } from 'swr'
import { apartmentApi } from '@/api/apartmentApi'
import { propertyApi } from '@/api/propertyApi'
import { userApi } from '@/api/userApi'
import { superAdminApi } from '@/api/superAdminApi'
import { ROUTES } from '@/utils/constants'
import DataTable from '@/components/common/DataTable'
import AddressAutocomplete from '@/components/common/AddressAutocomplete'

// Pakistan cities for dropdown (Pakistan only)
const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
  'Peshawar', 'Quetta', 'Sialkot', 'Sargodha', 'Bahawalpur', 'Gujranwala',
  'Gujrat', 'Sukkur', 'Larkana', 'Sheikhupura', 'Rahim Yar Khan', 'Mardan',
  'Mingora', 'Nawabshah', 'Sahiwal', 'Mirpur Khas', 'Okara', 'Mandi Bahauddin',
  'Jacobabad', 'Saddar', 'Hyderabad', 'Abbottabad', 'Dera Ghazi Khan', 'Other',
]
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    address: Yup.string(),
    city: Yup.string(),
    total_floors: Yup.number().min(0).nullable(),
    total_units: Yup.number().min(0).nullable(),
    unitInputMode: Yup.string().oneOf(['total', 'per_floor']).nullable(),
    units_per_floor: Yup.number()
      .nullable()
      .when(['unitInputMode', 'total_blocks'], {
        is: (mode, blocks) => mode === 'per_floor' && (blocks || 0) > 0,
        then: (schema) => schema.required('Units per floor is required').min(1, 'At least 1'),
        otherwise: (schema) => schema.nullable(),
      }),
    union_admin_name: Yup.string().nullable(),
    union_admin_email: Yup.string().nullable().test('email', 'Invalid email', (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
    union_admin_phone: Yup.string().nullable(),
    union_admin_password: Yup.string()
      .nullable()
      .when('union_admin_email', {
        is: (v) => v && String(v).trim(),
        then: (schema) => schema.required('Password is required when adding Union Admin client').min(6, 'At least 6 characters'),
        otherwise: (schema) => schema.nullable(),
      }),
    lead_source: Yup.string().nullable(),
    current_status: Yup.string().nullable(),
    next_followup_date: Yup.string().nullable(),
    last_interaction_date: Yup.string().nullable(),
    priority: Yup.string().nullable(),
    notes: Yup.string().nullable(),
  })

const Leads = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingSociety, setEditingSociety] = useState(null)
  const [actionMenu, setActionMenu] = useState({ anchorEl: null, row: null })
  const [assignAdminRow, setAssignAdminRow] = useState(null)
  const [assignSelectedAdmin, setAssignSelectedAdmin] = useState(null)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [addressFilter, setAddressFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('inactive')
  const [approvalFilter, setApprovalFilter] = useState('')

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const openActionMenu = (e, row) => {
    e.stopPropagation()
    setActionMenu({ anchorEl: e.currentTarget, row })
  }
  const closeActionMenu = () => setActionMenu({ anchorEl: null, row: null })

  const { mutate: globalMutate } = useSWRConfig()
  const societiesKey = ['/societies', page, limit, search, addressFilter, statusFilter, approvalFilter, sortBy, sortOrder]
  const { data, isLoading, mutate } = useSWR(
    societiesKey,
    () =>
      apartmentApi
        .getAll({
          page,
          limit,
          search: search || undefined,
          address: addressFilter || undefined,
          status: statusFilter || undefined,
          approval_status: approvalFilter || undefined,
          sortBy: sortBy || undefined,
          order: sortBy ? sortOrder : undefined,
        })
        .then((res) => res.data)
  )

  const { data: adminsData, mutate: mutateAdmins } = useSWR(
    '/super-admin/subscription/admins',
    () => superAdminApi.getAdminsWithSubscriptions().then(res => res.data)
  )
  const admins = adminsData?.data ?? []

  const { data: unassignedAdminsData } = useSWR(
    openDialog || assignAdminRow ? '/users/unassigned-union-admins' : null,
    () => userApi.getUnassignedUnionAdmins().then(res => res.data)
  )
  const unassignedUnionAdmins = unassignedAdminsData?.data ?? []

  const { data: apartmentDetailData, isLoading: apartmentDetailLoading } = useSWR(
    openDialog && editingSociety?.id ? ['/apartment-detail', editingSociety.id] : null,
    () => apartmentApi.getById(editingSociety.id).then(res => res.data)
  )
  const apartmentDetail = apartmentDetailData?.data

  const [createJobRow, setCreateJobRow] = useState(null)
  const [selectedPlanIdForJob, setSelectedPlanIdForJob] = useState('')
  const [givingSubscription, setGivingSubscription] = useState(false)

  const [approveRejectRow, setApproveRejectRow] = useState(null)
  const [approveRejectAction, setApproveRejectAction] = useState(null)
  const [approveRejectNotes, setApproveRejectNotes] = useState('')
  const [approveRejectLoading, setApproveRejectLoading] = useState(false)

  const [featuresRow, setFeaturesRow] = useState(null)
  const [featuresForm, setFeaturesForm] = useState({})
  const [featuresLoading, setFeaturesLoading] = useState(false)

  const { data: createJobApartmentData } = useSWR(
    createJobRow?.society_apartment_id ? ['/apartment-detail-create-job', createJobRow.society_apartment_id] : null,
    () => apartmentApi.getById(createJobRow.society_apartment_id).then(res => res.data)
  )
  const createJobApartment = createJobApartmentData?.data

  const { data: subscriptionPlansData } = useSWR(
    createJobRow ? '/super-admin/subscription-plans' : null,
    () => superAdminApi.getSubscriptionPlans().then(res => res.data)
  )
  const subscriptionPlans = subscriptionPlansData?.data ?? []

  const { data: featuresData } = useSWR(
    featuresRow?.id ? ['/societies/features', featuresRow.id] : null,
    () => apartmentApi.getFeatures(featuresRow.id).then(res => res.data)
  )
  const featuresOptions = featuresData?.data ? { ...featuresData.data } : null

  useEffect(() => {
    if (featuresRow && featuresOptions && Object.keys(featuresOptions).length) {
      setFeaturesForm({ ...featuresOptions })
    }
  }, [featuresRow?.id, featuresData])

  const subscriptionByUserId = useMemo(() => {
    const list = adminsData?.data ?? []
    return Object.fromEntries(list.filter((a) => a.subscription_id).map((a) => [a.id, { subscription_id: a.subscription_id, subscription_status: a.subscription_status }]))
  }, [adminsData])

  const handleOpenCreateJob = (adminRow) => {
    closeActionMenu()
    if (!adminRow?.society_apartment_id) {
      toast.error('This user is not assigned to a lead.')
      return
    }
    const sub = subscriptionByUserId[adminRow.id]
    const hasExistingSubscription = sub && ['active', 'trial'].includes((sub.subscription_status || '').toLowerCase())
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
                  setCreateJobRow(adminRow)
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
    setCreateJobRow(adminRow)
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
      toast.success(`Job created. Lead removed from this list; manage from Users. Next billing: ${nextBilling.toLocaleDateString()}.`)
      await Promise.all([mutate(), mutateAdmins()])
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
    const sub = subscriptionByUserId[createJobRow.id]
    const hasExistingSubscription = sub && ['active', 'trial'].includes((sub.subscription_status || '').toLowerCase())
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

  const handleOpenDialog = (society = null) => {
    setEditingSociety(society)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingSociety(null)
  }

  const handleOpenAssignAdmin = (row) => {
    setAssignAdminRow(row)
    setAssignSelectedAdmin(null)
    closeActionMenu()
  }

  const handleCloseAssignAdmin = () => {
    setAssignAdminRow(null)
    setAssignSelectedAdmin(null)
  }

  const handleAssignAdmin = async () => {
    if (!assignAdminRow || !assignSelectedAdmin?.id) return
    try {
      await userApi.update(assignSelectedAdmin.id, { society_apartment_id: assignAdminRow.id })
      toast.success('Union Admin assigned successfully.')
      mutate()
      mutateAdmins()
      handleCloseAssignAdmin()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed')
    }
  }

  const openApproveReject = (row, action) => {
    closeActionMenu()
    setApproveRejectRow(row)
    setApproveRejectAction(action)
    setApproveRejectNotes('')
  }
  const closeApproveReject = () => {
    setApproveRejectRow(null)
    setApproveRejectAction(null)
    setApproveRejectNotes('')
  }
  const handleApproveRejectSubmit = async () => {
    if (!approveRejectRow?.id || !approveRejectAction) return
    setApproveRejectLoading(true)
    try {
      if (approveRejectAction === 'approve') {
        await apartmentApi.approve(approveRejectRow.id, { notes: approveRejectNotes || undefined })
        toast.success('Union approved.')
      } else {
        await apartmentApi.reject(approveRejectRow.id, { notes: approveRejectNotes || undefined })
        toast.success('Union rejected.')
      }
      mutate()
      closeApproveReject()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed')
    } finally {
      setApproveRejectLoading(false)
    }
  }

  const openFeatures = (row) => {
    closeActionMenu()
    setFeaturesRow(row)
    setFeaturesForm({})
  }
  const closeFeatures = () => { setFeaturesRow(null); setFeaturesForm({}) }
  const handleSaveFeatures = async () => {
    if (!featuresRow?.id) return
    setFeaturesLoading(true)
    try {
      const payload = { ...(featuresOptions || {}), ...featuresForm }
      await apartmentApi.updateFeatures(featuresRow.id, payload)
      toast.success('Features updated.')
      mutate()
      closeFeatures()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed')
    } finally {
      setFeaturesLoading(false)
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingSociety) {
        const id = editingSociety.id
        await apartmentApi.update(id, {
          name: values.name,
          address: values.address,
          city: values.city,
          area: values.area,
          total_blocks: Math.max(0, parseInt(values.total_blocks, 10) || 0),
          total_floors: Math.max(0, parseInt(values.total_floors, 10) || 0),
          total_units: Math.max(0, parseInt(values.total_units, 10) || 0),
          is_active: values.is_active === true || values.is_active === 'true',
          union_admin_name: values.union_admin_name || null,
          union_admin_email: values.union_admin_email || null,
          union_admin_phone: values.union_admin_phone || null,
          lead_source: values.lead_source || null,
          current_status: values.current_status || null,
          next_followup_date: values.next_followup_date || null,
          last_interaction_date: values.last_interaction_date || null,
          priority: values.priority || null,
          notes: values.notes || null,
        })
        toast.success('Lead updated successfully')
        // Defer close and revalidate so dialog closes and list updates reliably
        setTimeout(() => {
          setOpenDialog(false)
          setEditingSociety(null)
          globalMutate(societiesKey)
        }, 0)
        return
      } else {
        const numBlocksForPayload = Array.isArray(values.blockNames) && values.blockNames.length > 0 ? values.blockNames.length : 0
        const totalFloorsForPayload = Number(values.total_floors) || 0
        const totalUnitsForPayload =
          values.unitInputMode === 'per_floor' && numBlocksForPayload > 0
            ? (Number(values.units_per_floor) || 0) * totalFloorsForPayload * numBlocksForPayload
            : Number(values.total_units) || 0
        const payload = {
          name: values.name,
          address: values.address,
          city: values.city,
          area: values.area || null,
          total_blocks: Number(values.total_blocks) || 0,
          total_floors: totalFloorsForPayload,
          total_units: totalUnitsForPayload,
          union_admin_name: values.union_admin_name || null,
          union_admin_email: values.union_admin_email || null,
          union_admin_phone: values.union_admin_phone || null,
          union_admin_password: values.union_admin_password || undefined,
          lead_source: values.lead_source || null,
          current_status: values.current_status || null,
          next_followup_date: values.next_followup_date || null,
          last_interaction_date: values.last_interaction_date || null,
          priority: values.priority || null,
          notes: values.notes || null,
        }
        const res = await apartmentApi.create(payload)
        const newId = res?.data?.data?.id
        if (newId && Array.isArray(values.blockNames) && values.blockNames.length > 0) {
          const totalFloors = Number(values.total_floors) || 0
          const numBlocks = values.blockNames.length
          const isPerFloor = values.unitInputMode === 'per_floor'
          const totalUnits = isPerFloor
            ? (Number(values.units_per_floor) || 0) * totalFloors * numBlocks
            : (Number(values.total_units) || 0)
          let blockUnits
          if (isPerFloor) {
            blockUnits = (Number(values.units_per_floor) || 0) * totalFloors
          } else {
            const unitsPerBlock = Math.floor(totalUnits / numBlocks)
            const remainder = totalUnits % numBlocks
            blockUnits = (i) => unitsPerBlock + (i < remainder ? 1 : 0)
          }
          for (let i = 0; i < numBlocks; i++) {
            const name = (values.blockNames[i] || '').trim() || `Block ${i + 1}`
            const unitsForBlock = typeof blockUnits === 'function' ? blockUnits(i) : blockUnits
            await propertyApi.createBlock({
              society_apartment_id: newId,
              name,
              total_floors: totalFloors,
              total_units: unitsForBlock,
            })
          }
        }
        toast.success('Lead created successfully.')
      }
      setTimeout(() => {
        setOpenDialog(false)
        setEditingSociety(null)
        globalMutate(societiesKey)
      }, 0)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, dismissToastId) => {
    if (dismissToastId) toast.dismiss(dismissToastId)
    try {
      await apartmentApi.remove(id)
      toast.success('Lead deleted successfully')
      mutate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const confirmDelete = (id) => {
    closeActionMenu()
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
            Delete this lead?
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

  const columns = [
    {
      id: 'id',
      label: 'Lead ID',
      minWidth: 80,
      render: (row) => <Typography variant="body2">{row.id ?? '—'}</Typography>,
    },
    {
      id: 'name',
      label: 'Lead name',
      minWidth: 180,
      header: (
        <TableSortLabel
          active={sortBy === 'name'}
          direction={sortBy === 'name' ? sortOrder : 'asc'}
          onClick={() => handleSort('name')}
        >
          Lead name
        </TableSortLabel>
      ),
      render: (row) => {
        const label = row.name || '—'
        return (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
              color: 'primary.main',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => navigate(`${ROUTES.SUPER_ADMIN_VIEW_DETAILS}?society_id=${row.id}&from=leads`)}
          >
            {label}
          </Typography>
        )
      },
    },
    {
      id: 'union_admin_phone',
      label: 'Phone No.',
      minWidth: 120,
      render: (row) => {
        const admin = admins.find((a) => a.society_apartment_id === row.id)
        const phone = admin?.contact_number || row.union_admin_phone || '—'
        return <Typography variant="body2">{phone}</Typography>
      },
    },
    {
      id: 'union_admin_email',
      label: 'Email',
      minWidth: 180,
      render: (row) => {
        const admin = admins.find((a) => a.society_apartment_id === row.id)
        const email = admin?.email || row.union_admin_email || '—'
        return <Typography variant="body2">{email}</Typography>
      },
    },
    { id: 'address', label: 'Address', minWidth: 160, render: (row) => <Typography variant="body2">{row.address || '—'}</Typography> },
    {
      id: 'lead_source',
      label: 'Lead Source',
      minWidth: 120,
      render: (row) => <Typography variant="body2">{row.lead_source || '—'}</Typography>,
    },
    {
      id: 'current_status',
      label: 'Current Status',
      minWidth: 120,
      render: (row) => {
        const s = (row.current_status || '').trim()
        if (!s) return <Typography variant="body2">—</Typography>
        return <Chip size="small" label={s} variant="outlined" />
      },
    },
    {
      id: 'next_followup_date',
      label: 'Next Follow-up Date',
      minWidth: 130,
      render: (row) => (
        <Typography variant="body2">
          {row.next_followup_date ? new Date(row.next_followup_date).toLocaleDateString() : '—'}
        </Typography>
      ),
    },
    {
      id: 'last_interaction_date',
      label: 'Last Interaction Date',
      minWidth: 140,
      render: (row) => (
        <Typography variant="body2">
          {row.last_interaction_date ? new Date(row.last_interaction_date).toLocaleDateString() : '—'}
        </Typography>
      ),
    },
    {
      id: 'union_admin',
      label: 'Union Admin',
      minWidth: 160,
      header: (
        <TableSortLabel
          active={sortBy === 'union_admin'}
          direction={sortBy === 'union_admin' ? sortOrder : 'asc'}
          onClick={() => handleSort('union_admin')}
        >
          Union Admin
        </TableSortLabel>
      ),
      render: (row) => {
        const admin = admins.find((a) => a.society_apartment_id === row.id)
        const label = admin ? admin.name : (row.union_admin_name || '—')
        return (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              cursor: label !== '—' ? 'pointer' : 'default',
              color: label !== '—' ? 'primary.main' : 'text.primary',
              '&:hover': label !== '—' ? { textDecoration: 'underline' } : {},
            }}
            onClick={() => label !== '—' && navigate(`${ROUTES.SUPER_ADMIN_VIEW_DETAILS}?society_id=${row.id}&from=leads`)}
          >
            {label}
          </Typography>
        )
      },
    },
    {
      id: 'priority',
      label: 'Priority',
      minWidth: 100,
      render: (row) => {
        const p = (row.priority || '').trim()
        if (!p) return <Typography variant="body2">—</Typography>
        const color = p.toLowerCase() === 'high' ? 'error' : p.toLowerCase() === 'medium' ? 'warning' : 'default'
        return <Chip size="small" label={p} color={color} />
      },
    },
    {
      id: 'notes',
      label: 'Notes',
      minWidth: 140,
      render: (row) => {
        const n = (row.notes || '').trim()
        if (!n) return <Typography variant="body2">—</Typography>
        const truncated = n.length > 50 ? n.slice(0, 50) + '…' : n
        return <Typography variant="body2" title={n}>{truncated}</Typography>
      },
    },
    {
      id: 'approval_status',
      label: 'Approval',
      minWidth: 110,
      render: (row) => {
        const status = (row.approval_status || 'pending').toLowerCase()
        const color = status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'
        const label = status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Pending'
        return <Chip size="small" label={label} color={color} />
      },
    },
    {
      id: 'next_billing_date',
      label: 'Billing',
      minWidth: 120,
      render: (row) => {
        const admin = admins.find((a) => a.society_apartment_id === row.id)
        const date = admin?.next_billing_date
        return (
          <Typography variant="body2">
            {date ? new Date(date).toLocaleDateString() : '—'}
          </Typography>
        )
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Actions">
            <IconButton
              size="small"
              onClick={(e) => openActionMenu(e, row)}
              aria-label="Open actions menu"
              sx={{ p: 0.5 }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={actionMenu.anchorEl}
            open={Boolean(actionMenu.anchorEl)}
            onClose={closeActionMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {actionMenu.row && (
              <>
                <MenuItem
                  onClick={() => {
                    navigate(`${ROUTES.SUPER_ADMIN_VIEW_DETAILS}?society_id=${actionMenu.row.id}&from=leads`)
                    closeActionMenu()
                  }}
                >
                  <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>View</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    navigate(`/super-admin/blocks?society_id=${actionMenu.row.id}`)
                    closeActionMenu()
                  }}
                >
                  <ListItemIcon><AccountTreeIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Blocks</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate(`/super-admin/floors?society_id=${actionMenu.row.id}`)
                    closeActionMenu()
                  }}
                >
                  <ListItemIcon><LayersIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Floors</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate(`/super-admin/units?society_id=${actionMenu.row.id}`)
                    closeActionMenu()
                  }}
                >
                  <ListItemIcon><DomainIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Units</ListItemText>
                </MenuItem>
                <Divider />
                {(() => {
                  const assignedAdmin = admins.find((a) => a.society_apartment_id === actionMenu.row.id)
                  if (!assignedAdmin?.id) return null
                  return (
                    <MenuItem
                      onClick={() => handleOpenCreateJob(assignedAdmin)}
                    >
                      <ListItemIcon><WorkOutlineIcon fontSize="small" /></ListItemIcon>
                      <ListItemText>Create Job</ListItemText>
                    </MenuItem>
                  )
                })()}
                {!admins.find((a) => a.society_apartment_id === actionMenu.row.id) && (
                  <MenuItem onClick={() => handleOpenAssignAdmin(actionMenu.row)}>
                    <ListItemIcon><PersonAddIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Assign Union Admin</ListItemText>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    handleOpenDialog(actionMenu.row)
                    closeActionMenu()
                  }}
                >
                  <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Edit lead</ListItemText>
                </MenuItem>
                {(actionMenu.row?.approval_status || '').toLowerCase() === 'pending' && (
                  <>
                    <MenuItem onClick={() => openApproveReject(actionMenu.row, 'approve')}>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText>Approve union</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => openApproveReject(actionMenu.row, 'reject')}>
                      <ListItemIcon><CancelIcon fontSize="small" color="error" /></ListItemIcon>
                      <ListItemText>Reject union</ListItemText>
                    </MenuItem>
                  </>
                )}
                <MenuItem onClick={() => openFeatures(actionMenu.row)}>
                  <ListItemIcon><TuneIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Features</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => confirmDelete(actionMenu.row.id)}
                  sx={{ color: 'error.main' }}
                >
                  <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                  <ListItemText>Delete lead</ListItemText>
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      ),
    },
  ]

  const assignedAdminForEdit = editingSociety
    ? admins.find((a) => a.society_apartment_id === editingSociety.id)
    : null

  const editSource = editingSociety ? (apartmentDetail || editingSociety) : null

  const initialValues = editSource
    ? {
        name: editSource.name || '',
        address: editSource.address || '',
        city: editSource.city || '',
        area: editSource.area || '',
        total_blocks: editSource.total_blocks ?? 0,
        total_floors: editSource.total_floors ?? 0,
        total_units: editSource.total_units ?? 0,
        unitInputMode: 'total',
        units_per_floor: 0,
        blockNames: [],
        is_active: editSource.is_active !== false,
        union_admin_name: editSource.union_admin_name ?? assignedAdminForEdit?.name ?? '',
        union_admin_email: editSource.union_admin_email ?? assignedAdminForEdit?.email ?? '',
        union_admin_phone: editSource.union_admin_phone ?? assignedAdminForEdit?.contact_number ?? '',
        union_admin_password: '',
        lead_source: editSource.lead_source ?? '',
        current_status: editSource.current_status ?? '',
        next_followup_date: editSource.next_followup_date ? String(editSource.next_followup_date).slice(0, 10) : '',
        last_interaction_date: editSource.last_interaction_date ? String(editSource.last_interaction_date).slice(0, 10) : '',
        priority: editSource.priority ?? '',
        notes: editSource.notes ?? '',
      }
    : {
        name: '',
        address: '',
        city: '',
        area: '',
        total_blocks: 0,
        total_floors: 0,
        total_units: 0,
        unitInputMode: 'total',
        units_per_floor: 0,
        blockNames: [],
        is_active: true,
        union_admin_name: '',
        union_admin_email: '',
        union_admin_phone: '',
        union_admin_password: '',
        lead_source: '',
        current_status: '',
        next_followup_date: '',
        last_interaction_date: '',
        priority: '',
        notes: '',
      }

  const totalLeads = data?.pagination?.total ?? (data?.data?.length ?? 0)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Leads
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Leads shown here until a job is created for a union admin. After Create Job, manage from Users.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total leads: {isLoading ? '—' : totalLeads}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Lead
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          sx={{ minWidth: 200, flex: '1 1 200px' }}
          placeholder="Search leads..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          sx={{ minWidth: 200, flex: '1 1 200px' }}
          placeholder="Filter by address"
          value={addressFilter}
          onChange={(e) => { setAddressFilter(e.target.value); setPage(1) }}
          size="small"
        />
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          sx={{ minWidth: 160 }}
          InputLabelProps={{ shrink: true }}
          SelectProps={{
            displayEmpty: true,
          renderValue: (v) => (v === '' ? 'All' : v === 'active' ? 'Active (job created)' : 'Leads only'),
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active (job created)</MenuItem>
          <MenuItem value="inactive">Leads only</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          label="Approval"
          value={approvalFilter}
          onChange={(e) => { setApprovalFilter(e.target.value); setPage(1) }}
          sx={{ minWidth: 140 }}
          InputLabelProps={{ shrink: true }}
          SelectProps={{ displayEmpty: true, renderValue: (v) => (v === '' ? 'All' : v === 'pending' ? 'Pending' : v === 'approved' ? 'Approved' : 'Rejected') }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </TextField>
      </Box>

      <DataTable
        dense
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {editingSociety && apartmentDetailLoading ? (
          <>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                <CircularProgress />
              </Box>
            </DialogContent>
          </>
        ) : (
        <Formik
          key={editingSociety ? `edit-${editingSociety.id}` : 'add'}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={!editingSociety}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form>
              <DialogTitle>
                {editingSociety ? 'Edit Lead' : 'Add New Lead'}
              </DialogTitle>
              <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Blocks, floors and units are optional. You can add them here or later from Blocks / Floors / Units.
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Lead name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                      placeholder="e.g. Sunrise Towers, Green Valley"
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ position: 'relative', zIndex: 10 }}>
                    {editingSociety && (values.address || '').trim() ? (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Saved address: {values.address}
                      </Typography>
                    ) : null}
                    <AddressAutocomplete
                      fullWidth
                      label="Address (from map or type manually)"
                      name="address"
                      value={values.address || ''}
                      onChange={(e) => handleChange({ target: { name: 'address', value: e.target.value } })}
                      onBlur={handleBlur}
                      onPlaceSelect={({ address, city, area }) => {
                        setFieldValue('address', address || '')
                        setFieldValue('city', city || '')
                        setFieldValue('area', area || '')
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="City (Pakistan)"
                      name="city"
                      value={values.city || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="">Select city</MenuItem>
                      {PAKISTAN_CITIES.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Area (e.g. DHA, Clifton)"
                      name="area"
                      placeholder="Optional"
                      value={values.area || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Total Blocks"
                      name="total_blocks"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={values.total_blocks}
                      onChange={(e) => {
                        const num = Math.max(0, parseInt(e.target.value, 10) || 0)
                        handleChange(e)
                        const names = Array.from({ length: num }, (_, i) =>
                          (values.blockNames && values.blockNames[i] !== undefined)
                            ? values.blockNames[i]
                            : `Block ${i + 1}`
                        )
                        setFieldValue('blockNames', names)
                      }}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Total Floors (per block)"
                      name="total_floors"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={values.total_floors ?? ''}
                      onChange={(e) => {
                        const raw = e.target.value
                        if (raw === '') {
                          handleChange(e)
                          return
                        }
                        const num = Math.max(0, parseInt(raw, 10) || 0)
                        handleChange({ target: { name: e.target.name, value: num } })
                      }}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  {!editingSociety && Array.isArray(values.blockNames) && values.blockNames.length > 0 ? (
                    <>
                      <Grid item xs={12}>
                        <FormControl component="fieldset" size="small">
                          <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>
                            How do you want to specify units?
                          </FormLabel>
                          <RadioGroup
                            row
                            name="unitInputMode"
                            value={values.unitInputMode || 'total'}
                            onChange={(e) => setFieldValue('unitInputMode', e.target.value)}
                          >
                            <FormControlLabel value="total" control={<Radio size="small" />} label="Total units (split across blocks)" />
                            <FormControlLabel value="per_floor" control={<Radio size="small" />} label="Units per floor (same for each block)" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      {values.unitInputMode === 'per_floor' ? (
                        <>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Units per floor"
                              name="units_per_floor"
                              type="number"
                              inputProps={{ min: 1 }}
                              value={values.units_per_floor ?? ''}
                              onChange={(e) => {
                                const raw = e.target.value
                                if (raw === '') {
                                  setFieldValue('units_per_floor', '')
                                  return
                                }
                                const num = Math.max(0, parseInt(raw, 10) || 0)
                                setFieldValue('units_per_floor', num)
                              }}
                              onBlur={handleBlur}
                              error={touched.units_per_floor && !!errors.units_per_floor}
                              helperText={touched.units_per_floor && errors.units_per_floor}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              Total units = {((Number(values.units_per_floor) || 0) * (Number(values.total_floors) || 0) * (values.blockNames?.length || 0)) || '—'} (units per floor × floors × blocks)
                            </Typography>
                          </Grid>
                        </>
                      ) : (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Total units (split across blocks)"
                            name="total_units"
                            type="number"
                            inputProps={{ min: 0 }}
                            value={values.total_units ?? ''}
                            onChange={(e) => {
                              const raw = e.target.value
                              if (raw === '') {
                                handleChange(e)
                                return
                              }
                              const num = Math.max(0, parseInt(raw, 10) || 0)
                              handleChange({ target: { name: e.target.name, value: num } })
                            }}
                            onBlur={handleBlur}
                            helperText="e.g. 15 units in 2 blocks → 8 + 7"
                          />
                        </Grid>
                      )}
                    </>
                  ) : (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Total Units"
                        name="total_units"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={values.total_units ?? ''}
                        onChange={(e) => {
                          const raw = e.target.value
                          if (raw === '') {
                            handleChange(e)
                            return
                          }
                          const num = Math.max(0, parseInt(raw, 10) || 0)
                          handleChange({ target: { name: e.target.name, value: num } })
                        }}
                        onBlur={handleBlur}
                      />
                    </Grid>
                  )}
                  {!editingSociety && Array.isArray(values.blockNames) && values.blockNames.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Block names
                      </Typography>
                      <Grid container spacing={1}>
                        {values.blockNames.map((_, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <TextField
                              fullWidth
                              size="small"
                              label={`Block ${index + 1} name`}
                              value={values.blockNames[index] || ''}
                              onChange={(e) => {
                                const next = [...(values.blockNames || [])]
                                next[index] = e.target.value
                                setFieldValue('blockNames', next)
                              }}
                              placeholder={`Block ${index + 1}`}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  )}
                  {editingSociety && (
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!values.is_active}
                            onChange={(e) => setFieldValue('is_active', e.target.checked)}
                            name="is_active"
                            size="small"
                          />
                        }
                        label="Active"
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }} color="text.secondary">
                      {editingSociety
                        ? 'Union Admin Name, Email &amp; Phone (optional — for lead contact)'
                        : 'Union Admin details: if filled, a new client is added to Users with pending subscription. Activate later via Users → Create Job.'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Union Admin Name"
                      name="union_admin_name"
                      value={values.union_admin_name || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.union_admin_name && !!errors.union_admin_name}
                      helperText={touched.union_admin_name && errors.union_admin_name}
                      placeholder="Optional"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Union Admin Email"
                      name="union_admin_email"
                      type="email"
                      value={values.union_admin_email || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.union_admin_email && !!errors.union_admin_email}
                      helperText={touched.union_admin_email && errors.union_admin_email}
                      placeholder="Optional"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Union Admin Phone No."
                      name="union_admin_phone"
                      value={values.union_admin_phone || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.union_admin_phone && !!errors.union_admin_phone}
                      helperText={touched.union_admin_phone && errors.union_admin_phone}
                      placeholder="Optional"
                    />
                  </Grid>
                  {!editingSociety && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Union Admin Password"
                        name="union_admin_password"
                        type="password"
                        autoComplete="new-password"
                        value={values.union_admin_password || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.union_admin_password && !!errors.union_admin_password}
                        helperText={touched.union_admin_password && errors.union_admin_password}
                        placeholder="Required if email is set (min 6)"
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }} color="text.secondary">
                      Lead details (optional)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Lead Source"
                      name="lead_source"
                      value={values.lead_source || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Website">Website</MenuItem>
                      <MenuItem value="Referral">Referral</MenuItem>
                      <MenuItem value="Cold Call">Cold Call</MenuItem>
                      <MenuItem value="Social Media">Social Media</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Current Status"
                      name="current_status"
                      value={values.current_status || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Contacted">Contacted</MenuItem>
                      <MenuItem value="Qualified">Qualified</MenuItem>
                      <MenuItem value="Converted">Converted</MenuItem>
                      <MenuItem value="Lost">Lost</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Next Follow-up Date"
                      name="next_followup_date"
                      type="date"
                      value={values.next_followup_date || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Interaction Date"
                      name="last_interaction_date"
                      type="date"
                      value={values.last_interaction_date || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Priority"
                      name="priority"
                      value={values.priority || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      multiline
                      rows={3}
                      value={values.notes || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Optional notes"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {editingSociety ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
        )}
      </Dialog>

      <Dialog open={Boolean(assignAdminRow)} onClose={handleCloseAssignAdmin} maxWidth="xs" fullWidth>
        <DialogTitle>Assign Union Admin</DialogTitle>
        <DialogContent>
          {assignAdminRow && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Lead: <strong>{assignAdminRow.name}</strong>
            </Typography>
          )}
          <Autocomplete
            fullWidth
            options={unassignedUnionAdmins}
            getOptionLabel={(option) => (option && option.name) || ''}
            value={assignSelectedAdmin}
            onChange={(_, newValue) => setAssignSelectedAdmin(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Union Admin" placeholder="Type to search..." />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.name} {option.email ? `(${option.email})` : ''}
              </li>
            )}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignAdmin}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAssignAdmin}
            disabled={!assignSelectedAdmin?.id}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(approveRejectRow)} onClose={closeApproveReject} maxWidth="xs" fullWidth>
        <DialogTitle>{approveRejectAction === 'approve' ? 'Approve union' : 'Reject union'}</DialogTitle>
        <DialogContent>
          {approveRejectRow && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Lead: <strong>{approveRejectRow.name}</strong>
            </Typography>
          )}
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Notes (optional)"
            value={approveRejectNotes}
            onChange={(e) => setApproveRejectNotes(e.target.value)}
            placeholder={approveRejectAction === 'approve' ? 'e.g. Verified documents' : 'e.g. Incomplete registration'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeApproveReject}>Cancel</Button>
          <Button
            variant="contained"
            color={approveRejectAction === 'reject' ? 'error' : 'primary'}
            onClick={handleApproveRejectSubmit}
            disabled={approveRejectLoading}
          >
            {approveRejectLoading ? <CircularProgress size={20} /> : approveRejectAction === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(featuresRow)} onClose={closeFeatures} maxWidth="sm" fullWidth>
        <DialogTitle>Features — {featuresRow?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enable or disable features for this union (subscription tiers / rollout).
          </Typography>
          {featuresOptions && (
            <Grid container spacing={2}>
              {['complaints', 'maintenance', 'announcements', 'finance_reports', 'defaulters_visible', 'messaging'].map((key) => (
                <Grid item xs={12} sm={6} key={key}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={featuresForm[key] !== false}
                        onChange={(e) => setFeaturesForm((prev) => ({ ...prev, [key]: e.target.checked }))}
                      />
                    }
                    label={key.replace(/_/g, ' ')}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          {featuresRow && !featuresOptions && <CircularProgress size={24} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFeatures}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveFeatures} disabled={featuresLoading || !featuresOptions}>
            {featuresLoading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Job dialog – Lead & Union Admin details + package + Give subscription */}
      <Dialog
        open={Boolean(createJobRow)}
        onClose={() => { setCreateJobRow(null); setSelectedPlanIdForJob('') }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Job — Lead &amp; Union Admin details</DialogTitle>
        <DialogContent dividers>
          {createJobRow && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              {(() => {
                const adminDetail = admins.find((a) => a.id === createJobRow.id)
                const hasActiveSubscription = adminDetail?.subscription_id && ['active', 'trial'].includes((adminDetail?.subscription_status || '').toLowerCase())
                return hasActiveSubscription ? (
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ mb: 1 }}>
                      This user already has a subscription. Giving subscription again will update the plan and set next billing date to one month from today.
                    </Alert>
                  </Grid>
                ) : null
              })()}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Lead</Typography>
              </Grid>
              {createJobApartment ? (
                <>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Lead name</Typography>
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
                const adminDetail = admins.find((a) => a.id === createJobRow.id)
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
                  value={selectedPlanIdForJob || subscriptionPlans.find((p) => p.is_active)?.id || subscriptionPlans[0]?.id || ''}
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
    </Container>
  )
}
export default Leads