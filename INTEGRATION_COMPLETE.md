# FSWD-SEM-PROJECT: Backend-Frontend Integration Guide

## ✅ Integration Complete

This guide documents the full integration of the FSWD-SEM-PROJECT backend (NestJS) with the frontend (React + Vite), following the architecture patterns from the 231644_A_4 project.

---

## 📁 Project Structure

### Backend (NestJS)
- **Port**: 3001
- **API Base URL**: `http://localhost:3001/api`
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT-based

```
Backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts (CORS configured here)
│   ├── modules/
│   │   ├── auth/      (Login, Register, JWT)
│   │   ├── users/     (Profile management)
│   │   ├── emotions/  (Emotion detection)
│   │   ├── songs/     (Music catalog)
│   │   ├── playlists/ (User playlists)
│   │   ├── spotify/   (Spotify integration)
│   │   └── ...
│   └── common/
│       ├── decorators/
│       ├── dtos/
│       └── prisma/
├── prisma/
│   └── schema.prisma (Database schema)
└── package.json
```

### Frontend (React + Vite)
- **Port**: 5173
- **API Base URL**: `http://localhost:3001/api` (configured in `.env`)
- **Framework**: React 18 + Vite
- **State Management**: Zustand + React Context
- **Styling**: Tailwind CSS

```
Frontend/
├── src/
│   ├── context/
│   │   ├── AuthContext.jsx    (Authentication state)
│   │   └── ThemeContext.jsx   (Theme state)
│   ├── services/
│   │   ├── api.js             (Axios instance with interceptors)
│   │   ├── index.js           (Centralized service layer)
│   │   ├── spotify.js         (Spotify API calls)
│   │   └── ...
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx      (Uses AuthContext)
│   │   │   ├── Register.jsx   (Uses AuthContext)
│   │   │   └── ...
│   │   └── ...
│   ├── utils/
│   │   └── constants.js       (API endpoints, storage keys)
│   └── App.jsx
├── .env.example
└── package.json
```

---

## 🔐 Authentication Flow

### 1. **User Registration**
```
Frontend (Register.jsx)
    ↓
authService.register(userData)
    ↓
POST /auth/register
    ↓
Backend validates & creates user
    ↓
Returns { user, accessToken, refreshToken }
    ↓
AuthContext stores in localStorage & state
    ↓
Redirect to /dashboard
```

### 2. **User Login**
```
Frontend (Login.jsx)
    ↓
authService.login(credentials)
    ↓
POST /auth/login
    ↓
Backend validates credentials
    ↓
Returns { user, accessToken, refreshToken }
    ↓
AuthContext stores tokens & user
    ↓
Redirect to /dashboard
```

### 3. **Token Refresh (Automatic)**
```
Any API Call
    ↓
api.interceptors.request
    ↓
Adds Authorization: Bearer <token>
    ↓
If 401 Unauthorized Response
    ↓
api.interceptors.response
    ↓
POST /auth/refresh-token with refreshToken
    ↓
Gets new accessToken
    ↓
Retries original request
    ↓
If refresh fails → Clear storage & redirect to /login
```

### 4. **Logout**
```
Frontend
    ↓
logout() from AuthContext
    ↓
Optional: POST /auth/logout (backend)
    ↓
Clear localStorage (access_token, refresh_token, user)
    ↓
Clear Redux/Zustand state
    ↓
Redirect to /login
```

---

## 🔌 API Service Architecture

### Axios Configuration (`services/api.js`)
```javascript
// Features:
✓ Environment-based baseURL from VITE_API_URL
✓ Request interceptor: Auto-adds Bearer token
✓ Response interceptor: Handles errors & token refresh
✓ Logging in development mode
✓ 15-second timeout
```

### Service Layer (`services/index.js`)
Organized by feature with CRUD operations:
- `authService` → auth/register, login, logout, refresh-token
- `userService` → user profile, settings, statistics
- `emotionService` → emotion detection, history, analytics
- `recommendationService` → recommendations by emotion
- `playlistService` → CRUD operations on playlists
- `songService` → search, like, related songs
- `spotifyService` → connect, sync, profile
- `favoritesService` → add/remove favorites
- `feedbackService` → submit and manage feedback
- `genreService` → browse genres and songs

### Storage Keys (`utils/constants.js`)
```javascript
STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SPOTIFY_TOKEN: 'spotify_token',
  SPOTIFY_CONNECTED: 'spotify_connected',
}
```

---

## 📋 Environment Configuration

### Backend `.env`
```dotenv
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRATION=7d

# Spotify API
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/spotify/callback

# Server
PORT=3001
NODE_ENV=development
```

### Frontend `.env`
```dotenv
# Backend API URL
VITE_API_URL=http://localhost:3001/api

# Spotify Configuration
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/spotify-callback

# Hugging Face (for emotion detection)
VITE_HUGGINGFACE_API_KEY=your_api_key_here
```

---

## 🚀 Running the Full Stack

### Terminal 1: Backend
```bash
cd c:\Users\HP\Downloads\FSWD-SEM-PROJECT\Backend
npm install
npm run prisma:generate    # Generate Prisma client
npm run start:dev          # Start in watch mode
```

Expected output:
```
[Nest] 12345  - 01/01/2025, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 01/01/2025, 10:00:01 AM     LOG [InstanceLoader] AppModule dependencies initialized
🚀 Server running on http://localhost:3001
```

### Terminal 2: Frontend
```bash
cd c:\Users\HP\Downloads\FSWD-SEM-PROJECT\Frontend
npm install
npm run dev
```

Expected output:
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🔍 Testing the Integration

