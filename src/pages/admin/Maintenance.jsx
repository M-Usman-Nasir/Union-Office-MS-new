import { useState, useEffect } from 'react'
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
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Menu,
  Checkbox,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { maintenanceApi } from '@/api/maintenanceApi'
import { propertyApi } from '@/api/propertyApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const validationSchema = Yup.object({
  unit_id: Yup.number().required('Unit is required'),
  month: Yup.number().min(1).max(12).required('Month is required'),
  year: Yup.number().required('Year is required'),
  base_amount: Yup.number().min(0).required('Base amount is required'),
  total_amount: Yup.number().min(0).required('Total amount is required'),
  due_date: Yup.date().nullable(),
})

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const Maintenance = () => {
  const { user } = useAuth()
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false)
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState(null)
  const [selectedMaintenance, setSelectedMaintenance] = useState(null)
  const [societyId] = useState(user?.society_apartment_id)
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [selectedFloorId, setSelectedFloorId] = useState('')
  const [formBlockId, setFormBlockId] = useState('')
  const [formFloorId, setFormFloorId] = useState('')
  const [columnVisibility, setColumnVisibility] = useState({})
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null)
  const [confirmGenerate, setConfirmGenerate] = useState(null) // { action: 'block' | 'floor', blockName?: string }
  const [selectedLedgerRow, setSelectedLedgerRow] = useState(null)
  const [recordToDelete, setRecordToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const { data: ledgerData, isLoading, mutate } = useSWR(
    societyId ? ['/maintenance/yearly-ledger', societyId, year] : null,
    () => maintenanceApi.getYearlyLedger({ society_id: societyId, year }).then(res => res.data)
  )

  const { data: unitMaintenanceData, mutate: mutateUnitMaintenance } = useSWR(
    selectedLedgerRow && societyId
      ? ['/maintenance/unit', selectedLedgerRow.unit_id, year]
      : null,
    () =>
      maintenanceApi
        .getAll({ unit_id: selectedLedgerRow.unit_id, year, society_id: societyId, limit: 12 })
        .then(res => res.data)
  )

  const { data: unitForEditData } = useSWR(
    openDialog && editingMaintenance?.unit_id
      ? ['/unit', editingMaintenance.unit_id]
      : null,
    () => propertyApi.getUnitById(editingMaintenance.unit_id).then(res => res.data)
  )
  const unitForEdit = unitForEditData?.data ?? unitForEditData

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

  const { data: dialogFloorsData } = useSWR(
    formBlockId ? ['/floors-dialog-maint', formBlockId] : null,
    () => propertyApi.getFloors({ block_id: formBlockId }).then(res => res.data)
  )
  const { data: dialogUnitsData } = useSWR(
    formBlockId && societyId ? ['/units-dialog-maint', societyId, formBlockId, formFloorId] : null,
    () =>
      propertyApi
        .getUnits({
          society_id: societyId,
          block_id: formBlockId,
          ...(formFloorId ? { floor_id: formFloorId } : {}),
        })
        .then(res => res.data)
  )
  const dialogFloors = dialogFloorsData?.data || []
  const dialogUnits = dialogUnitsData?.data || []

  const handleOpenDialog = (maintenance = null) => {
    setEditingMaintenance(maintenance)
    setFormBlockId('')
    setFormFloorId('')
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingMaintenance(null)
    setFormBlockId('')
    setFormFloorId('')
  }

  useEffect(() => {
    if (openDialog && unitForEdit) {
      setFormBlockId(unitForEdit.block_id ?? '')
      setFormFloorId(unitForEdit.floor_id ?? '')
    }
  }, [openDialog, unitForEdit])

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false)
    setSelectedMaintenance(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        ...values,
        due_date: values.due_date || null,
      }
      delete payload.block_id
      delete payload.floor_id
      if (editingMaintenance) {
        await maintenanceApi.update(editingMaintenance.id, payload)
        toast.success('Maintenance record updated successfully')
      } else {
        await maintenanceApi.create({ ...payload, society_apartment_id: societyId })
        toast.success('Maintenance record created successfully')
      }
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = async (values, { setSubmitting }) => {
    try {
      await maintenanceApi.recordPayment(selectedMaintenance.id, values)
      toast.success('Payment recorded successfully')
      mutate()
      if (selectedLedgerRow) mutateUnitMaintenance()
      handleClosePaymentDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenPaymentForRecord = (record) => {
    setSelectedMaintenance(record)
    setOpenPaymentDialog(true)
  }

  const handleCloseUnitDetailModal = () => {
    setSelectedLedgerRow(null)
    setRecordToDelete(null)
  }

  const handleOpenEditFromModal = (record) => {
    setEditingMaintenance(record)
    handleCloseUnitDetailModal()
    setOpenDialog(true)
  }

  const handleConfirmDeleteRecord = async () => {
    if (!recordToDelete) return
    setDeleting(true)
    try {
      await maintenanceApi.remove(recordToDelete.id)
      toast.success('Maintenance record removed')
      mutate()
      mutateUnitMaintenance()
      setRecordToDelete(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove record')
    } finally {
      setDeleting(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount)
  }

  const formatFloorLabel = (floorNumber) => {
    if (floorNumber == null) return '—'
    const fn = Number(floorNumber)
    if (fn === 0) return 'Ground'
    if (fn === 1) return '1st'
    if (fn === 2) return '2nd'
    if (fn === 3) return '3rd'
    return `${fn}th`
  }

  const columns = [
    { id: 'flat_no', label: 'Unit No.', render: (row) => row.flat_no || 'N/A' },
    { id: 'resident_name', label: 'Resident Name', render: (row) => row.resident_name || '—' },
    {
      id: 'floor_number',
      label: 'Floor',
      render: (row) => formatFloorLabel(row.floor_number),
    },
    ...MONTH_LABELS.map((label, i) => {
      const key = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][i]
      return {
        id: key,
        label,
        align: 'right',
        render: (row) => formatCurrency(Number(row[key]) || 0),
      }
    }),
    {
      id: 'total_payment',
      label: 'Total Payment',
      align: 'right',
      render: (row) => formatCurrency(Number(row.total_payment) || 0),
    },
    {
      id: 'paid_payment',
      label: 'Paid Payment',
      align: 'right',
      render: (row) => formatCurrency(Number(row.paid_payment) || 0),
    },
    {
      id: 'due',
      label: 'Due',
      align: 'right',
      render: (row) => formatCurrency(Number(row.due) || 0),
    },
    {
      id: 'view',
      label: 'View',
      align: 'center',
      render: () => 'View details',
      onClick: (row) => setSelectedLedgerRow(row),
    },
  ]

  const visibleColumns = columns.filter((c) => columnVisibility[c.id] !== false)
  const isColumnVisible = (id) => columnVisibility[id] !== false
  const toggleColumnVisibility = (id) => {
    setColumnVisibility((prev) => ({ ...prev, [id]: prev[id] === false }))
  }

  const rawRows = ledgerData?.data || []
  const blockAndFloorFiltered =
    selectedBlockId != null && selectedBlockId !== ''
      ? selectedFloorId !== ''
        ? rawRows.filter(
            (row) => String(row.block_id) === String(selectedBlockId) && String(row.floor_id) === String(selectedFloorId)
          )
        : rawRows.filter((row) => String(row.block_id) === String(selectedBlockId))
      : rawRows
  const filteredData = search.trim()
    ? blockAndFloorFiltered.filter(
        (row) =>
          (row.flat_no || '').toLowerCase().includes(search.toLowerCase()) ||
          (row.resident_name || '').toLowerCase().includes(search.toLowerCase())
      )
    : blockAndFloorFiltered

  const perYearTotalMaintenance = blockAndFloorFiltered.reduce(
    (sum, row) => sum + (Number(row.total_payment) || 0),
    0
  )

  const currentMonth = new Date().getMonth() + 1

  const initialValues = editingMaintenance
    ? {
        block_id: unitForEdit?.block_id ?? '',
        floor_id: unitForEdit?.floor_id ?? '',
        unit_id: editingMaintenance.unit_id || '',
        month: editingMaintenance.month || currentMonth,
        year: editingMaintenance.year || currentYear,
        base_amount: editingMaintenance.base_amount ?? 0,
        total_amount: editingMaintenance.total_amount ?? 0,
        due_date: editingMaintenance.due_date ? editingMaintenance.due_date.slice(0, 10) : '',
      }
    : {
        block_id: '',
        floor_id: '',
        unit_id: '',
        month: currentMonth,
        year: currentYear,
        base_amount: 0,
        total_amount: 0,
        due_date: '',
      }

  const handleGenerateMonthlyDues = async () => {
    setGenerating(true)
    try {
      await maintenanceApi.generateMonthlyDues({ month: currentMonth, year: currentYear })
      toast.success('Monthly dues generated successfully')
      mutate()
      setOpenGenerateDialog(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate monthly dues')
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateForBlock = () => {
    if (!selectedBlockId) return
    const blockName = blocks.find((b) => String(b.id) === String(selectedBlockId))?.name || 'this block'
    setConfirmGenerate({ action: 'block', blockName })
  }

  const handleGenerateForFloor = () => {
    if (!selectedFloorId) return
    setConfirmGenerate({ action: 'floor' })
  }

  const handleConfirmGenerateSubmit = async () => {
    if (!confirmGenerate) return
    const { action } = confirmGenerate
    setGenerating(true)
    setConfirmGenerate(null)
    try {
      if (action === 'block') {
        const res = await maintenanceApi.generateForScope({
          scope: 'block',
          block_id: selectedBlockId,
          month: currentMonth,
          year: currentYear,
        })
        const data = res.data?.data || res.data
        toast.success(data ? `${data.successful} record(s) created` : 'Dues generated for block')
      } else if (action === 'floor') {
        const res = await maintenanceApi.generateForScope({
          scope: 'floor',
          floor_id: selectedFloorId,
          block_id: selectedBlockId || undefined,
          month: currentMonth,
          year: currentYear,
        })
        const data = res.data?.data || res.data
        toast.success(data ? `${data.successful} record(s) created` : 'Dues generated for floor')
      }
      mutate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate dues')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Per Year Total Maintenance Amount = {formatCurrency(perYearTotalMaintenance)}
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Maintenance Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<CalendarTodayIcon />}
            onClick={() => setOpenGenerateDialog(true)}
            color="primary"
            disabled={generating}
          >
            Generate Monthly Dues
          </Button>
          {selectedBlockId && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleGenerateForBlock}
              disabled={generating}
            >
              {generating ? 'Generating…' : 'Generate for this block'}
            </Button>
          )}
          {selectedBlockId && selectedFloorId && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleGenerateForFloor}
              disabled={generating}
            >
              {generating ? 'Generating…' : 'Generate for this floor'}
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Maintenance
          </Button>
        </Box>
      </Box>

      {blocks.length > 0 && (
        <Tabs
          value={selectedBlockId ?? ''}
          onChange={(_, v) => {
            setSelectedBlockId(v === '' ? null : v)
            setSelectedFloorId('')
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
        <TextField
          select
          label="Year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          size="small"
          sx={{ minWidth: 120 }}
        >
          {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </TextField>
        {selectedBlockId && floorsForBlock.length > 0 && (
          <TextField
            select
            label="Floor"
            value={selectedFloorId}
            onChange={(e) => setSelectedFloorId(e.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
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
          placeholder="Search by flat no or resident name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <IconButton
          onClick={(e) => setColumnMenuAnchor(e.currentTarget)}
          color="inherit"
          size="small"
          title="Toggle columns"
          sx={{ border: 1, borderColor: 'divider' }}
        >
          <ViewColumnIcon />
        </IconButton>
        <Menu
          anchorEl={columnMenuAnchor}
          open={Boolean(columnMenuAnchor)}
          onClose={() => setColumnMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { maxHeight: 400, minWidth: 220 } }}
        >
          {columns.map((col) => (
            <ListItemButton
              key={col.id}
              dense
              onClick={() => toggleColumnVisibility(col.id)}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox
                  edge="start"
                  checked={isColumnVisible(col.id)}
                  tabIndex={-1}
                  disableRipple
                  size="small"
                />
              </ListItemIcon>
              <ListItemText primary={col.label} />
            </ListItemButton>
          ))}
        </Menu>
      </Box>

      <DataTable
        columns={visibleColumns.length > 0 ? visibleColumns : columns}
        data={filteredData}
        loading={isLoading}
        pagination={undefined}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form>
              <DialogTitle>
                {editingMaintenance ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Block"
                      name="block_id"
                      value={values.block_id}
                      onChange={(e) => {
                        const v = e.target.value
                        handleChange(e)
                        setFieldValue('floor_id', '')
                        setFieldValue('unit_id', '')
                        setFormBlockId(v)
                        setFormFloorId('')
                      }}
                      onBlur={handleBlur}
                      size="small"
                    >
                      <MenuItem value="">Select block</MenuItem>
                      {blocks.map((block) => (
                        <MenuItem key={block.id} value={block.id}>
                          {block.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Floor"
                      name="floor_id"
                      value={values.floor_id}
                      onChange={(e) => {
                        const v = e.target.value
                        handleChange(e)
                        setFieldValue('unit_id', '')
                        setFormFloorId(v)
                      }}
                      onBlur={handleBlur}
                      disabled={!values.block_id}
                      size="small"
                    >
                      <MenuItem value="">Select floor</MenuItem>
                      {dialogFloors
                        .slice()
                        .sort((a, b) => (a.floor_number ?? 0) - (b.floor_number ?? 0))
                        .map((floor) => (
                          <MenuItem key={floor.id} value={floor.id}>
                            {floor.floor_number === 0 ? 'Ground' : floor.floor_number === 1 ? '1st' : floor.floor_number === 2 ? '2nd' : floor.floor_number === 3 ? '3rd' : `${floor.floor_number}th`} floor
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Unit"
                      name="unit_id"
                      value={values.unit_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.unit_id && !!errors.unit_id}
                      helperText={touched.unit_id && errors.unit_id}
                      disabled={!values.block_id}
                      size="small"
                    >
                      <MenuItem value="">Select unit</MenuItem>
                      {dialogUnits.map((unit) => (
                        <MenuItem key={unit.id} value={unit.id}>
                          Unit {unit.unit_number}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      select
                      label="Month"
                      name="month"
                      value={values.month}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.month && !!errors.month}
                      helperText={touched.month && errors.month}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                        <MenuItem key={m} value={m}>
                          {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Year"
                      name="year"
                      type="number"
                      inputProps={{ min: 2000, max: new Date().getFullYear() }}
                      value={values.year}
                      onChange={(e) => {
                        const raw = e.target.value
                        if (raw === '') {
                          handleChange(e)
                          return
                        }
                        const year = parseInt(raw, 10)
                        const clamped = Math.min(
                          new Date().getFullYear(),
                          Math.max(2000, isNaN(year) ? 2000 : year)
                        )
                        handleChange({ target: { name: e.target.name, value: clamped } })
                      }}
                      onBlur={handleBlur}
                      error={touched.year && !!errors.year}
                      helperText={touched.year && errors.year}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Base Amount"
                      name="base_amount"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={values.base_amount}
                      onChange={(e) => {
                        const raw = e.target.value
                        if (raw === '') {
                          handleChange(e)
                          return
                        }
                        const num = Math.max(0, parseFloat(raw) || 0)
                        handleChange({ target: { name: e.target.name, value: num } })
                      }}
                      onBlur={handleBlur}
                      error={touched.base_amount && !!errors.base_amount}
                      helperText={touched.base_amount && errors.base_amount}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Total Amount"
                      name="total_amount"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={values.total_amount}
                      onChange={(e) => {
                        const raw = e.target.value
                        if (raw === '') {
                          handleChange(e)
                          return
                        }
                        const num = Math.max(0, parseFloat(raw) || 0)
                        handleChange({ target: { name: e.target.name, value: num } })
                      }}
                      onBlur={handleBlur}
                      error={touched.total_amount && !!errors.total_amount}
                      helperText={touched.total_amount && errors.total_amount}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Due Date"
                      name="due_date"
                      type="date"
                      value={values.due_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.due_date && !!errors.due_date}
                      helperText={touched.due_date && errors.due_date}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ max: '9999-12-31' }}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {editingMaintenance ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={handleClosePaymentDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={{ amount_paid: selectedMaintenance?.total_amount || 0 }}
          onSubmit={handlePayment}
        >
          {({ values, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Total Amount: {formatCurrency(selectedMaintenance?.total_amount || 0)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount Paid"
                      name="amount_paid"
                      type="number"
                      inputProps={{ min: 0, max: selectedMaintenance?.total_amount }}
                      value={values.amount_paid}
                      onChange={(e) => {
                        const raw = e.target.value
                        if (raw === '') {
                          handleChange(e)
                          return
                        }
                        const maxVal = selectedMaintenance?.total_amount ?? Infinity
                        const num = Math.min(maxVal, Math.max(0, parseFloat(raw) || 0))
                        handleChange({ target: { name: e.target.name, value: num } })
                      }}
                      onBlur={handleBlur}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePaymentDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Record Payment
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Generate Monthly Dues Dialog */}
      <Dialog open={openGenerateDialog} onClose={() => setOpenGenerateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Monthly Dues</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This will generate maintenance dues for all units in your apartment for the current month ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}).
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Only units that have a resident assigned and no existing maintenance record for this month will be processed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGenerateDialog(false)} disabled={generating}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerateMonthlyDues}
            disabled={generating}
            startIcon={generating ? <CircularProgress size={20} /> : null}
          >
            {generating ? 'Generating...' : 'Generate Dues'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unit detail modal: view maintenance and record payment */}
      <Dialog
        open={Boolean(selectedLedgerRow)}
        onClose={handleCloseUnitDetailModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Unit {selectedLedgerRow?.flat_no ?? '—'} – {selectedLedgerRow?.resident_name || 'No resident'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Maintenance for year {year}
          </Typography>
          {!unitMaintenanceData?.data?.length ? (
            <Typography variant="body2" color="text.secondary">
              No maintenance records for this unit in {year}.
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Paid</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Due</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(unitMaintenanceData?.data || [])
                    .slice()
                    .sort((a, b) => (a.month ?? 0) - (b.month ?? 0))
                    .map((record) => {
                      const due = (Number(record.total_amount) || 0) - (Number(record.amount_paid) || 0)
                      const monthName = record.month
                        ? new Date(2000, record.month - 1).toLocaleString('default', { month: 'short' })
                        : '—'
                      return (
                        <TableRow key={record.id}>
                          <TableCell>{monthName}</TableCell>
                          <TableCell align="right">{formatCurrency(Number(record.total_amount) || 0)}</TableCell>
                          <TableCell align="right">{formatCurrency(Number(record.amount_paid) || 0)}</TableCell>
                          <TableCell align="right">{formatCurrency(due)}</TableCell>
                          <TableCell>{record.status || 'pending'}</TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            {due > 0 && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleOpenPaymentForRecord(record)}
                                sx={{ mr: 0.5 }}
                              >
                                Record payment
                              </Button>
                            )}
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleOpenEditFromModal(record)}
                              sx={{ mr: 0.5 }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => setRecordToDelete(record)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUnitDetailModal}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm delete maintenance record */}
      <Dialog
        open={Boolean(recordToDelete)}
        onClose={() => setRecordToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Remove maintenance record?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {recordToDelete && (
              <>
                Remove the maintenance record for{' '}
                {new Date(2000, (recordToDelete.month || 1) - 1).toLocaleString('default', { month: 'long' })} {recordToDelete.year}
                ? This cannot be undone.
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecordToDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteRecord}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? 'Removing…' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm generate for block/floor */}
      <Dialog
        open={Boolean(confirmGenerate)}
        onClose={() => setConfirmGenerate(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {confirmGenerate?.action === 'block' &&
              `Generate monthly dues for all units in ${confirmGenerate.blockName || 'this block'} (current month)?`}
            {confirmGenerate?.action === 'floor' &&
              'Generate monthly dues for all units on this floor (current month)?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmGenerate(null)} disabled={generating}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmGenerateSubmit}
            disabled={generating}
            startIcon={generating ? <CircularProgress size={20} /> : null}
          >
            {generating ? 'Generating…' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Maintenance
