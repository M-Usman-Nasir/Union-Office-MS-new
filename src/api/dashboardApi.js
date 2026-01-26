import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const dashboardApi = {
  // Finance Summary
  getFinanceSummary: () => {
    return api.get(API_ENDPOINTS.FINANCE_SUMMARY)
  },

  // Defaulters Statistics
  getDefaulterStatistics: () => {
    return api.get(API_ENDPOINTS.DEFAULTERS_STATISTICS)
  },

  // Recent Complaints
  getRecentComplaints: (limit = 5) => {
    return api.get(`${API_ENDPOINTS.COMPLAINTS}?limit=${limit}&page=1`)
  },

  // Recent Maintenance
  getRecentMaintenance: (limit = 5) => {
    return api.get(`${API_ENDPOINTS.MAINTENANCE}?limit=${limit}&page=1`)
  },

  // Recent Announcements
  getRecentAnnouncements: (limit = 5) => {
    return api.get(`${API_ENDPOINTS.ANNOUNCEMENTS}?limit=${limit}&page=1`)
  },

  // Residents Count
  getResidentsCount: () => {
    return api.get(`${API_ENDPOINTS.RESIDENTS}?limit=1&page=1`)
  },
}
