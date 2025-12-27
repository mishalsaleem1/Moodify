import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services'
import { STORAGE_KEYS } from '../utils/constants'
import toast from 'react-hot-toast'

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
  const [error, setError] = useState(null)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER)

        if (token && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser)
            setUser(parsedUser)
            setIsAuthenticated(true)
          } catch (parseError) {
            console.error('Failed to parse stored user:', parseError)
            // Clear invalid tokens
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.USER)
          }
        } else {
          // Clear any leftover tokens
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setError('Failed to initialize authentication')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setError(null)
      setLoading(true)
      
      console.log('🔐 Attempting login with:', credentials.email)
      const response = await authService.login(credentials)
      console.log('📥 Login response received:', response)
      
      // Handle both accessToken and access_token formats
      const token = response.accessToken || response.access_token
      const refreshToken = response.refreshToken || response.refresh_token
      const userData = response.user || response

      console.log('✅ Token received:', !!token)
      console.log('✅ User data received:', !!userData)

      if (!token || !userData) {
        console.error('❌ Invalid response format:', response)
        throw new Error('Invalid response format from server')
      }

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))

      setUser(userData)
      setIsAuthenticated(true)

      console.log('✅ Login successful!')
      toast.success(`Welcome back, ${userData.username || userData.email}!`)
      return { success: true, user: userData }
    } catch (error) {
      console.error('❌ Login error:', error)
      console.error('Error response:', error.response?.data)
      const message = error.response?.data?.message || error.message || 'Login failed. Please try again.'
      setError(message)
      toast.error(message)
      console.error('Login error:', error)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Register function
  const register = useCallback(async (userData) => {
    try {
      setError(null)
      setLoading(true)
      
      console.log('📝 Attempting registration with:', userData.email, userData.username)
      const response = await authService.register(userData)
      console.log('📥 Registration response received:', response)
      
      // Handle both accessToken and access_token formats
      const token = response.accessToken || response.access_token
      const refreshToken = response.refreshToken || response.refresh_token
      const newUser = response.user || response

      console.log('✅ Token received:', !!token)
      console.log('✅ User data received:', !!newUser)

      if (!token || !newUser) {
        console.error('❌ Invalid registration response format:', response)
        throw new Error('Invalid response format from server')
      }

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser))

      setUser(newUser)
      setIsAuthenticated(true)

      console.log('✅ Registration successful!')
      toast.success('Account created successfully!')
      return { success: true, user: newUser }
    } catch (error) {
      console.error('❌ Registration error:', error)
      console.error('Error response:', error.response?.data)
      const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.'
      setError(message)
      toast.error(message)
      console.error('Registration error:', error)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Optional: Call backend logout endpoint if it exists
      try {
        await authService.logout()
      } catch (err) {
        console.warn('Backend logout failed, clearing local storage anyway:', err)
      }
    } finally {
      // Always clear localStorage
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.SPOTIFY_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.SPOTIFY_CONNECTED)

      // Update state
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
      toast.success('Logged out successfully')
    }
  }, [])

  // Update user profile
  const updateUser = useCallback(async (updates) => {
    try {
      setError(null)
      setLoading(true)
      
      const updatedUser = await userService.updateProfile(updates)
      setUser(updatedUser)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser))
      toast.success('Profile updated successfully')
      return { success: true, user: updatedUser }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update profile'
      setError(message)
      toast.error(message)
      console.error('Profile update error:', error)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
