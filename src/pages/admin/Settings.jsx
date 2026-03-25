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
import { authApi } from '@/api/authApi'
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
  const [testEmailTo, setTestEmailTo] = useState(user?.email || '')
  const [sendingTestEmail, setSendingTestEmail] = useState(false)

  // Fetch settings
  const { data: settingsData, isLoading, mutate } = useSWR(
    societyId ? `/settings/${societyId}` : null,
    () => settingsApi.getSettings(societyId).then(res => res.data.data || res.data)
  )

  // Fetch maintenance config (society-level)
  const { data: configData, isLoading: configLoading, mutate: mutateConfig } = useSWR(
    societyId ? [`/settings/${societyId}/maintenance-config`, societyId] : null,
    () => settingsApi.getMaintenanceConfig(societyId).then(res => res.data.data || res.data).catch(() => [])
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

  const handleSendTestEmail = async () => {
    setSendingTestEmail(true)
    try {
      const recipient = (testEmailTo || '').trim()
      const res = await authApi.sendTestEmail(recipient || undefined)
      toast.success(res?.data?.message || 'Test email sent')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send test email')
    } finally {
      setSendingTestEmail(false)
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

                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    SMTP verification
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Send a test email to verify SMTP configuration.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', maxWidth: 520 }}>
                    <TextField
                      size="small"
                      label="Recipient email"
                      type="email"
                      value={testEmailTo}
                      onChange={(e) => setTestEmailTo(e.target.value)}
                      placeholder="team@myunionoffice.co"
                      sx={{ minWidth: 280, flex: 1 }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleSendTestEmail}
                      disabled={sendingTestEmail}
                    >
                      {sendingTestEmail ? 'Sending...' : 'Send Test Email'}
                    </Button>
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
                    }}
                    validationSchema={Yup.object({
                      base_amount: Yup.number()
                        .min(0, 'Amount must be positive')
                        .required('Base amount is required'),
                    })}
                    onSubmit={handleSaveMaintenanceConfig}
                    enableReinitialize
                  >
                    {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
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

                        <Alert severity="info" sx={{ mt: 3 }}>
                          <Typography variant="body2">
                            <strong>Note:</strong> This amount is used when generating monthly dues for your society.
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
