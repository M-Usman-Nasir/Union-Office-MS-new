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

  uploadReceipt: (maintenanceId, formData) => {
    return api.post(API_ENDPOINTS.MAINTENANCE_UPLOAD_RECEIPT(maintenanceId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  submitPaymentProof: (maintenanceId, formData) => {
    return api.post(API_ENDPOINTS.MAINTENANCE_SUBMIT_PAYMENT_PROOF(maintenanceId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getMyPaymentRequests: () => api.get(API_ENDPOINTS.MAINTENANCE_PAYMENT_REQUESTS_MINE),

  getPaymentRequests: (params) => api.get(API_ENDPOINTS.MAINTENANCE_PAYMENT_REQUESTS, { params }),

  approvePaymentRequest: (requestId) =>
    api.post(API_ENDPOINTS.MAINTENANCE_PAYMENT_REQUEST_APPROVE(requestId)),

  rejectPaymentRequest: (requestId, data) =>
    api.post(API_ENDPOINTS.MAINTENANCE_PAYMENT_REQUEST_REJECT(requestId), data),

  remove: (id) => {
    return api.delete(API_ENDPOINTS.MAINTENANCE_BY_ID(id))
  },

  generateMonthlyDues: (data) => {
    return api.post(API_ENDPOINTS.MAINTENANCE_GENERATE_DUES, data || {})
  },

  generateForScope: (data) => {
    return api.post(API_ENDPOINTS.MAINTENANCE_GENERATE_FOR_SCOPE, data)
  },

  applyBaseForYear: (data) => {
    return api.post(API_ENDPOINTS.MAINTENANCE_APPLY_BASE_YEAR, data)
  },

  createForAllUnits: (data) => {
    return api.post(API_ENDPOINTS.MAINTENANCE_CREATE_FOR_ALL_UNITS, data)
  },
}
