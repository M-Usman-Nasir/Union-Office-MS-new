// Application Constants

// User Roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'union_admin',
  RESIDENT: 'resident',
  STAFF: 'staff',
}

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIALLY_PAID: 'partially_paid',
}

// Complaint Status
export const COMPLAINT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
}

// Complaint Priority
export const COMPLAINT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
}

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  REGISTER: '/auth/register',
  
  // Apartments (societies)
  SOCIETIES: '/societies',
  SOCIETY_BY_ID: (id) => `/societies/${id}`,
  
  // Residents
  RESIDENTS: '/residents',
  RESIDENT_BY_ID: (id) => `/residents/${id}`,
  
  // Maintenance
  MAINTENANCE: '/maintenance',
  MAINTENANCE_YEARLY_LEDGER: '/maintenance/yearly-ledger',
  MAINTENANCE_BY_ID: (id) => `/maintenance/${id}`,
  MAINTENANCE_PAYMENT: (id) => `/maintenance/${id}/payment`,
  MAINTENANCE_GENERATE_DUES: '/maintenance/generate-monthly-dues',
  MAINTENANCE_GENERATE_FOR_SCOPE: '/maintenance/generate-for-scope',
  
  // Finance
  FINANCE: '/finance',
  FINANCE_SUMMARY: '/finance/summary',
  FINANCE_BY_ID: (id) => `/finance/${id}`,
  FINANCE_REPORTS_MONTHLY: '/finance/reports/monthly',
  FINANCE_REPORTS_YEARLY: '/finance/reports/yearly',
  FINANCE_PUBLIC_SUMMARY: '/finance/reports/public-summary',
  
  // Complaints
  COMPLAINTS: '/complaints',
  COMPLAINTS_WITH_ATTACHMENTS: '/complaints/with-attachments',
  COMPLAINT_BY_ID: (id) => `/complaints/${id}`,
  COMPLAINT_STATUS: (id) => `/complaints/${id}/status`,
  COMPLAINT_ASSIGN: (id) => `/complaints/${id}/assign`,
  COMPLAINT_PROGRESS: (id) => `/complaints/${id}/progress`,
  
  // Defaulters
  DEFAULTERS: '/defaulters',
  DEFAULTERS_STATISTICS: '/defaulters/statistics',
  DEFAULTERS_EXPORT: '/defaulters/export',
  DEFAULTER_STATUS: (id) => `/defaulters/${id}/status`,
  
  // Announcements
  ANNOUNCEMENTS: '/announcements',
  ANNOUNCEMENT_BY_ID: (id) => `/announcements/${id}`,
  
  // Properties
  BLOCKS: '/properties/blocks',
  BLOCK_NEXT_FLOOR: (id) => `/properties/blocks/${id}/next-floor`,
  FLOORS: '/properties/floors',
  FLOOR_BY_ID: (id) => `/properties/floors/${id}`,
  FLOOR_ADD_UNITS: (id) => `/properties/floors/${id}/units`,
  UNITS: '/properties/units',
  UNIT_BY_ID: (id) => `/properties/units/${id}`,
  
  // Users
  USERS: '/users',
  USER_CHECK_EMAIL: '/users/check-email',
  USER_BY_ID: (id) => `/users/${id}`,
  USER_PASSWORD: (id) => `/users/${id}/password`,
  
  // Staff
  STAFF_COMPLAINTS: '/staff/complaints',
  STAFF_PAYMENTS: '/staff/payments',
  STAFF_PAYMENT_UPDATE: (id) => `/staff/payments/${id}`,
  
  // Settings
  SETTINGS: (societyId) => `/settings/${societyId}`,
  MAINTENANCE_CONFIG: (societyId) => `/settings/${societyId}/maintenance-config`,
  
  // Messages (admin-resident chat)
  MESSAGES_CONVERSATIONS: '/messages/conversations',
  MESSAGES_PARTNERS: '/messages/partners',
  MESSAGES_WITH: (userId) => `/messages/with/${userId}`,
  MESSAGES_SEND: '/messages',

  // Notifications (push + vapid)
  NOTIFICATIONS_VAPID_PUBLIC: '/notifications/vapid-public',
  NOTIFICATIONS_SUBSCRIBE: '/notifications/subscribe',
  
  // Super Admin
  SUPER_ADMIN_REPORTS_GLOBAL: '/super-admin/reports/global',
  SUPER_ADMIN_SUBSCRIPTION_PLANS: '/super-admin/subscription/plans',
  SUPER_ADMIN_SUBSCRIPTION_ADMINS: '/super-admin/subscription/admins',
  SUPER_ADMIN_SUBSCRIPTION: '/super-admin/subscription',
  SUPER_ADMIN_SUBSCRIPTION_BY_ID: (id) => `/super-admin/subscription/${id}`,
  // Societies cascading (City → Area → Apartment)
  SOCIETIES_CITIES: '/societies/cities',
  SOCIETIES_AREAS: '/societies/areas',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
}

