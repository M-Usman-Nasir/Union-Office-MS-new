import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const propertyApi = {
  // Blocks
  getBlocks: (params) => {
    return api.get(API_ENDPOINTS.BLOCKS, { params })
  },

  getBlockNextFloorNumber: (blockId) => {
    return api.get(API_ENDPOINTS.BLOCK_NEXT_FLOOR(blockId))
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

  updateFloor: (id, data) => {
    return api.put(API_ENDPOINTS.FLOOR_BY_ID(id), data)
  },

  deleteFloor: (id) => {
    return api.delete(API_ENDPOINTS.FLOOR_BY_ID(id))
  },

  addUnitsToFloor: (floorId, count) => {
    return api.post(API_ENDPOINTS.FLOOR_ADD_UNITS(floorId), { count })
  },

  // Units
  getUnits: (params) => {
    return api.get(API_ENDPOINTS.UNITS, { params })
  },

  getUnitById: (id) => {
    return api.get(API_ENDPOINTS.UNIT_BY_ID(id))
  },

  getUnitLoginEmailPreview: (id) => {
    return api.get(API_ENDPOINTS.UNIT_LOGIN_EMAIL_PREVIEW(id))
  },

  createUnit: (data) => {
    return api.post(API_ENDPOINTS.UNITS, data)
  },

  updateUnit: (id, data) => {
    return api.put(API_ENDPOINTS.UNIT_BY_ID(id), data)
  },

  deleteUnit: (id) => {
    return api.delete(API_ENDPOINTS.UNIT_BY_ID(id))
  },

  importUnits: (formData) => {
    return api.post(API_ENDPOINTS.UNITS_IMPORT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

}
