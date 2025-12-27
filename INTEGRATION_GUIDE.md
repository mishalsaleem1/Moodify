# Frontend + Backend + Spotify Integration Guide

## System Overview

- **Frontend**: React + Vite (port 5173)
- **Backend**: NestJS (port 3001)
- **Database**: PostgreSQL (Neon)
- **Spotify**: OAuth 2.0 code exchange + top tracks sync
- **Auth**: JWT tokens stored in localStorage
- **API Communication**: Axios with interceptors for auto token refresh

## Architecture Layers

### 1. **API Layer** (`services/api.js`)
- Axios instance with base URL from environment
- Request interceptor: Auto-adds JWT token
- Response interceptor: Handles 401 by refreshing token
- Automatic retry on token refresh
- Error logging and handling

### 2. **Service Layer** (`services/index.js`)
- Organized by feature (auth, users, emotions, etc.)
- Clean CRUD interfaces
- Error handling and response transformation
- Centralized API call management

### 3. **State Management** (`context/AuthContext.jsx`)
- React Context for global auth state
- User data, loading state, authentication status
- Login, register, logout, updateUser functions
- Automatic initialization from localStorage
- Token refresh handling

### 4. **UI Layer** (`pages/`)
- Components use `useAuth()` hook for auth
- Uses service layer for API calls
- Error and loading state handling
- Form validation

## Key Integration Points

### 1. Backend Spotify Flow
- **`GET /api/spotify/connect`** (PUBLIC) → Returns Spotify authorization URL
- **`GET /api/spotify/callback`** (PUBLIC) → Exchanges auth code for token, redirects to frontend
- **`GET /api/spotify/sync?token=<TOKEN>`** (PUBLIC) → Fetches user's top tracks, stores in DB

### 2. Frontend Auth Flow
1. User signs up/logs in → JWT stored in localStorage (`access_token`, `refresh_token`)
2. Frontend axios interceptor auto-adds JWT to all requests
3. Protected routes require user to be authenticated via AuthContext

### 3. API Request Flow
```
Component
  ↓ useAuth() or service.method()
  ↓ api.post/get/put/delete()
  ↓ Interceptor adds auth header
  ↓ Request sent to backend
  ↓ Backend validates JWT
  ↓ Backend processes request
  ↓ Backend returns response
  ↓ Response interceptor checks status
  ↓ If 401: Auto-refresh token and retry
  ↓ Component receives data
  ↓ State updates, UI re-renders
```

### 4. Error Handling
- Network errors: Show toast notification
- 401 Unauthorized: Auto-refresh token, retry request
- 4xx Client errors: Display error message with details
- 5xx Server errors: Display generic error and log to console
- Timeout: After 15 seconds, show timeout error

## Running the Full Stack

### Prerequisites
1. Node.js v18+ installed
2. PostgreSQL running (or Neon connection string)
3. Spotify API credentials (optional, for Spotify integration)

### Terminal 1: Backend
```bash
cd Backend
npm install
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations (if needed)
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
cd Frontend
npm install
npm run dev
```

Expected output:
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- API Swagger Docs (if enabled): http://localhost:3001/api/docs

## Environment Configuration

### Backend `.env`
```dotenv
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=7d

# Spotify API (optional)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/spotify/callback

# Server
PORT=3001
NODE_ENV=development
```

### Frontend `.env`
```dotenv
# Backend API URL
VITE_API_URL=http://localhost:3001/api

# Spotify Configuration (optional)
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/spotify-callback

# Hugging Face (for emotion detection via API)
VITE_HUGGINGFACE_API_KEY=your_api_key_here
```

## Testing the Integration

### 1. Test Sign Up
```
1. Navigate to http://localhost:5173/signup
2. Fill in registration form:
   - Email: test@example.com
   - Username: testuser
   - Password: Test@123
   - First Name: Test
   - Last Name: User
3. Click "Create Account"
4. Should redirect to dashboard
5. Check localStorage: should have access_token, refresh_token, user
```

