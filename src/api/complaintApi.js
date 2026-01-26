import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const complaintApi = {
  getAll: (params) => {
    return api.get(API_ENDPOINTS.COMPLAINTS, { params })
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.COMPLAINT_BY_ID(id))
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.COMPLAINTS, data)
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
}
