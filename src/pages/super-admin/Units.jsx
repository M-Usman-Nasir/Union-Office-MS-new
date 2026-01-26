import { useState } from 'react'
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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import useSWR from 'swr'
import { propertyApi } from '@/api/propertyApi'
import { societyApi } from '@/api/societyApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const validationSchema = Yup.object({
  floor_id: Yup.number().required('Floor is required'),
  unit_number: Yup.string().required('Unit number is required'),
})

const Units = () => {
  const [societyFilter, setSocietyFilter] = useState('')
  const [blockFilter, setBlockFilter] = useState('')
  const [floorFilter, setFloorFilter] = useState('')
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUnit, setEditingUnit] = useState(null)

  const { data: societiesData } = useSWR(
    '/societies',
    () => societyApi.getAll({ limit: 100 }).then(res => res.data)
  )

  const { data: blocksData } = useSWR(
    societyFilter ? ['/blocks', societyFilter] : null,
    () => propertyApi.getBlocks({ society_id: societyFilter }).then(res => res.data)
  )

  const { data: floorsData } = useSWR(
    blockFilter ? ['/floors', blockFilter] : null,
    () => propertyApi.getFloors({ block_id: blockFilter }).then(res => res.data)
  )

  const { data: unitsData, isLoading, mutate } = useSWR(
    ['/units', societyFilter, blockFilter, floorFilter, search],
    () => propertyApi.getUnits({ society_id: societyFilter, block_id: blockFilter, floor_id: floorFilter, search }).then(res => res.data)
  )

  const handleOpenDialog = (unit = null) => {
    setEditingUnit(unit)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUnit(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingUnit) {
        await propertyApi.updateUnit(editingUnit.id, values)
        toast.success('Unit updated successfully')
      } else {
        await propertyApi.createUnit({ ...values, society_apartment_id: societyFilter, block_id: blockFilter })
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
    { id: 'owner_name', label: 'Owner' },
    { id: 'resident_name', label: 'Resident' },
    { id: 'contact_number', label: 'Contact' },
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
        floor_id: editingUnit.floor_id || floorFilter || '',
        unit_number: editingUnit.unit_number || '',
        owner_name: editingUnit.owner_name || '',
        resident_name: editingUnit.resident_name || '',
        contact_number: editingUnit.contact_number || '',
        email: editingUnit.email || '',
      }
    : {
        floor_id: floorFilter || '',
        unit_number: '',
        owner_name: '',
        resident_name: '',
        contact_number: '',
        email: '',
      }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Units Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={!floorFilter}
        >
          Add Unit
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Select Society"
          value={societyFilter}
          onChange={(e) => {
            setSocietyFilter(e.target.value)
            setBlockFilter('')
            setFloorFilter('')
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Select Society</MenuItem>
          {societiesData?.data?.map((society) => (
            <MenuItem key={society.id} value={society.id}>
              {society.name}
            </MenuItem>
          ))}
        </TextField>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
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
                      disabled={!!editingUnit}
                    >
                      <MenuItem value="">Select Floor</MenuItem>
                      {floorsData?.data?.map((floor) => (
                        <MenuItem key={floor.id} value={floor.id}>
                          Floor {floor.floor_number}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Unit Number"
                      name="unit_number"
                      value={values.unit_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.unit_number && !!errors.unit_number}
                      helperText={touched.unit_number && errors.unit_number}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Owner Name"
                      name="owner_name"
                      value={values.owner_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Resident Name"
                      name="resident_name"
                      value={values.resident_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      name="contact_number"
                      value={values.contact_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
    </Container>
  )
}

export default Units
