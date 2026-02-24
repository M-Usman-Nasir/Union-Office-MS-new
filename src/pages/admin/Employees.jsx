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
  Menu,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { employeesApi } from '@/api/employeesApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const EMPLOYEE_DESIGNATIONS = ['Supervisor', 'Guard', 'Sweeper', 'Security', 'Maintenance', 'Driver', 'Laundry', 'Lift Operator', 'Other']

const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  work_title: Yup.string().nullable(),
  department: Yup.string().nullable(),
  contact_number: Yup.string().nullable(),
  salary_rupees: Yup.number().nullable().transform((v, o) => (o === '' || o == null ? null : v)),
})

const Employees = () => {
  const { user: currentUser } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [designationFilter, setDesignationFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [actionMenuRow, setActionMenuRow] = useState(null)

  const { data, isLoading, mutate } = useSWR(
    ['/employees', page, limit, search, designationFilter],
    () => {
      const params = { page, limit, search }
      if (designationFilter) params.work_title = designationFilter
      return employeesApi.getAll(params).then((res) => res.data)
    }
  )

  const list = data?.data ?? []
  const pagination = data?.pagination ?? { page: 1, limit: 10, total: 0, pages: 0 }

  const handleOpenDialog = (row = null) => {
    setEditingEmployee(row)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingEmployee(null)
  }

  const handleSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        contact_number: values.contact_number || null,
        designation: values.work_title || null,
        department: values.department || null,
        salary_rupees: values.salary_rupees != null && values.salary_rupees !== '' ? values.salary_rupees : null,
      }
      if (editingEmployee) {
        await employeesApi.update(editingEmployee.id, payload)
        toast.success('Employee updated successfully')
      } else {
        await employeesApi.create(payload)
        toast.success('Employee created successfully')
      }
      handleCloseDialog()
      mutate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    try {
      await employeesApi.remove(id)
      toast.success('Employee deleted successfully')
      setActionMenuAnchor(null)
      setActionMenuRow(null)
      mutate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const confirmDelete = (id) => {
    toast.custom(
      (t) => (
        <Box
          sx={{
            background: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            minWidth: 280,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Delete this employee?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button size="small" variant="outlined" onClick={() => toast.dismiss(t.id)}>
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => {
                toast.dismiss(t.id)
                handleDelete(id)
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      ),
      { duration: Infinity }
    )
  }

  const initialValues = editingEmployee
    ? {
        name: editingEmployee.name || '',
        work_title: editingEmployee.designation || editingEmployee.work_title || '',
        department: editingEmployee.department || '',
        contact_number: editingEmployee.contact_number || '',
        salary_rupees: editingEmployee.salary_rupees ?? '',
      }
    : {
        name: '',
        work_title: '',
        department: '',
        contact_number: '',
        salary_rupees: '',
      }

  const columns = [
    { id: 'name', label: 'Name', minWidth: 140, render: (row) => (row.name || '—') },
    { id: 'designation', label: 'Designation', minWidth: 120, render: (row) => row.designation || row.work_title || '—' },
    { id: 'department', label: 'Department', minWidth: 120, render: (row) => row.department || '—' },
    {
      id: 'salary_rupees',
      label: 'Salary (PKR)',
      minWidth: 110,
      render: (row) =>
        row.salary_rupees != null && row.salary_rupees !== '' ? Number(row.salary_rupees).toLocaleString() : '—',
    },
    { id: 'contact_number', label: 'Contact', minWidth: 120, render: (row) => row.contact_number || '—' },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      minWidth: 56,
      render: (row) => (
        <Tooltip title="Actions">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              setActionMenuAnchor(e.currentTarget)
              setActionMenuRow(row)
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Employees Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Employee
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search employees..."
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
          label="Designation"
          value={designationFilter}
          onChange={(e) => {
            setDesignationFilter(e.target.value)
            setPage(1)
          }}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          {EMPLOYEE_DESIGNATIONS.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <DataTable
        columns={columns}
        data={list}
        loading={isLoading}
        pagination={pagination}
        onPageChange={(_, p) => setPage(p + 1)}
        onRowsPerPageChange={(e) => {
          setLimit(parseInt(e.target.value, 10))
          setPage(1)
        }}
        emptyMessage="No employees yet. Add one to get started."
      />

      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={() => {
          setActionMenuAnchor(null)
          setActionMenuRow(null)
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {actionMenuRow && (
          <>
            <MenuItem
              onClick={() => {
                setActionMenuAnchor(null)
                handleOpenDialog(actionMenuRow)
                setActionMenuRow(null)
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            {actionMenuRow.id !== currentUser?.id && (
              <MenuItem
                onClick={() => {
                  setActionMenuAnchor(null)
                  confirmDelete(actionMenuRow.id)
                  setActionMenuRow(null)
                }}
                sx={{ color: 'error.main' }}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          key={editingEmployee ? `edit-${editingEmployee.id}` : 'add-new'}
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form autoComplete="off">
              <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
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
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Designation"
                      name="work_title"
                      value={values.work_title || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.work_title && !!errors.work_title}
                      helperText={touched.work_title && errors.work_title}
                    >
                      <MenuItem value="">— None —</MenuItem>
                      {EMPLOYEE_DESIGNATIONS.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={values.department || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.department && !!errors.department}
                      helperText={touched.department && errors.department}
                      placeholder="e.g. Security, Maintenance"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Salary (PKR)"
                      name="salary_rupees"
                      type="number"
                      inputProps={{ min: 0, step: 1 }}
                      value={values.salary_rupees ?? ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.salary_rupees && !!errors.salary_rupees}
                      helperText={touched.salary_rupees && errors.salary_rupees}
                      placeholder="Rupees"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      name="contact_number"
                      value={values.contact_number || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.contact_number && !!errors.contact_number}
                      helperText={touched.contact_number && errors.contact_number}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {editingEmployee ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default Employees
