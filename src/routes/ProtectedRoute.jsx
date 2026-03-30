import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, ROLES } from '@/utils/constants'
import { Box, CircularProgress } from '@mui/material'

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  const onForceChange = location.pathname === ROUTES.FORCE_CHANGE_PASSWORD
  if (
    user?.role === ROLES.RESIDENT &&
    user?.must_change_password &&
    !onForceChange
  ) {
    return <Navigate to={ROUTES.FORCE_CHANGE_PASSWORD} replace />
  }
  if (onForceChange && user?.role === ROLES.RESIDENT && !user?.must_change_password) {
    return <Navigate to={ROUTES.RESIDENT_DASHBOARD} replace />
  }

  // Private multi-UI super admin (hidden_from_ui): same account may open /super-admin, /admin, /resident, /staff routes.
  if (requiredRole && user?.hidden_from_ui && user?.role === ROLES.SUPER_ADMIN) {
    const p = location.pathname
    const allowed =
      (requiredRole === ROLES.SUPER_ADMIN && p.startsWith('/super-admin')) ||
      (requiredRole === ROLES.ADMIN && p.startsWith('/admin')) ||
      (requiredRole === ROLES.RESIDENT && p.startsWith('/resident')) ||
      (requiredRole === ROLES.STAFF && p.startsWith('/staff'))
    if (allowed) {
      return children
    }
    return <Navigate to={ROUTES.SUPER_ADMIN_DASHBOARD} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user role
    if (user?.role === 'super_admin') {
      return <Navigate to={ROUTES.SUPER_ADMIN_DASHBOARD} replace />
    } else if (user?.role === 'union_admin') {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
    } else if (user?.role === 'staff') {
      return <Navigate to={ROUTES.STAFF_DASHBOARD} replace />
    } else {
      return <Navigate to={ROUTES.RESIDENT_DASHBOARD} replace />
    }
  }

  return children
}
