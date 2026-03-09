import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Tabs,
  Tab,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SyncIcon from '@mui/icons-material/Sync'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import useSWR, { useSWRConfig } from 'swr'
import { defaulterApi } from '@/api/defaulterApi'
import { settingsApi } from '@/api/settingsApi'
import { propertyApi } from '@/api/propertyApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { jsPDF } from 'jspdf'
import { ROLES } from '@/utils/constants'

const Defaulters = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { mutate: globalMutate } = useSWRConfig()
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDefaulter, setSelectedDefaulter] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [societyId] = useState(user?.society_apartment_id)
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [selectedFloorId, setSelectedFloorId] = useState('')

  const fetchParams = { page, limit, search, status: statusFilter, society_id: societyId }
  if (selectedBlockId != null && selectedBlockId !== '') fetchParams.block_id = selectedBlockId
  if (selectedFloorId != null && selectedFloorId !== '') fetchParams.floor_id = selectedFloorId

  const { data, isLoading, error, mutate } = useSWR(
    ['/defaulters', page, limit, search, statusFilter, societyId, selectedBlockId, selectedFloorId],
    () => defaulterApi.getAll(fetchParams).then(res => res.data).catch(err => {
      console.error('Defaulters API error:', err)
      toast.error(err.response?.data?.message || 'Failed to load defaulters data')
      throw err
    })
  )

  const { data: stats } = useSWR(
    ['/defaulters/statistics', societyId],
    () => defaulterApi.getStatistics({ society_id: societyId }).then(res => res.data.data).catch(err => {
      console.error('Defaulters statistics error:', err)
      return null
    })
  )

  // Check visibility settings (for admin view - to show message if disabled)
  const { data: settings, isLoading: settingsLoading } = useSWR(
    societyId ? `/settings/${societyId}` : null,
    () => settingsApi.getSettings(societyId).then(res => res.data.data || res.data).catch(() => null)
  )

  const isVisible = settings?.defaulter_list_visible !== false

  const { data: blocksData } = useSWR(
    societyId ? ['/blocks', societyId] : null,
    () => propertyApi.getBlocks({ society_id: societyId }).then(res => res.data)
  )
  const { data: floorsData } = useSWR(
    selectedBlockId ? ['/floors-block', selectedBlockId] : null,
    () => propertyApi.getFloors({ block_id: selectedBlockId }).then(res => res.data)
  )
  const blocks = blocksData?.data || []
  const floorsForBlock = floorsData?.data ?? []

  const handleOpenDialog = (defaulter) => {
    setSelectedDefaulter(defaulter)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedDefaulter(null)
  }

  const handleStatusUpdate = async (values) => {
    try {
      await defaulterApi.updateStatus(selectedDefaulter.id, values)
      toast.success('Defaulter status updated successfully')
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      const res = await defaulterApi.exportCsv({ society_id: societyId })
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `defaulters-${societyId || 'all'}-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Defaulter list exported successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  const handleExportPdf = async () => {
    setExportingPdf(true)
    try {
      const exportParams = { page: 1, limit: 10000, search, status: statusFilter, society_id: societyId }
      if (selectedBlockId != null && selectedBlockId !== '') exportParams.block_id = selectedBlockId
      if (selectedFloorId != null && selectedFloorId !== '') exportParams.floor_id = selectedFloorId
      const res = await defaulterApi.getAll(exportParams)
      const list = res?.data?.data || []
      if (!list.length) {
        toast.error('No data to export')
        return
      }
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const colCount = 8
      const colWidth = (pageWidth - 20) / colCount
      const rowHeight = 8
      const startX = 10
      let y = 15

      doc.setFontSize(14)
      doc.text('Defaulter List', startX, y)
      y += 8
      doc.setFontSize(9)
      doc.text(`Generated on ${dayjs().format('DD MMM YYYY HH:mm')}`, startX, y)
      y += 10

      const headers = ['Full Name', 'Unit No.', 'Phone', 'Floor', 'Last Payment', 'Amount Due', 'Months Overdue', 'Remarks']
      doc.setFont(undefined, 'bold')
      headers.forEach((h, i) => {
        doc.text(h.substring(0, 14), startX + i * colWidth + 2, y)
      })
      y += rowHeight
      doc.setDrawColor(200, 200, 200)
      doc.line(startX, y - 4, pageWidth - 10, y - 4)
      doc.setFont(undefined, 'normal')

      list.forEach((row) => {
        if (y > 180) {
          doc.addPage('a4', 'landscape')
          y = 15
          doc.setFontSize(9)
          headers.forEach((h, i) => {
            doc.setFont(undefined, 'bold')
            doc.text(h.substring(0, 14), startX + i * colWidth + 2, y)
          })
          y += rowHeight
          doc.line(startX, y - 4, pageWidth - 10, y - 4)
          doc.setFont(undefined, 'normal')
        }
        const cells = [
          (row.resident_name || '-').substring(0, 14),
          (row.unit_number != null ? String(row.unit_number) : '-').substring(0, 8),
          (row.resident_contact || '-').substring(0, 12),
          formatFloorLabel(row.floor_number).substring(0, 6),
          row.last_payment_date ? dayjs(row.last_payment_date).format('DD/MM/YY') : '-',
          formatCurrency(row.amount_due).replace(/\s/g, '').substring(0, 12),
          (row.months_overdue != null ? String(row.months_overdue) : '-').substring(0, 6),
          (row.remarks || '-').substring(0, 14),
        ]
        cells.forEach((cell, i) => {
          doc.text(cell, startX + i * colWidth + 2, y)
        })
        y += rowHeight
      })

      doc.save(`defaulters-${societyId || 'all'}-${dayjs().format('YYYY-MM-DD')}.pdf`)
      toast.success('Defaulter list exported as PDF')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to generate PDF')
    } finally {
      setExportingPdf(false)
    }
  }

  const handleSyncFromMaintenance = async () => {
    setSyncing(true)
    try {
      const res = await defaulterApi.syncFromMaintenance({ society_id: societyId })
      const data = res.data?.data ?? res.data
      const msg = data
        ? `Synced: ${data.defaulters_inserted ?? 0} defaulters from unpaid maintenance`
        : 'Defaulters synced from maintenance'
      toast.success(msg)
      mutate()
      globalMutate((key) => Array.isArray(key) && key[0] === '/defaulters/statistics')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount || 0)
  }

  const formatFloorLabel = (floorNumber) => {
    const fn = floorNumber != null ? Number(floorNumber) : null
    if (fn === null) return '-'
    if (fn === 0) return 'Ground'
    if (fn === 1) return '1st'
    if (fn === 2) return '2nd'
    if (fn === 3) return '3rd'
    return `${fn}th`
  }

  const columns = [
    {
      id: 'resident_name',
      label: 'Full Name',
      render: (row) => {
        const name = row.resident_name || '-'
        const residentId = row.resident_id
        if (residentId) {
          return (
            <Typography
              component="button"
              type="button"
              onClick={() => navigate(`/admin/residents/${residentId}`)}
              sx={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'primary.main',
                textDecoration: 'underline',
                font: 'inherit',
              }}
            >
              {name}
            </Typography>
          )
        }
        return name
      },
    },
    { id: 'unit_number', label: 'Unit No.', render: (row) => row.unit_number || '-' },
    { id: 'resident_contact', label: 'Phone Number', render: (row) => row.resident_contact || '-' },
    {
      id: 'floor_number',
      label: 'Floors No.',
      render: (row) => formatFloorLabel(row.floor_number),
    },
    {
      id: 'last_payment_date',
      label: 'Last Payment Date',
      render: (row) =>
        row.last_payment_date
          ? dayjs(row.last_payment_date).format('DD MMM YYYY')
          : '-',
    },
    { id: 'amount_due', label: 'Amount Due', render: (row) => formatCurrency(row.amount_due) },
    { id: 'months_overdue', label: 'Months Overdue', render: (row) => row.months_overdue ?? '-' },
    { id: 'remarks', label: 'Remarks', render: (row) => row.remarks || '-' },
    {
      id: 'actions',
      label: 'Action',
      align: 'right',
      render: (row) => (
        <Tooltip title="Update Status">
          <IconButton size="small" onClick={() => handleOpenDialog(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Defaulters Management
        </Typography>
      </Box>

      {/* Error Message */}
      {error && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error">
            {error.response?.data?.message || 'Failed to load defaulters data. Please try again.'}
          </Alert>
        </Box>
      )}

      {/* Visibility Notice: only for super_admin (union_admin manages their society and can use Settings without this reminder) */}
      {isSuperAdmin && !settingsLoading && settings && !isVisible && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="warning">
            Defaulter list visibility is currently disabled. Residents will not be able to view the defaulter list.
            You can enable it in Settings.
          </Alert>
        </Box>
      )}

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {stats.total_defaulters || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Defaulters
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="error.main">
                  {formatCurrency(stats.total_amount_due)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Amount Due
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {stats.active_count || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Defaulters
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  {stats.avg_months_overdue != null 
                    ? (typeof stats.avg_months_overdue === 'number' 
                        ? stats.avg_months_overdue.toFixed(1) 
                        : parseFloat(stats.avg_months_overdue || 0).toFixed(1))
                    : '0.0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Months Overdue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {blocks.length > 0 && (
        <Tabs
          value={selectedBlockId ?? ''}
          onChange={(_, v) => {
            setSelectedBlockId(v === '' ? null : v)
            setSelectedFloorId('')
            setPage(1)
          }}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 2,
            '& .MuiTab-root:hover': { color: 'primary.main' },
          }}
        >
          <Tab label="All blocks" value="" />
          {blocks.map((block) => (
            <Tab key={block.id} label={block.name} value={block.id} />
          ))}
        </Tabs>
      )}

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {selectedBlockId && floorsForBlock.length > 0 && (
          <TextField
            select
            label="Floor"
            value={selectedFloorId}
            onChange={(e) => {
              setSelectedFloorId(e.target.value)
              setPage(1)
            }}
            sx={{ minWidth: 160 }}
            size="small"
          >
            <MenuItem value="">All floors</MenuItem>
            {floorsForBlock
              .slice()
              .sort((a, b) => (a.floor_number ?? 0) - (b.floor_number ?? 0))
              .map((floor) => (
                <MenuItem key={floor.id} value={floor.id}>
                  {floor.floor_number === 0 ? 'Ground' : floor.floor_number === 1 ? '1st' : floor.floor_number === 2 ? '2nd' : floor.floor_number === 3 ? '3rd' : `${floor.floor_number}th`} floor
                </MenuItem>
              ))}
          </TextField>
        )}
        <TextField
          fullWidth
          sx={{ flex: '1 1 200px' }}
          placeholder="Search defaulters..."
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
          label="Status Filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
          <MenuItem value="escalated">Escalated</MenuItem>
        </TextField>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportCsv}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : 'Export CSV'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleExportPdf}
          disabled={exportingPdf}
        >
          {exportingPdf ? 'Exporting...' : 'Download PDF'}
        </Button>
        <Tooltip title="Update defaulters list from unpaid maintenance records">
          <span>
            <Button
              variant="contained"
              startIcon={<SyncIcon />}
              onClick={handleSyncFromMaintenance}
              disabled={syncing}
            >
              {syncing ? 'Syncing...' : 'Sync from maintenance'}
            </Button>
          </span>
        </Tooltip>
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

      {/* Status Update Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={{
            status: selectedDefaulter?.status || 'active',
            remarks: selectedDefaulter?.remarks || '',
          }}
          onSubmit={handleStatusUpdate}
          enableReinitialize
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <DialogTitle>Update Defaulter Status</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Unit: {selectedDefaulter?.unit_number || '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Amount Due: {formatCurrency(selectedDefaulter?.amount_due)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="escalated">Escalated</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      label="Remarks"
                      name="remarks"
                      value={values.remarks}
                      onChange={handleChange}
                      placeholder="Optional notes"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Update
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default Defaulters
