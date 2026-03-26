import { useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
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
const driftKeyframes = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0.75; }
  50% { transform: translate3d(18px, -14px, 0) rotate(6deg); opacity: 1; }
`
const pulseKeyframes = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.07); opacity: 1; }
`
const shimmerBorderKeyframes = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

// Simple email format validation
const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value?.trim() || '')

const BRAND_LOGO_SRC = brandLogo
const QUOTE_ROTATE_MS = 7000
const PROJECT_QUOTES = [
  '"Building better communities through smarter management."',
  '"Every resident interaction matters."',
  '"Transparent operations, trusted living."',
  '"One platform for homes, people, and peace of mind."',
  '"From complaints to clarity - all in one place."',
  '"Where residents, staff, and administration stay connected."',
  '"Reliable records, faster service, happier communities."',
  '"Simple workflows for complex community operations."',
]

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
  const [quoteIndex, setQuoteIndex] = useState(0)

  const emailValid = email.trim() !== '' && isValidEmail(email)
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

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

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % PROJECT_QUOTES.length)
    }, QUOTE_ROTATE_MS)

    return () => clearInterval(timer)
  }, [])

  const searchParams = new URLSearchParams(location.search)
  const sessionExpired = searchParams.get('reason') === 'session-expired'

  useEffect(() => {
    if (!sessionExpired) return
    const next = new URLSearchParams(location.search)
    next.delete('reason')
    navigate(
      {
        pathname: location.pathname,
        search: next.toString() ? `?${next.toString()}` : '',
      },
      { replace: true }
    )
  }, [sessionExpired, location.pathname, location.search, navigate])

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

  const quoteCard = (
    <Fade in key={`quote-${quoteIndex}`} timeout={900}>
      <Box
        sx={{
          mb: 2.5,
          px: 2,
          py: 1.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: (t) => alpha(t.palette.primary.main, 0.22),
          bgcolor: (t) => alpha(t.palette.background.paper, 0.72),
          boxShadow: (t) => `0 10px 26px ${alpha(t.palette.primary.main, 0.12)}`,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          maxWidth: { xs: 420, md: 720 },
          mx: { xs: 'auto', md: 0 },
          transition: 'transform 260ms ease, box-shadow 260ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: (t) => `0 14px 30px ${alpha(t.palette.primary.main, 0.18)}`,
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontStyle: 'italic',
            fontWeight: 500,
            lineHeight: 1.75,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          {PROJECT_QUOTES[quoteIndex]}
        </Typography>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ mt: 0.8, display: 'block', textAlign: { xs: 'center', md: 'left' } }}
        >
          Quote {quoteIndex + 1} of {PROJECT_QUOTES.length}
        </Typography>
      </Box>
    </Fade>
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
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '16%', md: '12%' },
          left: { xs: '-8%', md: '6%' },
          width: { xs: 180, md: 260 },
          height: { xs: 120, md: 170 },
          borderRadius: 4,
          bgcolor: alpha(theme.palette.primary.main, 0.09),
          transform: 'rotate(-12deg)',
          animation: prefersReducedMotion ? 'none' : `${driftKeyframes} 9s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '12%', md: '10%' },
          right: { xs: '-8%', md: '7%' },
          width: { xs: 160, md: 240 },
          height: { xs: 160, md: 240 },
          borderRadius: 6,
          bgcolor: alpha(theme.palette.secondary.main, 0.08),
          transform: 'rotate(18deg)',
          animation: prefersReducedMotion ? 'none' : `${pulseKeyframes} 7s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 15% 25%, ${alpha(theme.palette.primary.light, 0.12)} 0%, transparent 40%),
                       radial-gradient(circle at 85% 75%, ${alpha(theme.palette.secondary.light, 0.11)} 0%, transparent 38%)`,
          pointerEvents: 'none',
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
            <Box sx={{ mt: 1.25 }}>{quoteCard}</Box>
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
                  {quoteCard}

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
                  transition: 'transform 320ms ease, box-shadow 320ms ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 28px 72px ${alpha(theme.palette.common.black, 0.16)}`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -1,
                    borderRadius: 'inherit',
                    padding: '1px',
                    background: `linear-gradient(120deg,
                      ${alpha(theme.palette.primary.main, 0.55)},
                      ${alpha(theme.palette.secondary.main, 0.5)},
                      ${alpha(theme.palette.primary.light, 0.45)})`,
                    backgroundSize: '200% 200%',
                    animation: prefersReducedMotion
                      ? 'none'
                      : `${shimmerBorderKeyframes} 6s ease-in-out infinite`,
                    WebkitMask:
                      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                  },
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

                {sessionExpired && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Your session expired due to inactivity. Please sign in again.
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
