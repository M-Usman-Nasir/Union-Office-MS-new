import client from './client';
import { API_ENDPOINTS } from '../constants';

export const apartmentApi = {
  getById: (id) => client.get(API_ENDPOINTS.SOCIETY_BY_ID(id)),
};