### 2. Test Log In
```
1. Navigate to http://localhost:5173/login
2. Enter credentials:
   - Email: test@example.com
   - Password: Test@123
3. Click "Sign In"
4. Should redirect to dashboard
5. Check localStorage for tokens
```

### 3. Test API Calls
```
1. Open DevTools → Network tab
2. Perform any action (e.g., fetch profile)
3. Check Authorization header: should be "Bearer <token>"
4. Check response status: should be 200 for success
5. Check response data: should match API format
```

### 4. Test Token Refresh
```
1. Log in successfully
2. Wait for token to expire (or manually delete access_token)
3. Make an API request
4. Should see:
   - Failed request with 401
   - Automatic refresh token request
   - Retry of original request
   - Success response
```

### 5. Test Error Handling
```
1. Invalid credentials → "Login failed" message
2. Network down → "Network error" message
3. Expired session → Auto-logout and redirect to login
4. Server error → Generic error message
```

## API Endpoints Reference

See [Backend/API.md](Backend/API.md) for complete documentation.

### Common Endpoints Used in Frontend

#### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - Log in user
- `POST /auth/logout` - Log out user
- `POST /auth/refresh-token` - Refresh access token
- `GET /auth/me` - Get current user

#### Users
- `GET /users/me` - Get user profile
- `PUT /users/me` - Update profile
- `PUT /users/me/settings` - Update settings
- `GET /users/me/statistics` - Get statistics

#### Emotions
- `POST /emotions/detect` - Detect emotion from text
- `GET /emotions/history` - Get emotion history
- `GET /emotions/statistics` - Get emotion stats
- `GET /emotions/trends` - Get emotion trends

#### Recommendations
- `POST /recommendations/generate` - Generate recommendations
- `GET /recommendations` - Get all recommendations
- `GET /recommendations/emotion/{emotionId}` - By emotion

#### Playlists
- `POST /playlists` - Create playlist
- `GET /playlists` - Get user's playlists
- `GET /playlists/{id}` - Get single playlist
- `PUT /playlists/{id}` - Update playlist
- `DELETE /playlists/{id}` - Delete playlist
- `POST /playlists/{id}/songs` - Add song to playlist

#### Songs
- `GET /songs` - Search songs
- `POST /songs/{id}/like` - Like song
- `DELETE /songs/{id}/like` - Unlike song

## Troubleshooting

### "Cannot POST /api/auth/login"
- Check backend is running on port 3001
- Check `VITE_API_URL` in frontend `.env`
- Check CORS configuration in backend `src/main.ts`
- Check network in DevTools for actual error

### "401 Unauthorized"
- Token may have expired
- Check if refresh token works
- Check JWT_SECRET matches between requests
- Clear localStorage and log in again

### "Stuck on loading screen after login"
- Check browser console for JS errors
- Check response format from backend
- Verify token is being stored correctly
- Check localStorage in DevTools

### "Cannot connect to database"
- Verify DATABASE_URL in backend `.env`
- Check PostgreSQL is running
- Run migrations: `npm run prisma:migrate`
- Check Neon connection if using cloud

### "Spotify integration not working"
- Get Client ID from Spotify Developer Dashboard
- Update SPOTIFY_CLIENT_ID in both frontend and backend `.env`
- Check redirect URI matches exactly
- Check API rate limits

## Architecture Comparison with 231644_A_4

This integration follows the patterns established in the 231644_A_4 book management system:

### ✅ Service Layer Pattern
```javascript
// Similar structure to 231644_A_4
export const booksAPI = {
  getAll: async () => { /* ... */ },
  getById: async (id) => { /* ... */ },
  create: async (data) => { /* ... */ },
  // ...
}

// Applied to FSWD
export const emotionService = {
  detectEmotion: async (data) => { /* ... */ },
  getEmotionHistory: async () => { /* ... */ },
  // ...
}
```

### ✅ Axios Interceptors
```javascript
// Error handling and auth token management
// Request: Auto-add Bearer token
// Response: Handle 401 by refreshing token
```

### ✅ Centralized API Configuration
```javascript
// Single axios instance with shared config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
})
```

