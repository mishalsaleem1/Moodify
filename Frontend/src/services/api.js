import axios from 'axios'
import { STORAGE_KEYS } from '../utils/constants'

// Create axios instance with environment-based base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 30000, // Increased to 30s for Neon database cold starts
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Optional: Log requests in development
    if (import.meta.env.MODE === 'development') {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`)
      console.log(`📦 Request data:`, config.data)
    }
    return config
  },
  (error) => {
    console.error('❌ Request error:', error.message)
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors, logging, and token refresh
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.MODE === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`)
      console.log(`📦 Response data:`, response.data)
    }
    return response
  },
  async (error) => {
    console.error(`❌ API Error:`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    })
    
    const originalRequest = error.config

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        if (refreshToken) {
          const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
          const response = await axios.post(
            `${baseURL}/auth/refresh-token`,
            { refreshToken }
          )

          const { accessToken } = response.data
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        console.warn('🔐 Session expired, redirecting to login...')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Log error responses
    const errorMessage = error.response?.data?.message || error.message || 'Request failed'
    const errorStatus = error.response?.status || 'Unknown'
    console.error(`❌ API Error [${errorStatus}]: ${errorMessage}`)

    return Promise.reject(error)
  }
)

export default api
