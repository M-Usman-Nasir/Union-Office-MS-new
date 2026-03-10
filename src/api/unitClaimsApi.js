import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const unitClaimsApi = {
  getMine: () => api.get(API_ENDPOINTS.UNIT_CLAIMS_MINE),

  create: (data) => api.post(API_ENDPOINTS.UNIT_CLAIMS, data),

  getAll: (params) => api.get(API_ENDPOINTS.UNIT_CLAIMS, { params }),

  approve: (id) => api.post(API_ENDPOINTS.UNIT_CLAIM_APPROVE(id)),

  reject: (id, data) => api.post(API_ENDPOINTS.UNIT_CLAIM_REJECT(id), data),
}
