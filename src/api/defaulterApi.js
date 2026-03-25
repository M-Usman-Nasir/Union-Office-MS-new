import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const defaulterApi = {
  getAll: (params) => {
    return api.get(API_ENDPOINTS.DEFAULTERS, { params })
  },

  getPreviousYear: (params) => {
    return api.get(API_ENDPOINTS.DEFAULTERS_PREVIOUS_YEARS, { params })
  },

  exportPreviousYearCsv: (params) => {
    return api.get(API_ENDPOINTS.DEFAULTERS_PREVIOUS_YEARS_EXPORT, {
      params,
      responseType: 'blob',
    })
  },

  getStatistics: (params) => {
    return api.get(API_ENDPOINTS.DEFAULTERS_STATISTICS, { params })
  },

  /** Sync defaulters table from unpaid maintenance. Optional society_id for super_admin. */
  syncFromMaintenance: (params) => {
    return api.post(API_ENDPOINTS.DEFAULTERS_SYNC, {}, { params })
  },

  /** Export defaulters as CSV. Returns blob. */
  exportCsv: (params) => {
    return api.get(API_ENDPOINTS.DEFAULTERS_EXPORT, {
      params,
      responseType: 'blob',
    })
  },

  updateStatus: (id, data) => {
    return api.patch(API_ENDPOINTS.DEFAULTER_STATUS(id), data)
  },
}
