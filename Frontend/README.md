# MoodSync - Emotion-Based Music Recommendation System

<div align="center">
  <h3>🎵 Discover Music That Matches Your Mood 🎭</h3>
  <p>An AI-powered music recommendation platform that detects your emotional state and provides personalized song suggestions</p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Core Functionality](#core-functionality)
- [API Integration](#api-integration)
- [Components Documentation](#components-documentation)
- [State Management](#state-management)
- [Styling](#styling)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

**MoodSync** is a full-stack web application that revolutionizes music discovery by analyzing your real-time emotional state through AI-powered sentiment analysis. The system provides hyper-personalized song recommendations based on detected emotions, creating a unique and emotionally-intelligent music experience.

### Problem Statement
Traditional music platforms rely solely on listening history and generic algorithms, ignoring users' current emotional states. MoodSync bridges this gap by:
- Detecting emotions in real-time through text analysis
- Mapping emotions to specific musical characteristics
- Providing personalized recommendations that match your current mood

---

## ✨ Features

### 🎭 Emotion Detection
- **AI-Powered Analysis**: Uses Hugging Face Transformers for accurate emotion detection
- **8 Emotion Categories**: Happy, Sad, Angry, Calm, Anxious, Excited, Nostalgic, Peaceful
- **Text Input**: Describe your mood in natural language
- **Confidence Scoring**: See how confident the AI is about detected emotions

### 🎵 Smart Recommendations
- **Mood Matching**: Songs matched to audio features (valence, energy, danceability)
- **Match Scoring**: See how well each song matches your mood
- **Like/Dislike System**: Train the algorithm with your preferences
- **Spotify Integration**: (Backend ready) Connect your Spotify account

### 📝 Playlist Management
- **Create & Edit**: Build custom playlists
- **Mood Association**: Tag playlists with emotions
- **Drag & Drop**: Reorder songs easily
- **Public/Private**: Control playlist visibility

### ❤️ Favorites
- **Quick Access**: Save your favorite songs
- **Categorization**: All-Time, Recent, Mood-Based
- **Export**: Add to playlists or download

### 📊 Emotion History
- **Timeline View**: Track your emotional journey
- **Statistics**: Pie charts and distribution graphs
- **Trend Analysis**: Understand emotional patterns
- **Export Data**: Download your emotion history

### 👤 User Profile
- **Account Management**: Edit profile, change password
- **Statistics Dashboard**: View your activity stats
- **Privacy Controls**: Manage data sharing preferences

### ⚙️ Settings
- **Theme Modes**: Light, Dark, Auto (system preference)
- **Notifications**: Email alerts, recommendation updates
- **Integrations**: Spotify, Weather API (future)
- **Privacy**: Control public profile and data sharing

---

## 🛠️ Tech Stack

### Frontend
- **React 18+**: Modern functional components with Hooks
- **React Router v6**: Client-side routing with protected routes
- **Tailwind CSS**: Utility-first styling with custom theme
- **Framer Motion**: Smooth animations and transitions
- **React Query**: Server state management and caching
- **Axios**: HTTP client with interceptors
- **React Hot Toast**: Beautiful toast notifications
- **Recharts**: Data visualization (charts and graphs)
- **React Icons**: Comprehensive icon library

### Build Tools
- **Vite**: Lightning-fast build tool and dev server
- **PostCSS**: CSS processing with Autoprefixer
- **ESLint**: Code linting and quality

### Development
- **Git**: Version control
- **VS Code**: Recommended IDE
- **Chrome DevTools**: Debugging

---

## 📁 Project Structure

```
project/
├── public/                   # Static assets
├── src/
│   ├── assets/              # Images, fonts, static files
│   ├── components/          # Reusable components
│   │   ├── common/         # Generic UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── SkeletonLoader.jsx
│   │   └── layout/         # Layout components
│   │       ├── MainLayout.jsx
│   │       ├── Navbar.jsx
│   │       └── Sidebar.jsx
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   │   ├── auth/          # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EmotionDetection.jsx
│   │   ├── Recommendations.jsx
│   │   ├── Playlists.jsx
│   │   ├── PlaylistDetail.jsx
│   │   ├── Favorites.jsx
│   │   ├── History.jsx
│   │   ├── Profile.jsx
│   │   ├── Settings.jsx
│   │   └── LandingPage.jsx
│   ├── services/           # API service layer
│   │   ├── api.js         # Axios instance with interceptors
│   │   └── index.js       # All API service functions
│   ├── utils/              # Utility functions
│   │   ├── constants.js   # App constants and configs
│   │   ├── helpers.js     # Helper functions
│   │   └── validation.js  # Form validation functions
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── .eslintrc.cjs         # ESLint configuration
├── .gitignore            # Git ignore rules
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ (Download from [nodejs.org](https://nodejs.org/))
- **npm** or **yarn**: Package manager
- **Git**: Version control
- **Backend API**: MoodSync backend server running (see backend repo)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_HUGGINGFACE_API_KEY=your_key_here
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_HUGGINGFACE_API_KEY` | Hugging Face API key for emotion detection | Yes |
| `VITE_SPOTIFY_CLIENT_ID` | Spotify application client ID | No |
| `VITE_SPOTIFY_REDIRECT_URI` | OAuth redirect URI | No |

### Tailwind Configuration

Custom theme colors for each emotion are defined in `tailwind.config.js`:
- Happy: Yellow/Orange gradients
- Sad: Blue tones
- Calm: Green tones
- Angry: Red tones
- Excited: Pink/Magenta
- Peaceful: Purple/Lavender
- Anxious: Amber/Orange
- Nostalgic: Purple/Pink

---

## 📜 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🎯 Core Functionality

### Authentication Flow

```jsx
// Login flow
const { login } = useAuth()
const result = await login({ email, password })
// - Validates credentials
// - Stores JWT tokens (access + refresh)
// - Redirects to dashboard
```

### Emotion Detection Flow

```jsx
// 1. User inputs mood description
const text = "I'm feeling happy and energetic!"

// 2. Send to backend emotion detection API
const emotion = await emotionService.detectEmotion({
  input_text: text,
  input_type: 'text'
})
// Returns: { detected_emotion: 'happy', confidence_score: 0.95 }

// 3. Generate recommendations based on emotion
const recommendations = await recommendationService.generateRecommendations(emotion.id)

// 4. Display songs matched to emotion
```

### Recommendation Algorithm

Songs are scored using:
```javascript
Match Score = (0.3 × Audio_Feature_Match) +
              (0.25 × User_Preference_Match) +
              (0.2 × Popularity_Score) +
              (0.15 × Genre_Match) +
              (0.1 × Recency_Bonus)
```

Audio features mapped to emotions:
- **Happy**: High valence (0.7-1.0), high energy (0.6-1.0)
- **Sad**: Low valence (0.0-0.3), moderate energy
- **Calm**: Moderate valence, low energy (0.0-0.4)
- **Angry**: Moderate valence, very high energy (0.8-1.0)

---

## 🔌 API Integration

### Service Layer Architecture

All API calls go through service functions in `src/services/index.js`:

```javascript
// Example: Emotion Service
export const emotionService = {
  detectEmotion: async (data) => {
    const response = await api.post('/emotions/detect', data)
    return response.data
  },
  
  getEmotionHistory: async (params) => {
    const response = await api.get('/emotions/history', { params })
    return response.data
  },
  // ... more methods
}
```

### Axios Interceptors

**Request Interceptor**: Automatically adds JWT token
```javascript
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**Response Interceptor**: Handles token refresh on 401
```javascript
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      // Retry original request
    }
    return Promise.reject(error)
  }
)
```

---

## 🧩 Components Documentation

### Reusable Components

#### Button
```jsx
<Button 
  variant="primary|secondary|danger|success|outline|ghost"
  size="sm|md|lg"
  fullWidth={boolean}
  loading={boolean}
  onClick={handler}
>
  Click Me
</Button>
```

#### Card
```jsx
<Card 
  hover={boolean}
  onClick={handler}
  noPadding={boolean}
  className="custom-classes"
>
  Content here
</Card>
```

#### Input
```jsx
<Input
  label="Email"
  type="email"
  value={value}
  onChange={handler}
  error={errorMessage}
  icon={FiMail}
  placeholder="Enter email"
/>
```

#### Modal
```jsx
<Modal
  isOpen={isOpen}
  onClose={closeHandler}
  title="Modal Title"
  size="sm|md|lg|xl|full"
>
  Modal content
</Modal>
```

---

## 🎨 Styling

### Tailwind Utilities

Custom utility classes defined in `index.css`:

```css
/* Emotion gradients */
.emotion-gradient-happy { @apply bg-gradient-to-br from-happy-300 via-happy-500 to-happy-700; }
.emotion-gradient-sad { @apply bg-gradient-to-br from-sad-300 via-sad-500 to-sad-700; }
/* ... more emotions */

/* Buttons */
.btn { @apply px-6 py-3 rounded-lg font-semibold transition-all; }
.btn-primary { @apply bg-blue-600 text-white hover:bg-blue-700; }

/* Cards */
.card { @apply bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6; }
```

### Dark Mode

Theme controlled via `ThemeContext`:
```jsx
const { theme, toggleTheme, setTheme } = useTheme()
// theme: 'light' | 'dark' | 'auto'
```

Classes automatically applied to `<html>` element:
```javascript
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
```

---

## 📈 State Management

### Context Providers

#### AuthContext
Manages user authentication state:
```jsx
const { 
  user,              // Current user object
  isAuthenticated,   // Boolean
  loading,           // Auth check in progress
  login,             // Login function
  register,          // Registration function
  logout,            // Logout function
  updateUser         // Update user profile
} = useAuth()
```

#### ThemeContext
Manages theme and emotion state:
```jsx
const {
  theme,            // Current theme
  toggleTheme,      // Switch theme
  setTheme,         // Set specific theme
  currentEmotion,   // Currently detected emotion
  setCurrentEmotion // Update current emotion
} = useTheme()
```

### React Query

Used for server state management and caching:
```jsx
const { data, isLoading, error } = useQuery(
  'recommendations',
  recommendationService.getRecommendations,
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000  // 10 minutes
  }
)
```

---

## 🚧 Future Enhancements

### Phase 1 - Core Features (Completed)
- ✅ User authentication
- ✅ Emotion detection via text
- ✅ Music recommendations
- ✅ Playlist management
- ✅ Favorites system
- ✅ Emotion history tracking

### Phase 2 - Enhanced Features (Planned)
- 🔄 Facial recognition emotion detection
- 🔄 Spotify API integration (play songs)
- 🔄 Real-time collaborative playlists
- 🔄 Social features (share playlists, follow users)
- 🔄 Weather-based recommendations
- 🔄 Activity-based suggestions

### Phase 3 - Advanced Features (Future)
- 🔮 Voice-based emotion detection
- 🔮 ML model improvements
- 🔮 Multi-language support
- 🔮 Mobile app (React Native)
- 🔮 Podcast recommendations
- 🔮 Mood journaling integration

---

## 📝 Notes for Backend Integration

This frontend is designed to work with a Node.js/Express backend. Required API endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token

### Emotions
- `POST /api/emotions/detect` - Detect emotion from text
- `GET /api/emotions/history` - Get emotion history
- `GET /api/emotions/statistics` - Get emotion statistics
- `DELETE /api/emotions/:id` - Delete emotion entry

### Recommendations
- `POST /api/recommendations/generate` - Generate recommendations
- `GET /api/recommendations` - Get all recommendations
- `PUT /api/recommendations/:id` - Update recommendation (like/dislike)

### Playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get single playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/songs` - Add song to playlist

### Favorites
- `POST /api/favorites` - Add to favorites
- `GET /api/favorites` - Get favorites
- `DELETE /api/favorites/:id` - Remove from favorites

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Your Name** - *Initial work* - Full Stack Development

---

## 🙏 Acknowledgments

- Hugging Face for emotion detection models
- Spotify for music API
- React community for amazing libraries
- Tailwind CSS for utility-first styling

---

<div align="center">
  <p>Made with ❤️ and 🎵</p>
  <p>
    <a href="#moodsync---emotion-based-music-recommendation-system">Back to Top ↑</a>
  </p>
</div>
