import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const residentApi = {
  getAll: (params) => {
    return api.get(API_ENDPOINTS.RESIDENTS, { params })
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.RESIDENT_BY_ID(id))
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.RESIDENTS, data)
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.RESIDENT_BY_ID(id), data)
  },

  remove: (id) => {
    return api.delete(API_ENDPOINTS.RESIDENT_BY_ID(id))
  },
}
