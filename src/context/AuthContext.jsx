import { createContext, useContext, useState, useEffect } from 'react'
import { authService, userService } from '../services'
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

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER)

        if (token && savedUser) {
          setUser(JSON.parse(savedUser))
          setIsAuthenticated(true)
        } else {
          // Clear invalid tokens
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      const { user: userData, accessToken, refreshToken } = response

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))

      setUser(userData)
      setIsAuthenticated(true)

      toast.success(`Welcome back, ${userData.username}!`)
      return { success: true, user: userData }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      const { user: newUser, accessToken, refreshToken } = response

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser))

      setUser(newUser)
      setIsAuthenticated(true)

      toast.success('Account created successfully!')
      return { success: true, user: newUser }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)

    // Update state
    setUser(null)
    setIsAuthenticated(false)
  }

  // Update user profile
  const updateUser = async (updates) => {
    try {
      const updatedUser = await userService.updateProfile(updates)
      setUser(updatedUser)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser))
      toast.success('Profile updated successfully')
      return { success: true, user: updatedUser }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
