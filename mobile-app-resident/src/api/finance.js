import client from './client';
import { API_ENDPOINTS } from '../constants';

export const financeApi = {
  getPublicSummary: (params) =>
    client.get(API_ENDPOINTS.FINANCE_PUBLIC_SUMMARY, { params }),
};
