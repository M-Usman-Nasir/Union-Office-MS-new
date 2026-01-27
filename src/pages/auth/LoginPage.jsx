import { useState, useEffect } from 'react'
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
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, ROLES } from '@/utils/constants'
import toast from 'react-hot-toast'

const TEST_USERS = [
  {
    role: 'Super Admin',
    email: 'admin@homelandunion.com',
    password: 'admin123',
    color: 'primary',
  },
  {
    role: 'Union Admin',
    email: 'unionadmin@homelandunion.com',
    password: 'admin123',
    color: 'secondary',
  },
  {
    role: 'Resident',
    email: 'resident@homelandunion.com',
    password: 'resident123',
    color: 'success',
  },
]

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === ROLES.SUPER_ADMIN) {
        navigate(ROUTES.SUPER_ADMIN_DASHBOARD)
      } else if (user.role === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD)
      } else {
        navigate(ROUTES.RESIDENT_DASHBOARD)
      }
    }
  }, [isAuthenticated, user, navigate])

  const handleTestUserClick = (testUser) => {
    setEmail(testUser.email)
    setPassword(testUser.password)
    setError('')
    toast.success(`Filled credentials for ${testUser.role}`)
  }

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email)
    toast.success('Email copied to clipboard!')
  }

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password)
    toast.success('Password copied to clipboard!')
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

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Test Users
              </Typography>
            </Divider>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Click to auto-fill credentials:
              </Typography>
              {TEST_USERS.map((testUser) => (
                <Card
                  key={testUser.email}
                  variant="outlined"
                  sx={{
                    mt: 1.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      borderColor: `${testUser.color}.main`,
                    },
                  }}
                  onClick={() => handleTestUserClick(testUser)}
                >
                  <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Chip
                            label={testUser.role}
                            size="small"
                            color={testUser.color}
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          <strong>Email:</strong>{' '}
                          <Box component="span" sx={{ fontFamily: 'monospace' }}>
                            {testUser.email}
                          </Box>
                          <Tooltip title="Copy email">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopyEmail(testUser.email)
                              }}
                              sx={{ ml: 0.5, p: 0.25 }}
                            >
                              <ContentCopyIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Password:</strong>{' '}
                          <Box component="span" sx={{ fontFamily: 'monospace' }}>
                            {testUser.password}
                          </Box>
                          <Tooltip title="Copy password">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopyPassword(testUser.password)
                              }}
                              sx={{ ml: 0.5, p: 0.25 }}
                            >
                              <ContentCopyIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default LoginPage
