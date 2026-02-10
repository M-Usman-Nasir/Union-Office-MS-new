import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const superAdminApi = {
  getGlobalReports: (year) => {
    return api.get(API_ENDPOINTS.SUPER_ADMIN_REPORTS_GLOBAL, {
      params: { year },
    })
  },

  getSubscriptionPlans: () => api.get(API_ENDPOINTS.SUPER_ADMIN_SUBSCRIPTION_PLANS),
  getAdminsWithSubscriptions: () => api.get(API_ENDPOINTS.SUPER_ADMIN_SUBSCRIPTION_ADMINS),
  createSubscription: (data) => api.post(API_ENDPOINTS.SUPER_ADMIN_SUBSCRIPTION, data),
  updateSubscriptionStatus: (id, data) => api.patch(API_ENDPOINTS.SUPER_ADMIN_SUBSCRIPTION_BY_ID(id), data),
}
