/* global process */
import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api/auth';
import { ROLES, STORAGE_KEYS } from '../constants';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

/* eslint-disable-next-line react/prop-types */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          const res = await authApi.getMe();
          const userData = res.data?.data;
          if (userData && userData.role === ROLES.RESIDENT) {
            if (!cancelled) {
              setUser(userData);
              setIsAuthenticated(true);
            }
          } else {
            await clearStorage();
          }
        }
      } catch (e) {
        await clearStorage();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    checkAuth();
    return () => { cancelled = true; };
  }, []);

  const clearStorage = async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (credentials) => {
    try {
      const res = await authApi.login(credentials);
      const { user: userData, accessToken, refreshToken } = res.data?.data || {};
      if (!userData || userData.role !== ROLES.RESIDENT) {
        return {
          success: false,
          error: 'This app is for residents only. Please use the web app for other roles.',
        };
      }
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      if (refreshToken) {
        await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(userData));
      await SecureStore.setItemAsync(STORAGE_KEYS.LAST_EMAIL, credentials.email || '');
      await SecureStore.setItemAsync(STORAGE_KEYS.LAST_PASSWORD, credentials.password || '');
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (err) {
      console.warn('Login error:', err.message, err.response?.status, err.response?.data);
      let msg = err.response?.data?.message || err.message || 'Login failed';
      if (err.message === 'Network Error') {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
        msg = `Cannot reach server at ${apiUrl}. Check: 1) Backend running (cd backend && npm run dev). 2) If using phone: same WiFi as PC, restart Expo after changing .env. 3) If using emulator: set EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api in .env.`;
      }
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore; clearStorage runs regardless
    }
    await clearStorage();
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      const userData = res.data?.data;
      if (userData) {
        setUser(userData);
        await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(userData));
      }
    } catch {
      // Ignore; user state unchanged on refresh failure
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
