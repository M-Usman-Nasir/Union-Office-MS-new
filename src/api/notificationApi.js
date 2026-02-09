import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const notificationApi = {
  getVapidPublic: () => api.get(API_ENDPOINTS.NOTIFICATIONS_VAPID_PUBLIC),

  subscribe: (subscription) =>
    api.post(API_ENDPOINTS.NOTIFICATIONS_SUBSCRIBE, subscription),
}
