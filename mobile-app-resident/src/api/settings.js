import client from './client';
import { API_ENDPOINTS } from '../constants';

export const settingsApi = {
  getSettings: (societyId) =>
    client.get(API_ENDPOINTS.SETTINGS(societyId)),
};
