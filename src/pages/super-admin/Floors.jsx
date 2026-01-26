import { useState } from 'react'
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
import { societyApi } from '@/api/societyApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const validationSchema = Yup.object({
  block_id: Yup.number().required('Block is required'),
  floor_number: Yup.number().min(1).required('Floor number is required'),
})

const Floors = () => {
  const [societyFilter, setSocietyFilter] = useState('')
  const [blockFilter, setBlockFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingFloor, setEditingFloor] = useState(null)

  const { data: societiesData } = useSWR(
    '/societies',
    () => societyApi.getAll({ limit: 100 }).then(res => res.data)
  )

  const { data: blocksData } = useSWR(
    societyFilter ? ['/blocks', societyFilter] : null,
    () => propertyApi.getBlocks({ society_id: societyFilter }).then(res => res.data)
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
      await propertyApi.createFloor(values)
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
          disabled={!blockFilter}
        >
          Add Floor
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          select
          label="Select Society"
          value={societyFilter}
          onChange={(e) => {
            setSocietyFilter(e.target.value)
            setBlockFilter('')
          }}
          sx={{ minWidth: 250 }}
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
            Please select a Society and Block to view floors
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
                      label="Floor Number"
                      name="floor_number"
                      type="number"
                      value={values.floor_number}
                      onChange={handleChange}
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
                      value={values.total_units}
                      onChange={handleChange}
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
