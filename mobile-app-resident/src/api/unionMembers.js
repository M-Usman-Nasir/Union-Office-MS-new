import client from './client';
import { API_ENDPOINTS } from '../constants';

export const unionMembersApi = {
  getAll: (params) => client.get(API_ENDPOINTS.UNION_MEMBERS, { params }),
  getById: (id) => client.get(API_ENDPOINTS.UNION_MEMBER_BY_ID(id)),
};
