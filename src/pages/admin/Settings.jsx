import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Tabs,
  Tab,
  Divider,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { settingsApi } from '@/api/settingsApi'
import { propertyApi } from '@/api/propertyApi'
import toast from 'react-hot-toast'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

const Settings = () => {
  const { user } = useAuth()
  const [societyId] = useState(user?.society_apartment_id)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [savingConfig, setSavingConfig] = useState(false)
  const [reminderDaysInput, setReminderDaysInput] = useState(0)

  // Fetch settings
  const { data: settingsData, isLoading, mutate } = useSWR(
    societyId ? `/settings/${societyId}` : null,
    () => settingsApi.getSettings(societyId).then(res => res.data.data || res.data)
  )

  // Fetch maintenance config (array: society-level and per-block/per-unit)
  const { data: configData, isLoading: configLoading, mutate: mutateConfig } = useSWR(
    societyId ? [`/settings/${societyId}/maintenance-config`, societyId] : null,
    () => settingsApi.getMaintenanceConfig(societyId).then(res => res.data.data || res.data).catch(() => [])
  )

  // Fetch blocks for per-block overrides
  const { data: blocksData } = useSWR(
    societyId ? ['/blocks', societyId] : null,
    () => propertyApi.getBlocks({ society_id: societyId }).then(res => res.data).catch(() => null)
  )

  // Fetch units for per-unit (per-flat) overrides
  const { data: unitsData } = useSWR(
    societyId ? ['/units', societyId] : null,
    () => propertyApi.getUnits({ society_id: societyId }).then(res => res.data).catch(() => null)
  )

  const settings = settingsData || {
    defaulter_list_visible: false,
    complaint_logs_visible: false,
    financial_reports_visible: false,
    email_dues_on_generate: false,
    email_reminder_days_before: 0,
  }

  useEffect(() => {
    const v = settingsData?.email_reminder_days_before
    setReminderDaysInput(v != null ? v : 0)
  }, [settingsData?.email_reminder_days_before])

  const configList = Array.isArray(configData) ? configData : []
  const societyLevelConfig = configList.find((c) => c.block_id == null && c.unit_id == null)
  const blocks = blocksData?.data || []
  const units = unitsData?.data || []
  const blockConfigByBlockId = configList
    .filter((c) => c.block_id != null && c.unit_id == null)
    .reduce((acc, c) => ({ ...acc, [c.block_id]: c }), {})
  const unitConfigByUnitId = configList
    .filter((c) => c.unit_id != null)
    .reduce((acc, c) => ({ ...acc, [c.unit_id]: c }), {})

  const handleToggle = (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    }
    handleSave(newSettings)
  }

  const handleSave = async (newSettings = settings) => {
    if (!societyId) {
      toast.error('Society ID not found')
      return
    }

    setSaving(true)
    try {
      await settingsApi.updateSettings(societyId, {
        ...newSettings,
        society_apartment_id: societyId,
      })
      toast.success('Settings saved successfully')
      mutate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveMaintenanceConfig = async (values, formikHelpers) => {
    if (!societyId) {
      toast.error('Society ID not found')
      return
    }

    setSavingConfig(true)
    try {
      const societyAmount = Number(values.base_amount) || 0
      const configs = [
        {
          id: societyLevelConfig?.id,
          unit_id: null,
          block_id: null,
          base_amount: societyAmount,
        },
      ]
      blocks.forEach((block) => {
        const amount = values.blockAmounts?.[block.id]
        if (amount !== undefined && amount !== '' && amount !== null) {
          const blockConfig = blockConfigByBlockId[block.id]
          configs.push({
            id: blockConfig?.id,
            block_id: block.id,
            unit_id: null,
            base_amount: Math.max(0, Number(amount) || 0),
          })
        }
      })
      units.forEach((unit) => {
        const amount = values.unitAmounts?.[unit.id]
        if (amount !== undefined && amount !== '' && amount !== null) {
          const unitConfig = unitConfigByUnitId[unit.id]
          configs.push({
            id: unitConfig?.id,
            unit_id: unit.id,
            block_id: null,
            base_amount: Math.max(0, Number(amount) || 0),
          })
        }
      })
      await settingsApi.updateMaintenanceConfig(societyId, { configs })
      toast.success('Maintenance configuration saved successfully')
      await mutateConfig()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save maintenance configuration')
    } finally {
      setSavingConfig(false)
      formikHelpers.setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure system settings for your society
        </Typography>
      </Box>

      {isLoading && (
        <Box display="flex" justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Visibility Settings" />
          <Tab label="Maintenance Configuration" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Visibility Settings
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.defaulter_list_visible}
                        onChange={() => handleToggle('defaulter_list_visible')}
                      />
                    }
                    label="Defaulter List Visible"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Allow residents to view the defaulter list
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.complaint_logs_visible}
                        onChange={() => handleToggle('complaint_logs_visible')}
                      />
                    }
                    label="Complaint Logs Visible"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Allow residents to view complaint logs
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.financial_reports_visible}
                        onChange={() => handleToggle('financial_reports_visible')}
                      />
                    }
                    label="Financial Reports Visible"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 3 }}>
                    Allow residents to view financial reports
                  </Typography>

                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Dues notifications (email & push)
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!settings.email_dues_on_generate}
                        onChange={() => handleSave({ ...settings, email_dues_on_generate: !settings.email_dues_on_generate })}
                      />
                    }
                    label="Email residents when dues are generated"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Send email (and push if enabled) when monthly maintenance dues are created
                  </Typography>
                  <Box sx={{ ml: 4, mt: 2, maxWidth: 280 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Remind X days before due date"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={reminderDaysInput}
                      onChange={(e) => {
                        const raw = e.target.value
                        setReminderDaysInput(raw === '' ? '' : Math.max(0, parseInt(raw, 10) || 0))
                      }}
                      onBlur={() => {
                        const val = reminderDaysInput === '' ? 0 : Number(reminderDaysInput)
                        const final = Math.max(0, val)
                        setReminderDaysInput(final)
                        handleSave({ ...settings, email_reminder_days_before: final })
                      }}
                      helperText="0 = off. When &gt; 0, residents get email and push reminders for pending/overdue dues (daily job)."
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Maintenance Amount Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Configure the base maintenance amount for your society. This amount will be used when generating monthly dues.
                </Typography>

                {configLoading ? (
                  <Box display="flex" justifyContent="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Formik
                    initialValues={{
                      base_amount: societyLevelConfig?.base_amount ?? 0,
                      blockAmounts: blocks.reduce(
                        (acc, block) => ({
                          ...acc,
                          [block.id]: blockConfigByBlockId[block.id]?.base_amount ?? '',
                        }),
                        {}
                      ),
                      unitAmounts: units.reduce(
                        (acc, unit) => ({
                          ...acc,
                          [unit.id]: unitConfigByUnitId[unit.id]?.base_amount ?? '',
                        }),
                        {}
                      ),
                    }}
                    validationSchema={Yup.object({
                      base_amount: Yup.number()
                        .min(0, 'Amount must be positive')
                        .required('Base amount is required'),
                    })}
                    onSubmit={handleSaveMaintenanceConfig}
                    enableReinitialize
                  >
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                      <Form>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Base Maintenance Amount (PKR) – society default"
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
                              InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>PKR</Typography>,
                              }}
                            />
                          </Grid>
                        </Grid>

                        {blocks.length > 0 && (
                          <>
                            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                              Per-block overrides (optional)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Set a different amount for a block. Leave empty to use the society default.
                            </Typography>
                            <Grid container spacing={2}>
                              {blocks.map((block) => (
                                <Grid item xs={12} sm={6} md={4} key={block.id}>
                                  <TextField
                                    fullWidth
                                    label={`${block.name} (PKR)`}
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    value={values.blockAmounts?.[block.id] ?? ''}
                                    onChange={(e) => {
                                      const raw = e.target.value
                                      setFieldValue('blockAmounts', {
                                        ...values.blockAmounts,
                                        [block.id]: raw === '' ? '' : Math.max(0, parseFloat(raw) || 0),
                                      })
                                    }}
                                    placeholder="Use default"
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </>
                        )}

                        {units.length > 0 && (
                          <>
                            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                              Per-unit / per-flat overrides (optional)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Set a different amount for a specific unit (flat). Leave empty to use block or society default. Priority: unit → block → society.
                            </Typography>
                            <Grid container spacing={2}>
                              {blocks.map((block) => {
                                const unitsInBlock = units.filter((u) => u.block_id === block.id)
                                if (unitsInBlock.length === 0) return null
                                return (
                                  <Grid item xs={12} key={block.id}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                      {block.name}
                                    </Typography>
                                    <Grid container spacing={1}>
                                      {unitsInBlock.map((unit) => (
                                        <Grid item xs={6} sm={4} md={3} key={unit.id}>
                                          <TextField
                                            fullWidth
                                            size="small"
                                            label={`Unit ${unit.unit_number} (PKR)`}
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={values.unitAmounts?.[unit.id] ?? ''}
                                            onChange={(e) => {
                                              const raw = e.target.value
                                              setFieldValue('unitAmounts', {
                                                ...values.unitAmounts,
                                                [unit.id]: raw === '' ? '' : Math.max(0, parseFloat(raw) || 0),
                                              })
                                            }}
                                            placeholder="Default"
                                          />
                                        </Grid>
                                      ))}
                                    </Grid>
                                  </Grid>
                                )
                              })}
                              {(() => {
                                const unitsWithoutBlock = units.filter((u) => u.block_id == null)
                                if (unitsWithoutBlock.length === 0) return null
                                return (
                                  <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                      Other (no block)
                                    </Typography>
                                    <Grid container spacing={1}>
                                      {unitsWithoutBlock.map((unit) => (
                                        <Grid item xs={6} sm={4} md={3} key={unit.id}>
                                          <TextField
                                            fullWidth
                                            size="small"
                                            label={`Unit ${unit.unit_number} (PKR)`}
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={values.unitAmounts?.[unit.id] ?? ''}
                                            onChange={(e) => {
                                              const raw = e.target.value
                                              setFieldValue('unitAmounts', {
                                                ...values.unitAmounts,
                                                [unit.id]: raw === '' ? '' : Math.max(0, parseFloat(raw) || 0),
                                              })
                                            }}
                                            placeholder="Default"
                                          />
                                        </Grid>
                                      ))}
                                    </Grid>
                                  </Grid>
                                )
                              })()}
                            </Grid>
                          </>
                        )}

                        <Alert severity="info" sx={{ mt: 3 }}>
                          <Typography variant="body2">
                            <strong>Note:</strong> Society amount is the default. Block overrides apply to all units in that block. Unit overrides apply to a single flat. Priority when generating monthly dues: unit → block → society.
                          </Typography>
                        </Alert>

                        <Box sx={{ mt: 3 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={savingConfig ? <CircularProgress size={20} /> : <SaveIcon />}
                            disabled={savingConfig || isSubmitting}
                          >
                            {savingConfig ? 'Saving...' : 'Save Configuration'}
                          </Button>
                        </Box>
                      </Form>
                    )}
                  </Formik>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={() => handleSave()}
            disabled={saving || isLoading}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default Settings
