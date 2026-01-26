import { Container, Typography, Box } from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'

const ResidentDashboard = () => {
  const { user } = useAuth()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resident Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.name || user?.email}
        </Typography>
      </Box>

      <Typography variant="body1">
        Your personal dashboard content will appear here.
      </Typography>
    </Container>
  )
}

export default ResidentDashboard
