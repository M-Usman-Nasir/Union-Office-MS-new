import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Badge,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import PaymentIcon from '@mui/icons-material/Payment'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AssessmentIcon from '@mui/icons-material/Assessment'
import WarningIcon from '@mui/icons-material/Warning'
import FeedbackIcon from '@mui/icons-material/Feedback'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import SettingsIcon from '@mui/icons-material/Settings'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import ApartmentIcon from '@mui/icons-material/Apartment'
import MessageIcon from '@mui/icons-material/Message'
import LogoutIcon from '@mui/icons-material/Logout'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SearchIcon from '@mui/icons-material/Search'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme as useAppTheme } from '@/contexts/ThemeContext'
import { ROUTES, ROLES } from '@/utils/constants'
import { messagesApi } from '@/api/messagesApi'
import PushNotificationEnabler from '@/components/notifications/PushNotificationEnabler'
import superAdminAvatar from '@/assets/images/users/super_admin.webp'

const sidebarLogo = '/icons/mob_Logo.png'
const drawerWidth = 240
const drawerWidthCollapsed = 64

// Colorful icon palette (works in light and dark mode)
const iconColors = [
  { main: '#6366f1', light: 'rgba(99, 102, 241, 0.15)' },   // indigo
  { main: '#0ea5e9', light: 'rgba(14, 165, 233, 0.15)' },   // sky
  { main: '#06b6d4', light: 'rgba(6, 182, 212, 0.15)' },    // cyan
  { main: '#10b981', light: 'rgba(16, 185, 129, 0.15)' },   // emerald
  { main: '#f59e0b', light: 'rgba(245, 158, 11, 0.15)' },   // amber
  { main: '#ef4444', light: 'rgba(239, 68, 68, 0.15)' },    // red
  { main: '#ec4899', light: 'rgba(236, 72, 153, 0.15)' },   // pink
  { main: '#8b5cf6', light: 'rgba(139, 92, 246, 0.15)' },   // violet
  { main: '#64748b', light: 'rgba(100, 116, 139, 0.15)' },  // slate
  { main: '#14b8a6', light: 'rgba(20, 184, 166, 0.15)' },   // teal
  { main: '#f97316', light: 'rgba(249, 115, 22, 0.15)' },   // orange
]

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const effectiveDrawerWidth = sidebarOpen ? drawerWidth : drawerWidthCollapsed
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const { user, logout } = useAuth()
  const { mode, toggleMode } = useAppTheme()
  const navigate = useNavigate()
  const location = useLocation()

  // Fetch unread message count for admin and resident (shown in toolbar chat icon badge)
  useEffect(() => {
    if (user?.role !== ROLES.ADMIN && user?.role !== ROLES.RESIDENT) return
    const fetchUnread = () => {
      messagesApi.getConversations()
        .then((res) => {
          const list = res.data?.data || []
          const total = list.reduce((sum, c) => sum + (c.unread_count || 0), 0)
          setUnreadMessagesCount(total)
        })
        .catch(() => setUnreadMessagesCount(0))
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 60000) // refresh every minute
    return () => clearInterval(interval)
  }, [user?.role])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    setAnchorEl(null)
    setMobileOpen(false)
    try {
      await logout()
      navigate(ROUTES.LOGIN, { replace: true })
    } catch (err) {
      console.error('Logout failed:', err)
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Menu items based on role
  const getMenuItems = () => {
    if (user?.role === ROLES.SUPER_ADMIN) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.SUPER_ADMIN_DASHBOARD },
        { text: 'Leads', icon: <ApartmentIcon />, path: ROUTES.SUPER_ADMIN_SOCIETIES },
        { text: 'Clients', icon: <PeopleIcon />, path: ROUTES.SUPER_ADMIN_USERS },
        { text: 'Subscription Management', icon: <CardMembershipIcon />, path: ROUTES.SUPER_ADMIN_SUBSCRIPTION_MANAGEMENT },
        { text: 'Invoices', icon: <ReceiptLongIcon />, path: ROUTES.SUPER_ADMIN_INVOICES },
        { text: 'Escalations', icon: <FeedbackIcon />, path: ROUTES.SUPER_ADMIN_ESCALATIONS },
        { text: 'Audit logs', icon: <AssessmentIcon />, path: ROUTES.SUPER_ADMIN_AUDIT_LOGS },
        { text: 'Settings', icon: <SettingsIcon />, path: ROUTES.SUPER_ADMIN_SETTINGS },
        { text: 'Profile', icon: <AccountCircleIcon />, path: ROUTES.SUPER_ADMIN_PROFILE },
        { text: 'Logout', icon: <LogoutIcon />, path: '/logout', action: handleLogout },
      ]
    } else if (user?.role === ROLES.ADMIN) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.ADMIN_DASHBOARD },
        { text: 'Residents', icon: <PeopleIcon />, path: ROUTES.ADMIN_RESIDENTS },
        { text: 'Maintenance', icon: <PaymentIcon />, path: ROUTES.ADMIN_MAINTENANCE },
        { text: 'Defaulters', icon: <WarningIcon />, path: ROUTES.ADMIN_DEFAULTERS },
        { text: 'Finance', icon: <AccountBalanceIcon />, path: ROUTES.ADMIN_FINANCE },
        { text: 'Complaints', icon: <FeedbackIcon />, path: ROUTES.ADMIN_COMPLAINTS },
        { text: 'Employees', icon: <PeopleIcon />, path: ROUTES.ADMIN_EMPLOYEES },
        { text: 'Announcements', icon: <AnnouncementIcon />, path: ROUTES.ADMIN_ANNOUNCEMENTS },
        { text: 'Settings', icon: <SettingsIcon />, path: ROUTES.ADMIN_SETTINGS },
        { text: 'Union Members', icon: <PeopleIcon />, path: ROUTES.ADMIN_UNION_MEMBERS },
        { text: 'Profile', icon: <AccountCircleIcon />, path: ROUTES.ADMIN_PROFILE },
        { text: 'Logout', icon: <LogoutIcon />, path: '/logout', action: handleLogout },
      ]
    } else if (user?.role === ROLES.STAFF) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.STAFF_DASHBOARD },
        { text: 'My Complaints', icon: <FeedbackIcon />, path: ROUTES.STAFF_COMPLAINTS },
        { text: 'Payment Updates', icon: <PaymentIcon />, path: ROUTES.STAFF_PAYMENTS },
        { text: 'Logout', icon: <LogoutIcon />, path: '/logout', action: handleLogout },
      ]
    } else {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.RESIDENT_DASHBOARD },
        { text: 'Messages', icon: <MessageIcon />, path: ROUTES.RESIDENT_MESSAGES },
        { text: 'Complaints', icon: <FeedbackIcon />, path: ROUTES.RESIDENT_COMPLAINTS },
        { text: 'Maintenance', icon: <PaymentIcon />, path: ROUTES.RESIDENT_MAINTENANCE },
        { text: 'Financial Summary', icon: <AssessmentIcon />, path: ROUTES.RESIDENT_FINANCIAL_SUMMARY },
        { text: 'Union Info', icon: <ApartmentIcon />, path: ROUTES.RESIDENT_UNION_INFO },
        { text: 'Profile', icon: <PeopleIcon />, path: ROUTES.RESIDENT_PROFILE },
        { text: 'Logout', icon: <LogoutIcon />, path: '/logout', action: handleLogout },
      ]
    }
  }

  const menuItems = getMenuItems()

  const drawer = (collapsed = false) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: (t) =>
            t.palette.mode === 'dark'
              ? 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)'
              : 'linear-gradient(180deg, #6366f1 0%, #a78bfa 50%, #22d3ee 100%)',
          opacity: 0.9,
          zIndex: 1,
        },
      }}
    >
      <Toolbar
        sx={{
          minHeight: collapsed ? 56 : { xs: 120, sm: 180 },
          justifyContent: 'center',
          px: collapsed ? 0 : 1.5,
          position: 'relative',
          zIndex: 2,
          background: (t) =>
            t.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, transparent 60%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, transparent 60%)',
          borderBottom: (t) =>
            `1px solid ${t.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.12)'}`,
        }}
      >
        {!collapsed && (
          <Box
            component="img"
            src={sidebarLogo}
            alt="Homeland Union"
            sx={{
              height: { xs: 120, sm: 160 },
              width: 'auto',
              maxWidth: '100%',
              display: 'block',
              flexShrink: 0,
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
              filter: (t) => (t.palette.mode === 'dark' ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' : 'none'),
              '&:hover': { transform: 'scale(1.05)' },
            }}
          />
        )}
      </Toolbar>
      <Divider
        sx={{
          borderColor: (t) => (t.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)'),
          position: 'relative',
          zIndex: 2,
        }}
      />
      <List
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflow: 'auto',
          px: collapsed ? 0 : 1,
          py: 0.5,
          position: 'relative',
          zIndex: 2,
          '@keyframes itemEnter': {
            '0%': { opacity: 0, transform: 'translateX(-12px)' },
            '100%': { opacity: 1, transform: 'translateX(0)' },
          },
          '@keyframes iconBounce': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.25)' },
          },
          '@keyframes iconPulse': {
            '0%, 100%': { opacity: 1, transform: 'scale(1)' },
            '50%': { opacity: 0.9, transform: 'scale(1.08)' },
          },
        }}
      >
        {menuItems.map((item, index) => {
          const colors = iconColors[index % iconColors.length]
          const isSelected = location.pathname === item.path
          return (
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                display: 'block',
                animation: 'itemEnter 0.35s ease-out forwards',
                animationDelay: `${index * 0.05}s`,
                opacity: 0,
              }}
            >
              <ListItemButton
                selected={isSelected && !item.action}
                onClick={() => {
                  if (item.action) {
                    item.action()
                  } else {
                    navigate(item.path)
                    setMobileOpen(false)
                  }
                }}
                sx={{
                  justifyContent: collapsed ? 'center' : 'initial',
                  px: collapsed ? 0 : 1,
                  borderRadius: 2,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: colors.light,
                    transform: 'translateX(4px)',
                    '& .nav-icon-wrap': {
                      transform: 'scale(1.1)',
                      boxShadow: `0 4px 12px ${colors.main}40`,
                    },
                    '& .nav-icon-wrap .MuiSvgIcon-root': {
                      animation: 'iconBounce 0.4s ease',
                    },
                  },
                  '&.Mui-selected': {
                    backgroundColor: colors.light,
                    boxShadow: collapsed ? 'none' : `inset 3px 0 0 ${colors.main}`,
                    '& .nav-icon-wrap': {
                      backgroundColor: colors.main,
                      color: '#fff',
                      boxShadow: `0 4px 14px ${colors.main}50`,
                    },
                    '& .nav-icon-wrap .MuiSvgIcon-root': {
                      animation: 'iconPulse 2s ease-in-out infinite',
                    },
                    '&:hover': {
                      backgroundColor: colors.light,
                      '& .nav-icon-wrap .MuiSvgIcon-root': {
                        animation: 'iconBounce 0.4s ease, iconPulse 2s ease-in-out infinite 0.4s',
                      },
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 56,
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    className="nav-icon-wrap"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      backgroundColor: isSelected ? colors.main : colors.light,
                      color: isSelected ? '#fff' : colors.main,
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      '& .MuiSvgIcon-root': {
                        fontSize: 22,
                      },
                    }}
                  >
                    {item.icon}
                  </Box>
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 500,
                      sx: { transition: 'font-weight 0.2s' },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Divider
        sx={{
          borderColor: (t) => (t.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)'),
          position: 'relative',
          zIndex: 2,
        }}
      />
      <Box
        sx={{
          py: 1,
          px: collapsed ? 0 : 1,
          flexShrink: 0,
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
          position: 'relative',
          zIndex: 2,
          background: (t) =>
            t.palette.mode === 'dark'
              ? 'linear-gradient(0deg, rgba(99, 102, 241, 0.06) 0%, transparent 100%)'
              : 'linear-gradient(0deg, rgba(99, 102, 241, 0.04) 0%, transparent 100%)',
          borderTop: (t) =>
            `1px solid ${t.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)'}`,
        }}
      >
        <IconButton
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          onClick={() => setSidebarOpen((o) => !o)}
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            transition: 'transform 0.25s ease, background-color 0.2s',
            backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)'),
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.12)'),
            },
          }}
          size="small"
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${effectiveDrawerWidth}px)` },
          ml: { sm: `${effectiveDrawerWidth}px` },
          boxShadow: (t) => (t.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(99, 102, 241, 0.08)'),
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={isDesktop && !sidebarOpen ? 'Open sidebar' : 'Open menu'}
            edge="start"
            onClick={() => {
              if (isDesktop && !sidebarOpen) setSidebarOpen(true)
              else handleDrawerToggle()
            }}
            sx={{
              mr: 1,
              display: { xs: 'block', sm: 'none' },
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'rotate(90deg)' },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'inherit', opacity: 0.8 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: 140, sm: 200 },
              mr: 1,
              '& .MuiOutlinedInput-root': {
                color: 'inherit',
                backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)'),
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.8)' },
              },
              '& .MuiInputBase-input::placeholder': { color: 'inherit', opacity: 0.7 },
            }}
          />
          {(user?.role === ROLES.ADMIN || user?.role === ROLES.RESIDENT) && (
            <IconButton
              color="inherit"
              aria-label="Messages"
              onClick={() => navigate(user?.role === ROLES.ADMIN ? ROUTES.ADMIN_MESSAGES : ROUTES.RESIDENT_MESSAGES)}
              sx={{
                mr: 0.5,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.08)' },
              }}
            >
              <Badge badgeContent={unreadMessagesCount} color="error">
                <MessageIcon />
              </Badge>
            </IconButton>
          )}
          <IconButton
            onClick={toggleMode}
            color="inherit"
            sx={{
              mr: 0.5,
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'rotate(180deg)' },
            }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton
            onClick={handleMenuClick}
            sx={{
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'scale(1.08)' },
            }}
          >
            <Avatar
              src={user?.role === ROLES.SUPER_ADMIN ? superAdminAvatar : undefined}
              sx={{
                width: 32,
                height: 32,
                border: '2px solid',
                borderColor: 'primary.light',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                {getGreeting()}, {user?.name || user?.email}
              </Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">
                {user?.role}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: effectiveDrawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              borderLeft: 'none',
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              boxShadow: (t) =>
                t.palette.mode === 'dark'
                  ? '4px 0 24px rgba(0,0,0,0.2), 2px 0 8px rgba(99, 102, 241, 0.15)'
                  : '4px 0 24px rgba(99, 102, 241, 0.12), 2px 0 8px rgba(0,0,0,0.04)',
              background: (t) =>
                t.palette.mode === 'dark'
                  ? 'linear-gradient(180deg, rgba(99, 102, 241, 0.12) 0%, rgba(30, 27, 75, 0.4) 50%, rgba(15, 23, 42, 0.95) 100%)'
                  : 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(248, 250, 252, 1) 100%)',
            },
          }}
        >
          {drawer(false)}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: effectiveDrawerWidth,
              overflowX: 'hidden',
              height: '100%',
              border: 'none',
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              boxShadow: (t) =>
                t.palette.mode === 'dark'
                  ? '4px 0 24px rgba(0,0,0,0.2), 2px 0 8px rgba(99, 102, 241, 0.15)'
                  : '4px 0 24px rgba(99, 102, 241, 0.12), 2px 0 8px rgba(0,0,0,0.04)',
              background: (t) =>
                t.palette.mode === 'dark'
                  ? 'linear-gradient(180deg, rgba(99, 102, 241, 0.12) 0%, rgba(30, 27, 75, 0.4) 50%, rgba(15, 23, 42, 0.95) 100%)'
                  : 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(248, 250, 252, 1) 100%)',
              transition: (theme) =>
                theme.transitions.create(['width', 'border-radius', 'background', 'box-shadow'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
            },
          }}
          open
        >
          {drawer(!sidebarOpen)}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: 160,
          py: { xs: 1.5, sm: 2, lg: 1.5 },
          width: { sm: `calc(100% - ${effectiveDrawerWidth}px)` },
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar />
        {children}
        <PushNotificationEnabler />
      </Box>
    </Box>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node,
}

export default MainLayout
