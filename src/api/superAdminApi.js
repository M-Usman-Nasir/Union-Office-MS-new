import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const superAdminApi = {
  getGlobalReports: (year) => {
    return api.get(API_ENDPOINTS.SUPER_ADMIN_REPORTS_GLOBAL, {
      params: { year },
    })
  },
}
