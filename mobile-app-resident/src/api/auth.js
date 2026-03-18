import client from './client';
import { API_ENDPOINTS } from '../constants';

export const authApi = {
  login: (credentials) => client.post(API_ENDPOINTS.LOGIN, credentials),
  registerResident: (data) => client.post(API_ENDPOINTS.REGISTER_RESIDENT, data),
  logout: () => client.post(API_ENDPOINTS.LOGOUT),
  getMe: () => client.get(API_ENDPOINTS.ME),

  changePasswordFirstLogin: ({ current_password, new_password }) =>
    client.post(API_ENDPOINTS.CHANGE_PASSWORD_FIRST_LOGIN, {
      current_password,
      new_password,
    }),
  refresh: (refreshToken) => client.post(API_ENDPOINTS.REFRESH, { refreshToken }),

  /**
   * Update current user profile. PUT /auth/me
   * @param {Object} data - { name, contact_number?, emergency_contact?, cnic?, remove_image? }
   * @param {Object|null} file - { uri, name, type } for profile_image (optional)
   */
  updateProfile: (data, file = null) => {
    if (file && file.uri) {
      const formData = new FormData();
      formData.append('name', data.name || '');
      if (data.contact_number != null) formData.append('contact_number', data.contact_number);
      if (data.emergency_contact != null) formData.append('emergency_contact', data.emergency_contact);
      if (data.cnic != null) formData.append('cnic', data.cnic);
      if (data.remove_image === true) formData.append('remove_image', 'true');
      formData.append('profile_image', {
        uri: file.uri,
        name: file.name || 'profile.jpg',
        type: file.type || 'image/jpeg',
      });
      return client.put(API_ENDPOINTS.ME, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return client.put(API_ENDPOINTS.ME, data);
  },
};
