import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { maintenanceApi } from '@/api/maintenanceApi'
import DataTable from '@/components/common/DataTable'
import toast from 'react-hot-toast'

const ResidentMaintenance = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadDialogRow, setUploadDialogRow] = useState(null)
  const [receiptFile, setReceiptFile] = useState(null)
  const [proofNote, setProofNote] = useState('')
  const [submitProofLoading, setSubmitProofLoading] = useState(false)

  const { data, isLoading, mutate } = useSWR(
    ['/maintenance/my', page, limit, user?.unit_id],
    () => maintenanceApi.getAll({ page, limit, unit_id: user?.unit_id }).then(res => res.data),
    { revalidateOnFocus: false }
  )

  const { data: myRequestsData, mutate: mutateMyRequests } = useSWR(
    user ? '/maintenance/payment-requests/mine' : null,
    () => maintenanceApi.getMyPaymentRequests().then(res => res.data)
  )
  const myRequests = myRequestsData?.data || []
  const pendingByMaintenanceId = myRequests
    .filter(r => r.status === 'pending')
    .reduce((acc, r) => ({ ...acc, [r.maintenance_id]: true }), {})

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount || 0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success'
      case 'partially_paid':
        return 'warning'
      case 'pending':
        return 'error'
      default:
        return 'default'
    }
  }

  const canUploadProof = (row) =>
    (row.status === 'pending' || row.status === 'partially_paid') && !pendingByMaintenanceId[row.id]

  const handleOpenUploadDialog = (row) => {
    setUploadDialogRow(row)
    setReceiptFile(null)
    setProofNote('')
    setUploadDialogOpen(true)
  }

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false)
    setUploadDialogRow(null)
    setReceiptFile(null)
    setProofNote('')
  }

  const handleSubmitProof = async () => {
    if (!uploadDialogRow || !receiptFile) {
      toast.error('Please select a file (image or PDF).')
      return
    }
    setSubmitProofLoading(true)
    try {
      const formData = new FormData()
      formData.append('proof', receiptFile)
      if (proofNote.trim()) formData.append('note', proofNote.trim())
      await maintenanceApi.submitPaymentProof(uploadDialogRow.id, formData)
      toast.success('Payment proof submitted. The office will review it shortly.')
      mutate()
      mutateMyRequests()
      handleCloseUploadDialog()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit proof')
    } finally {
      setSubmitProofLoading(false)
    }
  }

  const columns = [
    { id: 'month', label: 'Month', render: (row) => `${row.month}/${row.year}` },
    { id: 'base_amount', label: 'Base Amount', render: (row) => formatCurrency(row.base_amount) },
    { id: 'total_amount', label: 'Total Amount', render: (row) => formatCurrency(row.total_amount) },
    { id: 'amount_paid', label: 'Amount Paid', render: (row) => formatCurrency(row.amount_paid || 0) },
    {
      id: 'status',
      label: 'Status',
      render: (row) => {
        if (pendingByMaintenanceId[row.id]) {
          return <Chip label="Pending verification" color="info" size="small" />
        }
        return <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => {
        if (row.status === 'paid') return null
        if (pendingByMaintenanceId[row.id]) {
          return <Chip label="Under review" size="small" variant="outlined" />
        }
        if (canUploadProof(row)) {
          return (
            <Button
              size="small"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => handleOpenUploadDialog(row)}
            >
              Upload proof
            </Button>
          )
        }
        return null
      },
    },
  ]

  const totalPending = data?.data?.filter(m => m.status === 'pending').reduce((sum, m) => sum + parseFloat(m.total_amount || 0), 0) || 0
  const totalPaid = data?.data?.filter(m => m.status === 'paid').reduce((sum, m) => sum + parseFloat(m.total_amount || 0), 0) || 0

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Maintenance
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          For unpaid or partially paid dues, you can submit payment proof (e.g. bank slip or receipt). The office will verify and mark it as paid.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                {formatCurrency(totalPending)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {formatCurrency(totalPaid)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Paid
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {data?.pagination?.total || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Records
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

      <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Submit payment proof</DialogTitle>
        <DialogContent>
          {uploadDialogRow && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {uploadDialogRow.month}/{uploadDialogRow.year} · {formatCurrency(uploadDialogRow.total_amount)} due
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} disabled={submitProofLoading}>
                  Choose file (image or PDF)
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    hidden
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  />
                </Button>
                {receiptFile && (
                  <Typography variant="body2" color="text.secondary">
                    Selected: {receiptFile.name}
                  </Typography>
                )}
                <TextField
                  label="Note (optional)"
                  placeholder="e.g. Transaction reference, date of transfer"
                  multiline
                  rows={2}
                  value={proofNote}
                  onChange={(e) => setProofNote(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog} disabled={submitProofLoading}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitProof}
            disabled={!receiptFile || submitProofLoading}
            startIcon={submitProofLoading ? <CircularProgress size={18} /> : <UploadFileIcon />}
          >
            {submitProofLoading ? 'Submitting...' : 'Submit proof'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ResidentMaintenance
