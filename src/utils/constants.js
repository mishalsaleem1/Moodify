// Emotion types
export const EMOTIONS = {
  HAPPY: 'happy',
  SAD: 'sad',
  ANGRY: 'angry',
  CALM: 'calm',
  ANXIOUS: 'anxious',
  EXCITED: 'excited',
  NOSTALGIC: 'nostalgic',
  PEACEFUL: 'peaceful',
}

// Emotion configurations with colors, icons, and descriptions
export const EMOTION_CONFIG = {
  happy: {
    label: 'Happy',
    color: 'happy',
    gradient: 'emotion-gradient-happy',
    icon: '😊',
    emoji: '🎉',
    description: 'Upbeat, energetic, positive, joyful',
    audioFeatures: {
      valence: [0.7, 1.0],
      energy: [0.6, 1.0],
      danceability: [0.6, 1.0],
    }
  },
  sad: {
    label: 'Sad',
    color: 'sad',
    gradient: 'emotion-gradient-sad',
    icon: '😢',
    emoji: '💙',
    description: 'Melancholic, sorrowful, emotional, introspective',
    audioFeatures: {
      valence: [0.0, 0.3],
      energy: [0.3, 0.7],
      acousticness: [0.4, 1.0],
    }
  },
  angry: {
    label: 'Angry',
    color: 'angry',
    gradient: 'emotion-gradient-angry',
    icon: '😠',
    emoji: '🔥',
    description: 'Aggressive, intense, powerful, confrontational',
    audioFeatures: {
      valence: [0.3, 0.6],
      energy: [0.8, 1.0],
      tempo: [120, 150],
    }
  },
  calm: {
    label: 'Calm',
    color: 'calm',
    gradient: 'emotion-gradient-calm',
    icon: '😌',
    emoji: '🍃',
    description: 'Peaceful, relaxing, soothing, meditative',
    audioFeatures: {
      valence: [0.4, 0.7],
      energy: [0.0, 0.4],
      acousticness: [0.3, 1.0],
    }
  },
  anxious: {
    label: 'Anxious',
    color: 'anxious',
    gradient: 'emotion-gradient-anxious',
    icon: '😰',
    emoji: '⚡',
    description: 'Tense, suspenseful, dramatic, unsettled',
    audioFeatures: {
      valence: [0.3, 0.6],
      energy: [0.6, 0.9],
      instrumentalness: [0.0, 0.5],
    }
  },
  excited: {
    label: 'Excited',
    color: 'excited',
    gradient: 'emotion-gradient-excited',
    icon: '🤩',
    emoji: '✨',
    description: 'Energetic, exhilarating, thrilling, invigorating',
    audioFeatures: {
      valence: [0.7, 1.0],
      energy: [0.7, 1.0],
      danceability: [0.7, 1.0],
    }
  },
  nostalgic: {
    label: 'Nostalgic',
    color: 'nostalgic',
    gradient: 'emotion-gradient-nostalgic',
    icon: '🥺',
    emoji: '⏰',
    description: 'Reflective, bittersweet, reminiscent, timeless',
    audioFeatures: {
      valence: [0.4, 0.7],
      energy: [0.3, 0.6],
      releaseDate: [1980, 2010],
    }
  },
  peaceful: {
    label: 'Peaceful',
    color: 'peaceful',
    gradient: 'emotion-gradient-peaceful',
    icon: '☮️',
    emoji: '🕊️',
    description: 'Serene, tranquil, zen, restorative',
    audioFeatures: {
      valence: [0.5, 0.8],
      energy: [0.0, 0.3],
      instrumentalness: [0.3, 1.0],
    }
  },
}

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',

  // Users
  GET_CURRENT_USER: '/users/me',
  UPDATE_PROFILE: '/users/me',
  GET_USER: '/users',
  DELETE_ACCOUNT: '/users/me',
  UPDATE_SETTINGS: '/users/me/settings',
  GET_STATISTICS: '/users/me/statistics',

  // Emotions
  DETECT_EMOTION: '/emotions/detect',
  GET_EMOTION_HISTORY: '/emotions/history',
  GET_EMOTION: '/emotions',
  UPDATE_EMOTION: '/emotions',
  DELETE_EMOTION: '/emotions',
  GET_EMOTION_STATISTICS: '/emotions/statistics',
  GET_EMOTION_TRENDS: '/emotions/trends',

  // Recommendations
  GENERATE_RECOMMENDATIONS: '/recommendations/generate',
  GET_RECOMMENDATIONS: '/recommendations',
  GET_RECOMMENDATION: '/recommendations',
  UPDATE_RECOMMENDATION: '/recommendations',
  DELETE_RECOMMENDATION: '/recommendations',
  GET_RECOMMENDATIONS_BY_EMOTION: '/recommendations/emotion',
  RECOMMENDATION_FEEDBACK: '/recommendations',

  // Playlists
  CREATE_PLAYLIST: '/playlists',
  GET_PLAYLISTS: '/playlists',
  GET_PLAYLIST: '/playlists',
  UPDATE_PLAYLIST: '/playlists',
  DELETE_PLAYLIST: '/playlists',
  ADD_SONG_TO_PLAYLIST: '/playlists',
  REMOVE_SONG_FROM_PLAYLIST: '/playlists',
  REORDER_SONG: '/playlists',

  // Songs
  SEARCH_SONGS: '/songs',
  GET_SONG: '/songs',
  LIKE_SONG: '/songs',
  UNLIKE_SONG: '/songs',
  GET_RELATED_SONGS: '/songs',

  // Favorites
  ADD_FAVORITE: '/favorites',
  GET_FAVORITES: '/favorites',
  DELETE_FAVORITE: '/favorites',
  GET_FAVORITES_BY_MOOD: '/favorites/mood',

  // Spotify
  CONNECT_SPOTIFY: '/spotify/connect',
  CHECK_SPOTIFY_CONNECTION: '/spotify/connected',
  DISCONNECT_SPOTIFY: '/spotify/disconnect',
  GET_SPOTIFY_PROFILE: '/spotify/user-profile',

  // Feedback
  SUBMIT_FEEDBACK: '/feedback',
  GET_MY_FEEDBACK: '/feedback/me',
  GET_ALL_FEEDBACK: '/feedback',
  UPDATE_FEEDBACK: '/feedback',
  DELETE_FEEDBACK: '/feedback',

  // Genres
  GET_GENRES: '/genres',
  GET_GENRE: '/genres',
  GET_GENRE_SONGS: '/genres',
}

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
}

