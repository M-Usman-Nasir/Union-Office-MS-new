import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import BackupIcon from '@mui/icons-material/Backup'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RestoreIcon from '@mui/icons-material/Restore'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import { superAdminApi } from '@/api/superAdminApi'

function formatBytes(n) {
  if (n == null || Number.isNaN(n)) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

const fetcher = () =>
  superAdminApi.listSystemBackups().then((res) => res.data?.data ?? [])

const ResetBackup = () => {
  const { data: backups, isLoading, mutate } = useSWR('system-backups', fetcher)
  const [creating, setCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [restoreTarget, setRestoreTarget] = useState(null)
  const [restoreConfirm, setRestoreConfirm] = useState('')
  const [factoryOpen, setFactoryOpen] = useState(false)
  const [factoryPassword, setFactoryPassword] = useState('')
  const [factoryConfirm, setFactoryConfirm] = useState('')

  const handleCreate = async () => {
    setCreating(true)
    try {
      await superAdminApi.createSystemBackup()
      toast.success('Backup created.')
      await mutate()
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Backup failed')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Type DELETE to confirm.')
      return
    }
    try {
      await superAdminApi.deleteSystemBackup(deleteTarget.filename)
      toast.success('Backup removed.')
      setDeleteTarget(null)
      setDeleteConfirm('')
      await mutate()
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Delete failed')
    }
  }

  const handleRestore = async () => {
    if (restoreConfirm !== 'RESTORE') {
      toast.error('Type RESTORE to confirm.')
      return
    }
    try {
      await superAdminApi.restoreSystemBackup(restoreTarget.filename)
      toast.success(
        'Restore started. The API server will stop — restart the backend process, then refresh this page.'
      )
      setRestoreTarget(null)
      setRestoreConfirm('')
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Restore failed')
    }
  }

  const handleFactory = async () => {
    if (!factoryPassword.trim()) {
      toast.error('Enter your account password.')
      return
    }
    if (factoryConfirm !== 'FACTORY RESET') {
      toast.error('Type FACTORY RESET to confirm.')
      return
    }
    try {
      const res = await superAdminApi.factoryResetSystem(factoryPassword)
      toast.success(res.data?.message || 'Factory reset completed.')
      setFactoryOpen(false)
      setFactoryPassword('')
      setFactoryConfirm('')
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Factory reset failed')
    }
  }

  const closeFactoryDialog = () => {
    setFactoryOpen(false)
    setFactoryPassword('')
    setFactoryConfirm('')
  }

  const rows = Array.isArray(backups) ? backups : []

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Reset & backup
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Full database dumps (PostgreSQL custom format). Restore stops this API process — restart the server afterward.
            Factory reset empties all public tables; you may need bootstrap again if no users remain.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<BackupIcon />}
          disabled={creating}
          onClick={handleCreate}
        >
          {creating ? 'Creating…' : 'Create backup'}
        </Button>
      </Box>

      <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3 }}>
        Requires PostgreSQL client tools on the server (<code>pg_dump</code> / <code>pg_restore</code>). Set{' '}
        <code>PGBIN</code> if they are not on <code>PATH</code>. Backups are stored under{' '}
        <code>HUMS_BACKUPS_DIR</code> (default: <code>backend/backups</code>).
      </Alert>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>File</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  No backups yet. Create one to snapshot the database.
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.filename} hover>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{row.filename}</TableCell>
                <TableCell align="right">{formatBytes(row.sizeBytes)}</TableCell>
                <TableCell>
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                </TableCell>
                <TableCell align="right">
                  <Button size="small" color="warning" startIcon={<RestoreIcon />} onClick={() => setRestoreTarget(row)}>
                    Restore
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => setDeleteTarget(row)}
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4, p: 2, border: '1px solid', borderColor: 'error.main', borderRadius: 1 }}>
        <Typography variant="subtitle1" color="error" gutterBottom>
          Factory reset (empty all data)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Truncates every table in the <code>public</code> schema. Schema and migrations stay; all rows are removed.
          You may be locked out until you run <code>POST /api/bootstrap</code> with <code>X-Bootstrap-Secret</code>.
        </Typography>
        <Button variant="outlined" color="error" onClick={() => { setFactoryPassword(''); setFactoryConfirm(''); setFactoryOpen(true) }}>
          Factory reset…
        </Button>
      </Box>

      <Dialog open={!!deleteTarget} onClose={() => { setDeleteTarget(null); setDeleteConfirm('') }} maxWidth="xs" fullWidth>
        <DialogTitle>Delete backup</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Remove file <strong>{deleteTarget?.filename}</strong> from disk?
          </Typography>
          <TextField
            fullWidth
            size="small"
            label='Type "DELETE" to confirm'
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteTarget(null); setDeleteConfirm('') }}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleteConfirm !== 'DELETE'}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!restoreTarget} onClose={() => { setRestoreTarget(null); setRestoreConfirm('') }} maxWidth="sm" fullWidth>
        <DialogTitle>Restore from backup</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This replaces database objects from the dump. The API will close its pool and exit — you must restart the
            backend. All connected clients will be disconnected.
          </Alert>
          <Typography variant="body2" sx={{ mb: 2 }}>
            File: <strong>{restoreTarget?.filename}</strong>
          </Typography>
          <TextField
            fullWidth
            size="small"
            label='Type "RESTORE" to confirm'
            value={restoreConfirm}
            onChange={(e) => setRestoreConfirm(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setRestoreTarget(null); setRestoreConfirm('') }}>Cancel</Button>
          <Button color="warning" variant="contained" onClick={handleRestore} disabled={restoreConfirm !== 'RESTORE'}>
            Restore
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={factoryOpen} onClose={closeFactoryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Factory reset</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your <strong>login password</strong> for this account, then type the phrase below. Nothing runs until both are correct.
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="password"
            autoComplete="current-password"
            label="Your password"
            value={factoryPassword}
            onChange={(e) => setFactoryPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            size="small"
            label='Type "FACTORY RESET" to confirm'
            value={factoryConfirm}
            onChange={(e) => setFactoryConfirm(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFactoryDialog}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleFactory}
            disabled={
              !factoryPassword.trim() || factoryConfirm !== 'FACTORY RESET'
            }
          >
            Erase all data
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ResetBackup
