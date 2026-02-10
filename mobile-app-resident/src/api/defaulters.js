import client from './client';
import { API_ENDPOINTS } from '../constants';

export const defaultersApi = {
  getAll: (params) => client.get(API_ENDPOINTS.DEFAULTERS, { params }),
};
