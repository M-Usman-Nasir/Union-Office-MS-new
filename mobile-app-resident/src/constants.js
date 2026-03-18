export const ROLES = {
  RESIDENT: 'resident',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  LAST_EMAIL: 'lastEmail',
  LAST_PASSWORD: 'lastPassword',
};

// Paths only; axios client uses baseURL from EXPO_PUBLIC_API_URL
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  CHANGE_PASSWORD_FIRST_LOGIN: '/auth/change-password-first-login',
  REGISTER_RESIDENT: '/auth/register/resident',
  COMPLAINTS: '/complaints',
  COMPLAINT_BY_ID: (id) => `/complaints/${id}`,
  COMPLAINTS_WITH_ATTACHMENTS: '/complaints/with-attachments',
  COMPLAINT_PROGRESS: (id) => `/complaints/${id}/progress`,
  MAINTENANCE: '/maintenance',
  MAINTENANCE_BY_ID: (id) => `/maintenance/${id}`,
  MAINTENANCE_SUBMIT_PAYMENT_PROOF: (id) => `/maintenance/${id}/submit-payment-proof`,
  MAINTENANCE_PAYMENT_REQUESTS_MINE: '/maintenance/payment-requests/mine',
  FINANCE_PUBLIC_SUMMARY: '/finance/reports/public-summary',
  FINANCE_REPORTS_YEARLY: '/finance/reports/yearly',
  ANNOUNCEMENTS: '/announcements',
  SETTINGS: (societyId) => `/settings/${societyId}`,
  SOCIETIES: '/societies',
  SOCIETY_BY_ID: (id) => `/societies/${id}`,
  PROPERTIES_BLOCKS: '/properties/blocks',
  PROPERTIES_UNITS: '/properties/units',
  DEFAULTERS: '/defaulters',
  MESSAGES_CONVERSATIONS: '/messages/conversations',
  MESSAGES_PARTNERS: '/messages/partners',
  MESSAGES_WITH: (userId) => `/messages/with/${userId}`,
  MESSAGES_SEND: '/messages',
  UNION_MEMBERS: '/union-members',
  UNION_MEMBER_BY_ID: (id) => `/union-members/${id}`,
  RESIDENTS: '/residents',
  RESIDENT_BY_ID: (id) => `/residents/${id}`,
};
