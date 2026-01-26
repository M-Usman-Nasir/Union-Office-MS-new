import { useState } from 'react'
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
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import PaymentIcon from '@mui/icons-material/Payment'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import WarningIcon from '@mui/icons-material/Warning'
import FeedbackIcon from '@mui/icons-material/Feedback'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import SettingsIcon from '@mui/icons-material/Settings'
import ApartmentIcon from '@mui/icons-material/Apartment'
import LogoutIcon from '@mui/icons-material/Logout'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { ROUTES, ROLES } from '@/utils/constants'

const drawerWidth = 240

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, logout } = useAuth()
  const { mode, toggleMode } = useTheme()
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
        { text: 'Societies', icon: <ApartmentIcon />, path: ROUTES.SUPER_ADMIN_SOCIETIES },
        { text: 'Blocks', icon: <ApartmentIcon />, path: ROUTES.SUPER_ADMIN_BLOCKS },
        { text: 'Floors', icon: <ApartmentIcon />, path: ROUTES.SUPER_ADMIN_FLOORS },
        { text: 'Units', icon: <ApartmentIcon />, path: ROUTES.SUPER_ADMIN_UNITS },
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
      ]
    } else {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.RESIDENT_DASHBOARD },
        { text: 'Complaints', icon: <FeedbackIcon />, path: ROUTES.RESIDENT_COMPLAINTS },
        { text: 'Maintenance', icon: <PaymentIcon />, path: ROUTES.RESIDENT_MAINTENANCE },
        { text: 'Union Info', icon: <ApartmentIcon />, path: ROUTES.RESIDENT_UNION_INFO },
        { text: 'Profile', icon: <PeopleIcon />, path: ROUTES.RESIDENT_PROFILE },
      ]
    }
  }

  const menuItems = getMenuItems()

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Homeland Union
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
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
            <Avatar sx={{ width: 32, height: 32 }}>
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
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}

export default MainLayout
