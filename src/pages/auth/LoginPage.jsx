import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Box,
  Card,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
  alpha,
  Fade,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import SecurityIcon from '@mui/icons-material/Security'
import PeopleIcon from '@mui/icons-material/People'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, ROLES } from '@/utils/constants'
import toast from 'react-hot-toast'

// Simple email format validation
const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value?.trim() || '')

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
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const emailValid = email.trim() !== '' && isValidEmail(email)
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.must_change_password && user.role === ROLES.RESIDENT) {
        navigate(ROUTES.FORCE_CHANGE_PASSWORD)
      } else if (user.role === ROLES.SUPER_ADMIN) {
        navigate(ROUTES.SUPER_ADMIN_DASHBOARD)
      } else if (user.role === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD)
      } else {
        navigate(ROUTES.RESIDENT_DASHBOARD)
      }
    }
  }, [isAuthenticated, user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login({ email, password })

      if (result.success) {
        toast.success('Login successful!')
        const loggedIn = result.user
        if (result.mustChangePassword && loggedIn.role === ROLES.RESIDENT) {
          navigate(ROUTES.FORCE_CHANGE_PASSWORD)
          return
        }
        if (loggedIn.role === ROLES.SUPER_ADMIN) {
          navigate(ROUTES.SUPER_ADMIN_DASHBOARD)
        } else if (loggedIn.role === ROLES.ADMIN) {
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
                    error={email.trim() !== '' && !emailValid}
                    helperText={
                      email.trim() !== '' && !emailValid
                        ? 'Please enter a valid email address'
                        : ''
                    }
                    InputProps={{
                      endAdornment: emailValid ? (
                        <InputAdornment position="end">
                          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowPassword((prev) => !prev)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default LoginPage
