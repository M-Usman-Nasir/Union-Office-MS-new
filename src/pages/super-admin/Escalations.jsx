import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
} from '@mui/material'
import useSWR from 'swr'
import { superAdminApi } from '@/api/superAdminApi'
import DataTable from '@/components/common/DataTable'
import toast from 'react-hot-toast'

const Escalations = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [resolvedFilter, setResolvedFilter] = useState('')
  const [resolveDialog, setResolveDialog] = useState({ open: false, row: null, notes: '' })
  const [resolving, setResolving] = useState(false)

  const { data, isLoading, mutate } = useSWR(
    ['/super-admin/escalations', page, limit, resolvedFilter],
    () =>
      superAdminApi
        .getEscalations({
          page,
          limit,
          resolved: resolvedFilter === 'resolved' ? true : resolvedFilter === 'open' ? false : undefined,
        })
        .then((res) => res.data)
  )

  const openResolve = (row) => setResolveDialog({ open: true, row, notes: '' })
  const closeResolve = () => setResolveDialog({ open: false, row: null, notes: '' })

  const handleResolve = async () => {
    if (!resolveDialog.row?.id) return
    setResolving(true)
    try {
      await superAdminApi.resolveEscalation(resolveDialog.row.id, { resolution_notes: resolveDialog.notes })
      toast.success('Escalation resolved')
      mutate()
      closeResolve()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to resolve')
    } finally {
      setResolving(false)
    }
  }

  const columns = [
    { id: 'id', label: 'ID', minWidth: 60 },
    { id: 'subject', label: 'Subject', minWidth: 180 },
    { id: 'society_name', label: 'Union', minWidth: 140 },
    { id: 'submitted_by_name', label: 'Submitted by', minWidth: 120 },
    { id: 'unit_number', label: 'Unit', minWidth: 80 },
    { id: 'priority', label: 'Priority', minWidth: 90, render: (row) => <Chip size="small" label={row.priority || '—'} /> },
    { id: 'escalated_at', label: 'Escalated', minWidth: 140, render: (row) => row.escalated_at ? new Date(row.escalated_at).toLocaleString() : '—' },
    { id: 'escalation_reason', label: 'Reason', minWidth: 120, render: (row) => (row.escalation_reason || '—').slice(0, 40) + ((row.escalation_reason || '').length > 40 ? '…' : '') },
    {
      id: 'resolved',
      label: 'Status',
      minWidth: 100,
      render: (row) => (row.resolved_by_super_at ? <Chip size="small" color="success" label="Resolved" /> : <Chip size="small" color="warning" label="Open" />),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      minWidth: 100,
      render: (row) =>
        !row.resolved_by_super_at ? (
          <Button size="small" variant="outlined" onClick={() => openResolve(row)}>
            Resolve
          </Button>
        ) : (
          '—'
        ),
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Escalations &amp; disputes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Complaints escalated to platform for resolution. Resolve with notes.
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          select
          size="small"
          label="Status"
          value={resolvedFilter}
          onChange={(e) => { setResolvedFilter(e.target.value); setPage(1) }}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
        </TextField>
      </Box>

      <DataTable
        dense
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

      <Dialog open={resolveDialog.open} onClose={closeResolve} maxWidth="sm" fullWidth>
        <DialogTitle>Resolve escalation</DialogTitle>
        <DialogContent>
          {resolveDialog.row && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Complaint: {resolveDialog.row.subject}</Typography>
            </Box>
          )}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Resolution notes"
            value={resolveDialog.notes}
            onChange={(e) => setResolveDialog((d) => ({ ...d, notes: e.target.value }))}
            placeholder="Outcome and notes for the record"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeResolve}>Cancel</Button>
          <Button variant="contained" onClick={handleResolve} disabled={resolving}>
            {resolving ? <CircularProgress size={20} /> : 'Mark resolved'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Escalations
