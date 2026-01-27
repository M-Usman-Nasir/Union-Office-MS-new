import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const propertyApi = {
  // Blocks
  getBlocks: (params) => {
    return api.get(API_ENDPOINTS.BLOCKS, { params })
  },

  createBlock: (data) => {
    return api.post(API_ENDPOINTS.BLOCKS, data)
  },

  updateBlock: (id, data) => {
    return api.put(`${API_ENDPOINTS.BLOCKS}/${id}`, data)
  },

  // Floors
  getFloors: (params) => {
    return api.get(API_ENDPOINTS.FLOORS, { params })
  },

  createFloor: (data) => {
    return api.post(API_ENDPOINTS.FLOORS, data)
  },

  // Units
  getUnits: (params) => {
    return api.get(API_ENDPOINTS.UNITS, { params })
  },

  getUnitById: (id) => {
    return api.get(API_ENDPOINTS.UNIT_BY_ID(id))
  },

  createUnit: (data) => {
    return api.post(API_ENDPOINTS.UNITS, data)
  },

  updateUnit: (id, data) => {
    return api.put(API_ENDPOINTS.UNIT_BY_ID(id), data)
  },
}