// Route Paths
export const ROUTES = {
  // Auth
  LOGIN: '/login',
  LOGOUT: '/logout',
  
  // Super Admin
  SUPER_ADMIN_DASHBOARD: '/super-admin/dashboard',
  SUPER_ADMIN_SOCIETIES: '/super-admin/societies',
  SUPER_ADMIN_BLOCKS: '/super-admin/blocks',
  SUPER_ADMIN_FLOORS: '/super-admin/floors',
  SUPER_ADMIN_UNITS: '/super-admin/units',
  SUPER_ADMIN_USERS: '/super-admin/users',
  SUPER_ADMIN_ADMINS: '/super-admin/admins',
  SUPER_ADMIN_PROFILE: '/super-admin/profile',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_RESIDENTS: '/admin/residents',
  ADMIN_MAINTENANCE: '/admin/maintenance',
  ADMIN_FINANCE: '/admin/finance',
  ADMIN_DEFAULTERS: '/admin/defaulters',
  ADMIN_COMPLAINTS: '/admin/complaints',
  ADMIN_ANNOUNCEMENTS: '/admin/announcements',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_USERS: '/admin/users',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_MESSAGES: '/admin/messages',
  ADMIN_UNION_MEMBERS: '/admin/union-members',
  
  // Resident
  RESIDENT_DASHBOARD: '/resident/dashboard',
  RESIDENT_MESSAGES: '/resident/messages',
  RESIDENT_COMPLAINTS: '/resident/complaints',
  RESIDENT_MAINTENANCE: '/resident/maintenance',
  RESIDENT_PROFILE: '/resident/profile',
  RESIDENT_UNION_INFO: '/resident/union-info',
  RESIDENT_FINANCIAL_SUMMARY: '/resident/financial-summary',
  
  // Staff
  STAFF_DASHBOARD: '/staff/dashboard',
  STAFF_COMPLAINTS: '/staff/complaints',
  STAFF_PAYMENTS: '/staff/payments',
  
  // Super Admin
  SUPER_ADMIN_REPORTS: '/super-admin/reports',
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
}

// Income Types
export const INCOME_TYPES = {
  FINES: 'fines',
  ADDITIONAL_CHARGES: 'additional_charges',
  OTHER_INCOME: 'other_income',
}

// Income Type Labels
export const INCOME_TYPE_LABELS = {
  [INCOME_TYPES.FINES]: 'Fines',
  [INCOME_TYPES.ADDITIONAL_CHARGES]: 'Additional Charges',
  [INCOME_TYPES.OTHER_INCOME]: 'Other Income',
}

// Payment Modes
export const PAYMENT_MODES = {
  CASH: 'Cash',
  ONLINE: 'Online',
  BANK_TRANSFER: 'Bank Transfer',
  CHECK: 'Check',
  CARD: 'Card',
  MOBILE_BANKING: 'Mobile Banking',
  OTHER: 'Other',
}

// Payment mode options for dropdowns (value + label)
export const PAYMENT_MODE_OPTIONS = Object.entries(PAYMENT_MODES).map(([key, value]) => ({
  value,
  label: value,
}))

// Month options (1–12) for finance/reports
export const MONTH_OPTIONS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
  { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
  { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
]

// Finance transaction status
export const FINANCE_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
}

export const FINANCE_STATUS_OPTIONS = [
  { value: FINANCE_STATUS.PAID, label: 'Paid' },
  { value: FINANCE_STATUS.PENDING, label: 'Pending' },
  { value: FINANCE_STATUS.CANCELLED, label: 'Cancelled' },
]

// Helper: year options for dropdown (e.g. last 5 years, current + 1)
export const getFinanceYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = currentYear - 5; y <= currentYear + 1; y++) years.push({ value: y, label: String(y) })
  return years.reverse()
}

// Helper function to get base URL for static files (without /api)
export const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  // Remove /api from the end if present
  return apiUrl.replace(/\/api\/?$/, '')
}

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  // If it's already a base64 data URL, return as is
  if (imagePath.startsWith('data:image/')) {
    return imagePath
  }
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  // Otherwise, prepend base URL
  return `${getBaseUrl()}${imagePath}`
}
