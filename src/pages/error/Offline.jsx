import { Container, Box, Typography, Button, Paper } from '@mui/material'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import RefreshIcon from '@mui/icons-material/Refresh'

const Offline = () => {
  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload()
    } else {
      window.location.reload()
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CloudOffIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          You're Offline
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          It looks like you've lost your internet connection. Please check your network settings and try again.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRetry}
          >
            Retry Connection
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.location.href = '/'}
          >
            Go to Home
          </Button>
        </Box>
        <Box sx={{ mt: 4, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Tip:</strong> Some features may be available offline if you've visited them before.
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Offline
