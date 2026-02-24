import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const unionMembersApi = {
  getAll: (params) => api.get(API_ENDPOINTS.UNION_MEMBERS, { params }),
  getById: (id) => api.get(API_ENDPOINTS.UNION_MEMBER_BY_ID(id)),
  create: (data) => api.post(API_ENDPOINTS.UNION_MEMBERS, data),
  update: (id, data) => api.put(API_ENDPOINTS.UNION_MEMBER_BY_ID(id), data),
  remove: (id) => api.delete(API_ENDPOINTS.UNION_MEMBER_BY_ID(id)),
}
