import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const complaintApi = {
  getAll: (params) => {
    return api.get(API_ENDPOINTS.COMPLAINTS, { params })
  },

  getStatistics: (params) => {
    return api.get(API_ENDPOINTS.COMPLAINTS_STATISTICS, { params })
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.COMPLAINT_BY_ID(id))
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.COMPLAINTS, data)
  },

  /** Create complaint with file attachments (FormData). */
  createWithAttachments: (formData) => {
    return api.post(API_ENDPOINTS.COMPLAINTS_WITH_ATTACHMENTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.COMPLAINT_BY_ID(id), data)
  },

  updateStatus: (id, data) => {
    return api.patch(API_ENDPOINTS.COMPLAINT_STATUS(id), data)
  },

  remove: (id) => {
    return api.delete(API_ENDPOINTS.COMPLAINT_BY_ID(id))
  },

  assignStaff: (id, staffId) => {
    return api.patch(API_ENDPOINTS.COMPLAINT_ASSIGN(id), { staff_id: staffId })
  },

  addProgress: (id, data) => {
    return api.post(API_ENDPOINTS.COMPLAINT_PROGRESS(id), data)
  },

  getProgress: (id) => {
    return api.get(API_ENDPOINTS.COMPLAINT_PROGRESS(id))
  },

  escalate: (id, data = {}) => api.post(API_ENDPOINTS.COMPLAINT_ESCALATE(id), data),
}
