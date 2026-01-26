import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const financeApi = {
  getAll: (params) => {
    return api.get(API_ENDPOINTS.FINANCE, { params })
  },

  getSummary: (params) => {
    return api.get(API_ENDPOINTS.FINANCE_SUMMARY, { params })
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.FINANCE_BY_ID(id))
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.FINANCE, data)
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.FINANCE_BY_ID(id), data)
  },

  remove: (id) => {
    return api.delete(API_ENDPOINTS.FINANCE_BY_ID(id))
  },
}
