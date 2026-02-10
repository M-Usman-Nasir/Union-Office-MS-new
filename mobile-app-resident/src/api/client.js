import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const url = original?.url || '';
    const isAuth = /\/auth\/(login|refresh)$/.test(url.replace(/\?.*/, ''));

    if (err.response?.status === 401 && !original._retry && !isAuth) {
      original._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(`${baseURL}${API_ENDPOINTS.REFRESH}`, { refreshToken });
        const accessToken = data?.data?.accessToken;
        if (accessToken) {
          await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, accessToken);
          original.headers.Authorization = `Bearer ${accessToken}`;
          return client(original);
        }
      } catch (e) {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
      }
    }
    return Promise.reject(err);
  }
);

export default client;
