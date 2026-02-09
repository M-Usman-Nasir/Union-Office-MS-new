import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
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
  name: Yup.string().required('Block name is required'),
})

const Blocks = () => {
  const [, setPage] = useState(1)
  const [, setLimit] = useState(10)
  const [societyFilter, setSocietyFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingBlock, setEditingBlock] = useState(null)

  const { data: societiesData } = useSWR(
    '/societies',
    () => apartmentApi.getAll({ limit: 100 }).then(res => res.data)
  )

  const { data, isLoading, mutate } = useSWR(
    ['/blocks', societyFilter],
    () => propertyApi.getBlocks({ society_id: societyFilter }).then(res => res.data)
  )

  const handleOpenDialog = (block = null) => {
    setEditingBlock(block)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingBlock(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingBlock) {
        await propertyApi.updateBlock(editingBlock.id, values)
        toast.success('Block updated successfully')
      } else {
        await propertyApi.createBlock(values)
        toast.success('Block created successfully')
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
    { id: 'name', label: 'Block Name' },
    { id: 'society_name', label: 'Apartment', render: (row) => row.society_name || 'N/A' },
    { id: 'total_floors', label: 'Total Floors' },
    { id: 'total_units', label: 'Total Units' },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenDialog(row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const initialValues = {
    society_apartment_id: editingBlock?.society_apartment_id || societyFilter || '',
    name: editingBlock?.name || '',
    total_floors: editingBlock?.total_floors || 0,
    total_units: editingBlock?.total_units || 0,
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Blocks Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Block
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Filter by Apartment"
          value={societyFilter}
          onChange={(e) => setSocietyFilter(e.target.value)}
          sx={{ minWidth: 250, mr: 2 }}
        >
          <MenuItem value="">All Apartments</MenuItem>
          {societiesData?.data?.map((society) => (
            <MenuItem key={society.id} value={society.id}>
              {society.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <DataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        pagination={null}
        onPageChange={setPage}
        onRowsPerPageChange={setLimit}
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
                {editingBlock ? 'Edit Block' : 'Add New Block'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Apartment"
                      name="society_apartment_id"
                      value={values.society_apartment_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.society_apartment_id && !!errors.society_apartment_id}
                      helperText={touched.society_apartment_id && errors.society_apartment_id}
                      disabled={!!editingBlock}
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
                      label="Block Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Total Floors"
                      name="total_floors"
                      type="number"
                      inputProps={{ min: 1 }}
                      value={values.total_floors}
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
                    />
                  </Grid>
                  <Grid item xs={6}>
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
                  {editingBlock ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default Blocks
