import { Container, Typography, Box, Button, Alert } from '@mui/material'
import BusinessIcon from '@mui/icons-material/Business'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '@/contexts/AuthContext'

const ResidentPendingAssignment = () => {
  const { user, logout } = useAuth()

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <BusinessIcon sx={{ fontSize: 64, color: 'primary.main' }} />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          You&apos;re not assigned yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 520 }}>
          Your account is set up, but you&apos;re not linked to any society or apartment. You&apos;ll be able to use
          the portal once an administrator adds you to a society.
        </Typography>
        <Alert severity="info" sx={{ mb: 3, textAlign: 'left', maxWidth: 520 }}>
          Contact your union or society admin and ask to be added to your apartment. After they assign you,
          sign in again to access Dashboard, Maintenance, Complaints, and other features.
        </Alert>
        {user?.email && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Signed in as <strong>{user.email}</strong>
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          startIcon={<LogoutIcon />}
          onClick={() => logout()}
          size="large"
        >
          Sign out
        </Button>
      </Box>
    </Container>
  )
}

export default ResidentPendingAssignment
