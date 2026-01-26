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
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  name: Yup.string().required('Name is required'),
  role: Yup.string().required('Role is required'),
})

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

  const { data, isLoading, mutate } = useSWR(
    ['/users', page, limit, search, roleFilter],
    () => userApi.getAll({ page, limit, search, role: roleFilter }).then(res => res.data)
  )

  const handleOpenDialog = (user = null) => {
    setEditingUser(user)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
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
      if (editingUser) {
        await userApi.update(editingUser.id, values)
        toast.success('User updated successfully')
      } else {
        await userApi.create(values)
        toast.success('User created successfully')
      }
      mutate()
      handleCloseDialog()
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
      default:
        return 'default'
    }
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    {
      id: 'role',
      label: 'Role',
      render: (row) => (
        <Chip
          label={row.role === 'super_admin' ? 'Super Admin' : row.role === 'union_admin' ? 'Union Admin' : 'Resident'}
          color={getRoleColor(row.role)}
          size="small"
        />
      ),
    },
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
        is_active: editingUser.is_active !== undefined ? editingUser.is_active : true,
      }
    : {
        email: '',
        password: '',
        name: '',
        role: 'resident',
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
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.role && !!errors.role}
                      helperText={touched.role && errors.role}
                    >
                      <MenuItem value="resident">Resident</MenuItem>
                      <MenuItem value="union_admin">Union Admin</MenuItem>
                      {currentUser?.role === 'super_admin' && (
                        <MenuItem value="super_admin">Super Admin</MenuItem>
                      )}
                    </TextField>
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
          )}
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
