import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  MenuItem,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import RefreshIcon from '@mui/icons-material/Refresh'
import useSWR from 'swr'
import { unitClaimsApi } from '@/api/unitClaimsApi'
import DataTable from '@/components/common/DataTable'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const UnitClaims = () => {
  const [statusFilter, setStatusFilter] = useState('pending')
  const [rejectDialog, setRejectDialog] = useState({ open: false, claim: null, notes: '' })
  const [actionLoading, setActionLoading] = useState(false)

  const params = statusFilter ? { status: statusFilter } : {}
  const { data, isLoading, error, mutate } = useSWR(
    ['/unit-claims', statusFilter],
    () => unitClaimsApi.getAll(params).then(res => res.data)
  )

  const claims = data?.data ?? []

  const handleApprove = async (claim) => {
    setActionLoading(true)
    try {
      await unitClaimsApi.approve(claim.id)
      toast.success('Claim approved. Resident has been linked to the unit.')
      mutate()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectOpen = (claim) => {
    setRejectDialog({ open: true, claim, notes: '' })
  }

  const handleRejectClose = () => {
    setRejectDialog({ open: false, claim: null, notes: '' })
  }

  const handleRejectSubmit = async () => {
    if (!rejectDialog.claim) return
    setActionLoading(true)
    try {
      await unitClaimsApi.reject(rejectDialog.claim.id, { notes: rejectDialog.notes || undefined })
      toast.success('Claim rejected.')
      mutate()
      handleRejectClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject')
    } finally {
      setActionLoading(false)
    }
  }

  const columns = [
    {
      id: 'requester_name',
      label: 'Requester',
      minWidth: 140,
      render: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.requester_name || '—'}
          </Typography>
          {row.requester_email && (
            <Typography variant="caption" color="text.secondary" display="block">
              {row.requester_email}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'unit_number',
      label: 'Unit',
      minWidth: 80,
      render: (row) => `${row.block_name ? `${row.block_name} / ` : ''}${row.unit_number ?? '—'}`,
    },
    {
      id: 'society_name',
      label: 'Society',
      minWidth: 120,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (row) => {
        const value = row.status
        const color = value === 'pending' ? 'warning' : value === 'approved' ? 'success' : 'error'
        return <Chip size="small" label={value} color={color} />
      },
    },
    {
      id: 'created_at',
      label: 'Requested',
      minWidth: 110,
      render: (row) => (row.created_at ? dayjs(row.created_at).format('DD/MM/YYYY HH:mm') : '—'),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
      align: 'right',
      render: (row) =>
        row.status === 'pending' ? (
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
            <Tooltip title="Approve">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleApprove(row)}
                disabled={actionLoading}
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject">
              <IconButton
                color="error"
                size="small"
                onClick={() => handleRejectOpen(row)}
                disabled={actionLoading}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          '—'
        ),
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Ownership / Tenancy Requests
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            {statusOptions.map((opt) => (
              <MenuItem key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <IconButton onClick={() => mutate()} size="small" title="Refresh">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Residents request to link their account to a unit. Approve to assign the unit to them; reject to decline with optional notes.
          </Typography>
          <DataTable
            columns={columns}
            data={claims}
            loading={isLoading}
            emptyMessage="No unit claims found."
          />
        </CardContent>
      </Card>

      <Dialog open={rejectDialog.open} onClose={handleRejectClose} maxWidth="sm" fullWidth>
        <DialogTitle>Reject unit claim</DialogTitle>
        <DialogContent>
          {rejectDialog.claim && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Reject request by {rejectDialog.claim.requester_name} for unit {rejectDialog.claim.unit_number}?
            </Typography>
          )}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (optional)"
            value={rejectDialog.notes}
            onChange={(e) => setRejectDialog((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Reason for rejection (visible to resident)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectClose}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleRejectSubmit} disabled={actionLoading}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default UnitClaims
