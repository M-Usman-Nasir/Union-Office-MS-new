import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const announcementApi = {
  getAll: (params) => {
    return api.get(API_ENDPOINTS.ANNOUNCEMENTS, { params })
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.ANNOUNCEMENT_BY_ID(id))
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.ANNOUNCEMENTS, data)
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.ANNOUNCEMENT_BY_ID(id), data)
  },

  remove: (id) => {
    return api.delete(API_ENDPOINTS.ANNOUNCEMENT_BY_ID(id))
  },
}
