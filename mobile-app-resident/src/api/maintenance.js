import client from './client';
import { API_ENDPOINTS } from '../constants';

export const maintenanceApi = {
  getAll: (params) => client.get(API_ENDPOINTS.MAINTENANCE, { params }),
  getById: (id) => client.get(API_ENDPOINTS.MAINTENANCE_BY_ID(id)),
  getMyPaymentRequests: () => client.get(API_ENDPOINTS.MAINTENANCE_PAYMENT_REQUESTS_MINE),
  submitPaymentProof: (maintenanceId, formData) =>
    client.post(API_ENDPOINTS.MAINTENANCE_SUBMIT_PAYMENT_PROOF(maintenanceId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
