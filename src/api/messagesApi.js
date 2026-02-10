import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const messagesApi = {
  getConversations: () => api.get(API_ENDPOINTS.MESSAGES_CONVERSATIONS),
  getPartners: () => api.get(API_ENDPOINTS.MESSAGES_PARTNERS),
  getMessagesWith: (userId) => api.get(API_ENDPOINTS.MESSAGES_WITH(userId)),
  send: (data) => api.post(API_ENDPOINTS.MESSAGES_SEND, data),
}
