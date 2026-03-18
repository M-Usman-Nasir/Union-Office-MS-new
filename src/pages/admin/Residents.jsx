import { useState, useEffect } from 'react'
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
  IconButton,
  Tabs,
  Tab,
  Menu,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import RemoveIcon from '@mui/icons-material/Remove'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { residentApi } from '@/api/residentApi'
import { propertyApi } from '@/api/propertyApi'
import { apartmentApi } from '@/api/apartmentApi'
import DataTable from '@/components/common/DataTable'
import { ROUTES } from '@/utils/constants'
import dayjs from 'dayjs'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const getValidationSchema = (isEdit, apartmentCreatedAt) => {
  const passwordField = Yup.string()
    .transform((v) => (v === '' || v === undefined ? undefined : v))
    .optional()
    .test('min-if-set', 'Password must be at least 6 characters', (v) => !v || String(v).length >= 6)

  const schema = {
  name: Yup.string().required('Name is required'),
  society_apartment_id: Yup.number().required('Society is required'),
  contact_number: Yup.string(),
  cnic: Yup.string(),
  emergency_contact: Yup.string(),
  move_in_date: Yup.date()
    .nullable()
    .test(
      'not-before-apartment',
      'Move-in date must be on or after the apartment creation date',
      (value) => {
        if (value == null) return true
        if (apartmentCreatedAt == null) return true
        const moveIn = dayjs(value).startOf('day')
        const created = dayjs(apartmentCreatedAt).startOf('day')
        return !moveIn.isBefore(created)
      }
    ),
  password: passwordField,
  }
  if (!isEdit) {
    schema.unit_id = Yup.mixed().required('Select block, floor, and unit')
  }
  return Yup.object(schema)
}

