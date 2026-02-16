import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const maintenanceApi = {
  getAll: (params) => {
    return api.get(API_ENDPOINTS.MAINTENANCE, { params })
  },

  getYearlyLedger: (params) => {
    return api.get(API_ENDPOINTS.MAINTENANCE_YEARLY_LEDGER, { params })
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.MAINTENANCE_BY_ID(id))
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.MAINTENANCE, data)
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.MAINTENANCE_BY_ID(id), data)
  },

  recordPayment: (id, data) => {
    return api.post(API_ENDPOINTS.MAINTENANCE_PAYMENT(id), data)
  },

  remove: (id) => {
    return api.delete(API_ENDPOINTS.MAINTENANCE_BY_ID(id))
  },

  generateMonthlyDues: (data) => {
    return api.post(API_ENDPOINTS.MAINTENANCE_GENERATE_DUES, data || {})
  },

  generateForScope: (data) => {
    return api.post(API_ENDPOINTS.MAINTENANCE_GENERATE_FOR_SCOPE, data)
  },
}
