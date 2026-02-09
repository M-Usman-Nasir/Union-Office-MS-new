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
import RemoveIcon from '@mui/icons-material/Remove'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { residentApi } from '@/api/residentApi'
import { propertyApi } from '@/api/propertyApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { ROLES } from '@/utils/constants'

const getValidationSchema = (isEdit) => Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: isEdit 
    ? Yup.string().min(6, 'Password must be at least 6 characters')
    : Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  name: Yup.string().required('Name is required'),
  society_apartment_id: Yup.number().required('Society is required'),
  contact_number: Yup.string(),
  cnic: Yup.string(),
  emergency_contact: Yup.string(),
  move_in_date: Yup.date().nullable(),
})

const Residents = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingResident, setEditingResident] = useState(null)
  const [societyId] = useState(user?.society_apartment_id)

  const { data, isLoading, mutate } = useSWR(
    ['/residents', page, limit, search, societyId],
    () => residentApi.getAll({ page, limit, search, society_id: societyId }).then(res => res.data)
  )

  const { data: unitsData } = useSWR(
    societyId ? ['/units', societyId] : null,
    () => propertyApi.getUnits({ society_id: societyId }).then(res => res.data)
  )

  const handleOpenDialog = (resident = null) => {
    setEditingResident(resident)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingResident(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Prepare data for backend
      const submitData = { ...values }
      
      // Clean up empty strings - convert to null for optional fields
      const optionalFields = ['contact_number', 'cnic', 'emergency_contact', 'move_in_date', 'unit_id', 'owner_name', 'license_plate']
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
        await residentApi.create(submitData)
        toast.success('Resident created successfully')
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
    if (window.confirm('Are you sure you want to delete this resident?')) {
      try {
        await residentApi.remove(id)
        toast.success('Resident deleted successfully')
        mutate()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed')
      }
    }
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role', render: (row) => row.role === 'union_admin' ? 'Union Admin' : 'Resident' },
    { id: 'contact_number', label: 'Contact' },
    { id: 'unit_number', label: 'Unit', render: (row) => row.unit_number || 'N/A' },
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
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
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
        unit_id: editingResident.unit_id || '',
        owner_name: editingResident.owner_name || '',
        license_plate: editingResident.license_plate || '',
        telephone_bills: Array.isArray(editingResident.telephone_bills) ? editingResident.telephone_bills : [],
        other_bills: Array.isArray(editingResident.other_bills) ? editingResident.other_bills : [],
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
        unit_id: '',
        owner_name: '',
        license_plate: '',
        telephone_bills: [],
        other_bills: [],
      }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Residents Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Resident
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
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
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(!!editingResident)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
            <Form>
              <DialogTitle>
                {editingResident ? 'Edit Resident' : 'Add New Resident'}
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
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      disabled={!!editingResident}
                    />
                  </Grid>
                  {!editingResident && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && !!errors.password}
                        helperText={touched.password && errors.password}
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
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Society"
                      name="society_apartment_id"
                      type="number"
                      inputProps={{ min: 1 }}
                      value={values.society_apartment_id}
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
                      error={touched.society_apartment_id && !!errors.society_apartment_id}
                      helperText={touched.society_apartment_id && errors.society_apartment_id}
                      disabled={!!societyId}
                      required
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
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Unit"
                      name="unit_id"
                      value={values.unit_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="">None</MenuItem>
                      {unitsData?.data?.map((unit) => (
                        <MenuItem key={unit.id} value={unit.id}>
                          {unit.block_name} - Floor {unit.floor_number} - Unit {unit.unit_number}
                        </MenuItem>
                      ))}
                    </TextField>
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
                      label="License Plate"
                      name="license_plate"
                      value={values.license_plate}
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
