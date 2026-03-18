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

  updateProfile: (data, file = null) => {
    // If file is provided, use FormData; otherwise use regular JSON
    if (file) {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.contact_number) formData.append('contact_number', data.contact_number)
      if (data.emergency_contact) formData.append('emergency_contact', data.emergency_contact)
      if (data.cnic) formData.append('cnic', data.cnic)
      if (file) formData.append('profile_image', file)
      if (data.remove_image) formData.append('remove_image', data.remove_image)
      
      return api.put(API_ENDPOINTS.ME, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } else {
      return api.put(API_ENDPOINTS.ME, data)
    }
  },

  refreshToken: () => {
    return api.post(API_ENDPOINTS.REFRESH)
  },

  register: (userData) => {
    return api.post(API_ENDPOINTS.REGISTER, userData)
  },

  changePasswordFirstLogin: ({ current_password, new_password }) => {
    return api.post(API_ENDPOINTS.CHANGE_PASSWORD_FIRST_LOGIN, {
      current_password,
      new_password,
    })
  },
}
