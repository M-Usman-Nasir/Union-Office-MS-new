import { useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
  Alert,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { authApi } from '@/api/authApi'
import { ROUTES } from '@/utils/constants'
import toast from 'react-hot-toast'

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const token = useMemo(() => searchParams.get('token') || '', [searchParams])
  const email = useMemo(() => (searchParams.get('email') || '').toLowerCase(), [searchParams])
  const hasRequiredParams = Boolean(token && email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!hasRequiredParams) {
      setError('Invalid or expired reset link')
      return
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await authApi.resetPassword({
        token,
        email,
        new_password: newPassword,
      })
      const successMsg = res?.data?.message || 'Password reset successful'
      setSuccess(successMsg)
      toast.success('Password updated')
      setTimeout(() => navigate(ROUTES.LOGIN), 1200)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to reset password'
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
            Reset password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Set a new password for {email || 'your account'}.
          </Typography>

          {!hasRequiredParams && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Invalid or expired reset link. Please request a new one.
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
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
              label="New password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              margin="normal"
              disabled={!hasRequiredParams}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              required
              label="Confirm new password"
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              margin="normal"
              disabled={!hasRequiredParams}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !hasRequiredParams}
              sx={{ mt: 2 }}
            >
              {loading ? 'Saving...' : 'Save new password'}
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

export default ResetPasswordPage
