import axios from 'axios'
import toast from 'react-hot-toast'
import { STORAGE_KEYS } from '@/utils/constants'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based refresh tokens
})

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Don't set Content-Type for FormData - let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Attempt to refresh token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const { accessToken } = response.data.data
        
        // Store new access token
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken)
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        
        // Retry original request
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        
        // Redirect to login
        window.location.href = '/login'
        
        toast.error('Session expired. Please login again.')
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 400:
          toast.error(data.message || 'Bad request')
          break
        case 403:
          // Silently ignore permission errors to avoid ugly global toasts,
          // especially for resident users hitting admin-only endpoints.
          // Individual pages can render their own friendly messages if needed.
          break
        case 404:
          toast.error('Resource not found')
          break
        case 500:
          toast.error('Server error. Please try again later')
          break
        default:
          toast.error(data.message || 'An error occurred')
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection')
    } else {
      toast.error('An unexpected error occurred')
    }

    return Promise.reject(error)
  }
)

export default api
