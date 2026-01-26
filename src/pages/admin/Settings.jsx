import { useState } from 'react'
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
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import { settingsApi } from '@/api/settingsApi'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user } = useAuth()
  const [societyId] = useState(user?.society_apartment_id)
  const [saving, setSaving] = useState(false)

  // Fetch settings
  const { data: settingsData, isLoading, mutate } = useSWR(
    societyId ? `/settings/${societyId}` : null,
    () => settingsApi.getSettings(societyId).then(res => res.data.data || res.data)
  )

  const settings = settingsData || {
    defaulter_list_visible: false,
    complaint_logs_visible: false,
    financial_reports_visible: false,
  }

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
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  Allow residents to view financial reports
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
    </Container>
  )
}

export default Settings
