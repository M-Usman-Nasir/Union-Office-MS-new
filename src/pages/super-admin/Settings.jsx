import { useState, useMemo } from 'react'
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
  CircularProgress,
  TextField,
  Tabs,
  Tab,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import useSWR from 'swr'
import { superAdminApi } from '@/api/superAdminApi'
import { settingsApi } from '@/api/settingsApi'
import toast from 'react-hot-toast'

const SuperAdminSettings = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedSocietyId, setSelectedSocietyId] = useState('')
  const [saving, setSaving] = useState(false)
  const [planDialogOpen, setPlanDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [planForm, setPlanForm] = useState({ name: 'Monthly', amount: '', interval_months: 1 })

  const { data: adminsData, isLoading: adminsLoading } = useSWR(
    '/super-admin/subscription/admins',
    () => superAdminApi.getAdminsWithSubscriptions().then(res => res.data)
  )
  const { data: plansData, isLoading: plansLoading, mutate: mutatePlans } = useSWR(
    ['/super-admin/subscription/plans', 'all'],
    () => superAdminApi.getSubscriptionPlans(true).then(res => res.data)
  )
  const { data: settingsData, isLoading: settingsLoading, mutate: mutateSettings } = useSWR(
    selectedSocietyId ? [`/settings/${selectedSocietyId}`, selectedSocietyId] : null,
    () => settingsApi.getSettings(selectedSocietyId).then(res => res.data?.data ?? res.data)
  )

  const admins = adminsData?.data ?? []
  const societies = useMemo(() => {
    const seen = new Set()
    return admins
      .filter((a) => a.society_apartment_id && !seen.has(a.society_apartment_id))
      .map((a) => {
        seen.add(a.society_apartment_id)
        return { id: a.society_apartment_id, name: a.apartment_name || `Society ${a.society_apartment_id}` }
      })
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }, [admins])

  const plans = plansData?.data ?? []
  const settings = settingsData || {
    defaulter_list_visible: false,
    complaint_logs_visible: false,
    financial_reports_visible: false,
    email_dues_on_generate: false,
    email_reminder_days_before: 0,
  }

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] }
    handleSaveSettings(newSettings)
  }

  const handleSaveSettings = async (newSettings = settings) => {
    if (!selectedSocietyId) {
      toast.error('Select a union (society) first')
      return
    }
    setSaving(true)
    try {
      await settingsApi.updateSettings(selectedSocietyId, {
        ...newSettings,
        society_apartment_id: parseInt(selectedSocietyId, 10),
      })
      toast.success('Settings saved')
      mutateSettings()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const openPlanDialog = (plan = null) => {
    setEditingPlan(plan)
    setPlanForm({
      name: plan?.name ?? 'Monthly',
      amount: plan?.amount ?? '',
      interval_months: plan?.interval_months ?? 1,
    })
    setPlanDialogOpen(true)
  }

  const closePlanDialog = () => {
    setPlanDialogOpen(false)
    setEditingPlan(null)
    setPlanForm({ name: 'Monthly', amount: '', interval_months: 1 })
  }

  const handleSavePlan = async () => {
    const amount = parseFloat(planForm.amount)
    if (isNaN(amount) || amount < 0) {
      toast.error('Enter a valid amount')
      return
    }
    setSaving(true)
    try {
      if (editingPlan) {
        await superAdminApi.updateSubscriptionPlan(editingPlan.id, {
          name: planForm.name,
          amount,
          interval_months: Math.max(1, parseInt(planForm.interval_months, 10)),
        })
        toast.success('Plan updated')
      } else {
        await superAdminApi.createSubscriptionPlan({
          name: planForm.name,
          amount,
          interval_months: Math.max(1, parseInt(planForm.interval_months, 10)),
        })
        toast.success('Plan created')
      }
      mutatePlans()
      closePlanDialog()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save plan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SettingsIcon fontSize="large" color="primary" />
        <Typography variant="h4" component="h1">
          Super Admin Settings
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure settings for union admins and monthly subscription amounts for all unions.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Union settings" />
          <Tab label="Subscription plans (monthly amount)" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Select union (society)
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
                  <InputLabel>Society</InputLabel>
                  <Select
                    value={selectedSocietyId}
                    label="Society"
                    onChange={(e) => setSelectedSocietyId(e.target.value)}
                  >
                    <MenuItem value="">— Select —</MenuItem>
                    {societies.map((s) => (
                      <MenuItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {adminsLoading && societies.length === 0 && <CircularProgress size={24} />}
                {!adminsLoading && societies.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No unions yet. Add union admins from Leads or Users.
                  </Typography>
                )}

                {selectedSocietyId && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Visibility & notifications for this union
                    </Typography>
                    {settingsLoading ? (
                      <Box display="flex" justifyContent="center" py={2}>
                        <CircularProgress size={28} />
                      </Box>
                    ) : (
                      <Box sx={{ mt: 2 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!settings.defaulter_list_visible}
                              onChange={() => handleToggle('defaulter_list_visible')}
                            />
                          }
                          label="Defaulter list visible"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!settings.complaint_logs_visible}
                              onChange={() => handleToggle('complaint_logs_visible')}
                            />
                          }
                          label="Complaint logs visible"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!settings.financial_reports_visible}
                              onChange={() => handleToggle('financial_reports_visible')}
                            />
                          }
                          label="Financial reports visible"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!settings.email_dues_on_generate}
                              onChange={() =>
                                handleSaveSettings({ ...settings, email_dues_on_generate: !settings.email_dues_on_generate })
                              }
                            />
                          }
                          label="Email residents when dues are generated"
                        />
                        <Box sx={{ mt: 2, maxWidth: 260 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Remind X days before due date"
                            type="number"
                            inputProps={{ min: 0 }}
                            value={settings.email_reminder_days_before ?? 0}
                            onChange={(e) => {
                              const v = Math.max(0, parseInt(e.target.value, 10) || 0)
                              handleSaveSettings({ ...settings, email_reminder_days_before: v })
                            }}
                          />
                        </Box>
                        <Button
                          variant="contained"
                          startIcon={saving ? <CircularProgress size={18} /> : null}
                          disabled={saving}
                          onClick={() => handleSaveSettings()}
                          sx={{ mt: 2 }}
                        >
                          {saving ? 'Saving...' : 'Save settings'}
                        </Button>
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
              <Typography variant="h6">
                Subscription plans (monthly amount for union admins)
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => openPlanDialog()}>
                Add plan
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              These plans define the monthly subscription amount. When you assign a union admin to an apartment, they get one of these plans. You can create a default &quot;Monthly&quot; plan and set the amount here.
            </Typography>
            {plansLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Amount (PKR)</TableCell>
                      <TableCell>Interval (months)</TableCell>
                      <TableCell>Active</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {plans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          No plans. Add a monthly plan with the amount you want to charge union admins.
                        </TableCell>
                      </TableRow>
                    ) : (
                      plans.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell align="right">{p.amount}</TableCell>
                          <TableCell>{p.interval_months}</TableCell>
                          <TableCell>{p.is_active ? 'Yes' : 'No'}</TableCell>
                          <TableCell align="right">
                            <Button size="small" startIcon={<EditIcon />} onClick={() => openPlanDialog(p)}>
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={planDialogOpen} onClose={closePlanDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPlan ? 'Edit plan' : 'Add subscription plan'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plan name"
                value={planForm.name}
                onChange={(e) => setPlanForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Monthly"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount (PKR)"
                type="number"
                inputProps={{ min: 0, step: 100 }}
                value={planForm.amount}
                onChange={(e) => setPlanForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Interval (months)"
                type="number"
                inputProps={{ min: 1 }}
                value={planForm.interval_months}
                onChange={(e) => setPlanForm((f) => ({ ...f, interval_months: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePlanDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSavePlan} disabled={saving}>
            {saving ? 'Saving...' : editingPlan ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default SuperAdminSettings