### 1. **Test Registration**
```
Navigate to: http://localhost:5173/signup
Fill form with:
  - Email: test@example.com
  - Username: testuser
  - Password: password123
  - First Name: Test
  - Last Name: User

Expected: 
  ✓ User created in database
  ✓ Tokens stored in localStorage
  ✓ Redirected to /dashboard
```

### 2. **Test Login**
```
Navigate to: http://localhost:5173/login
Use credentials from above
  - Email: test@example.com
  - Password: password123

Expected:
  ✓ User authenticated
  ✓ Tokens refreshed
  ✓ Redirected to /dashboard
```

### 3. **Test Protected Routes**
```
With valid token: All API calls should work
With expired token: Should automatically refresh
With invalid token: Should redirect to /login
```

### 4. **Test API Calls**
Open browser DevTools → Network tab
Watch API calls to confirm:
- ✓ Authorization header present: `Bearer <token>`
- ✓ Responses include proper data
- ✓ Errors handled gracefully

---

## 🔄 Data Flow Examples

### Getting User Profile
```
React Component
    ↓ useAuth() → user state
    ↓ or userService.getCurrentUser()
    ↓ GET /users/me (with auth header)
    ↓ Backend validates JWT
    ↓ Returns user data
    ↓ React updates state
    ↓ Component re-renders
```

### Detecting Emotion
```
React Component
    ↓ emotionService.detectEmotion(text)
    ↓ POST /emotions/detect (with auth header)
    ↓ Backend processes with ML model
    ↓ Returns emotion + recommendations
    ↓ React displays results
```

### Liking a Song
```
React Component
    ↓ songService.likeSong(songId)
    ↓ POST /songs/{id}/like (with auth header)
    ↓ Backend adds to user's favorites
    ↓ Returns updated song data
    ↓ React updates UI
```

---

## 📝 Key Integration Points

### 1. **CORS Configuration** ✅
- Backend: `src/main.ts` allows localhost:5173
- Frontend: Can make requests to localhost:3001

### 2. **Error Handling** ✅
- 401 responses: Auto-refresh token
- 4xx responses: Display user-friendly messages with toast
- 5xx responses: Log to console, display generic error
- Network errors: Timeout after 15 seconds

### 3. **Loading States** ✅
- Login/Register: Shows spinner during submission
- API calls: Each service returns promise with status
- Auth context: `loading` prop available globally

### 4. **Token Management** ✅
- Access token: Sent in Authorization header
- Refresh token: Stored securely in localStorage
- Auto-refresh: Happens transparently on 401
- Logout: Clears all tokens

---

## 🐛 Troubleshooting

### "Cannot POST /auth/login"
- ✓ Backend running on port 3001?
- ✓ Check `VITE_API_URL` in Frontend `.env`
- ✓ Check CORS origin in Backend `main.ts`

### "401 Unauthorized"
- ✓ Token expired? Check localStorage
- ✓ Token malformed? Check JWT_SECRET matches
- ✓ Route protected? Check middleware

### "Login successful but stuck on loading"
- ✓ Check browser console for errors
- ✓ Verify response format from backend
- ✓ Check localStorage permissions

### "Can't connect to database"
- ✓ Check DATABASE_URL in Backend `.env`
- ✓ Verify Neon connection string
- ✓ Run `npm run prisma:generate`
- ✓ Run `npm run prisma:migrate`

---

## 📚 References

### API Endpoints
See [Backend/API.md](../Backend/API.md) for complete endpoint documentation

### Architecture Pattern
Inspired by [231644_A_4](../231644_A_4/) book management system
- Centralized API service layer
- Context-based auth management
- Modular backend structure
- Clean separation of concerns

### Documentation
- [Backend Setup](../Backend/SETUP.md)
- [Spotify Integration](../Backend/SPOTIFY_FIXES.md)
- [Integration Guide](../INTEGRATION_GUIDE.md)

---

## ✨ Features Enabled

### Authentication
- ✅ User registration
- ✅ Email/password login
- ✅ JWT token management
- ✅ Automatic token refresh
- ✅ Logout functionality
- ✅ Password change

### Music Discovery
- ✅ Emotion detection
- ✅ Song recommendations
- ✅ Playlist management
- ✅ Favorite songs
- ✅ Genre browsing

### Spotify Integration
- ✅ OAuth connection
- ✅ Top tracks sync
- ✅ Playlist creation
- ✅ Song sharing

### User Features
- ✅ Profile management
- ✅ Settings
- ✅ Feedback submission
- ✅ History tracking
- ✅ Statistics dashboard

---

## 🎯 Next Steps

1. **Database Setup**
   - Ensure PostgreSQL is running
   - Update DATABASE_URL in `.env`
   - Run migrations: `npm run prisma:migrate`

2. **Spotify API Setup** (Optional)
   - Create app on Spotify Developer Dashboard
   - Get Client ID & Secret
   - Update in Backend & Frontend `.env`

3. **Hugging Face Setup** (Optional)
   - For emotion detection via API
   - Get API key from huggingface.co
   - Update VITE_HUGGINGFACE_API_KEY

4. **Development**
   - Run both services in separate terminals
   - Test authentication flow
   - Build features using established patterns

5. **Deployment**
   - Build frontend: `npm run build`
   - Deploy to hosting (Vercel, Netlify, etc.)
   - Configure production environment variables

---

## 📞 Support

For issues or questions:
1. Check console for error messages
2. Review browser DevTools Network tab
3. Check Backend logs in terminal
4. Verify environment variables
5. Refer to documentation files

---

**Last Updated**: December 22, 2025  
**Integration Status**: ✅ Complete
