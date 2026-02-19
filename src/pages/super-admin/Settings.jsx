import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
import toast from 'react-hot-toast'

const SuperAdminSettings = () => {
  const [saving, setSaving] = useState(false)
  const [planDialogOpen, setPlanDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [planForm, setPlanForm] = useState({ name: 'Monthly', amount: '', interval_months: 1 })

  const { data: plansData, isLoading: plansLoading, mutate: mutatePlans } = useSWR(
    ['/super-admin/subscription/plans', 'all'],
    () => superAdminApi.getSubscriptionPlans(true).then(res => res.data)
  )

  const plans = plansData?.data ?? []

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
        Configure monthly subscription plans for union admins.
      </Typography>

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
