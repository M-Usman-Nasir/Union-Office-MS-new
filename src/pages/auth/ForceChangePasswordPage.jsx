import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/api/authApi'
import { ROUTES, ROLES, STORAGE_KEYS } from '@/utils/constants'
import toast from 'react-hot-toast'

const ForceChangePasswordPage = () => {
  const { user, mutate, logout } = useAuth()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirm) {
      setError('New passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.changePasswordFirstLogin({
        current_password: currentPassword,
        new_password: newPassword,
      })
      const { accessToken, refreshToken, user: u } = res.data.data
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken)
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u))
      await mutate()
      toast.success('Password updated')
      if (u.role === ROLES.RESIDENT) {
        navigate(ROUTES.RESIDENT_DASHBOARD)
      } else if (u.role === ROLES.SUPER_ADMIN) {
        navigate(ROUTES.SUPER_ADMIN_DASHBOARD)
      } else if (u.role === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD)
      } else {
        navigate(ROUTES.LOGIN)
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (!user?.must_change_password) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="info">No password change required.</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate(ROUTES.RESIDENT_DASHBOARD)}>
          Continue
        </Button>
      </Container>
    )
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
        <Card sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Change your password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            For security, you must set a new password before using the app. Use the initial password you
            were given as the current password.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Current password"
              type={show1 ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShow1(!show1)} edge="end" aria-label="toggle password">
                      {show1 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="New password"
              type={show2 ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShow2(!show2)} edge="end" aria-label="toggle password">
                      {show2 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm new password"
              type={show2 ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Saving…' : 'Save new password'}
              </Button>
              <Button type="button" onClick={() => logout()} color="inherit">
                Log out
              </Button>
            </Box>
          </form>
        </Card>
      </Container>
    </Box>
  )
}

export default ForceChangePasswordPage
