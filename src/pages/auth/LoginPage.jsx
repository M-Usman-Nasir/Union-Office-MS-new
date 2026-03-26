import { useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { keyframes } from '@mui/material/styles'
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
  CircularProgress,
  Chip,
  Link,
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
import brandLogo from '@/assets/images/logo.png'

const floatKeyframes = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`

// Simple email format validation
const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value?.trim() || '')

const BRAND_LOGO_SRC = brandLogo

const FeatureCard = ({ icon, title, description }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5),
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 3,
      transition: 'all 0.3s ease',
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        '&:hover': { transform: 'none' },
      },
      '&:hover': {
        borderColor: 'primary.main',
        transform: 'translateY(-4px)',
        boxShadow: (theme) => `0 12px 32px ${alpha(theme.palette.primary.main, 0.18)}`,
      },
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'primary.main',
        mb: 2,
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
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
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const emailValid = email.trim() !== '' && isValidEmail(email)
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const floatAnimation = prefersReducedMotion ? 'none' : `${floatKeyframes} 6s ease-in-out infinite`
  const floatAnimationSlow = prefersReducedMotion
    ? 'none'
    : `${floatKeyframes} 8s ease-in-out infinite reverse`

  const pageBg = `linear-gradient(135deg,
    ${alpha(theme.palette.primary.main, 0.08)} 0%,
    ${theme.palette.background.default} 42%,
    ${alpha(theme.palette.secondary.main, 0.06)} 100%)`

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
    } catch {
      setError('An unexpected error occurred')
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const mobileFeatureChips = (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="center"
      flexWrap="wrap"
      useFlexGap
      sx={{ gap: 1, mt: 2 }}
    >
      <Chip icon={<HomeIcon />} label="Properties" size="small" variant="outlined" color="primary" />
      <Chip icon={<PeopleIcon />} label="Residents" size="small" variant="outlined" color="primary" />
      <Chip
        icon={<SecurityIcon />}
        label="Secure"
        size="small"
        variant="outlined"
        color="primary"
      />
    </Stack>
  )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: 'background.default',
        background: pageBg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 220,
          height: 220,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.primary.main, 0.07),
          animation: floatAnimation,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 320,
          height: 320,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.secondary.main, 0.07),
          animation: floatAnimationSlow,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '35%',
          left: '8%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          animation: prefersReducedMotion ? 'none' : `${floatKeyframes} 10s ease-in-out infinite`,
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          py: 4,
          zIndex: 1,
          width: '100%',
        }}
      >
        {isMobile && (
          <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                mb: 1.5,
                bgcolor: (t) => alpha(t.palette.background.paper, 0.94),
                border: '1px solid',
                borderColor: (t) => alpha(t.palette.common.black, 0.08),
                boxShadow: (t) => `0 10px 24px ${alpha(t.palette.common.black, 0.12)}`,
              }}
            >
              <Box
                component="img"
                src={BRAND_LOGO_SRC}
                alt="Homeland Union"
                sx={{ height: 72, width: 'auto', display: 'block' }}
              />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Homeland Union
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, px: 2 }}>
              Resident management — streamlined operations and better living.
            </Typography>
            {mobileFeatureChips}
          </Box>
        )}

        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {!isMobile && (
            <Grid item xs={12} md={6} lg={7}>
              <Fade in timeout={800}>
                <Box sx={{ pr: { md: 4, lg: 8 } }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 1.75,
                        py: 1,
                        borderRadius: 2.5,
                        bgcolor: (t) => alpha(t.palette.background.paper, 0.94),
                        border: '1px solid',
                        borderColor: (t) => alpha(t.palette.common.black, 0.08),
                        boxShadow: (t) => `0 12px 28px ${alpha(t.palette.common.black, 0.14)}`,
                      }}
                    >
                      <Box
                        component="img"
                        src={BRAND_LOGO_SRC}
                        alt="Homeland Union"
                        sx={{ height: 88, width: 'auto', display: 'block' }}
                      />
                    </Box>
                    <Typography
                      variant="overline"
                      sx={{
                        letterSpacing: 2,
                        color: 'text.secondary',
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      Office Management
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { md: '2.5rem', lg: '2.75rem' },
                      lineHeight: 1.15,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Welcome to Homeland Union
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 4, lineHeight: 1.65, fontWeight: 400 }}
                  >
                    Your comprehensive resident management solution. Streamline operations, enhance
                    communication, and create better living experiences.
                  </Typography>

                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    {[
                      {
                        icon: <HomeIcon sx={{ fontSize: 28 }} />,
                        title: 'Property Management',
                        description:
                          'Efficiently manage properties, units, and maintenance requests',
                      },
                      {
                        icon: <PeopleIcon sx={{ fontSize: 28 }} />,
                        title: 'Resident Portal',
                        description: 'Enhanced communication and service delivery platform',
                      },
                      {
                        icon: <SecurityIcon sx={{ fontSize: 28 }} />,
                        title: 'Secure Access',
                        description: 'Advanced security features and access control systems',
                      },
                    ].map((feature, index) => (
                      <Grid item xs={12} sm={4} key={feature.title}>
                        <Fade
                          in
                          timeout={600}
                          style={{ transitionDelay: `${280 + index * 140}ms` }}
                        >
                          <Box>
                            <FeatureCard
                              icon={feature.icon}
                              title={feature.title}
                              description={feature.description}
                            />
                          </Box>
                        </Fade>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            </Grid>
          )}

          <Grid item xs={12} md={6} lg={5}>
            <Fade in timeout={1000} style={{ transitionDelay: '200ms' }}>
              <Card
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: 4,
                  bgcolor: (t) => alpha(t.palette.background.paper, 0.82),
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: `0 24px 64px ${alpha(theme.palette.common.black, 0.12)}`,
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                <Stack spacing={1} sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography
                    variant={isMobile ? 'h5' : 'h4'}
                    sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
                  >
                    Welcome back
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Sign in to your dashboard
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
                    InputLabelProps={{ shrink: true }}
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
                    InputLabelProps={{ shrink: true }}
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
                  <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <Link
                      component={RouterLink}
                      to={ROUTES.FORGOT_PASSWORD}
                      variant="body2"
                      underline="hover"
                    >
                      Forgot password?
                    </Link>
                  </Box>
                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 1,
                      py: 1.35,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1.05rem',
                      boxShadow: (t) => `0 8px 24px ${alpha(t.palette.primary.main, 0.35)}`,
                      '@media (prefers-reduced-motion: reduce)': {
                        transition: 'none',
                        '&:hover': { transform: 'none' },
                      },
                      '&:hover': {
                        boxShadow: (t) => `0 12px 28px ${alpha(t.palette.primary.main, 0.45)}`,
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={26} color="inherit" />
                    ) : (
                      'Sign in'
                    )}
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
