import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '@/api/authApi'
import { STORAGE_KEYS } from '@/utils/constants'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        if (token) {
          // Verify token with backend
          const response = await authApi.getMe()
          setUser(response.data.data)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials)
      const { user: userData, accessToken } = response.data.data
      
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
      
      setUser(userData)
      setIsAuthenticated(true)
      
      return { success: true, user: userData }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
