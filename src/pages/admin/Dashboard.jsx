import { useEffect } from 'react'
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.name || user?.email}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Residents</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage residents
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Maintenance</Typography>
              <Typography variant="body2" color="text.secondary">
                Track maintenance fees
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Finance</Typography>
              <Typography variant="body2" color="text.secondary">
                Financial records
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AdminDashboard
