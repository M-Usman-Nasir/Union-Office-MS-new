import client from './client';
import { API_ENDPOINTS } from '../constants';

export const announcementsApi = {
  getAll: (params) => client.get(API_ENDPOINTS.ANNOUNCEMENTS, { params }),
};
