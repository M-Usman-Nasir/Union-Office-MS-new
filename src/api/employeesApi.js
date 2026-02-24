import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const employeesApi = {
  getAll: (params) => api.get(API_ENDPOINTS.EMPLOYEES, { params }),
  getById: (id) => api.get(API_ENDPOINTS.EMPLOYEE_BY_ID(id)),
  create: (data) => api.post(API_ENDPOINTS.EMPLOYEES, data),
  update: (id, data) => api.put(API_ENDPOINTS.EMPLOYEE_BY_ID(id), data),
  remove: (id) => api.delete(API_ENDPOINTS.EMPLOYEE_BY_ID(id)),
}
