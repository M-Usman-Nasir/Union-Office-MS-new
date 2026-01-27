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
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LockIcon from '@mui/icons-material/Lock'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { userApi } from '@/api/userApi'
import { societyApi } from '@/api/societyApi'
import { propertyApi } from '@/api/propertyApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const getValidationSchema = (isEdit, currentUserRole) => {
  const baseSchema = {
    email: Yup.string().email('Invalid email').required('Email is required'),
    name: Yup.string().required('Name is required'),
    role: Yup.string().required('Role is required'),
  }

  // Password required only on create
  if (!isEdit) {
    baseSchema.password = Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  }

  // Society required for union_admin, resident, and staff roles
  baseSchema.society_apartment_id = Yup.number().when('role', {
    is: (role) => role === 'union_admin' || role === 'resident' || role === 'staff',
    then: (schema) => schema.required('Society is required'),
    otherwise: (schema) => schema.nullable(),
  })

  // Unit optional (only for residents)
  baseSchema.unit_id = Yup.number().nullable()
  baseSchema.cnic = Yup.string().nullable()
  baseSchema.contact_number = Yup.string().nullable()
  baseSchema.emergency_contact = Yup.string().nullable()

  return Yup.object(baseSchema)
}

const passwordSchema = Yup.object({
  new_password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const Users = () => {
  const { user: currentUser } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedSocietyId, setSelectedSocietyId] = useState(null)

  const { data, isLoading, mutate } = useSWR(
    ['/users', page, limit, search, roleFilter],
    () => userApi.getAll({ page, limit, search, role: roleFilter }).then(res => res.data)
  )

  // Fetch societies (for Super Admin - all societies, for Union Admin - their own society)
  const { data: societiesData } = useSWR(
    currentUser?.role === 'super_admin' ? '/societies' : 
    (currentUser?.role === 'union_admin' && currentUser?.society_apartment_id ? `/societies/${currentUser.society_apartment_id}` : null),
    () => {
      if (currentUser?.role === 'super_admin') {
        return societyApi.getAll({ limit: 100 }).then(res => res.data)
      } else if (currentUser?.role === 'union_admin' && currentUser?.society_apartment_id) {
        return societyApi.getById(currentUser.society_apartment_id).then(res => ({
          data: [res.data.data]
        }))
      }
      return null
    }
  )

  // Fetch all societies for display in table (Super Admin only)
  const { data: allSocietiesData } = useSWR(
    currentUser?.role === 'super_admin' ? '/societies/all' : null,
    () => societyApi.getAll({ limit: 1000 }).then(res => res.data)
  )

  // Fetch units (filtered by selected society)
  const { data: unitsData } = useSWR(
    selectedSocietyId ? ['/units', selectedSocietyId] : null,
    () => propertyApi.getUnits({ society_id: selectedSocietyId }).then(res => res.data)
  )

  const handleOpenDialog = (user = null) => {
    setEditingUser(user)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
    setSelectedSocietyId(null)
  }

  const handleOpenPasswordDialog = (user) => {
    setSelectedUser(user)
    setOpenPasswordDialog(true)
  }

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false)
    setSelectedUser(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Prepare data for backend
      const submitData = { ...values }

      // Clean up empty strings - convert to null for optional fields
      const optionalFields = ['society_apartment_id', 'unit_id', 'cnic', 'contact_number', 'emergency_contact']
      optionalFields.forEach(field => {
        if (submitData[field] === '' || submitData[field] === undefined) {
          submitData[field] = null
        }
        // Convert string numbers to integers
        if (submitData[field] && (field === 'society_apartment_id' || field === 'unit_id')) {
          submitData[field] = parseInt(submitData[field])
        }
      })

      // For Union Admin creating users, auto-assign their society if not provided
      if (!editingUser && currentUser?.role === 'union_admin' && !submitData.society_apartment_id) {
        submitData.society_apartment_id = currentUser.society_apartment_id
      }

      // For Super Admin, society_apartment_id can be null (for super_admin role)
      // For union_admin, resident, and staff, it must be set
      if (submitData.role === 'super_admin') {
        submitData.society_apartment_id = null
      }

      if (editingUser) {
        await userApi.update(editingUser.id, submitData)
        toast.success('User updated successfully')
      } else {
        await userApi.create(submitData)
        toast.success('User created successfully')
      }
      mutate()
      handleCloseDialog()
      setSelectedSocietyId(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePasswordUpdate = async (values, { setSubmitting }) => {
    try {
      await userApi.updatePassword(selectedUser.id, values)
      toast.success('Password updated successfully')
      handleClosePasswordDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password update failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.remove(id)
        toast.success('User deleted successfully')
        mutate()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed')
      }
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'error'
      case 'union_admin':
        return 'primary'
      case 'resident':
        return 'success'
      case 'staff':
        return 'info'
      default:
        return 'default'
    }
  }

  const getSocietyName = (societyId) => {
    if (!societyId) return 'N/A'
    const society = allSocietiesData?.data?.find(s => s.id === societyId)
    return society?.name || `Society #${societyId}`
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    {
      id: 'role',
      label: 'Role',
      render: (row) => (
        <Chip
          label={row.role === 'super_admin' ? 'Super Admin' : row.role === 'union_admin' ? 'Union Admin' : row.role === 'staff' ? 'Staff' : 'Resident'}
          color={getRoleColor(row.role)}
          size="small"
        />
      ),
    },
    ...(currentUser?.role === 'super_admin' ? [{
      id: 'society_apartment_id',
      label: 'Society',
      render: (row) => (
        <Typography variant="body2">
          {row.society_apartment_id ? getSocietyName(row.society_apartment_id) : 'N/A'}
        </Typography>
      ),
    }] : []),
    {
      id: 'is_active',
      label: 'Status',
      render: (row) => (
        <Chip
          label={row.is_active ? 'Active' : 'Inactive'}
          color={row.is_active ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box>
          <Tooltip title="Change Password">
            <IconButton size="small" onClick={() => handleOpenPasswordDialog(row)}>
              <LockIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenDialog(row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.id !== currentUser?.id && (
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ]

  const initialValues = editingUser
    ? {
        email: editingUser.email || '',
        name: editingUser.name || '',
        role: editingUser.role || 'resident',
        society_apartment_id: editingUser.society_apartment_id || null,
        unit_id: editingUser.unit_id || null,
        cnic: editingUser.cnic || '',
        contact_number: editingUser.contact_number || '',
        emergency_contact: editingUser.emergency_contact || '',
        is_active: editingUser.is_active !== undefined ? editingUser.is_active : true,
      }
    : {
        email: '',
        password: '',
        name: '',
        role: 'resident',
        society_apartment_id: currentUser?.role === 'union_admin' ? currentUser.society_apartment_id : null,
        unit_id: null,
        cnic: '',
        contact_number: '',
        emergency_contact: '',
        is_active: true,
      }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Users Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search users..."
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
        <TextField
          select
          label="Role Filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="super_admin">Super Admin</MenuItem>
          <MenuItem value="union_admin">Union Admin</MenuItem>
          <MenuItem value="resident">Resident</MenuItem>
          <MenuItem value="staff">Staff</MenuItem>
        </TextField>
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

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(!!editingUser, currentUser?.role)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
            // Update selectedSocietyId when society changes
            const handleSocietyChange = (e) => {
              const newSocietyId = e.target.value ? parseInt(e.target.value) : null
              setSelectedSocietyId(newSocietyId)
              handleChange(e)
              // Reset unit when society changes
              if (newSocietyId !== values.society_apartment_id) {
                setFieldValue('unit_id', null)
              }
            }

            // Set selectedSocietyId when editing user
            if (editingUser && !selectedSocietyId && values.society_apartment_id) {
              setSelectedSocietyId(values.society_apartment_id)
            }

            // Determine if society field should be shown and editable
            // Society required for union_admin, resident, and staff roles
            const showSocietyField = values.role === 'union_admin' || values.role === 'resident' || values.role === 'staff'
            const isSocietyEditable = currentUser?.role === 'super_admin' || !editingUser
            const isSocietyDisabled = currentUser?.role === 'union_admin' && !editingUser

            return (
              <Form>
                <DialogTitle>
                  {editingUser ? 'Edit User' : 'Add New User'}
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
                        disabled={!!editingUser}
                      />
                    </Grid>
                    {!editingUser && (
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
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        label="Role"
                        name="role"
                        value={values.role}
                        onChange={(e) => {
                          handleChange(e)
                          // Reset society and unit when role changes to super_admin
                          if (e.target.value === 'super_admin') {
                            setFieldValue('society_apartment_id', null)
                            setFieldValue('unit_id', null)
                            setSelectedSocietyId(null)
                          }
                        }}
                        onBlur={handleBlur}
                        error={touched.role && !!errors.role}
                        helperText={touched.role && errors.role}
                        >
                          <MenuItem value="resident">Resident</MenuItem>
                          <MenuItem value="union_admin">Union Admin</MenuItem>
                          <MenuItem value="staff">Staff</MenuItem>
                          {currentUser?.role === 'super_admin' && (
                            <MenuItem value="super_admin">Super Admin</MenuItem>
                          )}
                        </TextField>
                    </Grid>
                    {showSocietyField && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          label="Society"
                          name="society_apartment_id"
                          value={values.society_apartment_id || ''}
                          onChange={handleSocietyChange}
                          onBlur={handleBlur}
                          error={touched.society_apartment_id && !!errors.society_apartment_id}
                          helperText={touched.society_apartment_id && errors.society_apartment_id}
                          disabled={isSocietyDisabled || !isSocietyEditable}
                          required
                        >
                          <MenuItem value="">Select Society</MenuItem>
                          {currentUser?.role === 'super_admin' && societiesData?.data?.map((society) => (
                            <MenuItem key={society.id} value={society.id}>
                              {society.name}
                            </MenuItem>
                          ))}
                          {currentUser?.role === 'union_admin' && societiesData?.data?.map((society) => (
                            <MenuItem key={society.id} value={society.id}>
                              {society.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    )}
                    {values.role === 'resident' && selectedSocietyId && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          label="Unit (Optional)"
                          name="unit_id"
                          value={values.unit_id || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.unit_id && !!errors.unit_id}
                          helperText={touched.unit_id && errors.unit_id}
                        >
                          <MenuItem value="">No Unit</MenuItem>
                          {unitsData?.data?.map((unit) => (
                            <MenuItem key={unit.id} value={unit.id}>
                              {unit.unit_number} {unit.block_name ? `(${unit.block_name})` : ''}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    )}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Contact Number"
                        name="contact_number"
                        value={values.contact_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.contact_number && !!errors.contact_number}
                        helperText={touched.contact_number && errors.contact_number}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Emergency Contact"
                        name="emergency_contact"
                        value={values.emergency_contact}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.emergency_contact && !!errors.emergency_contact}
                        helperText={touched.emergency_contact && errors.emergency_contact}
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
                        error={touched.cnic && !!errors.cnic}
                        helperText={touched.cnic && errors.cnic}
                        placeholder="e.g., 12345-1234567-1"
                      />
                    </Grid>
                    {editingUser && (
                      <Grid item xs={12}>
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
                    )}
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {editingUser ? 'Update' : 'Create'}
                  </Button>
                </DialogActions>
              </Form>
            )
          }}
        </Formik>
      </Dialog>

      {/* Password Update Dialog */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={{ new_password: '' }}
          validationSchema={passwordSchema}
          onSubmit={handlePasswordUpdate}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>Change Password</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      User: {selectedUser?.name} ({selectedUser?.email})
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="new_password"
                      type="password"
                      value={values.new_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.new_password && !!errors.new_password}
                      helperText={touched.new_password && errors.new_password}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePasswordDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Update Password
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default Users
