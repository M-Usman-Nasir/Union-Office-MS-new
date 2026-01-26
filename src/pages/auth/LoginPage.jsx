import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, ROLES } from '@/utils/constants'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(ROUTES.ADMIN_DASHBOARD)
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login({ email, password })

      if (result.success) {
        toast.success('Login successful!')
        
        // Redirect based on role
        const user = result.user
        if (user.role === ROLES.SUPER_ADMIN) {
          navigate(ROUTES.SUPER_ADMIN_DASHBOARD)
        } else if (user.role === ROLES.ADMIN) {
          navigate(ROUTES.ADMIN_DASHBOARD)
        } else {
          navigate(ROUTES.RESIDENT_DASHBOARD)
        }
      } else {
        setError(result.error || 'Login failed')
        toast.error(result.error || 'Login failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 450 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Homeland Union
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" gutterBottom sx={{ mb: 3 }}>
              Apartment Management System
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              Default: admin@homelandunion.com / admin123
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default LoginPage
