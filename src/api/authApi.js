import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const authApi = {
  login: (credentials) => {
    return api.post(API_ENDPOINTS.LOGIN, credentials)
  },

  logout: () => {
    return api.post(API_ENDPOINTS.LOGOUT)
  },

  getMe: () => {
    return api.get(API_ENDPOINTS.ME)
  },

  refreshToken: () => {
    return api.post(API_ENDPOINTS.REFRESH)
  },

  register: (userData) => {
    return api.post(API_ENDPOINTS.REGISTER, userData)
  },
}
