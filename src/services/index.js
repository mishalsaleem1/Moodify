import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

/**
 * Authentication Service
 */
export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData)
    return response.data
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials)
    return response.data
  },

  // Logout user
  logout: async () => {
    const response = await api.post(API_ENDPOINTS.LOGOUT)
    return response.data
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken })
    return response.data
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email })
    return response.data
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post(API_ENDPOINTS.RESET_PASSWORD, { token, newPassword })
    return response.data
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`${API_ENDPOINTS.VERIFY_EMAIL}?token=${token}`)
    return response.data
  },
}

/**
 * User Service
 */
export const userService = {
  // Get current user
  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.GET_CURRENT_USER)
    return response.data
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put(API_ENDPOINTS.UPDATE_PROFILE, userData)
    return response.data
  },

  // Get user by ID
  getUser: async (userId) => {
    const response = await api.get(`${API_ENDPOINTS.GET_USER}/${userId}`)
    return response.data
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete(API_ENDPOINTS.DELETE_ACCOUNT)
    return response.data
  },

  // Update settings
  updateSettings: async (settings) => {
    const response = await api.put(API_ENDPOINTS.UPDATE_SETTINGS, settings)
    return response.data
  },

  // Get user statistics
  getStatistics: async () => {
    const response = await api.get(API_ENDPOINTS.GET_STATISTICS)
    return response.data
  },
}

/**
 * Emotion Service
 */
export const emotionService = {
  // Detect emotion from text
  detectEmotion: async (emotionData) => {
    const response = await api.post(API_ENDPOINTS.DETECT_EMOTION, emotionData)
    return response.data
  },

  // Get emotion history
  getEmotionHistory: async (params) => {
    const response = await api.get(API_ENDPOINTS.GET_EMOTION_HISTORY, { params })
    return response.data
  },

  // Get single emotion
  getEmotion: async (emotionId) => {
    const response = await api.get(`${API_ENDPOINTS.GET_EMOTION}/${emotionId}`)
    return response.data
  },

  // Update emotion
  updateEmotion: async (emotionId, emotionData) => {
    const response = await api.put(`${API_ENDPOINTS.UPDATE_EMOTION}/${emotionId}`, emotionData)
    return response.data
  },

  // Delete emotion
  deleteEmotion: async (emotionId) => {
    const response = await api.delete(`${API_ENDPOINTS.DELETE_EMOTION}/${emotionId}`)
    return response.data
  },

  // Get emotion statistics
  getStatistics: async (params) => {
    const response = await api.get(API_ENDPOINTS.GET_EMOTION_STATISTICS, { params })
    return response.data
  },

  // Get emotion trends
  getTrends: async (params) => {
    const response = await api.get(API_ENDPOINTS.GET_EMOTION_TRENDS, { params })
    return response.data
  },
}

/**
 * Recommendation Service
 */
export const recommendationService = {
  // Generate recommendations
  generateRecommendations: async (emotionId) => {
    const response = await api.post(API_ENDPOINTS.GENERATE_RECOMMENDATIONS, { emotionId })
    return response.data
  },

  // Get recommendations
  getRecommendations: async (params) => {
    const response = await api.get(API_ENDPOINTS.GET_RECOMMENDATIONS, { params })
    return response.data
  },

  // Get single recommendation
  getRecommendation: async (recommendationId) => {
    const response = await api.get(`${API_ENDPOINTS.GET_RECOMMENDATION}/${recommendationId}`)
    return response.data
  },

  // Update recommendation (like/dislike)
  updateRecommendation: async (recommendationId, data) => {
    const response = await api.put(`${API_ENDPOINTS.UPDATE_RECOMMENDATION}/${recommendationId}`, data)
    return response.data
  },

  // Delete recommendation
  deleteRecommendation: async (recommendationId) => {
    const response = await api.delete(`${API_ENDPOINTS.DELETE_RECOMMENDATION}/${recommendationId}`)
    return response.data
  },

  // Get recommendations by emotion
  getRecommendationsByEmotion: async (emotionId) => {
    const response = await api.get(`${API_ENDPOINTS.GET_RECOMMENDATIONS_BY_EMOTION}/${emotionId}`)
    return response.data
  },

  // Submit feedback
  submitFeedback: async (recommendationId, feedback) => {
    const response = await api.post(`${API_ENDPOINTS.RECOMMENDATION_FEEDBACK}/${recommendationId}/feedback`, feedback)
    return response.data
  },
}

/**
 * Playlist Service
 */
