import { useState } from 'react'
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
import ApartmentIcon from '@mui/icons-material/Apartment'
import LogoutIcon from '@mui/icons-material/Logout'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme as useAppTheme } from '@/contexts/ThemeContext'
import { ROUTES, ROLES, getImageUrl } from '@/utils/constants'
import userRound from '@/assets/images/users/user-round.svg'
import PushNotificationEnabler from '@/components/notifications/PushNotificationEnabler'

const sidebarLogo = '/icons/mob_Logo.png'
const drawerWidth = 240
const drawerWidthCollapsed = 64

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const effectiveDrawerWidth = sidebarOpen ? drawerWidth : drawerWidthCollapsed
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const { user, logout } = useAuth()
  const { mode, toggleMode } = useAppTheme()
  const navigate = useNavigate()
  const location = useLocation()

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
    await logout()
    navigate(ROUTES.LOGIN)
  }

  // Menu items based on role
  const getMenuItems = () => {
    if (user?.role === ROLES.SUPER_ADMIN) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.SUPER_ADMIN_DASHBOARD },
        { text: 'Apartments', icon: <ApartmentIcon />, path: ROUTES.SUPER_ADMIN_SOCIETIES },
        { text: 'Blocks', icon: <ApartmentIcon />, path: ROUTES.SUPER_ADMIN_BLOCKS },
        { text: 'Floors', icon: <ApartmentIcon />, path: ROUTES.SUPER_ADMIN_FLOORS },
        { text: 'Units', icon: <ApartmentIcon />, path: ROUTES.SUPER_ADMIN_UNITS },
        { text: 'Users', icon: <PeopleIcon />, path: ROUTES.SUPER_ADMIN_USERS },
        { text: 'Global Reports', icon: <AssessmentIcon />, path: ROUTES.SUPER_ADMIN_REPORTS },
        { text: 'Profile', icon: <AccountCircleIcon />, path: ROUTES.SUPER_ADMIN_PROFILE },
      ]
    } else if (user?.role === ROLES.ADMIN) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.ADMIN_DASHBOARD },
        { text: 'Residents', icon: <PeopleIcon />, path: ROUTES.ADMIN_RESIDENTS },
        { text: 'Maintenance', icon: <PaymentIcon />, path: ROUTES.ADMIN_MAINTENANCE },
        { text: 'Finance', icon: <AccountBalanceIcon />, path: ROUTES.ADMIN_FINANCE },
        { text: 'Defaulters', icon: <WarningIcon />, path: ROUTES.ADMIN_DEFAULTERS },
        { text: 'Complaints', icon: <FeedbackIcon />, path: ROUTES.ADMIN_COMPLAINTS },
        { text: 'Announcements', icon: <AnnouncementIcon />, path: ROUTES.ADMIN_ANNOUNCEMENTS },
        { text: 'Users', icon: <PeopleIcon />, path: ROUTES.ADMIN_USERS },
        { text: 'Settings', icon: <SettingsIcon />, path: ROUTES.ADMIN_SETTINGS },
        { text: 'Profile', icon: <AccountCircleIcon />, path: ROUTES.ADMIN_PROFILE },
      ]
    } else if (user?.role === ROLES.STAFF) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.STAFF_DASHBOARD },
        { text: 'My Complaints', icon: <FeedbackIcon />, path: ROUTES.STAFF_COMPLAINTS },
        { text: 'Payment Updates', icon: <PaymentIcon />, path: ROUTES.STAFF_PAYMENTS },
      ]
    } else {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.RESIDENT_DASHBOARD },
        { text: 'Complaints', icon: <FeedbackIcon />, path: ROUTES.RESIDENT_COMPLAINTS },
        { text: 'Maintenance', icon: <PaymentIcon />, path: ROUTES.RESIDENT_MAINTENANCE },
        { text: 'Financial Summary', icon: <AssessmentIcon />, path: ROUTES.RESIDENT_FINANCIAL_SUMMARY },
        { text: 'Union Info', icon: <ApartmentIcon />, path: ROUTES.RESIDENT_UNION_INFO },
        { text: 'Profile', icon: <PeopleIcon />, path: ROUTES.RESIDENT_PROFILE },
      ]
    }
  }

  const menuItems = getMenuItems()

  const drawer = (collapsed = false) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar
        sx={{
          gap: 1.5,
          minHeight: { xs: 56, sm: 64 },
          justifyContent: collapsed ? 'center' : 'flex-start',
          px: collapsed ? 0 : 2,
        }}
      >
        <Box
          component="img"
          src={sidebarLogo}
          alt="Homeland Union"
          sx={{ height: 36, width: 'auto', display: 'block', flexShrink: 0 }}
        />
        {!collapsed && (
          <Typography variant="h6" noWrap component="div">
            Homeland Union
          </Typography>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, minHeight: 0, overflow: 'auto' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                justifyContent: collapsed ? 'center' : 'initial',
                px: collapsed ? 0 : 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 56,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 1, flexShrink: 0, display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end' }}>
        <IconButton
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          onClick={() => setSidebarOpen((o) => !o)}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
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
            sx={{ mr: 2, display: { xs: 'block', sm: sidebarOpen ? 'none' : 'block' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          <IconButton onClick={toggleMode} color="inherit" sx={{ mr: 1 }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton onClick={handleMenuClick}>
            <Avatar
              src={getImageUrl(user?.profile_image) || userRound}
              sx={{ width: 32, height: 32 }}
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
              <Typography variant="body2">{user?.name || user?.email}</Typography>
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
              transition: (theme) =>
                theme.transitions.create('width', {
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
          p: 3,
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
