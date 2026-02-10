import client from './client';
import { API_ENDPOINTS } from '../constants';

export const authApi = {
  login: (credentials) => client.post(API_ENDPOINTS.LOGIN, credentials),
  logout: () => client.post(API_ENDPOINTS.LOGOUT),
  getMe: () => client.get(API_ENDPOINTS.ME),
  refresh: (refreshToken) => client.post(API_ENDPOINTS.REFRESH, { refreshToken }),
};
