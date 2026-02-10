import client from './client';
import { API_ENDPOINTS } from '../constants';

export const complaintsApi = {
  getAll: (params) => client.get(API_ENDPOINTS.COMPLAINTS, { params }),
  getById: (id) => client.get(API_ENDPOINTS.COMPLAINT_BY_ID(id)),
  create: (data) => client.post(API_ENDPOINTS.COMPLAINTS, data),
  createWithAttachments: (formData) =>
    client.post(API_ENDPOINTS.COMPLAINTS_WITH_ATTACHMENTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) => client.put(API_ENDPOINTS.COMPLAINT_BY_ID(id), data),
  getProgress: (id) => client.get(API_ENDPOINTS.COMPLAINT_PROGRESS(id)),
};
