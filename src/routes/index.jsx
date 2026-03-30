import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import MainLayout from '@/components/layout/MainLayout'
import { ROLES, ROUTES } from '@/utils/constants'

// Import pages
import LoginPage from '@/pages/auth/LoginPage'
import ForceChangePasswordPage from '@/pages/auth/ForceChangePasswordPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import SuperAdminDashboard from '@/pages/super-admin/Dashboard'
import Leads from '@/pages/super-admin/Leads'
import Blocks from '@/pages/super-admin/Blocks'
import Floors from '@/pages/super-admin/Floors'
import Units from '@/pages/super-admin/Units'
import GlobalReports from '@/pages/super-admin/GlobalReports'
import SuperAdminProfile from '@/pages/super-admin/Profile'
import Admins from '@/pages/super-admin/Admins'
import SuperAdminSettings from '@/pages/super-admin/Settings'
import SuperAdminInvoices from '@/pages/super-admin/Invoices'
import AuditLogs from '@/pages/super-admin/AuditLogs'
import SubscriptionManagement from '@/pages/super-admin/SubscriptionManagement'
import ViewDetailsPage from '@/pages/super-admin/ViewDetailsPage'
import Escalations from '@/pages/super-admin/Escalations'
import ResetBackup from '@/pages/super-admin/ResetBackup'
import HiddenSuperAdminRoute from '@/routes/HiddenSuperAdminRoute'
import Users from '@/pages/admin/Users'
import Employees from '@/pages/admin/Employees'
import AdminDashboard from '@/pages/admin/Dashboard'
import Residents from '@/pages/admin/Residents'
import ResidentDetails from '@/pages/admin/ResidentDetails'
import Maintenance from '@/pages/admin/Maintenance'
import Finance from '@/pages/admin/Finance'
import Complaints from '@/pages/admin/Complaints'
import Defaulters from '@/pages/admin/Defaulters'
import PreviousDefaulters from '@/pages/admin/PreviousDefaulters'
import Announcements from '@/pages/admin/Announcements'
import Settings from '@/pages/admin/Settings'
import AdminProfile from '@/pages/admin/Profile'
import Messages from '@/pages/admin/Messages'
import UnionMembers from '@/pages/admin/UnionMembers'
import UnitClaims from '@/pages/admin/UnitClaims'
import ResidentDashboard from '@/pages/resident/Dashboard'
import ResidentComplaints from '@/pages/resident/Complaints'
import ResidentMaintenance from '@/pages/resident/Maintenance'
import ResidentProfile from '@/pages/resident/Profile'
import UnionInfo from '@/pages/resident/UnionInfo'
import ResidentUnionMembers from '@/pages/resident/UnionMembers'
import ResidentFinancialSummary from '@/pages/resident/FinancialSummary'
import StaffDashboard from '@/pages/staff/Dashboard'
import StaffComplaints from '@/pages/staff/Complaints'
import StaffPayments from '@/pages/staff/Payments'
import Offline from '@/pages/error/Offline'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      <Route
        path={ROUTES.FORCE_CHANGE_PASSWORD}
        element={
          <ProtectedRoute>
            <ForceChangePasswordPage />
          </ProtectedRoute>
        }
      />
      <Route path="/offline" element={<Offline />} />
      
      {/* Super Admin Routes */}
      <Route
        path="/super-admin/*"
        element={
          <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<SuperAdminDashboard />} />
                <Route path="societies" element={<Leads />} />
                <Route path="blocks" element={<Blocks />} />
                <Route path="floors" element={<Floors />} />
                <Route path="units" element={<Units />} />
                <Route path="users" element={<Users />} />
                <Route path="admins" element={<Admins />} />
                <Route path="subscription-management" element={<SubscriptionManagement />} />
                <Route path="view-details" element={<ViewDetailsPage />} />
                <Route path="invoices" element={<SuperAdminInvoices />} />
                <Route path="settings" element={<SuperAdminSettings />} />
                <Route path="profile" element={<SuperAdminProfile />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route
                  path="reset-backup"
                  element={
                    <HiddenSuperAdminRoute>
                      <ResetBackup />
                    </HiddenSuperAdminRoute>
                  }
                />
                <Route path="escalations" element={<Escalations />} />
                <Route path="messages" element={<Messages />} />
                <Route path="reports" element={<GlobalReports />} />
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
                <Route path="residents/:id" element={<ResidentDetails />} />
                <Route path="residents" element={<Residents />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="finance" element={<Finance />} />
                <Route path="defaulters" element={<Defaulters />} />
                <Route path="previous-defaulters" element={<PreviousDefaulters />} />
                <Route path="complaints" element={<Complaints />} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="messages" element={<Messages />} />
                <Route path="settings" element={<Settings />} />
                <Route path="users" element={<Users />} />
                <Route path="employees" element={<Employees />} />
                <Route path="union-members" element={<UnionMembers />} />
                <Route path="unit-claims" element={<UnitClaims />} />
                <Route path="profile" element={<AdminProfile />} />
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
                <Route path="messages" element={<Messages />} />
                <Route path="complaints" element={<ResidentComplaints />} />
                <Route path="maintenance" element={<ResidentMaintenance />} />
                <Route path="union-info" element={<UnionInfo />} />
                <Route path="union-members" element={<ResidentUnionMembers />} />
                <Route path="profile" element={<ResidentProfile />} />
                <Route path="financial-summary" element={<ResidentFinancialSummary />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Staff Routes */}
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute requiredRole={ROLES.STAFF}>
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<StaffDashboard />} />
                <Route path="complaints" element={<StaffComplaints />} />
                <Route path="payments" element={<StaffPayments />} />
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
