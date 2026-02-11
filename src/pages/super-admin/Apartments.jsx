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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import LayersIcon from '@mui/icons-material/Layers'
import DomainIcon from '@mui/icons-material/Domain'
import useSWR from 'swr'
import { apartmentApi } from '@/api/apartmentApi'
import { propertyApi } from '@/api/propertyApi'
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
})

const Apartments = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingSociety, setEditingSociety] = useState(null)
  const [actionMenu, setActionMenu] = useState({ anchorEl: null, row: null })

  const openActionMenu = (e, row) => {
    e.stopPropagation()
    setActionMenu({ anchorEl: e.currentTarget, row })
  }
  const closeActionMenu = () => setActionMenu({ anchorEl: null, row: null })

  const { data, isLoading, mutate } = useSWR(
    ['/societies', page, limit, search],
    () => apartmentApi.getAll({ page, limit, search }).then(res => res.data)
  )

  const handleOpenDialog = (society = null) => {
    setEditingSociety(society)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingSociety(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingSociety) {
        await apartmentApi.update(editingSociety.id, values)
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
        toast.success('Apartment created successfully')
      }
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this apartment?')) {
      try {
        await apartmentApi.remove(id)
        toast.success('Apartment deleted successfully')
        mutate()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed')
      }
    }
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'address', label: 'Address' },
    { id: 'city', label: 'City' },
    { id: 'area', label: 'Area' },
    { id: 'total_blocks', label: 'Blocks' },
    { id: 'total_floors', label: 'Floors' },
    { id: 'total_units', label: 'Units' },
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
                  onClick={() => {
                    handleDelete(actionMenu.row.id)
                    closeActionMenu()
                  }}
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

  const initialValues = editingSociety
    ? {
        name: editingSociety.name || '',
        address: editingSociety.address || '',
        city: editingSociety.city || '',
        area: editingSociety.area || '',
        total_blocks: editingSociety.total_blocks || 0,
        total_floors: editingSociety.total_floors ?? 0,
        total_units: editingSociety.total_units || 0,
        blockNames: [],
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
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
                    <AddressAutocomplete
                      fullWidth
                      label="Address (from map or type manually)"
                      name="address"
                      value={values.address || ''}
                      onChange={(e) => handleChange({ target: { name: 'address', value: e.target.value } })}
                      onBlur={handleBlur}
                      onPlaceSelect={({ address, city, area, name: placeName }) => {
                        setFieldValue('address', address || '')
                        setFieldValue('city', city || '')
                        setFieldValue('area', area || '')
                        setFieldValue('name', placeName != null && placeName !== '' ? placeName : (address ? address.split(',')[0].trim() : ''))
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
                      disabled={!!editingSociety}
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
    </Container>
  )
}

export default Apartments
