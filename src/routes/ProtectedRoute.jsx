import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/utils/constants'
import { Box, CircularProgress } from '@mui/material'

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth()

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

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user role
    if (user?.role === 'super_admin') {
      return <Navigate to={ROUTES.SUPER_ADMIN_DASHBOARD} replace />
    } else if (user?.role === 'union_admin') {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
    } else {
      return <Navigate to={ROUTES.RESIDENT_DASHBOARD} replace />
    }
  }

  return children
}
