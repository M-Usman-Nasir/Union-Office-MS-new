import client from './client';
import { API_ENDPOINTS } from '../constants';

export const residentsApi = {
  getById: (id) => client.get(API_ENDPOINTS.RESIDENT_BY_ID(id)),
  getFamilyMembers: (residentId) =>
    client.get(`${API_ENDPOINTS.RESIDENT_BY_ID(residentId)}/family-members`),
  update: (id, data) => client.put(API_ENDPOINTS.RESIDENT_BY_ID(id), data),
};