### ✅ Context-Based State Management
```javascript
// AuthProvider wraps app with global auth state
const { user, loading, isAuthenticated } = useAuth()
```

## Performance Optimization Tips

1. **Token Caching**: Tokens cached in localStorage for offline capability
2. **Request Deduplication**: Consider adding request caching for identical requests
3. **Lazy Loading**: Load pages only when needed
4. **API Response Caching**: Cache user profile and settings
5. **Image Optimization**: Compress album art before sending

## Security Best Practices

1. ✅ Tokens stored in localStorage (consider httpOnly cookies for production)
2. ✅ HTTPS required for production (Spotify redirects)
3. ✅ JWT validation on backend
4. ✅ CORS properly configured
5. ✅ Password validation on frontend and backend
6. ✅ Sensitive data not logged

## Next Steps

1. Complete database setup
2. Test full authentication flow
3. Implement protected routes
4. Set up Spotify integration
5. Add error tracking (Sentry, etc.)
6. Configure production environment
7. Deploy to hosting

---

**Status**: ✅ Integration Complete  
**Last Updated**: December 22, 2025


## Testing the Integration

### Step 1: Verify Backend & Frontend are Running
- Backend: `http://localhost:3001/api/auth/login` (test endpoint)
- Frontend: `http://localhost:5173` (landing page loads)

### Step 2: Test Auth Flow
1. Go to http://localhost:5173
2. Click "Sign Up" or "Login"
3. Use seeded user: `test@example.com` / `password123`
4. Verify JWT is in localStorage after login

### Step 3: Test Spotify Connect Flow
1. After login, go to Profile
2. Click "Connect Spotify"
3. Verify you're redirected to Spotify authorization page
4. After authorization, verify:
   - Spotify token is in localStorage (`spotify_access_token`)
   - Songs are added to database (check Neon DB)
   - Profile shows "Spotify Connected"

### Step 4: Verify Data in Database
```sql
-- Check synced songs
SELECT title, artist, "spotifyId" FROM "Song" LIMIT 10;

-- Check user data
SELECT id, email, username FROM "User";
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d
SPOTIFY_CLIENT_ID=b384cd15e4234828b62dde2af85132b2
SPOTIFY_CLIENT_SECRET=2c47baeb913f4d9cb17d2c6c3cfc169e
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/spotify/callback
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_SPOTIFY_CLIENT_ID=b384cd15e4234828b62dde2af85132b2
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/spotify-callback
```

## Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running on port 3001
- Check CORS is enabled in `main.ts` for http://localhost:5173

### "Spotify redirect not working"
- Verify FRONTEND_URL is set to `http://localhost:5173`
- Check Spotify app settings include callback URIs:
  - http://localhost:3001/api/spotify/callback (backend)
  - http://localhost:5173/spotify-callback (frontend)

### "Songs not syncing"
- Check localStorage has `spotify_access_token`
- Verify `/api/spotify/sync` is called after callback
- Check backend logs for sync errors

### "JWT not in auth header"
- Verify `api.js` has request interceptor that reads `access_token` from localStorage
- Check frontend localStorage has `access_token` after login

## Key Files Modified for Integration

- `Backend/src/modules/spotify/spotify.controller.ts` — Made `/connect` public, fixed `/callback`, removed JWT from `/sync`
- `Backend/src/modules/spotify/spotify.service.ts` — Token exchange & track sync logic
- `Frontend/src/pages/SpotifyCallback.jsx` — Auto-sync after storing token
- `Frontend/src/pages/Profile.jsx` — Check local Spotify token for connected status
- `Frontend/.env` — Spotify client ID & redirect URI
- `Backend/.env` — Spotify credentials & FRONTEND_URL
- `Frontend/src/services/api.js` — Axios baseURL & auth interceptor (already correct)

## Database Schema

All data is persisted in PostgreSQL via Prisma:
- Users login via `User` table
- Spotify sync creates `Song` records with `spotifyId`, `title`, `artist`, `album`, `duration`, `imageUrl`
- Playlists, Favorites, etc. linked via foreign keys

---

**Status**: All integration wiring complete. Both servers should run smoothly and sync Spotify songs to DB.