export const playlistService = {
  // Create playlist
  createPlaylist: async (playlistData) => {
    const response = await api.post(API_ENDPOINTS.CREATE_PLAYLIST, playlistData)
    return response.data
  },

  // Get all playlists
  getPlaylists: async (params) => {
    const response = await api.get(API_ENDPOINTS.GET_PLAYLISTS, { params })
    return response.data
  },

  // Get single playlist
  getPlaylist: async (playlistId) => {
    const response = await api.get(`${API_ENDPOINTS.GET_PLAYLIST}/${playlistId}`)
    return response.data
  },

  // Update playlist
  updatePlaylist: async (playlistId, playlistData) => {
    const response = await api.put(`${API_ENDPOINTS.UPDATE_PLAYLIST}/${playlistId}`, playlistData)
    return response.data
  },

  // Delete playlist
  deletePlaylist: async (playlistId) => {
    const response = await api.delete(`${API_ENDPOINTS.DELETE_PLAYLIST}/${playlistId}`)
    return response.data
  },

  // Add song to playlist
  addSongToPlaylist: async (playlistId, songId) => {
    const response = await api.post(`${API_ENDPOINTS.ADD_SONG_TO_PLAYLIST}/${playlistId}/songs`, { songId })
    return response.data
  },

  // Remove song from playlist
  removeSongFromPlaylist: async (playlistId, songId) => {
    const response = await api.delete(`${API_ENDPOINTS.REMOVE_SONG_FROM_PLAYLIST}/${playlistId}/songs/${songId}`)
    return response.data
  },

  // Reorder song in playlist
  reorderSong: async (playlistId, songId, newPosition) => {
    const response = await api.put(`${API_ENDPOINTS.REORDER_SONG}/${playlistId}/songs/${songId}`, { position: newPosition })
    return response.data
  },
}

/**
 * Song Service
 */
export const songService = {
  // Search songs
  searchSongs: async (params) => {
    const response = await api.get(API_ENDPOINTS.SEARCH_SONGS, { params })
    return response.data
  },

  // Get song details
  getSong: async (songId) => {
    const response = await api.get(`${API_ENDPOINTS.GET_SONG}/${songId}`)
    return response.data
  },

  // Like song
  likeSong: async (songId) => {
    const response = await api.post(`${API_ENDPOINTS.LIKE_SONG}/${songId}/like`)
    return response.data
  },

  // Unlike song
  unlikeSong: async (songId) => {
    const response = await api.delete(`${API_ENDPOINTS.UNLIKE_SONG}/${songId}/like`)
    return response.data
  },

  // Get related songs
  getRelatedSongs: async (songId) => {
    const response = await api.get(`${API_ENDPOINTS.GET_RELATED_SONGS}/${songId}/related`)
    return response.data
  },
}

/**
 * Favorites Service
 */
export const favoritesService = {
  // Add to favorites
  addFavorite: async (songId, category) => {
    const response = await api.post(API_ENDPOINTS.ADD_FAVORITE, { songId, category })
    return response.data
  },

  // Get favorites
  getFavorites: async (params) => {
    const response = await api.get(API_ENDPOINTS.GET_FAVORITES, { params })
    return response.data
  },

  // Remove from favorites
  removeFavorite: async (favoriteId) => {
    const response = await api.delete(`${API_ENDPOINTS.DELETE_FAVORITE}/${favoriteId}`)
    return response.data
  },

  // Get favorites by mood
  getFavoritesByMood: async (mood) => {
    const response = await api.get(`${API_ENDPOINTS.GET_FAVORITES_BY_MOOD}/${mood}`)
    return response.data
  },
}

/**
 * Spotify Service
 */
export const spotifyService = {
  // Connect Spotify account
  connectSpotify: async (code) => {
    const response = await api.post(API_ENDPOINTS.CONNECT_SPOTIFY, { code })
    return response.data
  },

  // Check Spotify connection
  checkConnection: async () => {
    const response = await api.get(API_ENDPOINTS.CHECK_SPOTIFY_CONNECTION)
    return response.data
  },

  // Disconnect Spotify
  disconnectSpotify: async () => {
    const response = await api.post(API_ENDPOINTS.DISCONNECT_SPOTIFY)
    return response.data
  },

  // Get Spotify profile
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.GET_SPOTIFY_PROFILE)
    return response.data
  },
}

/**
 * Feedback Service
 */
export const feedbackService = {
  // Submit feedback
  submitFeedback: async (feedbackData) => {
    const response = await api.post(API_ENDPOINTS.SUBMIT_FEEDBACK, feedbackData)
    return response.data
  },

  // Get my feedback
  getMyFeedback: async () => {
    const response = await api.get(API_ENDPOINTS.GET_MY_FEEDBACK)
    return response.data
  },

  // Get all feedback (admin)
  getAllFeedback: async (params) => {
    const response = await api.get(API_ENDPOINTS.GET_ALL_FEEDBACK, { params })
    return response.data
  },

  // Update feedback
  updateFeedback: async (feedbackId, feedbackData) => {
    const response = await api.put(`${API_ENDPOINTS.UPDATE_FEEDBACK}/${feedbackId}`, feedbackData)
    return response.data
  },

  // Delete feedback
  deleteFeedback: async (feedbackId) => {
    const response = await api.delete(`${API_ENDPOINTS.DELETE_FEEDBACK}/${feedbackId}`)
    return response.data
  },
}

/**
 * Genre Service
 */
export const genreService = {
  // Get all genres
  getGenres: async () => {
    const response = await api.get(API_ENDPOINTS.GET_GENRES)
    return response.data
  },

  // Get genre details
  getGenre: async (genreId) => {
    const response = await api.get(`${API_ENDPOINTS.GET_GENRE}/${genreId}`)
    return response.data
  },

  // Get songs by genre
  getGenreSongs: async (genreId, params) => {
    const response = await api.get(`${API_ENDPOINTS.GET_GENRE_SONGS}/${genreId}/songs`, { params })
    return response.data
  },
}
