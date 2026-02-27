import { useState, useEffect, useMemo } from 'react'
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
  Popover,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useAuth } from '@/contexts/AuthContext'
import useSWR, { useSWRConfig } from 'swr'
import { maintenanceApi } from '@/api/maintenanceApi'
import { propertyApi } from '@/api/propertyApi'
import { settingsApi } from '@/api/settingsApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const validationSchema = Yup.object({
  unit_id: Yup.mixed()
    .required('Select a unit or All units')
    .test('unit-or-all', 'Select a unit or All units', (v) => v === 'all' || (typeof v === 'number' && !Number.isNaN(v))),
  month: Yup.number().min(1).max(12).required('Month is required'),
  year: Yup.number().required('Year is required'),
  amount: Yup.number().min(0).required('Amount is required'),
})

const recordPaymentOnlySchema = Yup.object({
  unit_id: Yup.number().required('Unit is required'),
  month: Yup.number().min(1).max(12).required('Month is required'),
  year: Yup.number().required('Year is required'),
})

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Syncs form unit/month/year into recordPaymentLookup when on Record payment tab so the record auto-loads
// eslint-disable-next-line react/prop-types
function RecordPaymentLookupSync({ dialogMode, unitId, month, year, onSync }) {
  useEffect(() => {
    if (dialogMode !== 'record_payment' || !unitId || !month || !year) return
    onSync((prev) => {
      const next = { unit_id: unitId, month, year }
      if (prev.unit_id === next.unit_id && prev.month === next.month && prev.year === next.year)
        return prev
      return next
    })
  }, [dialogMode, unitId, month, year, onSync])
  return null
}

