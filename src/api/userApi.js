import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const userApi = {
  getAll: (params) => {
    return api.get(API_ENDPOINTS.USERS, { params })
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.USER_BY_ID(id))
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.REGISTER, data)
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.USER_BY_ID(id), data)
  },

  updatePassword: (id, data) => {
    return api.put(API_ENDPOINTS.USER_PASSWORD(id), data)
  },

  remove: (id) => {
    return api.delete(API_ENDPOINTS.USER_BY_ID(id))
  },
}
