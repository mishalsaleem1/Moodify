import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

/**
 * Authentication Service
 */
export const authService = {
  // Register new user
  register: async (userData) => {
    console.log('🔵 authService.register() called with:', userData)
    try {
      console.log('📡 Making POST request to:', API_ENDPOINTS.REGISTER)
      const response = await api.post(API_ENDPOINTS.REGISTER, userData)
      console.log('✅ Registration API response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ authService.register() error:', error)
      console.error('❌ Error response:', error.response?.data)
      throw error
    }
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
    // Get userId from localStorage (from AuthContext)
    const userStr = localStorage.getItem('user')
    let userId = null
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        userId = user.id || user.email || user.username
      } catch (e) {
        console.error('Error parsing user:', e)
      }
    }
    
    // Add userId to request
    const dataWithUser = {
      ...playlistData,
      userId: userId || 'default-user', // Fallback to default user if not logged in
    }
    
    console.log('🎵 Creating playlist with data:', dataWithUser)
    const response = await api.post(API_ENDPOINTS.CREATE_PLAYLIST, dataWithUser)
    return response.data
  },

  // Get all playlists
  getPlaylists: async (params) => {
    // Get userId from localStorage
    const userStr = localStorage.getItem('user')
    let userId = null
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        userId = user.id || user.email || user.username
      } catch (e) {
        console.error('Error parsing user:', e)
      }
    }
    
    // Add userId to query params
    const queryParams = {
      ...params,
      userId: userId || 'default-user',
    }
    
    console.log('📂 Fetching playlists with params:', queryParams)
    const response = await api.get(API_ENDPOINTS.GET_PLAYLISTS, { params: queryParams })
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
    // Get userId
    const userStr = localStorage.getItem('user')
    let userId = 'default-user'
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        userId = user.id || user.email || user.username || 'default-user'
      } catch (e) {}
    }
    
    try {
      const response = await api.post(`${API_ENDPOINTS.ADD_SONG_TO_PLAYLIST}/${playlistId}/songs?userId=${userId}`, { songId })
      return response.data
    } catch (error) {
      // Check if it's a conflict error (409) - song already in playlist
      if (error.response?.status === 409) {
        throw new Error('Song is already in this playlist')
      }
      // Re-throw other errors
      throw error
    }
  },

  // Remove song from playlist
  removeSongFromPlaylist: async (playlistId, songId) => {
    const userId = playlistService._getUserId()
    const response = await api.delete(`${API_ENDPOINTS.REMOVE_SONG_FROM_PLAYLIST}/${playlistId}/songs/${songId}?userId=${userId}`)
    return response.data
  },

  // Reorder songs in playlist (sends array of songIds)
  reorderSongs: async (playlistId, songIds) => {
    const response = await api.put(`${API_ENDPOINTS.REORDER_SONG}/${playlistId}/reorder`, { songIds })
    return response.data
  },
}

/**
 * Song Service
 */
export const songService = {
  // Create song
  createSong: async (songData) => {
    const response = await api.post('/songs', songData)
    return response.data
  },

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

  // Get all songs
  getAllSongs: async (params) => {
    const response = await api.get('/songs', { params })
    return response.data
  },

  // Get songs by genre
  getSongsByGenre: async (genreId, params) => {
    const response = await api.get(`/songs/genre/${genreId}`, { params })
    return response.data
  },
}

/**
 * Favorites Service
 */
export const favoritesService = {
  // Helper to get userId
  _getUserId: () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        return user.id || user.email || user.username || 'default-user'
      } catch (e) {
        return 'default-user'
      }
    }
    return 'default-user'
  },

  // Add to favorites
  addFavorite: async (songId, category) => {
    const userId = favoritesService._getUserId()
    const response = await api.post(`${API_ENDPOINTS.ADD_FAVORITE}?userId=${userId}`, { 
      songId, 
      category,
      userId 
    })
    return response.data
  },

  // Get favorites
  getFavorites: async (params) => {
    const userId = favoritesService._getUserId()
    const response = await api.get(API_ENDPOINTS.GET_FAVORITES, { 
      params: { ...params, userId } 
    })
    return response.data
  },

  // Remove from favorites (uses songId in URL)
  removeFavorite: async (songId) => {
    const userId = favoritesService._getUserId()
    const response = await api.delete(`${API_ENDPOINTS.DELETE_FAVORITE}/${songId}?userId=${userId}`)
    return response.data
  },

  // Check if song is favorite
  checkFavorite: async (songId) => {
    const userId = favoritesService._getUserId()
    const response = await api.get(`${API_ENDPOINTS.CHECK_FAVORITE}/${songId}?userId=${userId}`)
    return response.data
  },
}

