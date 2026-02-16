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
    assigned_union_admin_id: Yup.number().nullable(),
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

  const openActionMenu = (e, row) => {
    e.stopPropagation()
    setActionMenu({ anchorEl: e.currentTarget, row })
  }
  const closeActionMenu = () => setActionMenu({ anchorEl: null, row: null })

  const { data, isLoading, mutate } = useSWR(
    ['/societies', page, limit, search],
    () => apartmentApi.getAll({ page, limit, search }).then(res => res.data)
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
        })
        if (values.assigned_union_admin_id && !assignedAdminForEdit) {
          await userApi.update(values.assigned_union_admin_id, { society_apartment_id: editingSociety.id })
        }
        toast.success('Apartment updated successfully')
      } else {
        const payload = {
          name: values.name,
          address: values.address,
          city: values.city,
          area: values.area || null,
          total_blocks: values.total_blocks || 0,
          total_floors: values.total_floors || 0,
          total_units: values.total_units || 0,
        }
        const res = await apartmentApi.create(payload)
        const newId = res?.data?.data?.id
        if (newId && Array.isArray(values.blockNames) && values.blockNames.length > 0) {
          const totalFloors = values.total_floors || 0
          const totalUnits = values.total_units || 0
          const numBlocks = values.blockNames.length
          const unitsPerBlock = Math.floor(totalUnits / numBlocks)
          const remainder = totalUnits % numBlocks
          for (let i = 0; i < numBlocks; i++) {
            const name = (values.blockNames[i] || '').trim() || `Block ${i + 1}`
            const blockUnits = unitsPerBlock + (i < remainder ? 1 : 0)
            await propertyApi.createBlock({
              society_apartment_id: newId,
              name,
              total_floors: totalFloors,
              total_units: blockUnits,
            })
          }
        }
        // Assign selected unassigned Union Admin to this apartment
        if (newId && values.assigned_union_admin_id) {
          await userApi.update(values.assigned_union_admin_id, { society_apartment_id: newId })
        }
        toast.success(values.assigned_union_admin_id ? 'Apartment created and Union Admin assigned.' : 'Apartment created successfully.')
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
      id: 'name',
      label: 'Name',
      minWidth: 180,
      render: (row) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {row.name || '—'}
        </Typography>
      ),
    },
    { id: 'address', label: 'Address' },
    {
      id: 'union_admin',
      label: 'Union Admin',
      minWidth: 160,
      render: (row) => {
        const admin = admins.find((a) => a.society_apartment_id === row.id)
        return (
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {admin ? admin.name : '—'}
          </Typography>
        )
      },
    },
    { id: 'city', label: 'City' },
    { id: 'area', label: 'Area' },
    { id: 'total_blocks', label: 'Block' },
    { id: 'total_floors', label: 'Floor' },
    {
      id: 'total_units',
      label: 'Unit',
      render: (row) => (row.total_units == null || Number(row.total_units) === 0 ? 'N/A' : row.total_units),
    },
    {
      id: 'actions',
      label: 'Action',
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
        blockNames: [],
        assigned_union_admin_id: assignedAdminForEdit?.id ?? null,
      }
    : {
        name: '',
        address: '',
        city: '',
        area: '',
        total_blocks: 0,
        total_floors: 0,
        total_units: 0,
        blockNames: [],
        assigned_union_admin_id: null,
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

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search apartments..."
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
          enableReinitialize
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
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Total Units"
                      name="total_units"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={values.total_units}
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
                  <Grid item xs={12} sx={{ position: 'relative', zIndex: 10 }}>
                      <Typography variant="subtitle1" sx={{ mt: 1, mb: 0.5, fontWeight: 600 }}>
                        Union Admin {editingSociety ? '(assigned to this apartment)' : '(assign to this apartment)'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        {editingSociety && assignedAdminForEdit
                          ? 'Assigned admin cannot be changed here.'
                          : 'Type to search. Only unassigned Union Admins are shown.'}
                      </Typography>
                      <Autocomplete
                        fullWidth
                        options={
                          assignedAdminForEdit
                            ? [assignedAdminForEdit, ...unassignedUnionAdmins]
                            : unassignedUnionAdmins
                        }
                        getOptionLabel={(option) => (option && option.name) || ''}
                        value={
                          assignedAdminForEdit ||
                          unassignedUnionAdmins.find((a) => a.id === values.assigned_union_admin_id) ||
                          null
                        }
                        onChange={(_, newValue) => {
                          setFieldValue('assigned_union_admin_id', newValue ? newValue.id : null)
                        }}
                        onBlur={() => handleBlur({ target: { name: 'assigned_union_admin_id' } })}
                        disabled={!!assignedAdminForEdit}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="assigned_union_admin_id"
                            label="Select Union Admin"
                            error={touched.assigned_union_admin_id && !!errors.assigned_union_admin_id}
                            helperText={touched.assigned_union_admin_id && errors.assigned_union_admin_id}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name} {option.email ? `(${option.email})` : ''}
                          </li>
                        )}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
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