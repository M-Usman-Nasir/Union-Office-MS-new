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
import DeleteIcon from '@mui/icons-material/Delete'
import useSWR from 'swr'
import { propertyApi } from '@/api/propertyApi'
import { societyApi } from '@/api/societyApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const validationSchema = Yup.object({
  society_apartment_id: Yup.number().required('Society is required'),
  name: Yup.string().required('Block name is required'),
})

const Blocks = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [societyFilter, setSocietyFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingBlock, setEditingBlock] = useState(null)

  const { data: societiesData } = useSWR(
    '/societies',
    () => societyApi.getAll({ limit: 100 }).then(res => res.data)
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
      await propertyApi.createBlock(values)
      toast.success('Block created successfully')
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
    { id: 'society_name', label: 'Society', render: (row) => row.society_name || 'N/A' },
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
          label="Filter by Society"
          value={societyFilter}
          onChange={(e) => setSocietyFilter(e.target.value)}
          sx={{ minWidth: 250, mr: 2 }}
        >
          <MenuItem value="">All Societies</MenuItem>
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
              <DialogTitle>Add New Block</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Society"
                      name="society_apartment_id"
                      value={values.society_apartment_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.society_apartment_id && !!errors.society_apartment_id}
                      helperText={touched.society_apartment_id && errors.society_apartment_id}
                    >
                      <MenuItem value="">Select Society</MenuItem>
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
                      value={values.total_floors}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={6}>
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

export default Blocks