/**
 * Spotify Service
 */
export const spotifyService = {
  // Get Spotify authorization URL
  getAuthUrl: async () => {
    const response = await api.get(API_ENDPOINTS.CONNECT_SPOTIFY)
    return response.data
  },

  // Check Spotify connection
  checkConnection: async () => {
    const response = await api.get(API_ENDPOINTS.CHECK_SPOTIFY_CONNECTION)
    return response.data
  },

  // Get Spotify profile
  getProfile: async (token) => {
    const response = await api.get(`${API_ENDPOINTS.GET_SPOTIFY_PROFILE}?token=${token}`)
    return response.data
  },

  // Get top tracks
  getTopTracks: async (token) => {
    const response = await api.get(`${API_ENDPOINTS.SPOTIFY_TOP_TRACKS}?token=${token}`)
    return response.data
  },

  // Get top artists
  getTopArtists: async (token) => {
    const response = await api.get(`${API_ENDPOINTS.SPOTIFY_TOP_ARTISTS}?token=${token}`)
    return response.data
  },

  // Get mood-based recommendations
  getRecommendations: async (token, mood) => {
    console.log('🎵 Fetching Spotify recommendations for mood:', mood)
    const response = await api.get(`${API_ENDPOINTS.SPOTIFY_RECOMMENDATIONS}?token=${encodeURIComponent(token)}&mood=${mood}`)
    console.log('✅ Received Spotify recommendations:', response.data)
    return response.data
  },

  // Get mood-based recommendations (alias for consistency)
  getMoodBasedRecommendations: async (token, mood) => {
    console.log('🎵 getMoodBasedRecommendations - mood:', mood, 'token:', !!token)
    const response = await api.get(`${API_ENDPOINTS.SPOTIFY_RECOMMENDATIONS}?token=${encodeURIComponent(token)}&mood=${mood}`)
    console.log('✅ Spotify mood recommendations received:', response.data)
    return response.data
  },

  // iTunes API - Free alternative (no auth required)
  getITunesMoodSongs: async (mood, limit = 20) => {
    console.log(`🎵 Using iTunes API for mood: ${mood}`);
    
    // Map moods to iTunes search terms
    const moodKeywords = {
      happy: 'happy upbeat dance pop',
      sad: 'sad emotional acoustic',
      calm: 'calm relaxing ambient chill',
      angry: 'rock metal intense',
      energetic: 'energetic workout electronic dance',
      romantic: 'romantic love ballad',
      party: 'party dance electronic',
      focus: 'instrumental piano classical study',
    };

    const searchTerm = moodKeywords[mood.toLowerCase()] || 'pop music';
    
    // iTunes Search API is FREE and requires no authentication!
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=${limit}&media=music`
    );
    
    if (!response.ok) {
      throw new Error('iTunes API request failed');
    }
    
    const data = await response.json();
    console.log(`✅ iTunes API returned ${data.results?.length || 0} songs`);
    
    return {
      tracks: data.results.map((track, index) => ({
        id: track.trackId,
        name: track.trackName,
        artists: [{ name: track.artistName }],
        album: {
          name: track.collectionName,
          images: [{ url: track.artworkUrl100.replace('100x100', '300x300') }],
        },
        preview_url: track.previewUrl,
        external_urls: {
          apple: track.trackViewUrl,
        },
        duration_ms: track.trackTimeMillis,
      })),
    };
  },

  // Save track to library
  saveTrack: async (token, trackId) => {
    const response = await api.post(`${API_ENDPOINTS.SPOTIFY_SAVE_TRACK}?token=${token}`, { trackId })
    return response.data
  },

  // Sync top tracks to database
  syncTracks: async (token) => {
    const response = await api.get(`${API_ENDPOINTS.SPOTIFY_SYNC}?token=${token}`)
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

  // Get songs by genre (uses songs endpoint, not genres)
  getGenreSongs: async (genreId, params) => {
    const response = await api.get(`${API_ENDPOINTS.GET_SONGS_BY_GENRE}/${genreId}`, { params })
    return response.data
  },
}
