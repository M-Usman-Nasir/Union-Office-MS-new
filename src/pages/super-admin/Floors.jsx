import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
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
  floor_number: Yup.number().min(1).required('Floor number is required'),
})

const Floors = () => {
  const [searchParams] = useSearchParams()
  const [societyFilter, setSocietyFilter] = useState('')
  const [blockFilter, setBlockFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingFloor, setEditingFloor] = useState(null)

  useEffect(() => {
    const societyId = searchParams.get('society_id')
    if (societyId) setSocietyFilter(societyId)
  }, [searchParams])

  const { data: societiesData } = useSWR(
    '/societies',
    () => apartmentApi.getAll({ limit: 100 }).then(res => res.data)
  )

  const { data: blocksData } = useSWR(
    societyFilter ? ['/blocks', societyFilter] : null,
    () => propertyApi.getBlocks({ society_id: societyFilter }).then(res => res.data)
  )

  const { data: allBlocksData } = useSWR(
    '/blocks',
    () => propertyApi.getBlocks().then(res => res.data)
  )

  const { data: floorsData, isLoading, mutate } = useSWR(
    blockFilter ? ['/floors', blockFilter] : null,
    () => propertyApi.getFloors({ block_id: blockFilter }).then(res => res.data)
  )

  const handleOpenDialog = (floor = null) => {
    setEditingFloor(floor)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingFloor(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Ensure block_id is included (it's required)
      const floorData = {
        block_id: values.block_id,
        floor_number: values.floor_number,
        total_units: values.total_units || 0,
      }
      
      await propertyApi.createFloor(floorData)
      toast.success('Floor created successfully')
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { id: 'floor_number', label: 'Floor Number' },
    { id: 'block_name', label: 'Block', render: (row) => row.block_name || 'N/A' },
    { id: 'total_units', label: 'Total Units' },
  ]

  const initialValues = {
    society_apartment_id: editingFloor?.society_apartment_id || societyFilter || '',
    block_id: editingFloor?.block_id || blockFilter || '',
    floor_number: editingFloor?.floor_number || '',
    total_units: editingFloor?.total_units || 0,
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Floors Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Floor
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          select
          label="Select Apartment"
          value={societyFilter}
          onChange={(e) => {
            setSocietyFilter(e.target.value)
            setBlockFilter('')
          }}
          sx={{ minWidth: 250 }}
        >
          <MenuItem value="">Select Apartment</MenuItem>
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
          onChange={(e) => setBlockFilter(e.target.value)}
          disabled={!societyFilter}
          sx={{ minWidth: 250 }}
        >
          <MenuItem value="">Select Block</MenuItem>
          {blocksData?.data?.map((block) => (
            <MenuItem key={block.id} value={block.id}>
              {block.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {!blockFilter ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Please select an Apartment and Block to view floors
          </Typography>
        </Box>
      ) : (
        <DataTable
          columns={columns}
          data={floorsData?.data || []}
          loading={isLoading}
          pagination={null}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          emptyMessage={blockFilter ? 'No floors found for this block' : 'Please select a block first'}
        />
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>Add New Floor</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Apartment"
                      name="society_apartment_id"
                      value={values.society_apartment_id}
                      onChange={(e) => {
                        handleChange(e)
                        // Reset block when society changes
                        if (e.target.value !== values.society_apartment_id) {
                          handleChange({ target: { name: 'block_id', value: '' } })
                        }
                      }}
                      onBlur={handleBlur}
                      error={touched.society_apartment_id && !!errors.society_apartment_id}
                      helperText={touched.society_apartment_id && errors.society_apartment_id}
                      disabled={!!editingFloor}
                    >
                      <MenuItem value="">Select Apartment</MenuItem>
                      {societiesData?.data?.map((society) => (
                        <MenuItem key={society.id} value={society.id}>
                          {society.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Block"
                      name="block_id"
                      value={values.block_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.block_id && !!errors.block_id}
                      helperText={touched.block_id && errors.block_id}
                      disabled={!values.society_apartment_id || !!editingFloor}
                    >
                      <MenuItem value="">Select Block</MenuItem>
                      {(values.society_apartment_id
                        ? (blocksData?.data || []).filter(
                            (block) => block.society_apartment_id === values.society_apartment_id
                          )
                        : (allBlocksData?.data || [])
                      ).map((block) => (
                        <MenuItem key={block.id} value={block.id}>
                          {block.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Floor Number"
                      name="floor_number"
                      type="number"
                      inputProps={{ min: 1 }}
                      value={values.floor_number}
                      onChange={(e) => {
                        const raw = e.target.value
                        if (raw === '') {
                          handleChange(e)
                          return
                        }
                        const num = Math.max(1, parseInt(raw, 10) || 1)
                        handleChange({ target: { name: e.target.name, value: num } })
                      }}
                      onBlur={handleBlur}
                      error={touched.floor_number && !!errors.floor_number}
                      helperText={touched.floor_number && errors.floor_number}
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
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Create
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default Floors
