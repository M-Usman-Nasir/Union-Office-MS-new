import { useState } from 'react'
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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import LayersIcon from '@mui/icons-material/Layers'
import DomainIcon from '@mui/icons-material/Domain'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import VisibilityIcon from '@mui/icons-material/Visibility'
import useSWR from 'swr'
import { apartmentApi } from '@/api/apartmentApi'
import { propertyApi } from '@/api/propertyApi'
import { userApi } from '@/api/userApi'
import { superAdminApi } from '@/api/superAdminApi'
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
  })

const Apartments = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingSociety, setEditingSociety] = useState(null)
  const [actionMenu, setActionMenu] = useState({ anchorEl: null, row: null })
  const [assignAdminRow, setAssignAdminRow] = useState(null)
  const [assignSelectedAdmin, setAssignSelectedAdmin] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingRow, setViewingRow] = useState(null)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [addressFilter, setAddressFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

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

  const { data, isLoading, mutate } = useSWR(
    ['/societies', page, limit, search, addressFilter, statusFilter, sortBy, sortOrder],
    () =>
      apartmentApi
        .getAll({
          page,
          limit,
          search: search || undefined,
          address: addressFilter || undefined,
          status: statusFilter || undefined,
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

  const { data: apartmentDetailData } = useSWR(
    openDialog && editingSociety?.id ? ['/apartment-detail', editingSociety.id] : null,
    () => apartmentApi.getById(editingSociety.id).then(res => res.data)
  )
  const apartmentDetail = apartmentDetailData?.data

  // Full apartment detail for View dialog (so we show latest data and can show "—" for unset counts)
  const { data: viewDetailData } = useSWR(
    viewDialogOpen && viewingRow?.id ? ['/apartment-detail-view', viewingRow.id] : null,
    () => apartmentApi.getById(viewingRow.id).then(res => res.data)
  )
  const viewApartmentDetail = viewDetailData?.data

  const [activatingId, setActivatingId] = useState(null)

  const handleActivateSubscription = async (subscriptionId) => {
    if (!subscriptionId) return
    setActivatingId(subscriptionId)
    try {
      await superAdminApi.updateSubscriptionStatus(subscriptionId, { status: 'active' })
      toast.success('Subscription activated. Client can now log in.')
      mutate()
      mutateAdmins()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Activation failed')
    } finally {
      setActivatingId(null)
    }
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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingSociety) {
        await apartmentApi.update(editingSociety.id, {
          name: values.name,
          address: values.address,
          city: values.city,
          area: values.area,
          total_blocks: values.total_blocks,
          total_floors: values.total_floors,
          total_units: values.total_units,
          is_active: values.is_active,
          union_admin_name: values.union_admin_name || null,
          union_admin_email: values.union_admin_email || null,
          union_admin_phone: values.union_admin_phone || null,
        })
        toast.success('Apartment updated successfully')
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
        toast.success('Apartment created successfully.')
      }
      mutate()
      handleCloseDialog()
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
      toast.success('Apartment deleted successfully')
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
            Delete this apartment?
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
            onClick={() => label !== '—' && (setViewingRow(row), setViewDialogOpen(true))}
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
    {
      id: 'name',
      label: 'Apartment Name',
      minWidth: 180,
      header: (
        <TableSortLabel
          active={sortBy === 'name'}
          direction={sortBy === 'name' ? sortOrder : 'asc'}
          onClick={() => handleSort('name')}
        >
          Apartment Name
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
            onClick={() => (setViewingRow(row), setViewDialogOpen(true))}
          >
            {label}
          </Typography>
        )
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
    { id: 'address', label: 'Address' },
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
                    setViewingRow(actionMenu.row)
                    setViewDialogOpen(true)
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
                  const pendingAdmin = admins.find(
                    (a) => a.society_apartment_id === actionMenu.row.id && (a.subscription_status || '').toLowerCase() === 'pending'
                  )
                  return pendingAdmin?.subscription_id ? (
                    <MenuItem
                      onClick={() => {
                        handleActivateSubscription(pendingAdmin.subscription_id)
                        closeActionMenu()
                      }}
                      disabled={activatingId === pendingAdmin.subscription_id}
                      sx={{ color: 'success.main' }}
                    >
                      <ListItemIcon><PlayArrowIcon fontSize="small" color="success" /></ListItemIcon>
                      <ListItemText>Activate subscription</ListItemText>
                    </MenuItem>
                  ) : null
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
                  <ListItemText>Edit apartment</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => confirmDelete(actionMenu.row.id)}
                  sx={{ color: 'error.main' }}
                >
                  <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                  <ListItemText>Delete apartment</ListItemText>
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
      }

  const totalLeads = data?.pagination?.total ?? (data?.data?.length ?? 0)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Apartments Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Total leads: {isLoading ? '—' : totalLeads}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Apartment
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          sx={{ minWidth: 200, flex: '1 1 200px' }}
          placeholder="Search apartments..."
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
            renderValue: (v) => (v === '' ? 'All' : v === 'active' ? 'Active (subscribed)' : 'Inactive (waiting)'),
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active (subscribed)</MenuItem>
          <MenuItem value="inactive">Inactive (waiting for subscription)</MenuItem>
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={!!editingSociety}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form>
              <DialogTitle>
                {editingSociety ? 'Edit Apartment' : 'Add New Apartment'}
              </DialogTitle>
              <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Blocks, floors and units are optional. You can add them here or later from Blocks / Floors / Units.
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Apartment name"
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
      </Dialog>

      <Dialog
        open={viewDialogOpen}
        onClose={() => { setViewDialogOpen(false); setViewingRow(null) }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Apartment &amp; Union Admin details</DialogTitle>
        <DialogContent dividers>
          {viewingRow && (() => {
            const viewApartment = { ...viewingRow, ...(viewApartmentDetail ?? {}) }
            const showCount = (v) => (v == null || v === '') ? '—' : v
            return (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Apartment</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Apartment Name</Typography>
                <Typography variant="body1">{viewApartment.name || '—'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Address</Typography>
                <Typography variant="body1">{viewApartment.address || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">City</Typography>
                <Typography variant="body1">{viewApartment.city || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Area</Typography>
                <Typography variant="body1">{viewApartment.area || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Total Blocks</Typography>
                <Typography
                  variant="body1"
                  sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => {
                    setViewDialogOpen(false)
                    setViewingRow(null)
                    navigate(`/super-admin/blocks?society_id=${viewingRow.id}`)
                  }}
                >
                  {showCount(viewApartment.total_blocks)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Total Floors</Typography>
                <Typography
                  variant="body1"
                  sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => {
                    setViewDialogOpen(false)
                    setViewingRow(null)
                    navigate(`/super-admin/floors?society_id=${viewingRow.id}`)
                  }}
                >
                  {showCount(viewApartment.total_floors)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Total Units</Typography>
                <Typography
                  variant="body1"
                  sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => {
                    setViewDialogOpen(false)
                    setViewingRow(null)
                    navigate(`/super-admin/units?society_id=${viewingRow.id}`)
                  }}
                >
                  {showCount(viewApartment.total_units)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Union Admin</Typography>
              </Grid>
              {(() => {
                const admin = admins.find((a) => a.society_apartment_id === viewingRow.id)
                if (!admin) {
                  const hasStored = viewApartment.union_admin_name || viewApartment.union_admin_email || viewApartment.union_admin_phone
                  return (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">No Union Admin assigned.</Typography>
                      </Grid>
                      {hasStored && (
                        <>
                          {viewApartment.union_admin_name && (
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">Lead contact name</Typography>
                              <Typography variant="body1">{viewApartment.union_admin_name}</Typography>
                            </Grid>
                          )}
                          {viewApartment.union_admin_email && (
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">Lead contact email</Typography>
                              <Typography variant="body1">{viewApartment.union_admin_email}</Typography>
                            </Grid>
                          )}
                          {viewApartment.union_admin_phone && (
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">Lead contact phone</Typography>
                              <Typography variant="body1">{viewApartment.union_admin_phone}</Typography>
                            </Grid>
                          )}
                        </>
                      )}
                    </>
                  )
                }
                const subscriptionActivated = ['active', 'trial'].includes((admin.subscription_status || '').toLowerCase())
                return (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                      <Typography variant="body1">{admin.name || '—'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{admin.email || '—'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                      <Typography variant="body1">{admin.contact_number || '—'}</Typography>
                    </Grid>
                    {subscriptionActivated && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Subscription Status</Typography>
                          <Typography variant="body1">{admin.subscription_status || '—'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Plan</Typography>
                          <Typography variant="body1">{admin.plan_name ? `${admin.plan_name} (${admin.plan_amount ?? 0} PKR)` : '—'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Next Billing Date</Typography>
                          <Typography variant="body1">{admin.next_billing_date ? new Date(admin.next_billing_date).toLocaleDateString() : '—'}</Typography>
                        </Grid>
                      </>
                    )}
                  </>
                )
              })()}
            </Grid>
            )
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setViewDialogOpen(false); setViewingRow(null) }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(assignAdminRow)} onClose={handleCloseAssignAdmin} maxWidth="xs" fullWidth>
        <DialogTitle>Assign Union Admin</DialogTitle>
        <DialogContent>
          {assignAdminRow && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Apartment: <strong>{assignAdminRow.name}</strong>
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
    </Container>
  )
}
export default Apartments