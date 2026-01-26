import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import MainLayout from '@/components/layout/MainLayout'
import { ROLES, ROUTES } from '@/utils/constants'

// Import pages
import LoginPage from '@/pages/auth/LoginPage'
import SuperAdminDashboard from '@/pages/super-admin/Dashboard'
import AdminDashboard from '@/pages/admin/Dashboard'
import ResidentDashboard from '@/pages/resident/Dashboard'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      
      {/* Super Admin Routes */}
      <Route
        path="/super-admin/*"
        element={
          <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<SuperAdminDashboard />} />
                <Route path="societies" element={<div>Societies Management</div>} />
                <Route path="blocks" element={<div>Blocks Management</div>} />
                <Route path="floors" element={<div>Floors Management</div>} />
                <Route path="units" element={<div>Units Management</div>} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole={ROLES.ADMIN}>
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="residents" element={<div>Residents Management</div>} />
                <Route path="maintenance" element={<div>Maintenance Management</div>} />
                <Route path="finance" element={<div>Finance Management</div>} />
                <Route path="defaulters" element={<div>Defaulters Management</div>} />
                <Route path="complaints" element={<div>Complaints Management</div>} />
                <Route path="announcements" element={<div>Announcements Management</div>} />
                <Route path="settings" element={<div>Settings</div>} />
                <Route path="users" element={<div>Users Management</div>} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Resident Routes */}
      <Route
        path="/resident/*"
        element={
          <ProtectedRoute requiredRole={ROLES.RESIDENT}>
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<ResidentDashboard />} />
                <Route path="complaints" element={<div>My Complaints</div>} />
                <Route path="maintenance" element={<div>My Maintenance</div>} />
                <Route path="profile" element={<div>My Profile</div>} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect - based on role */}
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  )
}
