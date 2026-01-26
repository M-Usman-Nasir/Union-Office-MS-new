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
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { useAuth } from '@/contexts/AuthContext'
import useSWR from 'swr'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user } = useAuth()
  const [societyId] = useState(user?.society_apartment_id)
  const [settings, setSettings] = useState({
    defaulter_list_visible: false,
    complaint_logs_visible: false,
    financial_reports_visible: false,
  })

  // Note: Settings API would need to be implemented in backend
  // For now, this is a placeholder that shows the structure

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    try {
      // await settingsApi.update(societyId, settings)
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
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

      <Alert severity="info" sx={{ mb: 3 }}>
        Settings API needs to be implemented in the backend. This is a placeholder UI.
      </Alert>

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
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Box>
    </Container>
  )
}

export default Settings
