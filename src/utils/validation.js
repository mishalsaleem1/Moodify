import { VALIDATION } from './constants'

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email) return 'Email is required'
  if (!VALIDATION.EMAIL_REGEX.test(email)) return 'Invalid email format'
  return null
}

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
  }
  if (!VALIDATION.PASSWORD_REGEX.test(password)) {
    return 'Password must contain uppercase, lowercase, number, and special character'
  }
  return null
}

/**
 * Validate username
 */
export const validateUsername = (username) => {
  if (!username) return 'Username is required'
  if (username.length < VALIDATION.USERNAME_MIN_LENGTH) {
    return `Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters`
  }
  if (username.length > VALIDATION.USERNAME_MAX_LENGTH) {
    return `Username must be at most ${VALIDATION.USERNAME_MAX_LENGTH} characters`
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores'
  }
  return null
}

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`
  }
  return null
}

/**
 * Validate emotion text input
 */
export const validateEmotionText = (text) => {
  if (!text || text.trim() === '') return 'Please describe your mood'
  if (text.length < VALIDATION.EMOTION_TEXT_MIN_LENGTH) {
    return `Description must be at least ${VALIDATION.EMOTION_TEXT_MIN_LENGTH} characters`
  }
  if (text.length > VALIDATION.EMOTION_TEXT_MAX_LENGTH) {
    return `Description must be at most ${VALIDATION.EMOTION_TEXT_MAX_LENGTH} characters`
  }
  return null
}

/**
 * Validate playlist name
 */
export const validatePlaylistName = (name) => {
  if (!name || name.trim() === '') return 'Playlist name is required'
  if (name.length < 3) return 'Playlist name must be at least 3 characters'
  if (name.length > 100) return 'Playlist name must be at most 100 characters'
  return null
}

/**
 * Check password match
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) return 'Passwords do not match'
  return null
}