const Residents = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingResident, setEditingResident] = useState(null)
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [selectedFloorId, setSelectedFloorId] = useState('')
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null)
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [actionMenuRow, setActionMenuRow] = useState(null)
  // Cascading Block → Floor → Unit: used for fetching floors/units in Add/Edit dialog
  const [formBlockId, setFormBlockId] = useState('')
  const [formFloorId, setFormFloorId] = useState('')
  /** Toggle password visibility in Add New Resident dialog */
  const [showPassword, setShowPassword] = useState(false)
  /** Login email preview for selected unit (add flow) */
  const [unitLoginPreview, setUnitLoginPreview] = useState(null)

  const societyId = user?.society_apartment_id != null ? Number(user.society_apartment_id) : null
  const fetchParams = { page, limit, search, society_id: societyId }
  if (selectedBlockId != null && selectedBlockId !== '') {
    fetchParams.block_id = selectedBlockId
  }
  if (selectedFloorId != null && selectedFloorId !== '') {
    fetchParams.floor_id = selectedFloorId
  }

  const { data, isLoading, mutate } = useSWR(
    user ? ['/residents', page, limit, search, societyId, selectedBlockId, selectedFloorId] : null,
    () => residentApi.getAll(fetchParams).then(res => res.data)
  )

  const { data: blocksData } = useSWR(
    societyId ? ['/blocks', societyId] : null,
    () => propertyApi.getBlocks({ society_id: societyId }).then(res => res.data)
  )

  // When editing a resident with a unit, fetch unit to get block_id and floor_id for cascading dropdowns
  const { data: unitForEditData } = useSWR(
    openDialog && editingResident?.unit_id
      ? ['/unit', editingResident.unit_id]
      : null,
    () => propertyApi.getUnitById(editingResident.unit_id).then(res => res.data)
  )
  const unitForEdit = unitForEditData?.data ?? unitForEditData

  // Floors for the selected block in Add/Edit dialog
  const { data: floorsData } = useSWR(
    formBlockId ? ['/floors', formBlockId] : null,
    () => propertyApi.getFloors({ block_id: formBlockId }).then(res => res.data)
  )
  // Units filtered by block (and optionally floor) in Add/Edit dialog
  const { data: dialogUnitsData } = useSWR(
    formBlockId && societyId ? ['/units-dialog', societyId, formBlockId, formFloorId] : null,
    () =>
      propertyApi
        .getUnits({
          society_id: societyId,
          block_id: formBlockId,
          ...(formFloorId ? { floor_id: formFloorId } : {}),
        })
        .then(res => res.data)
  )

  const blocks = blocksData?.data || []
  const floors = floorsData?.data || []
  const dialogUnits = dialogUnitsData?.data || []

  // Current society (apartment) for display name in form
  const { data: currentSocietyData } = useSWR(
    societyId ? ['/society', societyId] : null,
    () => apartmentApi.getById(societyId).then(res => res.data)
  )
  const currentSociety = currentSocietyData?.data
  const apartmentOptions = currentSociety ? [{ id: currentSociety.id, name: currentSociety.name || `Apartment #${currentSociety.id}` }] : []

  // Floors for selected block (for floor filter dropdown)
  const { data: flatsFloorsData } = useSWR(
    selectedBlockId ? ['/floors-block', selectedBlockId] : null,
    () => propertyApi.getFloors({ block_id: selectedBlockId }).then(res => res.data)
  )

  const handleOpenDialog = (resident = null) => {
    setEditingResident(resident)
    setShowPassword(false)
    setUnitLoginPreview(resident?.email || null)
    setFormBlockId('')
    setFormFloorId('')
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingResident(null)
    setShowPassword(false)
    setUnitLoginPreview(null)
    setFormBlockId('')
    setFormFloorId('')
  }

  // When editing and unit loads, set block/floor so cascading dropdowns fetch the right data
  useEffect(() => {
    if (openDialog && unitForEdit) {
      setFormBlockId(unitForEdit.block_id ?? '')
      setFormFloorId(unitForEdit.floor_id ?? '')
    }
  }, [openDialog, unitForEdit])

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Prepare data for backend
      const submitData = { ...values }

      // block_id and floor_id are only for cascading UI; backend expects only unit_id
      delete submitData.block_id
      delete submitData.floor_id
      delete submitData.email

      // Ensure is_active is boolean for API
      submitData.is_active = submitData.is_active === true || submitData.is_active === 'true'

      // Clean up empty strings - convert to null for optional fields
      const optionalFields = ['contact_number', 'cnic', 'emergency_contact', 'move_in_date', 'unit_id', 'owner_name', 'license_plate', 'number_of_cars', 'number_of_bikes', 'car_make_model', 'bike_make_model', 'bike_license_plate']
      optionalFields.forEach(field => {
        if (submitData[field] === '') {
          submitData[field] = null
        }
      })
      
      // Filter out empty telephone_bills and other_bills entries
      if (submitData.telephone_bills && Array.isArray(submitData.telephone_bills)) {
        submitData.telephone_bills = submitData.telephone_bills.filter(bill => 
          bill && (bill.provider || bill.account_number || bill.amount)
        )
      }
      if (submitData.other_bills && Array.isArray(submitData.other_bills)) {
        submitData.other_bills = submitData.other_bills.filter(bill => 
          bill && (bill.type || bill.provider || bill.amount)
        )
      }
      
      if (editingResident) {
        // For update, remove password if not provided
        if (!submitData.password) {
          delete submitData.password
        }
        // Remove role as backend doesn't accept it
        delete submitData.role
        await residentApi.update(editingResident.id, submitData)
        toast.success('Resident updated successfully')
      } else {
        // For create, ensure society_apartment_id is set
        if (!submitData.society_apartment_id && societyId) {
          submitData.society_apartment_id = societyId
        }
        // Remove role as backend hardcodes it to 'resident'
        delete submitData.role
        if (!submitData.password) delete submitData.password
        await residentApi.create(submitData)
        toast.success(
          'Resident saved. They sign in with the unit login email and initial password Password1! (unless you set a custom password).'
        )
      }
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleView = (row) => {
    setActionMenuAnchor(null)
    setActionMenuRow(null)
    navigate(ROUTES.ADMIN_RESIDENT_PROFILE(row.id))
  }

  const handleDeleteClick = (id) => {
    setIdToDelete(id)
    setDeleteConfirmOpen(true)
    setActionMenuAnchor(null)
    setActionMenuRow(null)
  }

  const handleDeleteConfirm = async () => {
    if (!idToDelete) return
    try {
      await residentApi.remove(idToDelete)
      toast.success('Resident deleted successfully')
      mutate()
      setDeleteConfirmOpen(false)
      setIdToDelete(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    setIdToDelete(null)
  }

  const handleActionMenuOpen = (event, row) => {
    event.stopPropagation()
    setActionMenuAnchor(event.currentTarget)
    setActionMenuRow(row)
  }

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null)
    setActionMenuRow(null)
  }

  const columns = [
    {
      id: 'name',
      label: 'Full Name',
      render: (row) => {
        const nameContent = row.name || '-'
        const handleNameClick = (e) => {
          e.stopPropagation()
          handleView(row)
        }
        return (
          <Typography
            component="span"
            variant="body2"
            onClick={handleNameClick}
            sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
          >
            {nameContent}
          </Typography>
        )
      },
    },
    { id: 'unit_number', label: 'Unit No.', render: (row) => row.unit_number || '-' },
    {
      id: 'floor_number',
      label: 'Floor No.',
      render: (row) => {
        const fn = row.floor_number != null ? Number(row.floor_number) : null
        if (fn === null) return '-'
        if (fn === 0) return 'Ground'
        if (fn === 1) return '1st'
        if (fn === 2) return '2nd'
        if (fn === 3) return '3rd'
        return `${fn}th`
      },
    },
    {
      id: 'move_in_date',
      label: 'Move-in date',
      render: (row) => (row.move_in_date ? dayjs(row.move_in_date).format('DD MMM YYYY') : '-'),
    },
    { id: 'contact_number', label: 'Phone No.', render: (row) => row.contact_number || '-' },
    { id: 'email', label: 'Email', render: (row) => row.email || '-' },
    {
      id: 'defaulter_status',
      label: 'Defaulter status',
      render: (row) =>
        row.is_defaulter ? (
          <Chip label="Defaulter" size="small" color="error" variant="outlined" />
        ) : (
          <Chip label="Non-defaulter" size="small" color="success" variant="outlined" />
        ),
    },
    {
      id: 'is_active',
      label: 'Status',
      render: (row) => (
        <Chip
          size="small"
          label={row.is_active !== false ? 'Active' : 'Inactive'}
          color={row.is_active !== false ? 'success' : 'default'}
          variant="outlined"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Action',
      align: 'right',
      render: (row) => (
        <IconButton
          size="small"
          onClick={(e) => handleActionMenuOpen(e, row)}
          aria-label="Actions"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  // Format date for date input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toISOString().split('T')[0]
  }

  const initialValues = editingResident
    ? {
        email: editingResident.email || '',
        name: editingResident.name || '',
        society_apartment_id: editingResident.society_apartment_id || societyId || '',
        contact_number: editingResident.contact_number || '',
        cnic: editingResident.cnic || '',
        emergency_contact: editingResident.emergency_contact || '',
        move_in_date: formatDateForInput(editingResident.move_in_date),
        block_id: unitForEdit?.block_id ?? '',
        floor_id: unitForEdit?.floor_id ?? '',
        unit_id: editingResident.unit_id || '',
        owner_name: editingResident.owner_name || '',
        license_plate: editingResident.license_plate ?? unitForEdit?.license_plate ?? '',
        number_of_cars: editingResident.number_of_cars ?? unitForEdit?.number_of_cars ?? 0,
        number_of_bikes: editingResident.number_of_bikes ?? unitForEdit?.number_of_bikes ?? 0,
        car_make_model: editingResident.car_make_model ?? unitForEdit?.car_make_model ?? '',
        bike_make_model: editingResident.bike_make_model ?? unitForEdit?.bike_make_model ?? '',
        bike_license_plate: editingResident.bike_license_plate ?? unitForEdit?.bike_license_plate ?? '',
        telephone_bills: Array.isArray(editingResident.telephone_bills) ? editingResident.telephone_bills : [],
        other_bills: Array.isArray(editingResident.other_bills) ? editingResident.other_bills : [],
        is_active: editingResident.is_active !== false,
      }
    : {
        email: '',
        password: '',
        name: '',
        society_apartment_id: societyId || '',
        contact_number: '',
        cnic: '',
        emergency_contact: '',
        move_in_date: '',
        block_id: '',
        floor_id: '',
        unit_id: '',
        owner_name: '',
        license_plate: '',
        number_of_cars: 0,
        number_of_bikes: 0,
        car_make_model: '',
        bike_make_model: '',
        bike_license_plate: '',
        telephone_bills: [],
        other_bills: [],
        is_active: false,
      }

  const floorsForBlock = flatsFloorsData?.data ?? []

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="h4" component="h1">
            Residents Management
          </Typography>
          {currentSociety?.name && (
            <Typography
              variant="h5"
              component="span"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(25, 118, 210, 0.12)',
              }}
            >
              {currentSociety.name}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Resident
        </Button>
      </Box>

      {blocks.length > 0 && (
        <Tabs
          value={selectedBlockId ?? ''}
          onChange={(_, v) => {
            setSelectedBlockId(v === '' ? null : v)
            setSelectedFloorId('')
            setPage(1)
          }}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 2,
            '& .MuiTab-root:hover': { color: 'primary.main' },
          }}
        >
          <Tab label="All blocks" value="" />
          {blocks.map((block) => (
            <Tab key={block.id} label={block.name} value={block.id} />
          ))}
        </Tabs>
      )}

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {selectedBlockId && floorsForBlock.length > 0 && (
          <TextField
            select
            label="Floor"
            value={selectedFloorId}
            onChange={(e) => {
              setSelectedFloorId(e.target.value)
              setPage(1)
            }}
            sx={{ minWidth: 160 }}
            size="small"
          >
            <MenuItem value="">All floors</MenuItem>
            {floorsForBlock
              .slice()
              .sort((a, b) => (a.floor_number ?? 0) - (b.floor_number ?? 0))
              .map((floor) => (
                <MenuItem key={floor.id} value={floor.id}>
                  {floor.floor_number === 0 ? 'Ground' : floor.floor_number === 1 ? '1st' : floor.floor_number === 2 ? '2nd' : floor.floor_number === 3 ? '3rd' : `${floor.floor_number}th`} floor
                </MenuItem>
              ))}
          </TextField>
        )}
        <TextField
          fullWidth
          sx={{ flex: '1 1 200px' }}
          placeholder="Search residents..."
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

      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            if (actionMenuRow) handleView(actionMenuRow)
          }}
        >
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (actionMenuRow) handleOpenDialog(actionMenuRow)
            handleActionMenuClose()
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (actionMenuRow) handleDeleteClick(actionMenuRow.id)
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

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
        dense
      />

      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete resident?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this resident? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <Formik
          key={editingResident ? `edit-${editingResident.id}` : 'add-new'}
          initialValues={initialValues}
          validationSchema={getValidationSchema(!!editingResident, currentSociety?.created_at)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
            <Form autoComplete="off">
              <DialogTitle>
                {editingResident ? 'Edit Resident' : 'Add New Resident'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  {editingResident && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Login email (from unit)"
                        name="email_display"
                        value={editingResident.email || ''}
                        disabled
                        helperText="Tied to unit; cannot be changed here"
                      />
                    </Grid>
                  )}
                  {editingResident && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Password (leave blank to keep current)"
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
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Apartment"
                      name="society_apartment_id"
                      value={values.society_apartment_id ?? ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.society_apartment_id && !!errors.society_apartment_id}
                      helperText={touched.society_apartment_id && errors.society_apartment_id}
                      disabled={!!societyId}
                      required
                    >
                      <MenuItem value="">Select Apartment</MenuItem>
                      {apartmentOptions.map((apt) => (
                        <MenuItem key={apt.id} value={apt.id}>
                          {apt.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      name="contact_number"
                      value={values.contact_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CNIC"
                      name="cnic"
                      value={values.cnic}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="42101-1234567-8"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Emergency Contact"
                      name="emergency_contact"
                      value={values.emergency_contact}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0300-1234567"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Move-in Date"
                      name="move_in_date"
                      type="date"
                      value={values.move_in_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.move_in_date && !!errors.move_in_date}
                      helperText={touched.move_in_date && errors.move_in_date}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Block"
                      name="block_id"
                      value={values.block_id}
                      onChange={(e) => {
                        const v = e.target.value
                        handleChange(e)
                        setFieldValue('floor_id', '')
                        setFieldValue('unit_id', '')
                        setUnitLoginPreview(null)
                        setFormBlockId(v)
                        setFormFloorId('')
                      }}
                      onBlur={handleBlur}
                      disabled={!!editingResident}
                    >
                      <MenuItem value="">Select block</MenuItem>
                      {blocks.map((block) => (
                        <MenuItem key={block.id} value={block.id}>
                          {block.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Floor"
                      name="floor_id"
                      value={values.floor_id}
                      onChange={(e) => {
                        const v = e.target.value
                        handleChange(e)
                        setFieldValue('unit_id', '')
                        setUnitLoginPreview(null)
                        setFormFloorId(v)
                      }}
                      onBlur={handleBlur}
                      disabled={!values.block_id || !!editingResident}
                    >
                      <MenuItem value="">Select floor</MenuItem>
                      {floors.map((floor) => (
                        <MenuItem key={floor.id} value={floor.id}>
                          Floor {floor.floor_number}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Unit (Flat)"
                      name="unit_id"
                      value={values.unit_id}
                      onChange={async (e) => {
                        const uid = e.target.value
                        handleChange(e)
                        if (!editingResident && uid) {
                          try {
                            const res = await propertyApi.getUnitLoginEmailPreview(uid)
                            setUnitLoginPreview(res.data?.data?.email || null)
                          } catch {
                            setUnitLoginPreview(null)
                          }
                        } else if (!uid) {
                          setUnitLoginPreview(null)
                        }
                      }}
                      onBlur={handleBlur}
                      disabled={!values.block_id || !!editingResident}
                    >
                      <MenuItem value="">Select unit</MenuItem>
                      {dialogUnits.map((unit) => (
                        <MenuItem key={unit.id} value={unit.id}>
                          Unit {unit.unit_number}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {!editingResident && values.unit_id && (
                    <Grid item xs={12}>
                      <Alert severity="info">
                        <strong>Login email:</strong>{' '}
                        {unitLoginPreview || (
                          <CircularProgress size={16} sx={{ verticalAlign: 'middle', ml: 0.5 }} />
                        )}
                        <br />
                        <strong>Initial password:</strong> Password1! (resident must change on first login, unless
                        you set a custom password below)
                      </Alert>
                    </Grid>
                  )}
                  {!editingResident && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Custom password (optional)"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && !!errors.password}
                        helperText={
                          (touched.password && errors.password) ||
                          'Leave blank to use Password1! — resident will change it on first login'
                        }
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
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Number of cars"
                      name="number_of_cars"
                      value={values.number_of_cars}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {[0, 1, 2, 3, 4, 5].map((n) => (
                        <MenuItem key={n} value={n}>{n}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Number of bikes"
                      name="number_of_bikes"
                      value={values.number_of_bikes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {[0, 1, 2, 3, 4, 5].map((n) => (
                        <MenuItem key={n} value={n}>{n}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="License Plate (car)"
                      name="license_plate"
                      value={values.license_plate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Car make &amp; model"
                      name="car_make_model"
                      value={values.car_make_model}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Toyota Corolla"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bike make &amp; model"
                      name="bike_make_model"
                      value={values.bike_make_model}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Honda 70"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bike license plate"
                      name="bike_license_plate"
                      value={values.bike_license_plate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Telephone Bills
                    </Typography>
                    {values.telephone_bills?.map((bill, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Provider"
                              value={bill.provider || ''}
                              onChange={(e) => {
                                const newBills = [...(values.telephone_bills || [])]
                                newBills[index] = { ...newBills[index], provider: e.target.value }
                                setFieldValue('telephone_bills', newBills)
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Account Number"
                              value={bill.account_number || ''}
                              onChange={(e) => {
                                const newBills = [...(values.telephone_bills || [])]
                                newBills[index] = { ...newBills[index], account_number: e.target.value }
                                handleChange({ target: { name: 'telephone_bills', value: newBills } })
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Amount"
                              type="number"
                              inputProps={{ min: 0 }}
                              value={bill.amount || ''}
                              onChange={(e) => {
                                const raw = e.target.value
                                const amount = raw === '' ? 0 : Math.max(0, parseFloat(raw) || 0)
                                const newBills = [...(values.telephone_bills || [])]
                                newBills[index] = { ...newBills[index], amount }
                                handleChange({ target: { name: 'telephone_bills', value: newBills } })
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                const newBills = values.telephone_bills.filter((_, i) => i !== index)
                                setFieldValue('telephone_bills', newBills)
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        const newBills = [...(values.telephone_bills || []), { provider: '', account_number: '', amount: 0 }]
                        setFieldValue('telephone_bills', newBills)
                      }}
                    >
                      Add Telephone Bill
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Other Bills
                    </Typography>
                    {values.other_bills?.map((bill, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Type"
                              value={bill.type || ''}
                              onChange={(e) => {
                                const newBills = [...(values.other_bills || [])]
                                newBills[index] = { ...newBills[index], type: e.target.value }
                                setFieldValue('other_bills', newBills)
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Provider"
                              value={bill.provider || ''}
                              onChange={(e) => {
                                const newBills = [...(values.other_bills || [])]
                                newBills[index] = { ...newBills[index], provider: e.target.value }
                                handleChange({ target: { name: 'other_bills', value: newBills } })
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Amount"
                              type="number"
                              inputProps={{ min: 0 }}
                              value={bill.amount || ''}
                              onChange={(e) => {
                                const raw = e.target.value
                                const amount = raw === '' ? 0 : Math.max(0, parseFloat(raw) || 0)
                                const newBills = [...(values.other_bills || [])]
                                newBills[index] = { ...newBills[index], amount }
                                handleChange({ target: { name: 'other_bills', value: newBills } })
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                const newBills = values.other_bills.filter((_, i) => i !== index)
                                setFieldValue('other_bills', newBills)
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        const newBills = [...(values.other_bills || []), { type: '', provider: '', amount: 0 }]
                        setFieldValue('other_bills', newBills)
                      }}
                    >
                      Add Other Bill
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {editingResident ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default Residents
