import {
  Container,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import useSWR from 'swr'
import { superAdminApi } from '@/api/superAdminApi'
import dayjs from 'dayjs'

const subscriptionStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'trial':
      return 'info'
    case 'expired':
      return 'error'
    case 'cancelled':
      return 'default'
    case 'pending':
      return 'warning'
    default:
      return 'default'
  }
}

const Admins = () => {
  const { data, isLoading, mutate } = useSWR(
    '/super-admin/subscription/admins',
    () => superAdminApi.getAdminsWithSubscriptions().then(res => res.data)
  )

  const admins = data?.data ?? []

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PeopleIcon fontSize="large" color="primary" />
        <Typography variant="h4" component="h1">
          Admins & Subscriptions
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        All Union Admins (apartment admins) and their subscription status. Only Super Admin can see this list.
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="280px">
          <CircularProgress />
        </Box>
      ) : admins.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              No Union Admins yet. Add a user with role &quot;Union Admin&quot; and assign an apartment from the Users page.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Admin Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Apartment</TableCell>
                <TableCell>City / Area</TableCell>
                <TableCell>Subscription</TableCell>
                <TableCell>Next Billing</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.name || '—'}</TableCell>
                  <TableCell>{row.email || '—'}</TableCell>
                  <TableCell>{row.contact_number || '—'}</TableCell>
                  <TableCell>{row.apartment_name || '—'}</TableCell>
                  <TableCell>
                    {[row.city, row.area].filter(Boolean).join(' / ') || '—'}
                  </TableCell>
                  <TableCell>
                    {row.plan_name ? `${row.plan_name} (${row.interval_months} mo)` : '—'}
                  </TableCell>
                  <TableCell>
                    {row.next_billing_date
                      ? dayjs(row.next_billing_date).format('DD/MM/YYYY')
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.subscription_status || '—'}
                      color={subscriptionStatusColor(row.subscription_status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

export default Admins
