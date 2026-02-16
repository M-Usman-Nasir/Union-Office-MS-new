import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom'
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
  Breadcrumbs,
  Link,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LayersIcon from '@mui/icons-material/Layers'
import DomainIcon from '@mui/icons-material/Domain'
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
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [, setPage] = useState(1)
  const [, setLimit] = useState(10)
  const [societyFilter, setSocietyFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingBlock, setEditingBlock] = useState(null)

  const societyIdFromUrl = searchParams.get('society_id')

  useEffect(() => {
    if (societyIdFromUrl) setSocietyFilter(societyIdFromUrl)
  }, [societyIdFromUrl])

  const { data: currentSocietyData } = useSWR(
    societyIdFromUrl ? ['/society', societyIdFromUrl] : null,
    () => apartmentApi.getById(societyIdFromUrl).then(res => res.data)
  )
  const currentSocietyName = currentSocietyData?.data?.name

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
        await propertyApi.createBlock({
          ...values,
          total_floors: Number(values.total_floors) || 0,
          total_units: Number(values.total_units) || 0,
        })
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
    {
      id: 'total_units',
      label: 'Total Units',
      render: (row) => (row.total_units == null || Number(row.total_units) === 0 ? 'N/A' : row.total_units),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Floors">
            <IconButton
              size="small"
              onClick={() => navigate(`/super-admin/floors?society_id=${row.society_apartment_id}&block_id=${row.id}`)}
              aria-label="Manage floors"
            >
              <LayersIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Units">
            <IconButton
              size="small"
              onClick={() => navigate(`/super-admin/units?society_id=${row.society_apartment_id}&block_id=${row.id}`)}
              aria-label="Manage units"
            >
              <DomainIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
    society_apartment_id: editingBlock?.society_apartment_id || societyFilter || societyIdFromUrl || '',
    name: editingBlock?.name || '',
    total_floors: editingBlock != null ? (editingBlock.total_floors ?? 0) : '',
    total_units: editingBlock != null ? (editingBlock.total_units ?? 0) : '',
  }

  const backToApartmentsUrl = societyIdFromUrl
    ? `/super-admin/societies?society_id=${societyIdFromUrl}`
    : '/super-admin/societies'

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
            <Typography color="text.primary">Blocks</Typography>
          </Breadcrumbs>
        </Box>
      )}
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
        {societyIdFromUrl && currentSocietyName ? (
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Apartment: <Typography component="span" color="primary.main">{currentSocietyName}</Typography>
          </Typography>
        ) : (
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
        )}
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
                  {(societyIdFromUrl && currentSocietyName) || editingBlock ? (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Apartment"
                        value={editingBlock ? (societiesData?.data?.find((s) => s.id === editingBlock.society_apartment_id)?.name ?? '—') : currentSocietyName}
                        disabled
                        helperText={societyIdFromUrl ? 'Same apartment as selected from Apartments.' : undefined}
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
                        onChange={handleChange}
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
