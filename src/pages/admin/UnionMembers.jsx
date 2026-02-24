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
import VisibilityIcon from '@mui/icons-material/Visibility'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { unionMembersApi } from '@/api/unionMembersApi'
import { propertyApi } from '@/api/propertyApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { jsPDF } from 'jspdf'

const validationSchema = Yup.object({
  member_name: Yup.string().required('Member name is required'),
  designation: Yup.string().nullable(),
  phone: Yup.string().nullable(),
  email: Yup.string().email('Invalid email').nullable(),
  joining_date: Yup.string().nullable(),
  unit_id: Yup.number().nullable(),
})

const UnionMembers = () => {
  const { user } = useAuth()
  const societyId = user?.society_apartment_id != null ? Number(user.society_apartment_id) : null

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingMember, setViewingMember] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null)

  const { data, isLoading, mutate } = useSWR(
    user && societyId ? ['/union-members', page, limit, search] : null,
    () => unionMembersApi.getAll({ page, limit, search }).then((res) => res.data)
  )

  const { data: unitsData } = useSWR(
    openDialog && societyId ? ['/properties/units', societyId] : null,
    () => propertyApi.getUnits({ society_id: societyId }).then((res) => res.data)
  )
  const units = unitsData?.data ?? []

  const list = data?.data ?? []
  const pagination = data?.pagination ?? { page: 1, limit: 10, total: 0, pages: 0 }

  const handleOpenDialog = (member = null) => {
    setEditingMember(member)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingMember(null)
  }

  const handleView = (row) => {
    setViewingMember(row)
    setViewDialogOpen(true)
  }

  const handleCloseView = () => {
    setViewDialogOpen(false)
    setViewingMember(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        member_name: values.member_name?.trim() || '',
        designation: values.designation || null,
        phone: values.phone || null,
        email: values.email || null,
        joining_date: values.joining_date || null,
        unit_id: values.unit_id || null,
      }
      if (editingMember) {
        await unionMembersApi.update(editingMember.id, payload)
        toast.success('Union member updated successfully')
      } else {
        await unionMembersApi.create(payload)
        toast.success('Union member added successfully')
      }
      handleCloseDialog()
      mutate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (id) => {
    setIdToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!idToDelete) return
    try {
      await unionMembersApi.remove(idToDelete)
      toast.success('Union member deleted successfully')
      mutate()
      setDeleteConfirmOpen(false)
      setIdToDelete(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    setIdToDelete(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return dayjs(dateString).format('DD/MM/YYYY')
  }

  const handleDownloadPDF = () => {
    if (!list.length) {
      toast.error('No data to export')
      return
    }
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const colCount = 6
      const colWidth = pageWidth / colCount
      const rowHeight = 8
      const startX = 10
      let y = 15

      doc.setFontSize(14)
      doc.text('Union Members', startX, y)
      y += 10

      const headers = ['Member Name', 'Designation', 'Phone', 'Email', 'Joining Date', 'Unit No']
      doc.setFontSize(9)
      doc.setFont(undefined, 'bold')
      headers.forEach((h, i) => {
        doc.text(h, startX + i * colWidth + 2, y)
      })
      y += rowHeight
      doc.setDrawColor(200, 200, 200)
      doc.line(startX, y - 4, pageWidth - 10, y - 4)
      doc.setFont(undefined, 'normal')

      list.forEach((row) => {
        if (y > 180) {
          doc.addPage()
          y = 15
        }
        const cells = [
          (row.member_name || '').substring(0, 22),
          (row.designation || '-').substring(0, 18),
          (row.phone || '-').substring(0, 16),
          (row.email || '-').substring(0, 28),
          formatDate(row.joining_date),
          row.unit_number != null ? String(row.unit_number) : '-',
        ]
        cells.forEach((cell, i) => {
          doc.text(cell, startX + i * colWidth + 2, y)
        })
        y += rowHeight
      })

      doc.save('union-members.pdf')
      toast.success('PDF downloaded')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate PDF')
    }
  }

  const columns = [
    { id: 'member_name', label: 'Member Name', minWidth: 140 },
    { id: 'designation', label: 'Designation', render: (row) => row.designation || '-' },
    { id: 'phone', label: 'Phone', render: (row) => row.phone || '-' },
    { id: 'email', label: 'Email', render: (row) => row.email || '-' },
    { id: 'joining_date', label: 'Joining Date', render: (row) => formatDate(row.joining_date) },
    { id: 'unit_number', label: 'Unit No', render: (row) => (row.unit_number != null ? row.unit_number : '-') },
    {
      id: 'actions',
      label: 'Action',
      align: 'right',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleView(row)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenDialog(row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDeleteClick(row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const initialValues = editingMember
    ? {
        member_name: editingMember.member_name || '',
        designation: editingMember.designation || '',
        phone: editingMember.phone || '',
        email: editingMember.email || '',
        joining_date: editingMember.joining_date
          ? dayjs(editingMember.joining_date).format('YYYY-MM-DD')
          : '',
        unit_id: editingMember.unit_id ?? '',
      }
    : {
        member_name: '',
        designation: '',
        phone: '',
        email: '',
        joining_date: dayjs().format('YYYY-MM-DD'),
        unit_id: '',
      }

  return (
    <Container maxWidth="lg" sx={{ py: 4, overflowX: 'hidden' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          Union Members
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleDownloadPDF}
            disabled={!list.length}
          >
            Download PDF
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Add Member
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, designation, phone, email, unit..."
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
        data={list}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit)
          setPage(1)
        }}
        emptyMessage="No union members found"
      />

      {/* View dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseView} maxWidth="sm" fullWidth>
        <DialogTitle>Member Details</DialogTitle>
        <DialogContent>
          {viewingMember && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Member Name</Typography>
                <Typography variant="body1">{viewingMember.member_name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Designation</Typography>
                <Typography variant="body1">{viewingMember.designation || '-'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Phone</Typography>
                <Typography variant="body1">{viewingMember.phone || '-'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body1">{viewingMember.email || '-'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Joining Date</Typography>
                <Typography variant="body1">{formatDate(viewingMember.joining_date)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Unit No</Typography>
                <Typography variant="body1">
                  {viewingMember.unit_number != null ? viewingMember.unit_number : '-'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete union member?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this member? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add / Edit dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>{editingMember ? 'Edit Member' : 'Add Member'}</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Member Name"
                      name="member_name"
                      value={values.member_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.member_name && !!errors.member_name}
                      helperText={touched.member_name && errors.member_name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Designation"
                      name="designation"
                      value={values.designation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Joining Date"
                      name="joining_date"
                      type="date"
                      value={values.joining_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Unit No"
                      name="unit_id"
                      value={values.unit_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="">None</MenuItem>
                      {units.map((unit) => (
                        <MenuItem key={unit.id} value={unit.id}>
                          {unit.unit_number}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {editingMember ? 'Update' : 'Add'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default UnionMembers
