import client from './client';
import { API_ENDPOINTS } from '../constants';

export const maintenanceApi = {
  getAll: (params) => client.get(API_ENDPOINTS.MAINTENANCE, { params }),
  getById: (id) => client.get(API_ENDPOINTS.MAINTENANCE_BY_ID(id)),
};
