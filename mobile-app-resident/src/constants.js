export const ROLES = {
  RESIDENT: 'resident',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};

// Paths only; axios client uses baseURL from EXPO_PUBLIC_API_URL
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  COMPLAINTS: '/complaints',
  COMPLAINT_BY_ID: (id) => `/complaints/${id}`,
  COMPLAINTS_WITH_ATTACHMENTS: '/complaints/with-attachments',
  COMPLAINT_PROGRESS: (id) => `/complaints/${id}/progress`,
  MAINTENANCE: '/maintenance',
  MAINTENANCE_BY_ID: (id) => `/maintenance/${id}`,
  FINANCE_PUBLIC_SUMMARY: '/finance/reports/public-summary',
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
