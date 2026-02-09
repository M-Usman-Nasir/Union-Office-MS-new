import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const defaulterApi = {
  getAll: (params) => {
    return api.get(API_ENDPOINTS.DEFAULTERS, { params })
  },

  getStatistics: (params) => {
    return api.get(API_ENDPOINTS.DEFAULTERS_STATISTICS, { params })
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
