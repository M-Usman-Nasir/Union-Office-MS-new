import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const settingsApi = {
  getSettings: (societyId) => {
    return api.get(API_ENDPOINTS.SETTINGS(societyId))
  },

  updateSettings: (societyId, data) => {
    return api.put(API_ENDPOINTS.SETTINGS(societyId), data)
  },

  getMaintenanceConfig: (societyId) => {
    return api.get(API_ENDPOINTS.MAINTENANCE_CONFIG(societyId))
  },

  updateMaintenanceConfig: (societyId, data) => {
    return api.put(API_ENDPOINTS.MAINTENANCE_CONFIG(societyId), data)
  },
}
