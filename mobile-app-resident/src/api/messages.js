import client from './client';
import { API_ENDPOINTS } from '../constants';

export const messagesApi = {
  getConversations: () => client.get(API_ENDPOINTS.MESSAGES_CONVERSATIONS),
  getPartners: () => client.get(API_ENDPOINTS.MESSAGES_PARTNERS),
  getMessagesWith: (userId) => client.get(API_ENDPOINTS.MESSAGES_WITH(userId)),
  send: (data) => client.post(API_ENDPOINTS.MESSAGES_SEND, data),
};
