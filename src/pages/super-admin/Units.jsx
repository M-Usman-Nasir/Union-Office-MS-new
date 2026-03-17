import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link as RouterLink } from 'react-router-dom'
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
  IconButton,
  Tooltip,
  Chip,
  Breadcrumbs,
  Link,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import useSWR from 'swr'
import { propertyApi } from '@/api/propertyApi'
import { apartmentApi } from '@/api/apartmentApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const validationSchema = Yup.object({
  society_apartment_id: Yup.number().required('Apartment is required'),
  block_id: Yup.number().required('Block is required'),
  floor_id: Yup.number().required('Floor is required'),
  unit_number: Yup.string().required('Unit number or name is required'),
})

const Units = () => {
  const [searchParams] = useSearchParams()
  const societyIdFromUrl = searchParams.get('society_id')
  const blockIdFromUrl = searchParams.get('block_id')
  const [societyFilter, setSocietyFilter] = useState('')
  const [blockFilter, setBlockFilter] = useState('')
  const [floorFilter, setFloorFilter] = useState('')
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUnit, setEditingUnit] = useState(null)
  const [openBulkDialog, setOpenBulkDialog] = useState(false)
  const [bulkCount, setBulkCount] = useState(1)
  const [bulkSubmitting, setBulkSubmitting] = useState(false)
  const [openImportDialog, setOpenImportDialog] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importResult, setImportResult] = useState(null)
  const [importSubmitting, setImportSubmitting] = useState(false)
  const [importOverrideSociety, setImportOverrideSociety] = useState('')
  const [importOverrideBlock, setImportOverrideBlock] = useState('')
  const [importOverrideFloor, setImportOverrideFloor] = useState('')
  const [unitToDelete, setUnitToDelete] = useState(null)
  const [deletingUnit, setDeletingUnit] = useState(false)
  const [selectedUnitIds, setSelectedUnitIds] = useState(() => new Set())
  const [bulkDeleteIds, setBulkDeleteIds] = useState(null)
  const [openBulkEmailDialog, setOpenBulkEmailDialog] = useState(false)
  const [bulkEmailDomain, setBulkEmailDomain] = useState('')
  const [bulkEmailLetterGroup, setBulkEmailLetterGroup] = useState('A')
  const [bulkEmailPreview, setBulkEmailPreview] = useState(null)
  const [bulkEmailPreviewLoading, setBulkEmailPreviewLoading] = useState(false)
  const [bulkEmailApplyLoading, setBulkEmailApplyLoading] = useState(false)

  useEffect(() => {
    if (societyIdFromUrl) setSocietyFilter(societyIdFromUrl)
  }, [societyIdFromUrl])

  useEffect(() => {
    if (blockIdFromUrl) setBlockFilter(blockIdFromUrl)
  }, [blockIdFromUrl])

  useEffect(() => {
    setSelectedUnitIds(new Set())
  }, [societyFilter, blockFilter, floorFilter])

  const { data: currentSocietyData } = useSWR(
    societyIdFromUrl ? ['/society', societyIdFromUrl] : null,
    () => apartmentApi.getById(societyIdFromUrl).then(res => res.data)
  )
  const currentSocietyName = currentSocietyData?.data?.name

  const { data: societiesData } = useSWR(
    '/societies',
    () => apartmentApi.getAll({ limit: 100 }).then(res => res.data)
  )

  const bulkEmailSocietyId = societyFilter ? Number(societyFilter) : NaN
  const bulkEmailSocietyName =
    (societyIdFromUrl && currentSocietyName) ||
    societiesData?.data?.find((s) => String(s.id) === String(societyFilter))?.name ||
    currentSocietyName ||
    ''

  const suggestedBulkEmailDomain = useMemo(() => {
    if (!bulkEmailSocietyName) return ''
    const slug = bulkEmailSocietyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 48)
    return slug ? `${slug}.com` : ''
  }, [bulkEmailSocietyName])

  const { data: blocksData } = useSWR(
    societyFilter ? ['/blocks', societyFilter] : null,
    () => propertyApi.getBlocks({ society_id: societyFilter }).then(res => res.data)
  )

  const { data: floorsData, mutate: mutateFloors } = useSWR(
    blockFilter ? ['/floors', blockFilter] : null,
    () => propertyApi.getFloors({ block_id: blockFilter }).then(res => res.data)
  )

  // When coming from Apartments (society_id only): auto-select first/only block; user can change
  useEffect(() => {
    if (!societyIdFromUrl || blockIdFromUrl) return
    const blocks = blocksData?.data
    if (blocks?.length > 0 && !blockFilter) {
      setBlockFilter(blocks[0].id)
    }
  }, [societyIdFromUrl, blockIdFromUrl, blocksData?.data, blockFilter])

  // When block is selected (from URL or auto): auto-select first/only floor; user can change
  useEffect(() => {
    if (!blockFilter) return
    const floors = floorsData?.data
    if (floors?.length > 0 && !floorFilter) {
      setFloorFilter(floors[0].id)
    }
  }, [blockFilter, floorsData?.data, floorFilter])

  // For dialog - fetch blocks and floors when creating new unit
  const [dialogSocietyId, setDialogSocietyId] = useState('')
  const [dialogBlockId, setDialogBlockId] = useState('')
  const { data: dialogBlocksData } = useSWR(
    dialogSocietyId ? ['/blocks-dialog', dialogSocietyId] : null,
    () => propertyApi.getBlocks({ society_id: dialogSocietyId }).then(res => res.data)
  )
  const { data: dialogFloorsData } = useSWR(
    dialogBlockId ? ['/floors-dialog', dialogBlockId] : null,
    () => propertyApi.getFloors({ block_id: dialogBlockId }).then(res => res.data)
  )

  const { data: importBlocksData } = useSWR(
    openImportDialog && importOverrideSociety ? ['/blocks-import', importOverrideSociety] : null,
    () => propertyApi.getBlocks({ society_id: importOverrideSociety }).then(res => res.data)
  )
  const { data: importFloorsData } = useSWR(
    openImportDialog && importOverrideBlock ? ['/floors-import', importOverrideBlock] : null,
    () => propertyApi.getFloors({ block_id: importOverrideBlock }).then(res => res.data)
  )

  const { data: unitsData, isLoading, mutate } = useSWR(
    ['/units', societyFilter, blockFilter, floorFilter, search],
    () => propertyApi.getUnits({ society_id: societyFilter, block_id: blockFilter, floor_id: floorFilter, search }).then(res => res.data)
  )

  // Sort units by unit_number numerically so 1, 2, 3... 10, 11 display in correct order
  const sortedUnits = useMemo(() => {
    const list = unitsData?.data || []
    return [...list].sort((a, b) => {
      const sa = String(a.unit_number ?? '')
      const sb = String(b.unit_number ?? '')
      return sa.localeCompare(sb, undefined, { numeric: true })
    })
  }, [unitsData?.data])

  const resolvedBlockId = blockFilter || blockIdFromUrl
  const currentBlockName = resolvedBlockId && blocksData?.data
    ? blocksData.data.find((b) => String(b.id) === String(resolvedBlockId))?.name
    : null
  const resolvedFloor = floorFilter && floorsData?.data
    ? floorsData.data.find((f) => String(f.id) === String(floorFilter))
    : null
  const currentFloorLabel = resolvedFloor
    ? (resolvedFloor.floor_number === 0 ? 'Ground floor' : `Floor ${resolvedFloor.floor_number}`)
    : null
  const backToApartmentsUrl = societyIdFromUrl
    ? `/super-admin/societies?society_id=${societyIdFromUrl}`
    : '/super-admin/societies'

  const handleOpenDialog = (unit = null) => {
    setEditingUnit(unit)
    if (!unit) {
      setDialogSocietyId(societyIdFromUrl || societyFilter || '')
      setDialogBlockId(blockIdFromUrl || blockFilter || '')
    } else {
      setDialogSocietyId(unit.society_apartment_id || '')
      setDialogBlockId(unit.block_id || '')
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUnit(null)
  }

  const handleOpenBulkDialog = () => {
    setBulkCount(1)
    setOpenBulkDialog(true)
  }

  const handleCloseBulkDialog = () => {
    setOpenBulkDialog(false)
    setBulkCount(1)
  }

  const handleOpenBulkEmailDialog = () => {
    setBulkEmailPreview(null)
    setBulkEmailLetterGroup('A')
    setBulkEmailDomain((d) => d.trim() || suggestedBulkEmailDomain || '')
    setOpenBulkEmailDialog(true)
  }

  const handleCloseBulkEmailDialog = () => {
    setOpenBulkEmailDialog(false)
    setBulkEmailPreview(null)
    setBulkEmailPreviewLoading(false)
    setBulkEmailApplyLoading(false)
  }

  const handleBulkEmailPreview = async () => {
    const domain = bulkEmailDomain.trim().toLowerCase().replace(/^@/, '')
    if (!domain || Number.isNaN(bulkEmailSocietyId)) {
      toast.error('Select an apartment and enter a domain (e.g. homeland.com)')
      return
    }
    setBulkEmailPreviewLoading(true)
    try {
      const res = await propertyApi.bulkSetUnitEmails({
        society_apartment_id: bulkEmailSocietyId,
        domain,
        unit_letter_group: bulkEmailLetterGroup,
        dry_run: true,
      })
      const d = res.data?.data
      const previewRows = d?.preview ?? []
      setBulkEmailPreview({
        count: previewRows.length,
        rows: previewRows.map((r) => ({ ...r, _checked: true })),
        domain: d?.domain,
        unit_letter_group: d?.unit_letter_group,
      })
      toast.success(`Preview: ${d?.count ?? 0} unit(s)`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Preview failed')
      setBulkEmailPreview(null)
    } finally {
      setBulkEmailPreviewLoading(false)
    }
  }

  const handleBulkEmailApply = async () => {
    const domain = bulkEmailDomain.trim().toLowerCase().replace(/^@/, '')
    if (!domain || Number.isNaN(bulkEmailSocietyId)) {
      toast.error('Select an apartment and enter a domain')
      return
    }
    if (!bulkEmailPreview || bulkEmailPreview.count === 0) {
      toast.error('Run preview first')
      return
    }
    const ids = (bulkEmailPreview.rows || [])
      .filter((r) => r._checked !== false)
      .map((r) => r.id)
    if (ids.length === 0) {
      toast.error('Select at least one unit to update')
      return
    }
    setBulkEmailApplyLoading(true)
    try {
      const res = await propertyApi.bulkSetUnitEmails({
        society_apartment_id: bulkEmailSocietyId,
        domain,
        unit_letter_group: bulkEmailLetterGroup,
        dry_run: false,
        unit_ids: ids,
      })
      const n = res.data?.data?.updated_count ?? 0
      toast.success(res.data?.message || `Updated ${n} unit(s)`)
      mutate()
      handleCloseBulkEmailDialog()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply emails')
    } finally {
      setBulkEmailApplyLoading(false)
    }
  }

  const handleOpenImportDialog = () => {
    setImportFile(null)
    setImportResult(null)
    setImportOverrideSociety(societyFilter || '')
    setImportOverrideBlock(blockFilter || '')
    setImportOverrideFloor(floorFilter || '')
    setOpenImportDialog(true)
  }

  const handleCloseImportDialog = () => {
    setOpenImportDialog(false)
    setImportFile(null)
    setImportResult(null)
  }

  const handleDeleteUnit = async (row) => {
    setUnitToDelete(row)
  }

  const handleConfirmDeleteUnit = async () => {
    if (!unitToDelete) return
    setDeletingUnit(true)
    try {
      await propertyApi.deleteUnit(unitToDelete.id)
      const payload = unitRowToCreatePayload(unitToDelete)
      setSelectedUnitIds((prev) => {
        const next = new Set(prev)
        next.delete(unitToDelete.id)
        return next
      })
      setUnitToDelete(null)
      mutate()
      mutateFloors()
      toast(
        (t) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>Unit deleted.</span>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                restoreUnits([payload]).then(() => toast.dismiss(t.id))
              }}
            >
              Undo
            </Button>
          </Box>
        ),
        { duration: 5000 }
      )
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete unit')
    } finally {
      setDeletingUnit(false)
    }
  }

  const handleCancelDeleteUnit = () => {
    setUnitToDelete(null)
    setBulkDeleteIds(null)
  }

  const unitRowToCreatePayload = (row) => ({
    society_apartment_id: row.society_apartment_id,
    block_id: row.block_id,
    floor_id: row.floor_id,
    unit_number: row.unit_number,
    owner_name: row.owner_name || null,
    resident_name: row.resident_name || null,
    contact_number: row.contact_number || null,
    email: row.email || null,
    k_electric_account: row.k_electric_account || null,
    gas_account: row.gas_account || null,
    water_account: row.water_account || null,
    phone_tv_account: row.phone_tv_account || null,
    car_make_model: row.car_make_model || null,
    license_plate: row.license_plate || null,
    number_of_cars: row.number_of_cars ?? 0,
    is_occupied: row.is_occupied ?? false,
    telephone_bills: Array.isArray(row.telephone_bills) ? row.telephone_bills : [],
    other_bills: Array.isArray(row.other_bills) ? row.other_bills : [],
  })

  const restoreUnits = async (payloads) => {
    try {
      for (const p of payloads) {
        await propertyApi.createUnit(p)
      }
      mutate()
      mutateFloors()
      toast.success(payloads.length === 1 ? 'Unit restored' : `${payloads.length} units restored`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to restore')
    }
  }

  const handleDeleteSelected = () => {
    if (selectedUnitIds.size === 0) return
    setBulkDeleteIds(Array.from(selectedUnitIds))
  }

  const handleConfirmBulkDelete = async () => {
    if (!bulkDeleteIds || bulkDeleteIds.length === 0) return
    const payloads = (sortedUnits || [])
      .filter((r) => bulkDeleteIds.includes(r.id))
      .map(unitRowToCreatePayload)
    setDeletingUnit(true)
    let deleted = 0
    let failed = 0
    for (const id of bulkDeleteIds) {
      try {
        await propertyApi.deleteUnit(id)
        deleted++
      } catch {
        failed++
      }
    }
    setDeletingUnit(false)
    setBulkDeleteIds(null)
    setSelectedUnitIds(new Set())
    mutate()
    mutateFloors()
    if (failed) toast.error(`${failed} unit(s) could not be deleted (in use or not found)`)
    if (deleted > 0) {
      toast(
        (t) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>{deleted} unit(s) deleted.</span>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                restoreUnits(payloads).then(() => toast.dismiss(t.id))
              }}
            >
              Undo
            </Button>
          </Box>
        ),
        { duration: 5000 }
      )
    }
  }

  const handleSelectAllUnits = (event) => {
    if (!sortedUnits?.length) return
    if (event.target.checked) {
      setSelectedUnitIds(new Set(sortedUnits.map((r) => r.id)))
    } else {
      setSelectedUnitIds(new Set())
    }
  }

  const handleToggleUnit = (id) => {
    setSelectedUnitIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleImportUnits = async () => {
    if (!importFile) {
      toast.error('Please select a file (XLSX, XML, or CSV)')
      return
    }
    setImportSubmitting(true)
    setImportResult(null)
    try {
      const formData = new FormData()
      formData.append('file', importFile)
      if (importOverrideSociety) formData.append('society_apartment_id', importOverrideSociety)
      if (importOverrideBlock) formData.append('block_id', importOverrideBlock)
      if (importOverrideFloor) formData.append('floor_id', importOverrideFloor)
      const res = await propertyApi.importUnits(formData)
      const data = res.data?.data ?? res.data
      setImportResult(data)
      toast.success(res.data?.message ?? 'Import completed')
      mutate()
      mutateFloors()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Import failed')
    } finally {
      setImportSubmitting(false)
    }
  }

  const handleBulkAddUnits = async () => {
    const count = Math.max(1, parseInt(bulkCount, 10) || 1)
    if (!floorFilter) return
    setBulkSubmitting(true)
    try {
      await propertyApi.addUnitsToFloor(floorFilter, count)
      toast.success(`${count} unit(s) added to ${currentFloorLabel || 'this floor'}. Union Admin can add resident details later.`)
      mutate()
      mutateFloors()
      handleCloseBulkDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add units')
    } finally {
      setBulkSubmitting(false)
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Prepare data with all fields
      const unitData = {
        ...values,
        society_apartment_id: values.society_apartment_id || societyFilter,
        block_id: values.block_id || blockFilter,
        k_electric_account: values.k_electric_account || null,
        gas_account: values.gas_account || null,
        water_account: values.water_account || null,
        phone_tv_account: values.phone_tv_account || null,
        car_make_model: values.car_make_model || null,
        license_plate: values.license_plate || null,
        number_of_cars: values.number_of_cars || 0,
        is_occupied: values.is_occupied !== undefined ? values.is_occupied : false,
        telephone_bills: Array.isArray(values.telephone_bills) ? values.telephone_bills : [],
        other_bills: Array.isArray(values.other_bills) ? values.other_bills : [],
      }

      if (editingUnit) {
        await propertyApi.updateUnit(editingUnit.id, unitData)
        toast.success('Unit updated successfully')
      } else {
        await propertyApi.createUnit(unitData)
        toast.success('Unit created successfully')
      }
      mutate()
      mutateFloors()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    {
      id: 'select',
      label: '',
      width: 48,
      minWidth: 48,
      header:
        sortedUnits?.length > 0 ? (
          <Checkbox
            indeterminate={selectedUnitIds.size > 0 && selectedUnitIds.size < sortedUnits.length}
            checked={sortedUnits.length > 0 && selectedUnitIds.size === sortedUnits.length}
            onChange={handleSelectAllUnits}
            size="small"
            aria-label="Select all units"
          />
        ) : null,
      render: (row) => (
        <Checkbox
          checked={selectedUnitIds.has(row.id)}
          onChange={() => handleToggleUnit(row.id)}
          size="small"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select unit ${row.unit_number || row.id}`}
        />
      ),
    },
    { id: 'unit_number', label: 'Unit', minWidth: 96, noWrapHeader: true },
    {
      id: 'block_name',
      label: 'Block',
      minWidth: 88,
      render: (row) => row.block_name || 'N/A',
    },
    {
      id: 'floor_number',
      label: 'Floor',
      minWidth: 92,
      render: (row) =>
        floorFilter && currentFloorLabel
          ? currentFloorLabel
          : (row.floor_number != null
            ? (row.floor_number === 0 ? 'Ground floor' : `Floor ${row.floor_number}`)
            : 'N/A'),
    },
    {
      id: 'owner_name',
      label: 'Owner',
      minWidth: 112,
      render: (row) => row.owner_name || '—',
    },
    {
      id: 'resident_name',
      label: 'Resident',
      minWidth: 112,
      render: (row) => row.resident_name || '—',
    },
    {
      id: 'contact_number',
      label: 'Contact',
      minWidth: 118,
      render: (row) => row.contact_number || '—',
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 220,
      cellSx: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '0.8125rem',
        wordBreak: 'break-all',
        lineHeight: 1.4,
      },
      render: (row) => row.email || '—',
    },
    {
      id: 'is_occupied',
      label: 'Status',
      minWidth: 102,
      render: (row) => (
        <Chip
          label={row.is_occupied ? 'Occupied' : 'Vacant'}
          color={row.is_occupied ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'k_electric_account',
      label: 'K-Electric',
      minWidth: 104,
      render: (row) => row.k_electric_account || '—',
    },
    {
      id: 'gas_account',
      label: 'Gas',
      minWidth: 88,
      render: (row) => row.gas_account || '—',
    },
    {
      id: 'water_account',
      label: 'Water',
      minWidth: 88,
      render: (row) => row.water_account || '—',
    },
    {
      id: 'phone_tv_account',
      label: 'Phone/TV',
      minWidth: 96,
      render: (row) => row.phone_tv_account || '—',
    },
    {
      id: 'car_info',
      label: 'Car Info',
      minWidth: 168,
      render: (row) => {
        if (row.car_make_model || row.license_plate || row.number_of_cars) {
          return `${row.car_make_model || 'N/A'} | ${row.license_plate || 'N/A'} | ${row.number_of_cars || 0} cars`
        }
        return '-'
      },
    },
    {
      id: 'bills',
      label: 'Bills',
      minWidth: 100,
      render: (row) => {
        const telBills = Array.isArray(row.telephone_bills) ? row.telephone_bills.length : 0
        const otherBills = Array.isArray(row.other_bills) ? row.other_bills.length : 0
        if (telBills > 0 || otherBills > 0) {
          return `Tel: ${telBills}, Other: ${otherBills}`
        }
        return '-'
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      minWidth: 100,
      width: 100,
      render: (row) => (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenDialog(row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteUnit(row)}
              aria-label={`Delete unit ${row.unit_number || row.id}`}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const initialValues = editingUnit
    ? {
        society_apartment_id: editingUnit.society_apartment_id || societyFilter || '',
        block_id: editingUnit.block_id || blockFilter || '',
        floor_id: editingUnit.floor_id || floorFilter || '',
        unit_number: editingUnit.unit_number || '',
        owner_name: editingUnit.owner_name || '',
        resident_name: editingUnit.resident_name || '',
        contact_number: editingUnit.contact_number || '',
        email: editingUnit.email || '',
        k_electric_account: editingUnit.k_electric_account || '',
        gas_account: editingUnit.gas_account || '',
        water_account: editingUnit.water_account || '',
        phone_tv_account: editingUnit.phone_tv_account || '',
        car_make_model: editingUnit.car_make_model || '',
        license_plate: editingUnit.license_plate || '',
        number_of_cars: editingUnit.number_of_cars || 0,
        is_occupied: editingUnit.is_occupied !== undefined ? editingUnit.is_occupied : false,
        telephone_bills: editingUnit.telephone_bills || [],
        other_bills: editingUnit.other_bills || [],
      }
    : {
        society_apartment_id: societyFilter || societyIdFromUrl || '',
        block_id: blockFilter || blockIdFromUrl || '',
        floor_id: floorFilter || '',
        unit_number: '',
        owner_name: '',
        resident_name: '',
        contact_number: '',
        email: '',
        k_electric_account: '',
        gas_account: '',
        water_account: '',
        phone_tv_account: '',
        car_make_model: '',
        license_plate: '',
        number_of_cars: 0,
        is_occupied: false,
        telephone_bills: [],
        other_bills: [],
      }

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 1, sm: 2 } }}>
      {societyIdFromUrl && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            component={RouterLink}
            to={backToApartmentsUrl}
            aria-label="Back to Apartments"
            size="small"
            sx={{ mr: 0.5 }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} to={backToApartmentsUrl} underline="hover" color="inherit">
              Apartments
            </Link>
            <Typography color="text.primary">Units</Typography>
          </Breadcrumbs>
        </Box>
      )}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Units Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {selectedUnitIds.size > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={handleDeleteSelected}
            >
              Delete selected ({selectedUnitIds.size})
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<EmailOutlinedIcon />}
            onClick={handleOpenBulkEmailDialog}
            disabled={!societyFilter || Number.isNaN(bulkEmailSocietyId)}
            title={
              !societyFilter
                ? 'Select an apartment first'
                : 'Set unit emails for all units in this apartment (e.g. e-805_b2@homeland.com)'
            }
          >
            Bulk unit emails
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={handleOpenImportDialog}
            title="Import units from XLSX, XML, or CSV file"
          >
            Import units
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenBulkDialog()}
            disabled={!floorFilter}
            title={!floorFilter ? 'Select a floor first' : 'Add multiple units to this floor at once'}
          >
            Add multiple units
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Unit
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {societyIdFromUrl && currentSocietyName ? (
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Apartment: <Typography component="span" color="primary.main">{currentSocietyName}</Typography>
          </Typography>
        ) : (
          <TextField
            select
            label="Select Apartment"
            value={societyFilter}
            onChange={(e) => {
              setSocietyFilter(e.target.value)
              setBlockFilter('')
              setFloorFilter('')
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Select Apartment</MenuItem>
            {societiesData?.data?.map((society) => (
              <MenuItem key={society.id} value={society.id}>
                {society.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        {blockIdFromUrl && currentBlockName ? (
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Block: <Typography component="span" color="primary.main">{currentBlockName}</Typography>
          </Typography>
        ) : (
          <TextField
            select
            label="Select Block"
            value={blockFilter}
            onChange={(e) => {
              setBlockFilter(e.target.value)
              setFloorFilter('')
            }}
            disabled={!societyFilter}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Select Block</MenuItem>
            {blocksData?.data?.map((block) => (
              <MenuItem key={block.id} value={block.id}>
                {block.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          select
          label="Select Floor"
          value={floorFilter}
          onChange={(e) => setFloorFilter(e.target.value)}
          disabled={!blockFilter}
          sx={{ minWidth: 200 }}
          helperText={floorFilter && resolvedFloor != null ? `${resolvedFloor.units_count ?? 0} unit(s) on this floor` : null}
        >
          <MenuItem value="">Select Floor</MenuItem>
          {floorsData?.data?.map((floor) => (
            <MenuItem key={floor.id} value={floor.id}>
              Floor {floor.floor_number === 0 ? 'Ground' : floor.floor_number}
              {floor.units_count != null ? ` (${floor.units_count} unit${floor.units_count !== 1 ? 's' : ''})` : ''}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          placeholder="Search units..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
      </Box>

      <Box sx={{ width: '100%', maxWidth: '100%', m: 0 }}>
        <DataTable
          columns={columns}
          data={sortedUnits}
          loading={isLoading}
          pagination={null}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          minTableWidth={1320}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>
                {editingUnit ? 'Edit Unit' : 'Add New Unit'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {!editingUnit && (
                    <>
                      {(societyIdFromUrl && currentSocietyName) ? (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Apartment"
                            value={currentSocietyName}
                            disabled
                            helperText="Same apartment as selected from Apartments."
                          />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            select
                            label="Apartment"
                            name="society_apartment_id"
                            value={values.society_apartment_id}
                            onChange={(e) => {
                              handleChange(e)
                              setDialogSocietyId(e.target.value)
                              if (e.target.value !== values.society_apartment_id) {
                                handleChange({ target: { name: 'block_id', value: '' } })
                                handleChange({ target: { name: 'floor_id', value: '' } })
                                setDialogBlockId('')
                              }
                            }}
                            onBlur={handleBlur}
                            error={touched.society_apartment_id && !!errors.society_apartment_id}
                            helperText={touched.society_apartment_id && errors.society_apartment_id}
                          >
                            <MenuItem value="">Select Apartment</MenuItem>
                            {societiesData?.data?.map((society) => (
                              <MenuItem key={society.id} value={society.id}>
                                {society.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      )}
                      {currentBlockName ? (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Block"
                            value={currentBlockName}
                            disabled
                            helperText="Same block as selected on this page (step-by-step)."
                          />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            select
                            label="Block"
                            name="block_id"
                            value={values.block_id}
                            onChange={(e) => {
                              handleChange(e)
                              if (e.target.value !== values.block_id) {
                                handleChange({ target: { name: 'floor_id', value: '' } })
                                setDialogBlockId(e.target.value)
                              }
                            }}
                            onBlur={handleBlur}
                            error={touched.block_id && !!errors.block_id}
                            helperText={touched.block_id && errors.block_id}
                            disabled={!values.society_apartment_id}
                          >
                            <MenuItem value="">Select Block</MenuItem>
                            {(values.society_apartment_id
                              ? dialogBlocksData?.data || []
                              : []
                            ).map((block) => (
                              <MenuItem key={block.id} value={block.id}>
                                {block.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      )}
                    </>
                  )}
                  {!editingUnit && currentFloorLabel ? (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Floor"
                        value={currentFloorLabel}
                        disabled
                        helperText="Same floor as selected on this page (step-by-step)."
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        label="Floor"
                        name="floor_id"
                        value={values.floor_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.floor_id && !!errors.floor_id}
                        helperText={touched.floor_id && errors.floor_id}
                        disabled={!!editingUnit || !values.block_id}
                      >
                        <MenuItem value="">Select Floor</MenuItem>
                        {(editingUnit
                          ? floorsData?.data || []
                          : dialogFloorsData?.data || []
                        ).map((floor) => (
                          <MenuItem key={floor.id} value={floor.id}>
                            {floor.floor_number === 0 ? 'Ground floor' : `Floor ${floor.floor_number}`}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Unit number or name"
                      name="unit_number"
                      value={values.unit_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.unit_number && !!errors.unit_number}
                      helperText={
                        (touched.unit_number && errors.unit_number) ||
                        'Resident details, utility accounts and vehicle info are managed by Union Admin.'
                      }
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {editingUnit ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Dialog open={openBulkDialog} onClose={handleCloseBulkDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Add multiple units</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {currentFloorLabel
              ? `Add unit rows to ${currentFloorLabel}. Unit numbers will be assigned automatically. Union Admin can add resident details later.`
              : 'Select a floor above first, then use this to add many units at once.'}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            type="number"
            label="Number of units"
            inputProps={{ min: 1, max: 999 }}
            value={bulkCount}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              setBulkCount(isNaN(v) || v < 1 ? 1 : Math.min(999, v))
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBulkDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleBulkAddUnits}
            disabled={!floorFilter || bulkSubmitting}
          >
            {bulkSubmitting ? 'Adding…' : 'Add units'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openBulkEmailDialog}
        onClose={bulkEmailPreviewLoading || bulkEmailApplyLoading ? undefined : handleCloseBulkEmailDialog}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>Bulk set unit emails</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose <strong>A–E</strong> to update only units whose unit number <strong>starts with that letter</strong>{' '}
            (e.g. A805 → <code>a-805_b2@domain</code>). Run once per letter. Choose <strong>Other</strong> for units
            that do <strong>not</strong> start with A–E (pattern <code>e-{'{unit}'}_b…@domain</code>). Block index
            is by block order (b1, b2…). Does not change resident login emails.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Apartment: <strong>{bulkEmailSocietyName || '—'}</strong>
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Domain"
                placeholder="homeland.com"
                value={bulkEmailDomain}
                onChange={(e) => setBulkEmailDomain(e.target.value)}
                helperText="Full domain after @ (no @ prefix)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Unit group (one run per letter)"
                value={bulkEmailLetterGroup}
                onChange={(e) => {
                  setBulkEmailLetterGroup(e.target.value)
                  setBulkEmailPreview(null)
                }}
                helperText="A–E: only units starting with that letter. Other: numeric / F–Z / etc."
              >
                {['A', 'B', 'C', 'D', 'E'].map((L) => (
                  <MenuItem key={L} value={L}>
                    Units starting with {L} (e.g. {L}101 → {L.toLowerCase()}-101_b…@…)
                  </MenuItem>
                ))}
                <MenuItem value="OTHER">Other (not A–E)</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBulkEmailPreview}
              disabled={bulkEmailPreviewLoading || !bulkEmailDomain.trim() || Number.isNaN(bulkEmailSocietyId)}
            >
              {bulkEmailPreviewLoading ? 'Loading preview…' : 'Preview'}
            </Button>
          </Box>
          {bulkEmailPreview && bulkEmailPreview.rows?.length > 0 && (() => {
            const rows = bulkEmailPreview.rows
            const selectedCount = rows.filter((r) => r._checked !== false).length
            const allChecked = rows.length > 0 && selectedCount === rows.length
            const someChecked = selectedCount > 0 && selectedCount < rows.length
            return (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle2">
                    All units in this group ({rows.length}) — {selectedCount} selected to update
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => {
                      setBulkEmailPreview((prev) => prev && {
                        ...prev,
                        rows: prev.rows.map((r) => ({ ...r, _checked: true })),
                      })
                    }}
                    >
                      Check all
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => {
                      setBulkEmailPreview((prev) => prev && {
                        ...prev,
                        rows: prev.rows.map((r) => ({ ...r, _checked: false })),
                      })
                    }}
                    >
                      Uncheck all
                    </Button>
                  </Box>
                </Box>
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{
                    maxHeight: 'min(70vh, 560px)',
                    width: '100%',
                    overflow: 'auto',
                    borderRadius: 1,
                    '& .MuiTableHead-root .MuiTableCell-root': {
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      bgcolor: 'action.hover',
                      borderBottom: '2px solid',
                      borderColor: 'divider',
                      whiteSpace: 'nowrap',
                    },
                  }}
                >
                  <Table
                    size="small"
                    stickyHeader
                    sx={{
                      minWidth: 900,
                      tableLayout: 'auto',
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          padding="checkbox"
                          sx={{
                            width: 52,
                            minWidth: 52,
                            maxWidth: 52,
                            position: 'sticky',
                            left: 0,
                            zIndex: 3,
                            bgcolor: 'action.hover',
                            boxShadow: (t) => `1px 0 0 ${t.palette.divider}`,
                          }}
                        >
                          <Checkbox
                            size="small"
                            checked={allChecked}
                            indeterminate={someChecked}
                            onChange={() => {
                              const check = !allChecked
                              setBulkEmailPreview((prev) => prev && {
                                ...prev,
                                rows: prev.rows.map((r) => ({ ...r, _checked: check })),
                              })
                            }}
                            inputProps={{ 'aria-label': 'Select all units for email update' }}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 88, width: 100 }}>Unit</TableCell>
                        <TableCell sx={{ minWidth: 280 }}>Current email</TableCell>
                        <TableCell sx={{ minWidth: 280 }}>New email</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.id} hover selected={row._checked !== false}>
                          <TableCell
                            padding="checkbox"
                            sx={{
                              position: 'sticky',
                              left: 0,
                              zIndex: 1,
                              bgcolor: row._checked !== false ? 'action.selected' : 'background.paper',
                              boxShadow: (t) => `1px 0 0 ${t.palette.divider}`,
                              '.MuiTableRow:hover &': {
                                bgcolor: row._checked !== false ? 'action.selected' : 'action.hover',
                              },
                            }}
                          >
                            <Checkbox
                              size="small"
                              checked={row._checked !== false}
                              onChange={(e) => {
                                const checked = e.target.checked
                                setBulkEmailPreview((prev) => {
                                  if (!prev?.rows) return prev
                                  return {
                                    ...prev,
                                    rows: prev.rows.map((r) =>
                                      r.id === row.id ? { ...r, _checked: checked } : r
                                    ),
                                  }
                                })
                              }}
                              inputProps={{ 'aria-label': `Update email for unit ${row.unit_number ?? row.id}` }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              verticalAlign: 'top',
                              color: 'text.primary',
                            }}
                          >
                            {row.unit_number ?? row.id}
                          </TableCell>
                          <TableCell
                            sx={{
                              verticalAlign: 'top',
                              minWidth: 280,
                              fontFamily: 'ui-monospace, monospace',
                              fontSize: '0.8125rem',
                              wordBreak: 'break-all',
                              overflowWrap: 'anywhere',
                              color: 'text.secondary',
                              lineHeight: 1.45,
                            }}
                          >
                            {row.current_email || '—'}
                          </TableCell>
                          <TableCell
                            sx={{
                              verticalAlign: 'top',
                              minWidth: 280,
                              fontFamily: 'ui-monospace, monospace',
                              fontSize: '0.8125rem',
                              wordBreak: 'break-all',
                              overflowWrap: 'anywhere',
                              color: 'primary.main',
                              fontWeight: 500,
                              lineHeight: 1.45,
                            }}
                          >
                            {row.generated_email}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )
          })()}
          {bulkEmailPreview && bulkEmailPreview.count === 0 && (
            <Typography color="text.secondary">No units in this apartment.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBulkEmailDialog} disabled={bulkEmailApplyLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleBulkEmailApply}
            disabled={
              bulkEmailApplyLoading ||
              !bulkEmailPreview ||
              bulkEmailPreview.count === 0 ||
              bulkEmailPreviewLoading ||
              !(bulkEmailPreview.rows || []).some((r) => r._checked !== false)
            }
          >
            {bulkEmailApplyLoading
              ? 'Applying…'
              : `Apply to ${(bulkEmailPreview?.rows || []).filter((r) => r._checked !== false).length} selected — group ${bulkEmailLetterGroup}`}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openImportDialog} onClose={handleCloseImportDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Import units</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload a XLSX, XML, or CSV file. Required columns: society_apartment_id, block_id, floor_id, unit_number (or unit number or name). Optional: owner_name, resident_name, contact_number, email. If you set apartment/block/floor below, they will be applied to rows that do not have them.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              href="/templates/units-import-template.csv"
              download="units-import-template.csv"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download template (CSV)
            </Button>
            <Typography variant="caption" color="text.secondary">
              Fill the template and upload below. You can open CSV in Excel and save as XLSX.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            fullWidth
            sx={{ mb: 2 }}
          >
            {importFile ? importFile.name : 'Choose XLSX, XML, or CSV'}
            <input
              type="file"
              hidden
              accept=".xlsx,.xls,.csv,.xml"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            />
          </Button>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Apply apartment to all rows (optional)"
                value={importOverrideSociety}
                onChange={(e) => {
                  setImportOverrideSociety(e.target.value)
                  setImportOverrideBlock('')
                  setImportOverrideFloor('')
                }}
              >
                <MenuItem value="">Use value from file</MenuItem>
                {societiesData?.data?.map((s) => (
                  <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Apply block to all rows (optional)"
                value={importOverrideBlock}
                onChange={(e) => {
                  setImportOverrideBlock(e.target.value)
                  setImportOverrideFloor('')
                }}
                disabled={!importOverrideSociety}
              >
                <MenuItem value="">Use value from file</MenuItem>
                {(importBlocksData?.data || []).map((b) => (
                  <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Apply floor to all rows (optional)"
                value={importOverrideFloor}
                onChange={(e) => setImportOverrideFloor(e.target.value)}
                disabled={!importOverrideBlock}
              >
                <MenuItem value="">Use value from file</MenuItem>
                {(importFloorsData?.data || []).map((f) => (
                  <MenuItem key={f.id} value={f.id}>Floor {f.floor_number}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          {importResult && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="subtitle2">Result</Typography>
              <Typography variant="body2">Created: {importResult.created ?? 0}, Updated: {importResult.updated ?? 0}, Errors: {importResult.errorCount ?? 0}</Typography>
              {importResult.errors?.length > 0 && (
                <Typography variant="caption" component="pre" sx={{ mt: 1, whiteSpace: 'pre-wrap', maxHeight: 120, overflow: 'auto' }}>
                  {importResult.errors.map((e) => `Row ${e.row}: ${e.message}`).join('\n')}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportDialog}>{importResult ? 'Close' : 'Cancel'}</Button>
          {!importResult && (
            <Button
              variant="contained"
              onClick={handleImportUnits}
              disabled={!importFile || importSubmitting}
            >
              {importSubmitting ? 'Importing…' : 'Import'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={!!unitToDelete || !!(bulkDeleteIds && bulkDeleteIds.length > 0)} onClose={handleCancelDeleteUnit} maxWidth="xs" fullWidth>
        <DialogTitle>{bulkDeleteIds?.length ? 'Delete selected units' : 'Delete unit'}</DialogTitle>
        <DialogContent>
          <Typography>
            {bulkDeleteIds?.length
              ? `Delete ${bulkDeleteIds.length} selected unit(s)? This cannot be undone.`
              : unitToDelete
                ? `Delete unit ${unitToDelete.unit_number || unitToDelete.id}? This cannot be undone.`
                : ''}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDeleteUnit} disabled={deletingUnit}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={bulkDeleteIds?.length ? handleConfirmBulkDelete : handleConfirmDeleteUnit}
            disabled={deletingUnit}
          >
            {deletingUnit ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Units
