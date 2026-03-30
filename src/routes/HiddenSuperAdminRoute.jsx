import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, ROLES } from '@/utils/constants'

/**
 * Only the private owner account (hidden_from_ui super_admin) may access children.
 */
export default function HiddenSuperAdminRoute({ children }) {
  const { user } = useAuth()
  if (user?.role === ROLES.SUPER_ADMIN && user?.hidden_from_ui) {
    return children
  }
  return <Navigate to={ROUTES.SUPER_ADMIN_DASHBOARD} replace />
}

HiddenSuperAdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
}
