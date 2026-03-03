import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const apartmentApi = {
  getCities: () => api.get(API_ENDPOINTS.SOCIETIES_CITIES),
  getAreas: (city) => api.get(API_ENDPOINTS.SOCIETIES_AREAS, { params: city ? { city } : {} }),
  getAll: (params) => {
    return api.get(API_ENDPOINTS.SOCIETIES, { params })
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.SOCIETY_BY_ID(id))
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.SOCIETIES, data)
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.SOCIETY_BY_ID(id), data)
  },

  remove: (id) => {
    return api.delete(API_ENDPOINTS.SOCIETY_BY_ID(id))
  },

  approve: (id, data = {}) => api.patch(API_ENDPOINTS.SOCIETY_APPROVE(id), data),
  reject: (id, data = {}) => api.patch(API_ENDPOINTS.SOCIETY_REJECT(id), data),
  getFeatures: (id) => api.get(API_ENDPOINTS.SOCIETY_FEATURES(id)),
  updateFeatures: (id, features) => api.put(API_ENDPOINTS.SOCIETY_FEATURES(id), { features }),
}
