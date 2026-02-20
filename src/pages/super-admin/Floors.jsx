import { useState, useEffect } from 'react'
import { useSearchParams, Link as RouterLink } from 'react-router-dom'
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
  Grid,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import useSWR from 'swr'
import { propertyApi } from '@/api/propertyApi'
import { apartmentApi } from '@/api/apartmentApi'
import DataTable from '@/components/common/DataTable'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

const Floors = () => {
  const [searchParams] = useSearchParams()
  const societyIdFromUrl = searchParams.get('society_id')
  const blockIdFromUrl = searchParams.get('block_id')
  const [societyFilter, setSocietyFilter] = useState('')
  const [blockFilter, setBlockFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingFloor, setEditingFloor] = useState(null)
  const [addUnitsCount, setAddUnitsCount] = useState(1)
  const [addDialogBlockId, setAddDialogBlockId] = useState(null)

  useEffect(() => {
    if (societyIdFromUrl) setSocietyFilter(societyIdFromUrl)
  }, [societyIdFromUrl])

  useEffect(() => {
    if (blockIdFromUrl) setBlockFilter(blockIdFromUrl)
  }, [blockIdFromUrl])

  const { data: currentSocietyData } = useSWR(
    societyIdFromUrl ? ['/society', societyIdFromUrl] : null,
    () => apartmentApi.getById(societyIdFromUrl).then(res => res.data)
  )
  const currentSocietyName = currentSocietyData?.data?.name

  const { data: societiesData } = useSWR(
    '/societies',
    () => apartmentApi.getAll({ limit: 100 }).then(res => res.data)
  )

  const { data: blocksData } = useSWR(
    societyFilter ? ['/blocks', societyFilter] : null,
    () => propertyApi.getBlocks({ society_id: societyFilter }).then(res => res.data)
  )

  const { data: allBlocksData } = useSWR(
    '/blocks',
    () => propertyApi.getBlocks().then(res => res.data)
  )

  const { data: floorsData, isLoading, mutate } = useSWR(
    blockFilter ? ['/floors', blockFilter] : null,
    () => propertyApi.getFloors({ block_id: blockFilter }).then(res => res.data)
  )

  const { data: nextFloorData } = useSWR(
    openDialog && !editingFloor && addDialogBlockId
      ? ['/blocks/next-floor', addDialogBlockId]
      : null,
    () => propertyApi.getBlockNextFloorNumber(addDialogBlockId).then(res => res.data)
  )
  const nextFloorNumber =
    openDialog && !editingFloor && nextFloorData?.data?.next_floor_number != null
      ? nextFloorData.data.next_floor_number
      : null
  const canAddGround = Boolean(nextFloorData?.data?.can_add_ground)
  const showGroundOption = !editingFloor && canAddGround && nextFloorNumber === 1

  // When coming from Apartments (society_id only): auto-select first/only block; user can change
  useEffect(() => {
    if (!societyIdFromUrl || blockIdFromUrl) return
    const blocks = blocksData?.data
    if (blocks?.length > 0 && !blockFilter) {
      setBlockFilter(blocks[0].id)
    }
  }, [societyIdFromUrl, blockIdFromUrl, blocksData?.data, blockFilter])

  const currentBlockName = (blockIdFromUrl || blockFilter) && blocksData?.data
    ? blocksData.data.find((b) => String(b.id) === String(blockIdFromUrl || blockFilter))?.name
    : null
  const showBlockReadOnly = (blockIdFromUrl && currentBlockName) || editingFloor || (!editingFloor && blockFilter && currentBlockName)
  const backToApartmentsUrl = societyIdFromUrl
    ? `/super-admin/societies?society_id=${societyIdFromUrl}`
    : '/super-admin/societies'

  const validationSchema = Yup.object({
    society_apartment_id: Yup.number().required('Apartment is required'),
    block_id: Yup.number().required('Block is required'),
    floor_number: Yup.number()
      .min(0, 'Use 0 for Ground floor')
      .required('Floor number is required')
      .test(
        'unique-in-block',
        'This floor number already exists in this block',
        function (value) {
          if (value == null || value === '') return true
          const blockId = this.parent.block_id
          if (blockId == null || blockId === '') return true
          const sameBlock =
            Number(blockId) === Number(blockFilter) ||
            Number(blockId) === Number(blockIdFromUrl) ||
            String(blockId) === String(blockFilter)
          const existingFloors = sameBlock ? (floorsData?.data || []) : []
          const excludeId = editingFloor?.id
          const duplicate = existingFloors.some(
            (f) =>
              Number(f.floor_number) === Number(value) &&
              (!excludeId || Number(f.id) !== Number(excludeId))
          )
          return !duplicate
        }
      ),
  })

  const handleOpenDialog = (floor = null) => {
    setEditingFloor(floor)
    if (floor) setAddUnitsCount(1)
    if (!floor) {
      setAddDialogBlockId(resolvedBlockId || blockFilter || blockIdFromUrl || null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingFloor(null)
  }

  const handleAddUnitsInEditDialog = async () => {
    if (!editingFloor?.id || !addUnitsCount || addUnitsCount < 1) return
    try {
      await propertyApi.addUnitsToFloor(editingFloor.id, addUnitsCount)
      toast.success(`${addUnitsCount} unit(s) added. They will appear on the Units page for this block.`)
      mutate()
      setAddUnitsCount(1)
      setEditingFloor((prev) => ({
        ...prev,
        total_units: (prev.total_units || 0) + addUnitsCount,
        units_count: (prev.units_count || 0) + addUnitsCount,
      }))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add units')
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingFloor) {
        await propertyApi.updateFloor(editingFloor.id, {
          floor_number: values.floor_number,
          total_units: values.total_units ?? 0,
        })
        toast.success('Floor updated successfully')
      } else {
        const floorData = {
          block_id: values.block_id,
          floor_number: values.floor_number,
          total_units: values.total_units || 0,
        }
        await propertyApi.createFloor(floorData)
        toast.success('Floor created successfully')
      }
      mutate()
      handleCloseDialog()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (row) => {
    const label = row.floor_number === 0 ? 'Ground floor' : `Floor ${row.floor_number}`
    const doDelete = async () => {
      try {
        await propertyApi.deleteFloor(row.id)
        toast.success('Floor deleted successfully')
        mutate()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed')
      }
    }
    toast.custom(
      (t) => (
        <Box
          sx={{
            background: (theme) =>
              theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.background.paper,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: 3,
            p: 2,
            minWidth: 280,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Delete {label}?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={() => toast.dismiss(t.id)}>
              Cancel
            </Button>
            <Button size="small" variant="contained" color="error" onClick={() => { toast.dismiss(t.id); doDelete() }}>
              Delete
            </Button>
          </Box>
        </Box>
      ),
      { duration: Infinity }
    )
  }

  const columns = [
    {
      id: 'floor_number',
      label: 'Floor',
      render: (row) => (row.floor_number === 0 ? 'Ground floor' : `Floor ${row.floor_number}`),
    },
    { id: 'block_name', label: 'Block', render: (row) => row.block_name || 'N/A' },
    {
      id: 'total_units',
      label: 'Total Units',
      render: (row) => {
        const count = row.total_units ?? row.units_count
        return count == null || Number(count) === 0 ? 'N/A' : count
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box component="span" sx={{ display: 'inline-flex', gap: 0.5 }}>
          <Tooltip title="Edit floor & add units">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenDialog(row)}
              aria-label={`Edit ${row.floor_number === 0 ? 'Ground floor' : `Floor ${row.floor_number}`}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row)}
              aria-label={`Delete ${row.floor_number === 0 ? 'Ground floor' : `Floor ${row.floor_number}`}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const resolvedSocietyId = editingFloor?.society_apartment_id ?? societyFilter ?? societyIdFromUrl ?? ''
  const resolvedBlockId = editingFloor?.block_id ?? blockFilter ?? blockIdFromUrl ?? ''
  const initialValues = {
    society_apartment_id: resolvedSocietyId !== '' ? Number(resolvedSocietyId) || resolvedSocietyId : '',
    block_id: resolvedBlockId !== '' ? Number(resolvedBlockId) || resolvedBlockId : '',
    floor_number:
      editingFloor != null
        ? editingFloor.floor_number
        : (nextFloorNumber ?? 1),
    total_units: editingFloor?.total_units || 0,
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            <Typography color="text.primary">Floors</Typography>
          </Breadcrumbs>
        </Box>
      )}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Floors Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Floor
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
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
            }}
            sx={{ minWidth: 250 }}
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
            onChange={(e) => setBlockFilter(e.target.value)}
            disabled={!societyFilter}
            sx={{ minWidth: 250 }}
          >
            <MenuItem value="">Select Block</MenuItem>
            {blocksData?.data?.map((block) => (
              <MenuItem key={block.id} value={block.id}>
                {block.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      {!blockFilter ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Please select an Apartment and Block to view floors
          </Typography>
        </Box>
      ) : (
        <DataTable
          columns={columns}
          data={floorsData?.data || []}
          loading={isLoading}
          pagination={null}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          emptyMessage={blockFilter ? 'No floors found for this block' : 'Please select a block first'}
        />
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogTitle>{editingFloor ? 'Edit Floor' : 'Add New Floor'}</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {(societyIdFromUrl && currentSocietyName) || editingFloor ? (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Apartment"
                        value={editingFloor ? (societiesData?.data?.find((s) => String(s.id) === String(editingFloor.society_apartment_id))?.name ?? '—') : currentSocietyName}
                        disabled
                        helperText={societyIdFromUrl ? 'Same apartment as selected from Apartments.' : undefined}
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
                          if (e.target.value !== values.society_apartment_id) {
                            handleChange({ target: { name: 'block_id', value: '' } })
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
                  {showBlockReadOnly ? (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Block"
                        value={editingFloor ? (blocksData?.data?.find((b) => String(b.id) === String(editingFloor.block_id))?.name ?? '—') : currentBlockName}
                        disabled
                        helperText={blockIdFromUrl ? 'Same block as selected from Blocks.' : blockFilter ? 'Same block as selected in Floors table.' : undefined}
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
                          if (!editingFloor) setAddDialogBlockId(e.target.value || null)
                        }}
                        onBlur={handleBlur}
                        error={touched.block_id && !!errors.block_id}
                        helperText={touched.block_id && errors.block_id}
                        disabled={!values.society_apartment_id}
                      >
                        <MenuItem value="">Select Block</MenuItem>
                        {(values.society_apartment_id
                          ? (blocksData?.data || []).filter(
                              (block) => block.society_apartment_id === values.society_apartment_id
                            )
                          : (allBlocksData?.data || [])
                        ).map((block) => (
                          <MenuItem key={block.id} value={block.id}>
                            {block.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    {showGroundOption ? (
                      <TextField
                        fullWidth
                        select
                        label="Floor"
                        name="floor_number"
                        value={values.floor_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.floor_number && !!errors.floor_number}
                        helperText={
                          (touched.floor_number && errors.floor_number) ||
                          'First floor (1). Ground (0) is optional.'
                        }
                      >
                        <MenuItem value={1}>1 – First floor</MenuItem>
                        <MenuItem value={0}>0 – Ground floor</MenuItem>
                      </TextField>
                    ) : (
                      <TextField
                        fullWidth
                        label="Floor Number"
                        name="floor_number"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={values.floor_number}
                        onChange={(e) => {
                          if (editingFloor) {
                            const raw = e.target.value
                            if (raw === '') {
                              handleChange(e)
                              return
                            }
                            const num = Math.max(0, parseInt(raw, 10) || 0)
                            handleChange({ target: { name: e.target.name, value: num } })
                          }
                        }}
                        onBlur={handleBlur}
                        disabled={!editingFloor}
                        error={touched.floor_number && !!errors.floor_number}
                        helperText={
                          editingFloor
                            ? ((touched.floor_number && errors.floor_number) || '0 = Ground (optional), 1 = First, 2 = Second, etc.')
                            : `Next resident floor in sequence (1, 2, 3, …). Ground floor (0) is optional.`
                        }
                      />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Total Units"
                      name="total_units"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={values.total_units}
                      onChange={(e) => {
                        const raw = e.target.value
                        if (raw === '') {
                          handleChange(e)
                          return
                        }
                        const num = Math.max(0, parseInt(raw, 10) || 0)
                        handleChange({ target: { name: e.target.name, value: num } })
                      }}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  {editingFloor && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                          Add units to this floor
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Number of units to add"
                          inputProps={{ min: 1, max: 999 }}
                          value={addUnitsCount}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10)
                            setAddUnitsCount(isNaN(v) || v < 1 ? 1 : v)
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          New unit rows will appear on the Units page with empty fields. Union admin can then add residents.
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="button"
                          variant="outlined"
                          onClick={handleAddUnitsInEditDialog}
                        >
                          Add units
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {editingFloor ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  )
}

export default Floors
