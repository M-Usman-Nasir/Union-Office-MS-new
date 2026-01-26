// Application Constants

// User Roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'union_admin',
  RESIDENT: 'resident',
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
  
  // Societies
  SOCIETIES: '/societies',
  SOCIETY_BY_ID: (id) => `/societies/${id}`,
  
  // Residents
  RESIDENTS: '/residents',
  RESIDENT_BY_ID: (id) => `/residents/${id}`,
  
  // Maintenance
  MAINTENANCE: '/maintenance',
  MAINTENANCE_BY_ID: (id) => `/maintenance/${id}`,
  MAINTENANCE_PAYMENT: (id) => `/maintenance/${id}/payment`,
  
  // Finance
  FINANCE: '/finance',
  FINANCE_SUMMARY: '/finance/summary',
  FINANCE_BY_ID: (id) => `/finance/${id}`,
  
  // Complaints
  COMPLAINTS: '/complaints',
  COMPLAINT_BY_ID: (id) => `/complaints/${id}`,
  COMPLAINT_STATUS: (id) => `/complaints/${id}/status`,
  
  // Defaulters
  DEFAULTERS: '/defaulters',
  DEFAULTERS_STATISTICS: '/defaulters/statistics',
  DEFAULTER_STATUS: (id) => `/defaulters/${id}/status`,
  
  // Announcements
  ANNOUNCEMENTS: '/announcements',
  ANNOUNCEMENT_BY_ID: (id) => `/announcements/${id}`,
  
  // Properties
  BLOCKS: '/properties/blocks',
  FLOORS: '/properties/floors',
  UNITS: '/properties/units',
  UNIT_BY_ID: (id) => `/properties/units/${id}`,
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  USER_PASSWORD: (id) => `/users/${id}/password`,
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
  
  // Resident
  RESIDENT_DASHBOARD: '/resident/dashboard',
  RESIDENT_COMPLAINTS: '/resident/complaints',
  RESIDENT_MAINTENANCE: '/resident/maintenance',
  RESIDENT_PROFILE: '/resident/profile',
  RESIDENT_UNION_INFO: '/resident/union-info',
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
