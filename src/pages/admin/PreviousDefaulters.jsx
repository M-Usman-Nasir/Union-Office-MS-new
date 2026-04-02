import { useMemo, useState } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  Tabs,
  Tab,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { defaulterApi } from '@/api/defaulterApi'
import { propertyApi } from '@/api/propertyApi'
import DataTable from '@/components/common/DataTable'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { jsPDF } from 'jspdf'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const PERIOD_MODES = {
  FULL_YEAR: 'full_year',
  MONTH: 'month',
  QUARTER: 'quarter',
  CUSTOM: 'custom',
}

function buildPeriodQueryParams(periodMode, singleMonth, quarter, customMonths) {
  if (periodMode === PERIOD_MODES.FULL_YEAR) return {}
  if (periodMode === PERIOD_MODES.MONTH) return { months: String(singleMonth) }
  if (periodMode === PERIOD_MODES.QUARTER) return { quarter: String(quarter) }
  const sorted = [...new Set(customMonths)]
    .filter((m) => m >= 1 && m <= 12)
    .sort((a, b) => a - b)
  return { months: (sorted.length ? sorted : [1]).join(',') }
}

const PreviousDefaulters = () => {
  const { user } = useAuth()
  const societyId = user?.society_apartment_id
  const currentYear = new Date().getFullYear()
  // Current calendar year plus prior 10 years (e.g. 2026 … 2016 when year is 2026)
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - i)

  const [year, setYear] = useState(yearOptions[0] ?? currentYear)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [selectedFloorId, setSelectedFloorId] = useState('')
  const [exporting, setExporting] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [periodMode, setPeriodMode] = useState(PERIOD_MODES.FULL_YEAR)
  const [singleMonth, setSingleMonth] = useState(1)
  const [quarter, setQuarter] = useState(1)
  const [customMonths, setCustomMonths] = useState([1])

  const periodQuery = useMemo(
    () => buildPeriodQueryParams(periodMode, singleMonth, quarter, customMonths),
    [periodMode, singleMonth, quarter, customMonths]
  )

  const params = { page, limit, search, year, society_id: societyId, ...periodQuery }
  if (selectedBlockId != null && selectedBlockId !== '') params.block_id = selectedBlockId
  if (selectedFloorId != null && selectedFloorId !== '') params.floor_id = selectedFloorId

  const swrKey = societyId
    ? [
        '/defaulters/previous-years',
        page,
        limit,
        search,
        year,
        societyId,
        selectedBlockId,
        selectedFloorId,
        periodMode,
        singleMonth,
        quarter,
        [...customMonths].slice().sort((a, b) => a - b).join(','),
      ]
    : null

  const { data, isLoading, error } = useSWR(swrKey, () =>
    defaulterApi.getPreviousYear(params).then((res) => res.data).catch((err) => {
      console.error('Previous defaulters API error:', err)
      toast.error(err.response?.data?.message || 'Failed to load previous defaulters')
      throw err
    })
  )

  const { data: blocksData } = useSWR(
    societyId ? ['/blocks', societyId] : null,
    () => propertyApi.getBlocks({ society_id: societyId }).then((res) => res.data)
  )
  const { data: floorsData } = useSWR(
    selectedBlockId ? ['/floors-block', selectedBlockId] : null,
    () => propertyApi.getFloors({ block_id: selectedBlockId }).then((res) => res.data)
  )
  const blocks = blocksData?.data || []
  const floorsForBlock = floorsData?.data || []

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(Number(amount) || 0)

  const formatFloorLabel = (floorNumber) => {
    if (floorNumber == null) return '-'
    const fn = Number(floorNumber)
    if (fn === 0) return 'Ground'
    if (fn === 1) return '1st'
    if (fn === 2) return '2nd'
    if (fn === 3) return '3rd'
    return `${fn}th`
  }

  const columns = [
    { id: 'unit_number', label: 'Unit No.', render: (row) => row.unit_number || '-' },
    { id: 'resident_name', label: 'Resident', render: (row) => row.resident_name || '-' },
    { id: 'resident_contact', label: 'Phone', render: (row) => row.resident_contact || '-' },
    { id: 'block_name', label: 'Block', render: (row) => row.block_name || '-' },
    { id: 'floor_number', label: 'Floor', render: (row) => formatFloorLabel(row.floor_number) },
    { id: 'total_amount_due', label: 'Total Amount Due', render: (row) => formatCurrency(row.total_amount_due) },
  ]

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      const exportParams = { year, society_id: societyId, search, ...periodQuery }
      if (selectedBlockId != null && selectedBlockId !== '') exportParams.block_id = selectedBlockId
      if (selectedFloorId != null && selectedFloorId !== '') exportParams.floor_id = selectedFloorId
      const res = await defaulterApi.exportPreviousYearCsv(exportParams)
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `previous-defaulters-${year}-${societyId || 'all'}-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Previous defaulters exported successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  const handleExportPdf = async () => {
    setExportingPdf(true)
    try {
      const exportParams = { page: 1, limit: 10000, year, society_id: societyId, search, ...periodQuery }
      if (selectedBlockId != null && selectedBlockId !== '') exportParams.block_id = selectedBlockId
      if (selectedFloorId != null && selectedFloorId !== '') exportParams.floor_id = selectedFloorId
      const res = await defaulterApi.getPreviousYear(exportParams)
      const list = res?.data?.data || []
      const periodLabel = res?.data?.period_label || String(year)
      if (!list.length) {
        toast.error('No data to export')
        return
      }

      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const colCount = 6
      const colWidth = (pageWidth - 20) / colCount
      const rowHeight = 8
      const startX = 10
      let y = 15

      doc.setFontSize(14)
      doc.text(`Previous defaulters — ${periodLabel}`, startX, y)
      y += 8
      doc.setFontSize(9)
      doc.text(`Generated on ${dayjs().format('DD MMM YYYY HH:mm')}`, startX, y)
      y += 10

      const headers = ['Unit', 'Resident', 'Phone', 'Block', 'Floor', 'Total Due']
      doc.setFont(undefined, 'bold')
      headers.forEach((h, i) => {
        doc.text(h.substring(0, 16), startX + i * colWidth + 2, y)
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
          doc.setFont(undefined, 'bold')
          headers.forEach((h, i) => {
            doc.text(h.substring(0, 16), startX + i * colWidth + 2, y)
          })
          y += rowHeight
          doc.line(startX, y - 4, pageWidth - 10, y - 4)
          doc.setFont(undefined, 'normal')
        }

        const cells = [
          (row.unit_number != null ? String(row.unit_number) : '-').substring(0, 12),
          (row.resident_name || '-').substring(0, 18),
          (row.resident_contact || '-').substring(0, 14),
          (row.block_name || '-').substring(0, 12),
          formatFloorLabel(row.floor_number).substring(0, 10),
          formatCurrency(row.total_amount_due).replace(/\s/g, '').substring(0, 16),
        ]

        cells.forEach((cell, i) => {
          doc.text(cell, startX + i * colWidth + 2, y)
        })
        y += rowHeight
      })

      const safeSlug = String(periodLabel).replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'report'
      doc.save(`previous-defaulters-${safeSlug}-${dayjs().format('YYYY-MM-DD')}.pdf`)
      toast.success('PDF downloaded')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to generate PDF')
    } finally {
      setExportingPdf(false)
    }
  }

  const handlePeriodModeChange = (next) => {
    setPeriodMode(next)
    setPage(1)
    if (next === PERIOD_MODES.CUSTOM && customMonths.length === 0) {
      setCustomMonths([1])
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Previous Year Defaulters
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Unit-wise pending maintenance for the selected calendar year (including the current year). Default
          scope is the full year; narrow by month, quarter, or custom months.
        </Typography>
        {data?.period_label && (
          <Typography variant="body2" color="primary.main" sx={{ mt: 0.5 }}>
            Current scope: {data.period_label}
          </Typography>
        )}
      </Box>

      {!societyId && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="warning">
            Select or associate a society to load previous defaulters (super admin may need a society context).
          </Alert>
        </Box>
      )}

      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">
            {error.response?.data?.message || 'Failed to load data. Please try again.'}
          </Alert>
        </Box>
      )}

      {blocks.length > 0 && (
        <Tabs
          value={selectedBlockId ?? ''}
          onChange={(_, v) => {
            setSelectedBlockId(v === '' ? null : v)
            setSelectedFloorId('')
            setPage(1)
          }}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab label="All blocks" value="" />
          {blocks.map((block) => (
            <Tab key={block.id} label={block.name} value={block.id} />
          ))}
        </Tabs>
      )}

      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          select
          label="Year"
          size="small"
          value={year}
          onChange={(e) => {
            setYear(Number(e.target.value))
            setPage(1)
          }}
          sx={{ minWidth: 140 }}
        >
          {yearOptions.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </TextField>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="prev-def-period-mode">Period scope</InputLabel>
          <Select
            labelId="prev-def-period-mode"
            label="Period scope"
            value={periodMode}
            onChange={(e) => handlePeriodModeChange(e.target.value)}
          >
            <MenuItem value={PERIOD_MODES.FULL_YEAR}>Full year (default)</MenuItem>
            <MenuItem value={PERIOD_MODES.MONTH}>Single month</MenuItem>
            <MenuItem value={PERIOD_MODES.QUARTER}>Quarter (calendar)</MenuItem>
            <MenuItem value={PERIOD_MODES.CUSTOM}>Custom months</MenuItem>
          </Select>
        </FormControl>

        {periodMode === PERIOD_MODES.MONTH && (
          <TextField
            select
            label="Month"
            size="small"
            value={singleMonth}
            onChange={(e) => {
              setSingleMonth(Number(e.target.value))
              setPage(1)
            }}
            sx={{ minWidth: 140 }}
          >
            {MONTH_SHORT.map((name, idx) => (
              <MenuItem key={idx + 1} value={idx + 1}>
                {name}
              </MenuItem>
            ))}
          </TextField>
        )}

        {periodMode === PERIOD_MODES.QUARTER && (
          <TextField
            select
            label="Quarter"
            size="small"
            value={quarter}
            onChange={(e) => {
              setQuarter(Number(e.target.value))
              setPage(1)
            }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value={1}>Q1 (Jan–Mar)</MenuItem>
            <MenuItem value={2}>Q2 (Apr–Jun)</MenuItem>
            <MenuItem value={3}>Q3 (Jul–Sep)</MenuItem>
            <MenuItem value={4}>Q4 (Oct–Dec)</MenuItem>
          </TextField>
        )}

        {periodMode === PERIOD_MODES.CUSTOM && (
          <TextField
            select
            label="Months"
            size="small"
            sx={{ minWidth: 240 }}
            SelectProps={{
              multiple: true,
              renderValue: (selected) =>
                [...selected]
                  .sort((a, b) => a - b)
                  .map((m) => MONTH_SHORT[m - 1])
                  .join(', '),
            }}
            value={customMonths}
            onChange={(e) => {
              const v = e.target.value
              const next = typeof v === 'string' ? v.split(',').map(Number) : v
              setCustomMonths(next.length ? next : [1])
              setPage(1)
            }}
          >
            {MONTH_SHORT.map((name, idx) => (
              <MenuItem key={idx + 1} value={idx + 1}>
                {name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {selectedBlockId && floorsForBlock.length > 0 && (
          <TextField
            select
            label="Floor"
            size="small"
            value={selectedFloorId}
            onChange={(e) => {
              setSelectedFloorId(e.target.value)
              setPage(1)
            }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All floors</MenuItem>
            {floorsForBlock
              .slice()
              .sort((a, b) => (a.floor_number ?? 0) - (b.floor_number ?? 0))
              .map((floor) => (
                <MenuItem key={floor.id} value={floor.id}>
                  {formatFloorLabel(floor.floor_number)} floor
                </MenuItem>
              ))}
          </TextField>
        )}

        <TextField
          fullWidth
          size="small"
          placeholder="Search by unit, resident, or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          sx={{ flex: 1, minWidth: 220 }}
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
          startIcon={<FileDownloadIcon />}
          onClick={handleExportCsv}
          disabled={exporting || !societyId}
        >
          {exporting ? 'Exporting...' : 'Export CSV'}
        </Button>

        <Button
          variant="outlined"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleExportPdf}
          disabled={exportingPdf || !societyId}
        >
          {exportingPdf ? 'Exporting...' : 'Download PDF'}
        </Button>
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
    </Container>
  )
}

export default PreviousDefaulters
