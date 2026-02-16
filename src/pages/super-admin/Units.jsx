import { useState, useEffect } from 'react'
import { useSearchParams, Link as RouterLink } from 'react-router-dom'
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
  Tooltip,
  Chip,
  Breadcrumbs,
  Link,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import useSWR from 'swr'
import { propertyApi } from '@/api/propertyApi'
import { apartmentApi } from '@/api/apartmentApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const validationSchema = Yup.object({
  society_apartment_id: Yup.number().required('Apartment is required'),
  block_id: Yup.number().required('Block is required'),
  floor_id: Yup.number().required('Floor is required'),
  unit_number: Yup.string().required('Unit number is required'),
})

const Units = () => {
  const [searchParams] = useSearchParams()
  const societyIdFromUrl = searchParams.get('society_id')
  const blockIdFromUrl = searchParams.get('block_id')
  const [societyFilter, setSocietyFilter] = useState('')
  const [blockFilter, setBlockFilter] = useState('')
  const [floorFilter, setFloorFilter] = useState('')
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUnit, setEditingUnit] = useState(null)
  const [openBulkDialog, setOpenBulkDialog] = useState(false)
  const [bulkCount, setBulkCount] = useState(1)
  const [bulkSubmitting, setBulkSubmitting] = useState(false)

  useEffect(() => {
    if (societyIdFromUrl) setSocietyFilter(societyIdFromUrl)
  }, [societyIdFromUrl])

  useEffect(() => {
    if (blockIdFromUrl) setBlockFilter(blockIdFromUrl)
  }, [blockIdFromUrl])

  const { data: currentSocietyData } = useSWR(
    societyIdFromUrl ? ['/society', societyIdFromUrl] : null,
    () => apartmentApi.getById(societyIdFromUrl).then(res => res.data)
  )
  const currentSocietyName = currentSocietyData?.data?.name

  const { data: societiesData } = useSWR(
    '/societies',
    () => apartmentApi.getAll({ limit: 100 }).then(res => res.data)
  )

  const { data: blocksData } = useSWR(
    societyFilter ? ['/blocks', societyFilter] : null,
    () => propertyApi.getBlocks({ society_id: societyFilter }).then(res => res.data)
  )

  const { data: floorsData } = useSWR(
    blockFilter ? ['/floors', blockFilter] : null,
    () => propertyApi.getFloors({ block_id: blockFilter }).then(res => res.data)
  )

  // When coming from Apartments (society_id only): auto-select first/only block; user can change
  useEffect(() => {
    if (!societyIdFromUrl || blockIdFromUrl) return
    const blocks = blocksData?.data
    if (blocks?.length > 0 && !blockFilter) {
      setBlockFilter(blocks[0].id)
    }
  }, [societyIdFromUrl, blockIdFromUrl, blocksData?.data, blockFilter])

  // When block is selected (from URL or auto): auto-select first/only floor; user can change
  useEffect(() => {
    if (!blockFilter) return
    const floors = floorsData?.data
    if (floors?.length > 0 && !floorFilter) {
      setFloorFilter(floors[0].id)
    }
  }, [blockFilter, floorsData?.data, floorFilter])

  // For dialog - fetch blocks and floors when creating new unit
  const [dialogSocietyId, setDialogSocietyId] = useState('')
  const [dialogBlockId, setDialogBlockId] = useState('')
  const { data: dialogBlocksData } = useSWR(
    dialogSocietyId ? ['/blocks-dialog', dialogSocietyId] : null,
    () => propertyApi.getBlocks({ society_id: dialogSocietyId }).then(res => res.data)
  )
  const { data: dialogFloorsData } = useSWR(
    dialogBlockId ? ['/floors-dialog', dialogBlockId] : null,
    () => propertyApi.getFloors({ block_id: dialogBlockId }).then(res => res.data)
  )

  const { data: unitsData, isLoading, mutate } = useSWR(
    ['/units', societyFilter, blockFilter, floorFilter, search],
    () => propertyApi.getUnits({ society_id: societyFilter, block_id: blockFilter, floor_id: floorFilter, search }).then(res => res.data)
  )

  const resolvedBlockId = blockFilter || blockIdFromUrl
  const currentBlockName = resolvedBlockId && blocksData?.data
    ? blocksData.data.find((b) => String(b.id) === String(resolvedBlockId))?.name
    : null
  const resolvedFloor = floorFilter && floorsData?.data
    ? floorsData.data.find((f) => String(f.id) === String(floorFilter))
    : null
  const currentFloorLabel = resolvedFloor
    ? (resolvedFloor.floor_number === 0 ? 'Ground floor' : `Floor ${resolvedFloor.floor_number}`)
    : null
  const backToApartmentsUrl = societyIdFromUrl
    ? `/super-admin/societies?society_id=${societyIdFromUrl}`
    : '/super-admin/societies'

  const handleOpenDialog = (unit = null) => {
    setEditingUnit(unit)
    if (!unit) {
      setDialogSocietyId(societyIdFromUrl || societyFilter || '')
      setDialogBlockId(blockIdFromUrl || blockFilter || '')
    } else {
      setDialogSocietyId(unit.society_apartment_id || '')
      setDialogBlockId(unit.block_id || '')
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUnit(null)
  }

  const handleOpenBulkDialog = () => {
    setBulkCount(1)
    setOpenBulkDialog(true)
  }

  const handleCloseBulkDialog = () => {
    setOpenBulkDialog(false)
    setBulkCount(1)
  }

  const handleBulkAddUnits = async () => {
    const count = Math.max(1, parseInt(bulkCount, 10) || 1)
    if (!floorFilter) return
    setBulkSubmitting(true)
    try {
      await propertyApi.addUnitsToFloor(floorFilter, count)
      toast.success(`${count} unit(s) added to ${currentFloorLabel || 'this floor'}. Union Admin can add resident details later.`)
      mutate()
      handleCloseBulkDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add units')
    } finally {
      setBulkSubmitting(false)
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Prepare data with all fields
      const unitData = {
        ...values,
        society_apartment_id: values.society_apartment_id || societyFilter,
        block_id: values.block_id || blockFilter,
        k_electric_account: values.k_electric_account || null,
        gas_account: values.gas_account || null,
        water_account: values.water_account || null,
        phone_tv_account: values.phone_tv_account || null,
        car_make_model: values.car_make_model || null,
        license_plate: values.license_plate || null,
        number_of_cars: values.number_of_cars || 0,
        is_occupied: values.is_occupied !== undefined ? values.is_occupied : false,
        telephone_bills: Array.isArray(values.telephone_bills) ? values.telephone_bills : [],
        other_bills: Array.isArray(values.other_bills) ? values.other_bills : [],
      }

      if (editingUnit) {
        await propertyApi.updateUnit(editingUnit.id, unitData)
        toast.success('Unit updated successfully')
      } else {
        await propertyApi.createUnit(unitData)
        toast.success('Unit created successfully')
      }
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { id: 'unit_number', label: 'Unit Number' },
    { id: 'block_name', label: 'Block', render: (row) => row.block_name || 'N/A' },
    { id: 'floor_number', label: 'Floor', render: (row) => row.floor_number || 'N/A' },
    { id: 'owner_name', label: 'Owner', render: (row) => row.owner_name || '-' },
    { id: 'resident_name', label: 'Resident', render: (row) => row.resident_name || '-' },
    { id: 'contact_number', label: 'Contact', render: (row) => row.contact_number || '-' },
    { id: 'email', label: 'Email', render: (row) => row.email || '-' },
    {
      id: 'is_occupied',
      label: 'Status',
      render: (row) => (
        <Chip
          label={row.is_occupied ? 'Occupied' : 'Vacant'}
          color={row.is_occupied ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    { id: 'k_electric_account', label: 'K-Electric', render: (row) => row.k_electric_account || '-' },
    { id: 'gas_account', label: 'Gas', render: (row) => row.gas_account || '-' },
    { id: 'water_account', label: 'Water', render: (row) => row.water_account || '-' },
    { id: 'phone_tv_account', label: 'Phone/TV', render: (row) => row.phone_tv_account || '-' },
    {
      id: 'car_info',
      label: 'Car Info',
      render: (row) => {
        if (row.car_make_model || row.license_plate || row.number_of_cars) {
          return `${row.car_make_model || 'N/A'} | ${row.license_plate || 'N/A'} | ${row.number_of_cars || 0} cars`
        }
        return '-'
      },
    },
    {
      id: 'bills',
      label: 'Bills',
      render: (row) => {
        const telBills = Array.isArray(row.telephone_bills) ? row.telephone_bills.length : 0
        const otherBills = Array.isArray(row.other_bills) ? row.other_bills.length : 0
        if (telBills > 0 || otherBills > 0) {
          return `Tel: ${telBills}, Other: ${otherBills}`
        }
        return '-'
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => handleOpenDialog(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  const initialValues = editingUnit
    ? {
        society_apartment_id: editingUnit.society_apartment_id || societyFilter || '',
        block_id: editingUnit.block_id || blockFilter || '',
        floor_id: editingUnit.floor_id || floorFilter || '',
        unit_number: editingUnit.unit_number || '',
        owner_name: editingUnit.owner_name || '',
        resident_name: editingUnit.resident_name || '',
        contact_number: editingUnit.contact_number || '',
        email: editingUnit.email || '',
        k_electric_account: editingUnit.k_electric_account || '',
        gas_account: editingUnit.gas_account || '',
        water_account: editingUnit.water_account || '',
        phone_tv_account: editingUnit.phone_tv_account || '',
        car_make_model: editingUnit.car_make_model || '',
        license_plate: editingUnit.license_plate || '',
        number_of_cars: editingUnit.number_of_cars || 0,
        is_occupied: editingUnit.is_occupied !== undefined ? editingUnit.is_occupied : false,
        telephone_bills: editingUnit.telephone_bills || [],
        other_bills: editingUnit.other_bills || [],
      }
    : {
        society_apartment_id: societyFilter || societyIdFromUrl || '',
        block_id: blockFilter || blockIdFromUrl || '',
        floor_id: floorFilter || '',
        unit_number: '',
        owner_name: '',
        resident_name: '',
        contact_number: '',
        email: '',
        k_electric_account: '',
        gas_account: '',
        water_account: '',
        phone_tv_account: '',
        car_make_model: '',
        license_plate: '',
        number_of_cars: 0,
        is_occupied: false,
        telephone_bills: [],
        other_bills: [],
      }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {societyIdFromUrl && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            component={RouterLink}
            to={backToApartmentsUrl}
            aria-label="Back to Apartments"
            size="small"
            sx={{ mr: 0.5 }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} to={backToApartmentsUrl} underline="hover" color="inherit">
              Apartments
            </Link>
            <Typography color="text.primary">Units</Typography>
          </Breadcrumbs>
        </Box>
      )}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Units Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenBulkDialog()}
            disabled={!floorFilter}
            title={!floorFilter ? 'Select a floor first' : 'Add multiple units to this floor at once'}
          >
            Add multiple units
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Unit
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {societyIdFromUrl && currentSocietyName ? (
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Apartment: <Typography component="span" color="primary.main">{currentSocietyName}</Typography>
          </Typography>
        ) : (
          <TextField
            select
            label="Select Apartment"
            value={societyFilter}
            onChange={(e) => {
              setSocietyFilter(e.target.value)
              setBlockFilter('')
              setFloorFilter('')
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Select Apartment</MenuItem>
            {societiesData?.data?.map((society) => (
              <MenuItem key={society.id} value={society.id}>
                {society.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        {blockIdFromUrl && currentBlockName ? (
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Block: <Typography component="span" color="primary.main">{currentBlockName}</Typography>
          </Typography>
        ) : (
          <TextField
            select
            label="Select Block"
            value={blockFilter}
            onChange={(e) => {
              setBlockFilter(e.target.value)
              setFloorFilter('')
            }}
            disabled={!societyFilter}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Select Block</MenuItem>
            {blocksData?.data?.map((block) => (
              <MenuItem key={block.id} value={block.id}>
                {block.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          select
          label="Select Floor"
          value={floorFilter}
          onChange={(e) => setFloorFilter(e.target.value)}
          disabled={!blockFilter}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Select Floor</MenuItem>
          {floorsData?.data?.map((floor) => (
            <MenuItem key={floor.id} value={floor.id}>
              Floor {floor.floor_number}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          placeholder="Search units..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
      </Box>

      <DataTable
        columns={columns}
        data={unitsData?.data || []}
        loading={isLoading}
        pagination={null}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>
                {editingUnit ? 'Edit Unit' : 'Add New Unit'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {!editingUnit && (
                    <>
                      {(societyIdFromUrl && currentSocietyName) ? (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Apartment"
                            value={currentSocietyName}
                            disabled
                            helperText="Same apartment as selected from Apartments."
                          />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            select
                            label="Apartment"
                            name="society_apartment_id"
                            value={values.society_apartment_id}
                            onChange={(e) => {
                              handleChange(e)
                              setDialogSocietyId(e.target.value)
                              if (e.target.value !== values.society_apartment_id) {
                                handleChange({ target: { name: 'block_id', value: '' } })
                                handleChange({ target: { name: 'floor_id', value: '' } })
                                setDialogBlockId('')
                              }
                            }}
                            onBlur={handleBlur}
                            error={touched.society_apartment_id && !!errors.society_apartment_id}
                            helperText={touched.society_apartment_id && errors.society_apartment_id}
                          >
                            <MenuItem value="">Select Apartment</MenuItem>
                            {societiesData?.data?.map((society) => (
                              <MenuItem key={society.id} value={society.id}>
                                {society.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      )}
                      {currentBlockName ? (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Block"
                            value={currentBlockName}
                            disabled
                            helperText="Same block as selected on this page (step-by-step)."
                          />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            select
                            label="Block"
                            name="block_id"
                            value={values.block_id}
                            onChange={(e) => {
                              handleChange(e)
                              if (e.target.value !== values.block_id) {
                                handleChange({ target: { name: 'floor_id', value: '' } })
                                setDialogBlockId(e.target.value)
                              }
                            }}
                            onBlur={handleBlur}
                            error={touched.block_id && !!errors.block_id}
                            helperText={touched.block_id && errors.block_id}
                            disabled={!values.society_apartment_id}
                          >
                            <MenuItem value="">Select Block</MenuItem>
                            {(values.society_apartment_id
                              ? dialogBlocksData?.data || []
                              : []
                            ).map((block) => (
                              <MenuItem key={block.id} value={block.id}>
                                {block.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      )}
                    </>
                  )}
                  {!editingUnit && currentFloorLabel ? (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Floor"
                        value={currentFloorLabel}
                        disabled
                        helperText="Same floor as selected on this page (step-by-step)."
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        label="Floor"
                        name="floor_id"
                        value={values.floor_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.floor_id && !!errors.floor_id}
                        helperText={touched.floor_id && errors.floor_id}
                        disabled={!!editingUnit || !values.block_id}
                      >
                        <MenuItem value="">Select Floor</MenuItem>
                        {(editingUnit
                          ? floorsData?.data || []
                          : dialogFloorsData?.data || []
                        ).map((floor) => (
                          <MenuItem key={floor.id} value={floor.id}>
                            {floor.floor_number === 0 ? 'Ground floor' : `Floor ${floor.floor_number}`}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Unit Number"
                      name="unit_number"
                      value={values.unit_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.unit_number && !!errors.unit_number}
                      helperText={
                        (touched.unit_number && errors.unit_number) ||
                        'Resident details, utility accounts and vehicle info are managed by Union Admin.'
                      }
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {editingUnit ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Dialog open={openBulkDialog} onClose={handleCloseBulkDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Add multiple units</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {currentFloorLabel
              ? `Add unit rows to ${currentFloorLabel}. Unit numbers will be assigned automatically. Union Admin can add resident details later.`
              : 'Select a floor above first, then use this to add many units at once.'}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            type="number"
            label="Number of units"
            inputProps={{ min: 1, max: 999 }}
            value={bulkCount}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              setBulkCount(isNaN(v) || v < 1 ? 1 : Math.min(999, v))
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBulkDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleBulkAddUnits}
            disabled={!floorFilter || bulkSubmitting}
          >
            {bulkSubmitting ? 'Adding…' : 'Add units'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Units