// Language options
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
}

// Pagination
export const ITEMS_PER_PAGE = 20

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
}

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  EMOTION_TEXT_MIN_LENGTH: 5,
  EMOTION_TEXT_MAX_LENGTH: 500,
}

// Date formats
export const DATE_FORMATS = {
  FULL: 'MMMM dd, yyyy',
  SHORT: 'MM/dd/yyyy',
  TIME: 'hh:mm a',
  DATETIME: 'MM/dd/yyyy hh:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
}

// Feedback types
export const FEEDBACK_TYPES = {
  BUG: 'bug',
  FEATURE_REQUEST: 'feature_request',
  GENERAL_COMMENT: 'general_comment',
  EMOTION_ACCURACY: 'emotion_accuracy',
}

// Favorite categories
export const FAVORITE_CATEGORIES = {
  ALL_TIME: 'all-time',
  RECENT: 'recent',
  MOOD_BASED: 'mood-based',
}

// Time of day options
export const TIME_OF_DAY = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  NIGHT: 'night',
}

// Activity options
export const ACTIVITIES = {
  WORKING: 'working',
  RELAXING: 'relaxing',
  EXERCISING: 'exercising',
  STUDYING: 'studying',
  PARTYING: 'partying',
  COMMUTING: 'commuting',
  SLEEPING: 'sleeping',
}

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Logged out successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PLAYLIST_CREATED: 'Playlist created successfully',
  PLAYLIST_UPDATED: 'Playlist updated successfully',
  PLAYLIST_DELETED: 'Playlist deleted successfully',
  SONG_ADDED: 'Song added successfully',
  SONG_REMOVED: 'Song removed successfully',
  FAVORITE_ADDED: 'Added to favorites',
  FAVORITE_REMOVED: 'Removed from favorites',
  EMOTION_DETECTED: 'Emotion detected successfully',
  FEEDBACK_SUBMITTED: 'Feedback submitted successfully',
}

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You need to log in to access this resource.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
  TIMEOUT: 'Request timeout. Please try again.',
}
