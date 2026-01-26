import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'

const SuperAdminDashboard = () => {
  const { user } = useAuth()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Super Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.name || user?.email}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Societies</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage societies
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Blocks</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage blocks
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Units</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage units
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SuperAdminDashboard
