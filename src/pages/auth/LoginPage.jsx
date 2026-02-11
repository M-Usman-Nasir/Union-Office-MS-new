import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Box,
  Card,
  CardContent,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
  alpha,
  Fade,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import HomeIcon from '@mui/icons-material/Home'
import SecurityIcon from '@mui/icons-material/Security'
import PeopleIcon from '@mui/icons-material/People'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, ROLES } from '@/utils/constants'
import toast from 'react-hot-toast'
import logo from '@/assets/images/logo.png'

const TEST_USERS = [
  {
    role: 'Super Admin',
    email: 'hasanshkh17@gmail.com',
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

const FeatureCard = ({ icon, title, description }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      textAlign: 'center',
      bgcolor: 'transparent',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 3,
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: 'primary.main',
        transform: 'translateY(-2px)',
        boxShadow: (theme) => `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
      },
    }}
  >
    <Box sx={{ color: 'primary.main', mb: 2 }}>{icon}</Box>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Paper>
)

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

const LoginPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.secondary.main, 0.05),
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
            }
          `,
        }}
      />

      <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', py: 4, zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Left side - welcome content (hidden on mobile) */}
          {!isMobile && (
            <Grid item xs={12} md={6} lg={7}>
              <Fade in timeout={800}>
                <Box sx={{ pr: { md: 4, lg: 8 } }}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Welcome to Homeland Union
                  </Typography>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{ mb: 4, lineHeight: 1.6, fontWeight: 300 }}
                  >
                    Your comprehensive resident management solution. Streamline operations, enhance
                    communication, and create better living experiences.
                  </Typography>

                  <Grid container spacing={3} sx={{ mt: 4 }}>
                    <Grid item xs={12} sm={4}>
                      <FeatureCard
                        icon={<HomeIcon sx={{ fontSize: 40 }} />}
                        title="Property Management"
                        description="Efficiently manage properties, units, and maintenance requests"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FeatureCard
                        icon={<PeopleIcon sx={{ fontSize: 40 }} />}
                        title="Resident Portal"
                        description="Enhanced communication and service delivery platform"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FeatureCard
                        icon={<SecurityIcon sx={{ fontSize: 40 }} />}
                        title="Secure Access"
                        description="Advanced security features and access control systems"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Grid>
          )}

          {/* Right side - login form */}
          <Grid item xs={12} md={6} lg={5}>
            <Fade in timeout={1000} style={{ transitionDelay: '200ms' }}>
              <Card
                elevation={24}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.1)}`,
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                {/* Logo */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Box
                    component="img"
                    src={logo}
                    alt="Homeland Union"
                    sx={{ height: 56, width: 'auto' }}
                  />
                </Box>

                <Stack spacing={1} sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography
                    variant={isMobile ? 'h4' : 'h3'}
                    sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: '1.1rem', lineHeight: 1.5 }}
                  >
                    Sign in to access your resident management dashboard
                  </Typography>
                </Stack>

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
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default LoginPage
