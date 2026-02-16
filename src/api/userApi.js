import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const userApi = {
  getAll: (params) => {
    return api.get(API_ENDPOINTS.USERS, { params })
  },
  /** Union admins not assigned to any apartment (super_admin only) */
  getUnassignedUnionAdmins: (params = {}) => {
    return api.get(API_ENDPOINTS.USERS, {
      params: { role: 'union_admin', unassigned_only: 'true', limit: 200, ...params },
    })
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.USER_BY_ID(id))
  },

  /** Check if email exists in users table. excludeUserId = current user id when editing. */
  checkEmail: (email, excludeUserId = null) => {
    const params = { email: (email || '').trim() }
    if (excludeUserId != null) params.exclude_id = excludeUserId
    return api.get(API_ENDPOINTS.USER_CHECK_EMAIL, { params }).then(res => res.data)
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.REGISTER, data)
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.USER_BY_ID(id), data)
  },

  updatePassword: (id, data) => {
    return api.patch(API_ENDPOINTS.USER_PASSWORD(id), data)
  },

  remove: (id) => {
    return api.delete(API_ENDPOINTS.USER_BY_ID(id))
  },
}
