import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { unionMembersApi } from '@/api/unionMembersApi'
import DataTable from '@/components/common/DataTable'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { jsPDF } from 'jspdf'

const ResidentUnionMembers = () => {
  const { user } = useAuth()
  const societyId = user?.society_apartment_id != null ? Number(user.society_apartment_id) : null

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingMember, setViewingMember] = useState(null)

  const { data, isLoading } = useSWR(
    user && societyId ? ['/union-members', page, limit, search] : null,
    () => unionMembersApi.getAll({ page, limit, search }).then((res) => res.data)
  )

  const list = data?.data ?? []
  const pagination = data?.pagination ?? { page: 1, limit: 10, total: 0, pages: 0 }

  const handleView = (row) => {
    setViewingMember(row)
    setViewDialogOpen(true)
  }

  const handleCloseView = () => {
    setViewDialogOpen(false)
    setViewingMember(null)
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
      id: 'view',
      label: ' ',
      align: 'right',
      render: (row) => (
        <Tooltip title="View details">
          <IconButton size="small" onClick={() => handleView(row)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4, overflowX: 'hidden' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Union Members
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View your community leadership
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, designation, phone, email, unit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleDownloadPDF}
          disabled={!list.length}
        >
          Download PDF
        </Button>
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
    </Container>
  )
}

export default ResidentUnionMembers
