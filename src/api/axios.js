import axios from 'axios'
import toast from 'react-hot-toast'
import { STORAGE_KEYS, ROUTES } from '@/utils/constants'

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
    const requestUrl = originalRequest?.url || ''

    // Don't run refresh/redirect for login or refresh endpoint - let caller handle the error
    const isAuthEndpoint = /\/auth\/(login|refresh)$/.test(requestUrl.replace(/\?.*/, ''))

    // Handle 401 Unauthorized - Token expired or invalid (skip for login/refresh)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
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
        // Only logout when refresh explicitly returns 401 (expired/invalid token)
        if (refreshError.response?.status === 401) {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
          window.location.href = `${ROUTES.LOGIN}?reason=session-expired`
          toast.error('Session expired. Please login again.')
          return Promise.reject(refreshError)
        }
        // No response = network error, timeout, or server cold start – do not logout
        if (!refreshError.response) {
          if (!navigator.onLine) {
            toast.error('Network issue. Please check your connection.')
          } else {
            toast.error('Server waking up. Please wait and try again.')
          }
          return Promise.reject(refreshError)
        }
        // 5xx or other server error – allow retry, do not logout
        toast.error('Server error. Please try again later.')
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
          if (data?.code === 'MUST_CHANGE_PASSWORD' && typeof window !== 'undefined') {
            if (!window.location.pathname.includes('/force-change-password')) {
              window.location.href = ROUTES.FORCE_CHANGE_PASSWORD
            }
          }
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
