import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material'
import useSWR from 'swr'
import { superAdminApi } from '@/api/superAdminApi'
import DataTable from '@/components/common/DataTable'

const AuditLogs = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [resourceType, setResourceType] = useState('')
  const [actionFilter, setActionFilter] = useState('')

  const { data, isLoading, mutate } = useSWR(
    ['/super-admin/audit-logs', page, limit, resourceType, actionFilter],
    () =>
      superAdminApi
        .getAuditLogs({
          page,
          limit,
          resource_type: resourceType || undefined,
          action: actionFilter || undefined,
        })
        .then((res) => res.data)
  )

  const columns = [
    { id: 'created_at', label: 'Time', minWidth: 160, render: (row) => new Date(row.created_at).toLocaleString() },
    { id: 'user_name', label: 'User', minWidth: 120, render: (row) => row.user_name || row.user_id || '—' },
    { id: 'role', label: 'Role', minWidth: 100, render: (row) => <Chip size="small" label={row.role || '—'} /> },
    { id: 'action', label: 'Action', minWidth: 140 },
    { id: 'resource_type', label: 'Resource', minWidth: 100 },
    { id: 'resource_id', label: 'ID', minWidth: 80 },
    { id: 'society_name', label: 'Union', minWidth: 140, render: (row) => row.society_name || '—' },
    { id: 'details', label: 'Details', minWidth: 120, render: (row) => (row.details ? JSON.stringify(row.details).slice(0, 60) + (JSON.stringify(row.details).length > 60 ? '…' : '') : '—') },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Audit logs
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          System-wide audit trail for accountability and compliance.
        </Typography>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          size="small"
          label="Resource type"
          value={resourceType}
          onChange={(e) => { setResourceType(e.target.value); setPage(1) }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="apartment">Apartment</MenuItem>
          <MenuItem value="global_settings">Global settings</MenuItem>
          <MenuItem value="complaint">Complaint</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          label="Action"
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="apartment.create">apartment.create</MenuItem>
          <MenuItem value="apartment.update">apartment.update</MenuItem>
          <MenuItem value="apartment.delete">apartment.delete</MenuItem>
          <MenuItem value="apartment.approve">apartment.approve</MenuItem>
          <MenuItem value="apartment.reject">apartment.reject</MenuItem>
          <MenuItem value="global_settings.update">global_settings.update</MenuItem>
          <MenuItem value="escalation.resolve">escalation.resolve</MenuItem>
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
    </Container>
  )
}

export default AuditLogs
