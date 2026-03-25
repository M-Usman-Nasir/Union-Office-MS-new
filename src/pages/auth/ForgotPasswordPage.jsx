import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, Container, TextField, Typography, Alert, Link } from '@mui/material'
import { authApi } from '@/api/authApi'
import { ROUTES } from '@/utils/constants'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await authApi.forgotPassword(email.trim())
      const successMsg =
        res?.data?.message || 'If the account exists, a password reset email has been sent.'
      setMessage(successMsg)
      toast.success('Password reset request submitted')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to request password reset'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Forgot password?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your account email and we will send you a password reset link.
          </Typography>

          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              autoFocus
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 3 }}>
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to={ROUTES.LOGIN} underline="hover">
              Back to login
            </Link>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}

export default ForgotPasswordPage
