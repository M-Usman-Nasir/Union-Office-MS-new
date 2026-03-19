import client from './client';
import { API_ENDPOINTS } from '../constants';

export const propertyApi = {
  getBlocks: (params) => client.get(API_ENDPOINTS.PROPERTIES_BLOCKS, { params }),
  getFloors: (params) => client.get(API_ENDPOINTS.PROPERTIES_FLOORS, { params }),
  getUnits: (params) => client.get(API_ENDPOINTS.PROPERTIES_UNITS, { params }),
};