const Maintenance = () => {
  const { user } = useAuth()
  const { mutate: globalMutate } = useSWRConfig()
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false)
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState(null)
  const [selectedMaintenance, setSelectedMaintenance] = useState(null)
  const societyId = user?.society_apartment_id != null ? Number(user.society_apartment_id) : null
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [selectedFloorId, setSelectedFloorId] = useState('')
  const [formBlockId, setFormBlockId] = useState('')
  const [formFloorId, setFormFloorId] = useState('')
  const [columnVisibility, setColumnVisibility] = useState({})
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null)
  const [optionsMenuAnchor, setOptionsMenuAnchor] = useState(null)
  const [confirmGenerate, setConfirmGenerate] = useState(null) // { action: 'block' | 'floor', blockName?: string }
  const [generateScopeMonth, setGenerateScopeMonth] = useState(() => new Date().getMonth() + 1)
  const [generateScopeYear, setGenerateScopeYear] = useState(() => new Date().getFullYear())
  const [selectedLedgerRow, setSelectedLedgerRow] = useState(null)
  const [monthCellEdit, setMonthCellEdit] = useState(null) // { ledgerRow, month } → opens Add/Edit dialog with prefill
  const [addPrefill, setAddPrefill] = useState(null) // { unit_id, block_id, floor_id, month, year } when adding from month cell
  const [cellContext, setCellContext] = useState(null) // when set: dialog opened from cell click → lock block/floor/unit/month/year
  const [recordToDelete, setRecordToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [paymentReceivedAmount, setPaymentReceivedAmount] = useState('')
  const [recordingPaymentInDialog, setRecordingPaymentInDialog] = useState(false)
  const [markingFullyPaid, setMarkingFullyPaid] = useState(false)
  const [paymentSectionExpanded, setPaymentSectionExpanded] = useState(false)
  const [dialogMode, setDialogMode] = useState('create') // 'create' | 'edit' | 'record_payment' (edit only when cellContext set)
  const [recordPaymentLookup, setRecordPaymentLookup] = useState({ unit_id: null, month: null, year: null })
  const [markFullyPaidAnchor, setMarkFullyPaidAnchor] = useState(null) // { anchorEl, row, month, dueAmount }
  const [markFullyPaidLoading, setMarkFullyPaidLoading] = useState(false)
  const [applyingBaseYear, setApplyingBaseYear] = useState(false)
  const [creatingNextYear, setCreatingNextYear] = useState(false)
  const [recordingChoice, setRecordingChoice] = useState(null) // null | 'add_maintenance' | 'upload_receipt'
  const [receiptFile, setReceiptFile] = useState(null)
  const [uploadReceiptLoading, setUploadReceiptLoading] = useState(false)

  const { data: maintenanceConfigData } = useSWR(
    societyId ? ['/settings/maintenance-config', societyId] : null,
    () => settingsApi.getMaintenanceConfig(societyId).then(res => res.data?.data ?? res.data).catch(() => [])
  )
  const maintenanceConfigList = Array.isArray(maintenanceConfigData) ? maintenanceConfigData : []
  const societyLevelConfig = maintenanceConfigList.find((c) => c.block_id == null && c.unit_id == null)
  const baseAmount = Number(societyLevelConfig?.base_amount) || 0

  const unitIdForFetch = selectedLedgerRow?.unit_id ?? monthCellEdit?.ledgerRow?.unit_id
  const { data: unitMaintenanceData, error: unitMaintenanceError, mutate: mutateUnitMaintenance } = useSWR(
    societyId && unitIdForFetch && (selectedLedgerRow || monthCellEdit)
      ? ['/maintenance/unit', unitIdForFetch, year]
      : null,
    (key) => {
      if (!key || key[1] == null) return Promise.resolve({ data: [], success: true })
      return maintenanceApi
        .getAll({ unit_id: key[1], year, society_id: societyId, limit: 12 })
        .then(res => res.data)
    }
  )

  const { data: ledgerData, isLoading, mutate } = useSWR(
    societyId ? ['/maintenance/yearly-ledger', societyId, year] : null,
    () => maintenanceApi.getYearlyLedger({ society_id: societyId, year }).then(res => res.data)
  )

  const recordPaymentLookupKey = useMemo(
    () =>
      openDialog &&
      dialogMode === 'record_payment' &&
      recordPaymentLookup.unit_id &&
      recordPaymentLookup.month &&
      recordPaymentLookup.year
        ? ['/maintenance/record-payment-lookup', recordPaymentLookup.unit_id, recordPaymentLookup.month, recordPaymentLookup.year]
        : null,
    [openDialog, dialogMode, recordPaymentLookup.unit_id, recordPaymentLookup.month, recordPaymentLookup.year]
  )
  const { data: recordPaymentRecord, isLoading: recordPaymentLoading } = useSWR(
    societyId && recordPaymentLookupKey
      ? recordPaymentLookupKey
      : null,
    async (key) => {
      if (!key || key[1] == null || key[2] == null || key[3] == null) return null
      const [, unitId, month, year] = key
      const res = await maintenanceApi.getAll({
        unit_id: unitId,
        year: Number(year),
        society_id: societyId,
        limit: 12,
      })
      const list = res.data?.data ?? res.data ?? []
      const record = Array.isArray(list) ? list.find((r) => Number(r.month) === Number(month)) : null
      return record || null
    }
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

  const { data: paymentRequestsData, mutate: mutatePaymentRequests } = useSWR(
    societyId ? ['/maintenance/payment-requests', societyId] : null,
    () => maintenanceApi.getPaymentRequests({ status: 'pending', society_id: societyId }).then(res => res.data)
  )
  const pendingPaymentRequests = paymentRequestsData?.data || []
  const [rejectRequestId, setRejectRequestId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectLoading, setRejectLoading] = useState(false)
  const [approveLoadingId, setApproveLoadingId] = useState(null)

  const handleApprovePaymentRequest = async (requestId) => {
    setApproveLoadingId(requestId)
    try {
      const res = await maintenanceApi.approvePaymentRequest(requestId)
      const financeCreated = res.data?.data?.finance_income_created === true
      toast.success(financeCreated ? 'Payment approved. Income added to Finance.' : 'Payment approved and recorded.')
      if (financeCreated) globalMutate((key) => Array.isArray(key) && key[0] === '/finance')
      mutatePaymentRequests()
      mutate()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve')
    } finally {
      setApproveLoadingId(null)
    }
  }

  const handleRejectPaymentRequest = async () => {
    if (!rejectRequestId) return
    setRejectLoading(true)
    try {
      await maintenanceApi.rejectPaymentRequest(rejectRequestId, { rejection_reason: rejectReason || undefined })
      toast.success('Payment proof rejected.')
      setRejectRequestId(null)
      setRejectReason('')
      mutatePaymentRequests()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject')
    } finally {
      setRejectLoading(false)
    }
  }

  const handleOpenDialog = (maintenance = null) => {
    setEditingMaintenance(maintenance)
    setFormBlockId('')
    setFormFloorId('')
    setRecordingChoice('add_maintenance')
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingMaintenance(null)
    setAddPrefill(null)
    setCellContext(null)
    setPaymentReceivedAmount('')
    setPaymentSectionExpanded(false)
    setFormBlockId('')
    setFormFloorId('')
    setDialogMode('create')
    setRecordPaymentLookup({ unit_id: null, month: null, year: null })
    setRecordingChoice(null)
    setReceiptFile(null)
  }

  const handleUploadReceipt = async () => {
    if (!receiptFile || !cellContext || !societyId) {
      toast.error('Select a file and ensure unit and period are set (open from a month cell).')
      return
    }
    const { unit_id, month, year } = cellContext
    setUploadReceiptLoading(true)
    try {
      const res = await maintenanceApi.getAll({
        unit_id,
        month,
        year,
        society_id: societyId,
        limit: 1,
      })
      const list = res.data?.data ?? res.data ?? []
      let record = Array.isArray(list) ? list.find((r) => Number(r.month) === Number(month) && Number(r.year) === Number(year)) : null
      if (!record) {
        const createRes = await maintenanceApi.create({
          unit_id,
          society_apartment_id: societyId,
          month,
          year,
          base_amount: baseAmount,
          total_amount: baseAmount,
        })
        record = createRes.data?.data ?? createRes.data
      }
      if (!record?.id) {
        toast.error('Could not find or create maintenance record')
        return
      }
      const formData = new FormData()
      formData.append('receipt', receiptFile)
      await maintenanceApi.uploadReceipt(record.id, formData)
      toast.success('Receipt uploaded successfully')
      mutate()
      setReceiptFile(null)
      handleCloseDialog()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload receipt')
    } finally {
      setUploadReceiptLoading(false)
    }
  }

  useEffect(() => {
    if (openDialog && unitForEdit) {
      setFormBlockId(unitForEdit.block_id ?? '')
      setFormFloorId(unitForEdit.floor_id ?? '')
    }
  }, [openDialog, unitForEdit])

  // Clear cell-loading state on fetch error or timeout so user isn't stuck on "Loading maintenance data…"
  useEffect(() => {
    if (!monthCellEdit) return
    if (unitMaintenanceError) {
      toast.error(unitMaintenanceError?.message || 'Failed to load maintenance data')
      setMonthCellEdit(null)
      return
    }
    const timeout = setTimeout(() => {
      setMonthCellEdit((prev) => {
        if (!prev) return null
        toast.error('Loading took too long. Please try again.')
        return null
      })
    }, 12000)
    return () => clearTimeout(timeout)
  }, [monthCellEdit, unitMaintenanceError])

  // When unit maintenance data arrives: if dialog is open with cellContext, update editingMaintenance / dialogMode and clear monthCellEdit
  useEffect(() => {
    if (!unitMaintenanceData || !cellContext) return
    const rowUnitId = cellContext.unit_id
    if (rowUnitId == null || String(unitIdForFetch) !== String(rowUnitId)) return
    const list = Array.isArray(unitMaintenanceData)
      ? unitMaintenanceData
      : (unitMaintenanceData?.data || [])
    const monthRecord = list.find((r) => Number(r.month) === Number(cellContext.month))
    if (monthRecord) {
      setEditingMaintenance(monthRecord)
      setAddPrefill(null)
      setDialogMode('edit')
    } else {
      setEditingMaintenance(null)
      // addPrefill already set when we opened from cell
    }
    setMonthCellEdit(null)
  }, [unitMaintenanceData, cellContext, unitIdForFetch])

  // When dialog shows an existing record, pre-fill "Amount received" with current due so admin sees remaining to pay
  useEffect(() => {
    if (!openDialog || !editingMaintenance?.id) return
    const total = Number(editingMaintenance.total_amount) || 0
    const paid = Number(editingMaintenance.amount_paid) || 0
    const due = Math.max(0, total - paid)
    setPaymentReceivedAmount(due > 0 ? String(due) : '')
  }, [openDialog, editingMaintenance?.id, editingMaintenance?.total_amount, editingMaintenance?.amount_paid])

  // In record_payment mode: when auto-loaded record arrives, fetch full record by ID so total_amount/amount_paid are correct
  useEffect(() => {
    if (cellContext || dialogMode !== 'record_payment' || !recordPaymentLookupKey) return
    if (recordPaymentLoading) {
      setEditingMaintenance(null)
      return
    }
    if (!recordPaymentRecord) {
      setEditingMaintenance(null)
      return
    }
    let cancelled = false
    maintenanceApi
      .getById(recordPaymentRecord.id)
      .then((res) => {
        if (cancelled) return
        const full = res.data?.data ?? res.data
        setEditingMaintenance(full || recordPaymentRecord)
        setPaymentSectionExpanded(true)
      })
      .catch(() => {
        if (!cancelled) setEditingMaintenance(recordPaymentRecord)
      })
    return () => { cancelled = true }
  }, [cellContext, dialogMode, recordPaymentLookupKey, recordPaymentLoading, recordPaymentRecord])

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false)
    setSelectedMaintenance(null)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const amount = Number(values.amount) || 0
      const payload = {
        ...values,
        base_amount: amount,
        total_amount: amount,
        due_date: null,
      }
      delete payload.block_id
      delete payload.floor_id
      delete payload.amount

      const existingId = editingMaintenance?.id
      if (existingId) {
        await maintenanceApi.update(existingId, payload)
        toast.success('Maintenance record updated successfully')
        mutate()
        mutateUnitMaintenance()
        handleCloseDialog()
        return
      }
      if (cellContext && dialogMode === 'edit') {
        toast.error('Record not loaded yet. Please wait or close and try again.')
        setSubmitting(false)
        return
      }
      if (payload.unit_id === 'all') {
        const res = await maintenanceApi.createForAllUnits({
          society_apartment_id: societyId,
          month: payload.month,
          year: payload.year,
          base_amount: amount,
          total_amount: amount,
          due_date: null,
        })
        const msg = res.data?.message ?? (res.data?.data ? `${res.data.data.created} created, ${res.data.data.skipped} skipped` : 'Maintenance created for all units')
        toast.success(msg)
        mutate()
        handleCloseDialog()
        return
      }
      const res = await maintenanceApi.create({ ...payload, society_apartment_id: societyId })
      toast.success('Maintenance record created successfully')
      mutate()
      mutateUnitMaintenance()
      const created = res.data?.data ?? res.data
      if (created?.id) {
        setEditingMaintenance(created)
        setAddPrefill(null)
      } else {
        handleCloseDialog()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = async (values, { setSubmitting }) => {
    try {
      const res = await maintenanceApi.recordPayment(selectedMaintenance.id, values)
      const financeCreated = res.data?.finance_income_created === true
      toast.success(financeCreated ? 'Payment recorded. Income added to Finance.' : 'Payment recorded successfully')
      if (financeCreated) globalMutate((key) => Array.isArray(key) && key[0] === '/finance')
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

  const handleRecordPaymentInDialog = async (amountOverride) => {
    if (!editingMaintenance?.id) return
    const total = Number(editingMaintenance.total_amount ?? editingMaintenance.base_amount) || 0
    const paid = Number(editingMaintenance.amount_paid) || 0
    const due = Math.max(0, total - paid)
    const amount = typeof amountOverride === 'number' ? amountOverride : parseFloat(String(paymentReceivedAmount).replace(/,/g, ''))
    if (isNaN(amount) || amount <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    const maxAllowed = due > 0 ? due : total
    if (amount > maxAllowed) {
      toast.error(`Amount cannot exceed ${due > 0 ? 'due amount' : 'total'} (${formatCurrency(maxAllowed)})`)
      return
    }
    setRecordingPaymentInDialog(true)
    try {
      const res = await maintenanceApi.recordPayment(editingMaintenance.id, { amount_paid: amount })
      const financeCreated = res.data?.finance_income_created === true
      toast.success(financeCreated ? 'Payment recorded. Income added to Finance.' : 'Payment recorded successfully')
      if (financeCreated) globalMutate((key) => Array.isArray(key) && key[0] === '/finance')
      await mutate()
      if (editingMaintenance.unit_id) {
        await globalMutate(['/maintenance/unit', editingMaintenance.unit_id, year])
      }
      mutateUnitMaintenance()
      const getRes = await maintenanceApi.getById(editingMaintenance.id)
      const updated = getRes.data?.data ?? getRes.data
      if (updated) {
        setEditingMaintenance(updated)
        const newDue = Math.max(0, (Number(updated.total_amount) || 0) - (Number(updated.amount_paid) || 0))
        setPaymentReceivedAmount(newDue > 0 ? String(newDue) : '')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed')
    } finally {
      setRecordingPaymentInDialog(false)
    }
  }

  const handleMarkFullyPaid = async () => {
    if (!editingMaintenance?.id) return
    const total = Number(editingMaintenance.total_amount) || 0
    const paid = Number(editingMaintenance.amount_paid) || 0
    if (paid >= total) {
      toast.success('Record is already fully paid')
      return
    }
    setMarkingFullyPaid(true)
    try {
      await maintenanceApi.update(editingMaintenance.id, {
        base_amount: editingMaintenance.base_amount ?? total,
        total_amount: total,
        status: 'paid',
        amount_paid: total,
        due_date: null,
      })
      toast.success('Marked as fully paid')
      mutate()
      mutateUnitMaintenance()
      const res = await maintenanceApi.getById(editingMaintenance.id)
      const updated = res.data?.data ?? res.data
      if (updated) {
        setEditingMaintenance(updated)
        setPaymentReceivedAmount('')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as fully paid')
    } finally {
      setMarkingFullyPaid(false)
    }
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

  const handleMarkFullyPaidFromCell = async () => {
    if (!markFullyPaidAnchor || !societyId) return
    const { row, month, dueAmount } = markFullyPaidAnchor
    setMarkFullyPaidLoading(true)
    try {
      const res = await maintenanceApi.getAll({
        society_id: societyId,
        unit_id: row.unit_id,
        month,
        year,
        limit: 1,
        page: 1,
      })
      const list = res.data?.data ?? []
      const record = Array.isArray(list) ? list[0] : null
      if (!record?.id) {
        toast.error('Maintenance record not found for this unit and month')
        return
      }
      const payRes = await maintenanceApi.recordPayment(record.id, { amount_paid: dueAmount })
      const financeCreated = payRes.data?.finance_income_created === true
      toast.success(financeCreated ? 'Marked as fully paid. Income added to Finance.' : 'Marked as fully paid')
      if (financeCreated) globalMutate((key) => Array.isArray(key) && key[0] === '/finance')
      mutate()
      mutateUnitMaintenance()
      setMarkFullyPaidAnchor(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as fully paid')
    } finally {
      setMarkFullyPaidLoading(false)
    }
  }

  const handleOpenEditFromMarkFullyPaidPopover = () => {
    if (!markFullyPaidAnchor) return
    const anchor = markFullyPaidAnchor
    setMarkFullyPaidAnchor(null)
    setMonthCellEdit({ ledgerRow: anchor.row, month: anchor.month })
    setAddPrefill({
      unit_id: anchor.row.unit_id,
      block_id: anchor.row.block_id ?? '',
      floor_id: anchor.row.floor_id ?? '',
      month: anchor.month,
      year,
      amount: anchor.dueAmount,
    })
    setFormBlockId(anchor.row.block_id ?? '')
    setFormFloorId(anchor.row.floor_id ?? '')
    setOpenDialog(true)
  }

  const handleApplyBaseForYear = async () => {
    setApplyingBaseYear(true)
    try {
      const res = await maintenanceApi.applyBaseForYear({ year })
      const msg = res.data?.message ?? res.data?.data ? `${res.data.data.created} record(s) created` : 'Base amount applied'
      toast.success(msg)
      mutate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply base amount for year')
    } finally {
      setApplyingBaseYear(false)
    }
  }

  const handleCreateNextYear = async () => {
    const nextYear = currentYear + 1
    setCreatingNextYear(true)
    try {
      const res = await maintenanceApi.applyBaseForYear({ year: nextYear })
      const msg = res.data?.message ?? (res.data?.data ? `${res.data.data.created} record(s) created for ${nextYear}` : `Next year (${nextYear}) created`)
      toast.success(msg)
      mutate()
      setYear(nextYear)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create next year')
    } finally {
      setCreatingNextYear(false)
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
    {
      id: 'unit_number',
      label: 'Unit No.',
      minWidth: 88,
      render: (row) => (
        <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
          {row.unit_number || row.flat_no || '-'}
        </Box>
      ),
    },
    {
      id: 'resident_name',
      label: 'Resident Name',
      minWidth: 140,
      render: (row) => (
        <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
          {row.resident_name || '—'}
        </Box>
      ),
    },
    {
      id: 'floor_number',
      label: 'Floor',
      minWidth: 72,
      render: (row) => formatFloorLabel(row.floor_number),
    },
    ...MONTH_LABELS.map((label, i) => {
      const key = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][i]
      const monthNum = i + 1
      return {
        id: key,
        label,
        align: 'right',
        render: (row) => {
          const amount = Number(row[key]) || 0
          const isPaid = amount === 0
          const isUnpaid = amount > 0
          return (
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                borderRadius: 1,
                px: 0.75,
                py: 0.25,
                ...(isPaid
                  ? {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(76, 175, 80, 0.28)'
                          : 'rgba(46, 125, 50, 0.18)',
                      fontWeight: 600,
                      color: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgb(129, 199, 132)' : theme.palette.success.dark,
                    }
                  : isUnpaid
                    ? {
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(244, 67, 54, 0.28)'
                            : 'rgba(211, 47, 47, 0.2)',
                        fontWeight: 600,
                        color: (theme) =>
                          theme.palette.mode === 'dark' ? 'rgb(255, 138, 128)' : theme.palette.error.dark,
                      }
                    : {}),
              }}
            >
              {formatCurrency(amount)}
            </Box>
          )
        },
        onClick: (row) => {
          const cellAmount = Number(row[key]) || 0
          const payload = {
            ledgerRow: row,
            month: monthNum,
            cellAmount: cellAmount || baseAmount,
          }
          setMonthCellEdit(payload)
          setCellContext({
            block_id: row?.block_id ?? '',
            floor_id: row?.floor_id ?? '',
            unit_id: row?.unit_id,
            unit_number: row?.unit_number,
            month: monthNum,
            year,
          })
          setAddPrefill({
            unit_id: row?.unit_id,
            block_id: row?.block_id ?? '',
            floor_id: row?.floor_id ?? '',
            month: monthNum,
            year,
            amount: cellAmount || baseAmount,
          })
          setEditingMaintenance(null)
          setDialogMode('create')
          setFormBlockId(row?.block_id ?? '')
          setFormFloorId(row?.floor_id ?? '')
          setRecordingChoice(null)
          setOpenDialog(true)
        },
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
          (row.unit_number || row.flat_no || '').toLowerCase().includes(search.toLowerCase()) ||
          (row.resident_name || '').toLowerCase().includes(search.toLowerCase())
      )
    : blockAndFloorFiltered

  const perYearTotalMaintenance = blockAndFloorFiltered.reduce(
    (sum, row) => sum + (Number(row.total_payment) || 0),
    0
  )

  const currentMonth = new Date().getMonth() + 1

  const initialValues = cellContext
    ? {
        block_id: cellContext.block_id ?? '',
        floor_id: cellContext.floor_id ?? '',
        unit_id: cellContext.unit_id ?? '',
        month: cellContext.month ?? currentMonth,
        year: cellContext.year ?? currentYear,
        amount: editingMaintenance
          ? (editingMaintenance.total_amount ?? editingMaintenance.base_amount ?? 0)
          : (addPrefill?.amount ?? baseAmount),
      }
    : editingMaintenance
      ? {
          block_id: unitForEdit?.block_id ?? '',
          floor_id: unitForEdit?.floor_id ?? '',
          unit_id: editingMaintenance.unit_id || '',
          month: editingMaintenance.month || currentMonth,
          year: editingMaintenance.year || currentYear,
          amount: editingMaintenance.total_amount ?? editingMaintenance.base_amount ?? 0,
        }
      : addPrefill
        ? {
            block_id: addPrefill.block_id ?? '',
            floor_id: addPrefill.floor_id ?? '',
            unit_id: addPrefill.unit_id ?? '',
            month: addPrefill.month ?? currentMonth,
            year: addPrefill.year ?? currentYear,
            amount: addPrefill.amount ?? baseAmount,
          }
        : {
            block_id: '',
            floor_id: '',
            unit_id: '',
            month: currentMonth,
            year: currentYear,
            amount: baseAmount,
          }

  const formValidationSchema = dialogMode === 'record_payment' ? recordPaymentOnlySchema : validationSchema

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
    setGenerateScopeMonth(currentMonth)
    setGenerateScopeYear(currentYear)
    const blockName = blocks.find((b) => String(b.id) === String(selectedBlockId))?.name || 'this block'
    setConfirmGenerate({ action: 'block', blockName })
  }

  const handleGenerateForFloor = () => {
    if (!selectedFloorId) return
    setGenerateScopeMonth(currentMonth)
    setGenerateScopeYear(currentYear)
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
          month: generateScopeMonth,
          year: generateScopeYear,
        })
        const data = res.data?.data || res.data
        toast.success(data ? `${data.successful} record(s) created` : 'Dues generated for block')
      } else if (action === 'floor') {
        const res = await maintenanceApi.generateForScope({
          scope: 'floor',
          floor_id: selectedFloorId,
          block_id: selectedBlockId || undefined,
          month: generateScopeMonth,
          year: generateScopeYear,
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
      {/* Mark fully paid popover (month cell click when due > 0) */}
      <Popover
        open={Boolean(markFullyPaidAnchor)}
        anchorEl={markFullyPaidAnchor?.anchorEl}
        onClose={() => setMarkFullyPaidAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ p: 2, minWidth: 220 }}>
          <Typography variant="subtitle2" gutterBottom>
            Unit {markFullyPaidAnchor?.row?.unit_number ?? markFullyPaidAnchor?.row?.flat_no ?? '—'} · {markFullyPaidAnchor && MONTH_LABELS[(markFullyPaidAnchor.month || 1) - 1]} {year}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Due: {markFullyPaidAnchor && formatCurrency(markFullyPaidAnchor.dueAmount)}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleMarkFullyPaidFromCell}
              disabled={markFullyPaidLoading}
              fullWidth
            >
              {markFullyPaidLoading ? 'Updating…' : 'Mark fully paid (clear due)'}
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleOpenEditFromMarkFullyPaidPopover}
              disabled={markFullyPaidLoading}
              fullWidth
            >
              Edit record
            </Button>
            <Button size="small" onClick={() => setMarkFullyPaidAnchor(null)} fullWidth>
              Cancel
            </Button>
          </Box>
        </Box>
      </Popover>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Per Year Total Maintenance Amount = {formatCurrency(perYearTotalMaintenance)}
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Maintenance Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="outlined"
            endIcon={<ArrowDropDownIcon />}
            onClick={(e) => setOptionsMenuAnchor(e.currentTarget)}
            disabled={generating || applyingBaseYear || creatingNextYear}
          >
            Options
          </Button>
          <Menu
            anchorEl={optionsMenuAnchor}
            open={Boolean(optionsMenuAnchor)}
            onClose={() => setOptionsMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <MenuItem
              onClick={() => {
                setOpenGenerateDialog(true)
                setOptionsMenuAnchor(null)
              }}
              disabled={generating}
            >
              <ListItemIcon><CalendarTodayIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Generate Monthly Dues" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleApplyBaseForYear()
                setOptionsMenuAnchor(null)
              }}
              disabled={generating || applyingBaseYear || baseAmount <= 0}
            >
              <ListItemText primary={applyingBaseYear ? 'Applying…' : `Apply base to all units (${year})`} />
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCreateNextYear()
                setOptionsMenuAnchor(null)
              }}
              disabled={generating || creatingNextYear || baseAmount <= 0}
            >
              <ListItemText primary={creatingNextYear ? 'Creating…' : `Create new year (${currentYear + 1})`} />
            </MenuItem>
            {selectedBlockId && (
              <MenuItem
                onClick={() => {
                  handleGenerateForBlock()
                  setOptionsMenuAnchor(null)
                }}
                disabled={generating}
              >
                <ListItemText primary={generating ? 'Generating…' : 'Generate for this block'} />
              </MenuItem>
            )}
            {selectedBlockId && selectedFloorId && (
              <MenuItem
                onClick={() => {
                  handleGenerateForFloor()
                  setOptionsMenuAnchor(null)
                }}
                disabled={generating}
              >
                <ListItemText primary={generating ? 'Generating…' : 'Generate for this floor'} />
              </MenuItem>
            )}
          </Menu>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Maintenance
          </Button>
        </Box>
      </Box>

      {pendingPaymentRequests.length > 0 && (
        <Accordion defaultExpanded sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight={600}>
              Pending payment verifications ({pendingPaymentRequests.length})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Residents have submitted payment proofs. Approve to mark as paid or reject.
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell><strong>Unit</strong></TableCell>
                    <TableCell><strong>Month / Year</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Submitted by</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Proof</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingPaymentRequests.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.unit_number || `Unit ${row.unit_id}`}</TableCell>
                      <TableCell>{MONTH_LABELS[(row.month || 1) - 1]} {row.year}</TableCell>
                      <TableCell>{formatCurrency(row.total_amount)}</TableCell>
                      <TableCell>{row.submitted_by_name || row.submitted_by_email || '—'}</TableCell>
                      <TableCell>{row.created_at ? dayjs(row.created_at).format('DD/MM/YYYY HH:mm') : '—'}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          href={`${(import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '') || window.location.origin}${row.proof_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View proof
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          color="primary"
                          variant="contained"
                          disabled={approveLoadingId === row.id}
                          onClick={() => handleApprovePaymentRequest(row.id)}
                          startIcon={approveLoadingId === row.id ? <CircularProgress size={16} /> : null}
                          sx={{ mr: 1 }}
                        >
                          {approveLoadingId === row.id ? 'Approving…' : 'Approve'}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          disabled={rejectLoading}
                          onClick={() => { setRejectRequestId(row.id); setRejectReason('') }}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}

      <Dialog open={Boolean(rejectRequestId)} onClose={() => !rejectLoading && setRejectRequestId(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject payment proof</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Optionally add a reason to inform the resident.
          </Typography>
          <TextField
            label="Rejection reason (optional)"
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            fullWidth
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectRequestId(null)} disabled={rejectLoading}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleRejectPaymentRequest} disabled={rejectLoading}>
            {rejectLoading ? 'Rejecting…' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

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
          {[currentYear + 1, currentYear, currentYear - 1, currentYear - 2].map((y) => (
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

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Month columns show <strong>remaining due</strong> per month. Click a cell to add/edit record or record payment.
        Past months with amount due are <strong>highlighted</strong> for quick overview.
      </Typography>

      <DataTable
        columns={visibleColumns.length > 0 ? visibleColumns : columns}
        data={filteredData}
        loading={isLoading}
        pagination={undefined}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        getRowSx={(row) => {
          const floorIndex = Number(row.floor_number) ?? 0
          const lightShades = [
            'rgba(25, 118, 210, 0.12)',
            'rgba(46, 125, 50, 0.12)',
            'rgba(245, 124, 0, 0.12)',
            'rgba(123, 31, 162, 0.12)',
            'rgba(0, 151, 167, 0.12)',
            'rgba(229, 57, 53, 0.12)',
            'rgba(156, 39, 176, 0.12)',
            'rgba(121, 85, 72, 0.12)',
            'rgba(2, 119, 189, 0.12)',
            'rgba(27, 94, 32, 0.12)',
          ]
          const darkShades = [
            'rgba(66, 165, 245, 0.16)',
            'rgba(102, 187, 106, 0.16)',
            'rgba(255, 167, 38, 0.16)',
            'rgba(186, 104, 200, 0.16)',
            'rgba(38, 166, 154, 0.16)',
            'rgba(239, 83, 80, 0.16)',
            'rgba(206, 147, 216, 0.16)',
            'rgba(161, 136, 127, 0.16)',
            'rgba(100, 181, 246, 0.16)',
            'rgba(129, 199, 132, 0.16)',
          ]
          const shadeIndex = Math.abs(floorIndex) % lightShades.length
          return {
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? darkShades[shadeIndex] : lightShades[shadeIndex],
          }
        }}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={formValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form>
              {recordingChoice === null ? (
                <>
                  <DialogTitle>Record maintenance</DialogTitle>
                  <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      How would you like to record?
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', py: 1 }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => setRecordingChoice('add_maintenance')}
                        fullWidth
                      >
                        Add maintenance
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => setRecordingChoice('upload_receipt')}
                        fullWidth
                      >
                        Upload receipt
                      </Button>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                  </DialogActions>
                </>
              ) : recordingChoice === 'upload_receipt' ? (
                <>
                  <DialogTitle>Upload receipt</DialogTitle>
                  <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Upload a receipt to record payment for this unit and period.
                    </Typography>
                    {cellContext ? (
                      <>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Unit {cellContext.unit_number ?? cellContext.unit_id} · {MONTH_LABELS[(cellContext.month || 1) - 1]} {cellContext.year}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                          <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} disabled={uploadReceiptLoading}>
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
                          <Button
                            variant="contained"
                            onClick={handleUploadReceipt}
                            disabled={!receiptFile || uploadReceiptLoading}
                            startIcon={uploadReceiptLoading ? <CircularProgress size={18} /> : <UploadFileIcon />}
                          >
                            {uploadReceiptLoading ? 'Uploading...' : 'Upload receipt'}
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Open this dialog by clicking a month cell in the ledger to upload a receipt for that unit and period.
                      </Typography>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setRecordingChoice(null)} disabled={uploadReceiptLoading}>Back</Button>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                  </DialogActions>
                </>
              ) : (
                <>
              <DialogTitle>
                {cellContext
                  ? (dialogMode === 'record_payment'
                      ? 'Record payment'
                      : dialogMode === 'edit'
                        ? 'Edit Maintenance Record'
                        : 'Create New Maintenance Record')
                  : dialogMode === 'record_payment'
                    ? 'Record payment (existing record)'
                    : editingMaintenance
                      ? 'Edit Maintenance Record'
                      : 'Add New Maintenance Record'}
              </DialogTitle>
              <Box sx={{ px: 2, pb: 0 }}>
                <Button size="small" onClick={() => setRecordingChoice(null)} sx={{ mb: 0 }}>
                  Back
                </Button>
              </Box>
              <Tabs
                value={cellContext ? (dialogMode === 'edit' ? 'edit' : dialogMode) : dialogMode}
                onChange={(_, v) => {
                  setDialogMode(v)
                  if (!cellContext) {
                    setEditingMaintenance(null)
                  }
                  if (cellContext && v === 'record_payment') {
                    setPaymentSectionExpanded(true)
                  }
                  setPaymentReceivedAmount('')
                  setRecordPaymentLookup({ unit_id: null, month: null, year: null })
                }}
                sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
              >
                <Tab label="Create new record" value="create" />
                {cellContext && (
                  <Tab
                    label="Edit record"
                    value="edit"
                  />
                )}
                <Tab
                  label={cellContext ? 'Record payment' : 'Record payment (existing)'}
                  value="record_payment"
                  disabled={!cellContext && !editingMaintenance}
                />
              </Tabs>
              <DialogContent>
                <RecordPaymentLookupSync
                  dialogMode={dialogMode}
                  unitId={values.unit_id}
                  month={values.month}
                  year={values.year}
                  onSync={setRecordPaymentLookup}
                />
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
                      disabled={!!cellContext}
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
                      value={
                        dialogFloors.some((f) => String(f.id) === String(values.floor_id))
                          ? values.floor_id
                          : ''
                      }
                      onChange={(e) => {
                        const v = e.target.value
                        handleChange(e)
                        setFieldValue('unit_id', '')
                        setFormFloorId(v)
                      }}
                      onBlur={handleBlur}
                      disabled={!!cellContext || !values.block_id}
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
                      value={
                        values.unit_id === 'all'
                          ? 'all'
                          : dialogUnits.some((u) => String(u.id) === String(values.unit_id))
                            ? values.unit_id
                            : ''
                      }
                      onChange={(e) => {
                        handleChange(e)
                        if (dialogMode === 'record_payment') {
                          setRecordPaymentLookup({
                            unit_id: e.target.value === 'all' ? null : e.target.value || null,
                            month: values.month || null,
                            year: values.year || null,
                          })
                          setEditingMaintenance(null)
                        }
                      }}
                      onBlur={handleBlur}
                      error={touched.unit_id && !!errors.unit_id}
                      helperText={touched.unit_id && errors.unit_id}
                      disabled={!!cellContext || (dialogMode === 'record_payment' ? !values.block_id : false)}
                      size="small"
                    >
                      {dialogMode === 'create' && !cellContext && (
                        <MenuItem value="all">
                          <Typography component="span" fontWeight={600}>All units (create for every unit)</Typography>
                        </MenuItem>
                      )}
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
                      onChange={(e) => {
                        handleChange(e)
                        if (dialogMode === 'record_payment' && !cellContext) {
                          setRecordPaymentLookup({
                            unit_id: values.unit_id || null,
                            month: e.target.value || null,
                            year: values.year || null,
                          })
                          setEditingMaintenance(null)
                        }
                      }}
                      onBlur={handleBlur}
                      error={touched.month && !!errors.month}
                      helperText={touched.month && errors.month}
                      disabled={!!cellContext}
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
                          if (dialogMode === 'record_payment' && !cellContext) {
                            setRecordPaymentLookup({
                              unit_id: values.unit_id || null,
                              month: values.month || null,
                              year: null,
                            })
                            setEditingMaintenance(null)
                          }
                          return
                        }
                        const yearNum = parseInt(raw, 10)
                        const clamped = Math.min(
                          new Date().getFullYear(),
                          Math.max(2000, isNaN(yearNum) ? 2000 : yearNum)
                        )
                        handleChange({ target: { name: e.target.name, value: clamped } })
                        if (dialogMode === 'record_payment' && !cellContext) {
                          setRecordPaymentLookup({
                            unit_id: values.unit_id || null,
                            month: values.month || null,
                            year: clamped,
                          })
                          setEditingMaintenance(null)
                        }
                      }}
                      onBlur={handleBlur}
                      error={touched.year && !!errors.year}
                      helperText={touched.year && errors.year}
                      disabled={!!cellContext}
                    />
                  </Grid>
                  {((dialogMode === 'create') || (cellContext && dialogMode === 'edit')) && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Amount"
                          name="amount"
                          type="number"
                          inputProps={{ min: 0 }}
                          value={values.amount}
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
                          error={touched.amount && !!errors.amount}
                          helperText={touched.amount && errors.amount}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                <Divider sx={{ my: 2 }} />
                <Accordion
                  expanded={paymentSectionExpanded}
                  onChange={(_, expanded) => setPaymentSectionExpanded(expanded)}
                  sx={{ boxShadow: 'none', '&:before': { display: 'none' }, bgcolor: 'transparent' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">
                      Record payment (optional)
                    </Typography>
                    {editingMaintenance?.id && (() => {
                      const total = Number(editingMaintenance.total_amount) || 0
                      const paid = Number(editingMaintenance.amount_paid) || 0
                      const due = Math.max(0, total - paid)
                      return due > 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          — {formatCurrency(due)} due
                        </Typography>
                      ) : null
                    })()}
                  </AccordionSummary>
                  <AccordionDetails>
                    {!editingMaintenance?.id ? (
                      <>
                        {dialogMode === 'record_payment' && recordPaymentLookupKey && recordPaymentLoading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                            <CircularProgress size={20} />
                            <Typography variant="body2" color="text.secondary">
                              Loading record…
                            </Typography>
                          </Box>
                        ) : (
                          <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                              {dialogMode === 'record_payment'
                                ? (recordPaymentLookupKey && !recordPaymentLoading && recordPaymentRecord === null
                                    ? 'No maintenance record found for this unit, month, and year.'
                                    : 'Select unit, month, and year above. The record loads automatically — then you can pay full or enter any amount to record payment.')
                                : 'Create the maintenance record above, then you can record payment here. The payment section will show Total, Paid, and Due after the record is saved.'}
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4}>
                                <Typography variant="body2" color="text.secondary">Total</Typography>
                                <Typography variant="body1" color="text.secondary">—</Typography>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Typography variant="body2" color="text.secondary">Paid</Typography>
                                <Typography variant="body1" color="text.secondary">—</Typography>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Typography variant="body2" color="text.secondary">Due</Typography>
                                <Typography variant="body1" color="text.secondary">—</Typography>
                              </Grid>
                            </Grid>
                          </>
                        )}
                      </>
                    ) : (() => {
                      const total = Number(String(editingMaintenance.total_amount ?? editingMaintenance.base_amount ?? 0).replace(/,/g, '')) || 0
                      const paid = Number(String(editingMaintenance.amount_paid ?? 0).replace(/,/g, '')) || 0
                      const due = Math.max(0, total - paid)
                      const amountNum = parseFloat(String(paymentReceivedAmount).replace(/,/g, ''))
                      const isValidAmount = !isNaN(amountNum) && amountNum > 0
                      const hasRemainingDue = due > 0
                      return (
                        <>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            Amount below is the <strong>remaining due</strong>. Submit to record that payment (it is added to already paid). Change the amount for a partial payment.
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">Total</Typography>
                              <Typography variant="body1" fontWeight={600}>{formatCurrency(total)}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">Paid</Typography>
                              <Typography variant="body1" fontWeight={600}>{formatCurrency(paid)}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" color="text.secondary">Due</Typography>
                              <Typography variant="body1" fontWeight={600}>{formatCurrency(due)}</Typography>
                            </Grid>
                            {due > 0 && (
                              <Grid item xs={12}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  onClick={handleMarkFullyPaid}
                                  disabled={markingFullyPaid || recordingPaymentInDialog}
                                  startIcon={markingFullyPaid ? <CircularProgress size={16} /> : null}
                                >
                                  Mark fully paid (clear due)
                                </Button>
                              </Grid>
                            )}
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                <TextField
                                  size="small"
                                  label="Amount to record (remaining due)"
                                  type="number"
                                  inputProps={{ min: 0, max: due, step: 0.01 }}
                                  value={paymentReceivedAmount}
                                  onChange={(e) => {
                                    const v = e.target.value
                                    if (v === '' || /^\d*\.?\d*$/.test(v)) setPaymentReceivedAmount(v)
                                  }}
                                  disabled={recordingPaymentInDialog}
                                  sx={{ minWidth: 140 }}
                                />
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => {
                                    setPaymentReceivedAmount(String(due))
                                    handleRecordPaymentInDialog(due)
                                  }}
                                  disabled={recordingPaymentInDialog || !hasRemainingDue}
                                  startIcon={recordingPaymentInDialog ? <CircularProgress size={16} /> : null}
                                >
                                  Pay full & update record
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={handleRecordPaymentInDialog}
                                  disabled={recordingPaymentInDialog || !isValidAmount}
                                  startIcon={recordingPaymentInDialog ? <CircularProgress size={16} /> : null}
                                >
                                  Record payment
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </>
                      )
                    })()}
                  </AccordionDetails>
                </Accordion>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                {(dialogMode === 'create' || (cellContext && dialogMode === 'edit')) && (
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {(cellContext && dialogMode === 'edit') || (editingMaintenance && dialogMode === 'create') ? 'Update' : 'Create'}
                  </Button>
                )}
              </DialogActions>
                </>
              )}
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
          Unit {selectedLedgerRow?.unit_number ?? selectedLedgerRow?.flat_no ?? '—'} – {selectedLedgerRow?.resident_name || 'No resident'}
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
          <Typography variant="body1" sx={{ mb: 2 }}>
            {confirmGenerate?.action === 'block' &&
              `Generate monthly dues for all units in ${confirmGenerate.blockName || 'this block'}?`}
            {confirmGenerate?.action === 'floor' &&
              'Generate monthly dues for all units on this floor?'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                size="small"
                label="Month"
                value={generateScopeMonth}
                onChange={(e) => setGenerateScopeMonth(Number(e.target.value))}
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
                select
                size="small"
                label="Year"
                value={generateScopeYear}
                onChange={(e) => setGenerateScopeYear(Number(e.target.value))}
              >
                {[currentYear + 1, currentYear, currentYear - 1, currentYear - 2].map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
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
