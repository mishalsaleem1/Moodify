# Spotify API Integration

This module provides full integration with the Spotify Web API using **two authentication methods**:

## 🔐 Authentication Methods

### 1. **Client Credentials Flow** (NEW - NO USER LOGIN REQUIRED)
- ✅ **App-level access** - Access Spotify catalog without user authentication
- ✅ **Search tracks** - Search for any song, artist, album
- ✅ **Get recommendations** - Mood-based song recommendations
- ✅ **Automatic token refresh** - Handles 1-hour token expiration
- ✅ **Perfect for**: Mood detection, search features, public recommendations

### 2. **Authorization Code Flow** (Existing - User Authentication)
- ✅ **User-specific data** - Access user's top tracks, playlists, library
- ✅ **Personalized recommendations** - Based on user's listening history
- ✅ **Save to library** - Add tracks to user's Spotify library
- ✅ **Perfect for**: User profiles, personalized features

---

## 🚀 Quick Start (Client Credentials Flow)

### 1. Get Spotify Credentials
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **"Create App"**
3. Copy your **Client ID** and **Client Secret**

### 2. Configure Environment Variables
Add to `Backend/.env`:
```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/spotify/callback
```

### 3. Start Using
No additional setup needed! The service automatically handles token management.

---

## 📡 API Endpoints

### 🆕 Client Credentials Flow Endpoints (No Auth Required)

#### 1. Search Tracks
```http
GET /api/spotify/search?q={query}&limit={limit}
```

**Parameters:**
- `q` (required): Search query (song name, artist, keywords)
- `limit` (optional): Number of results (default: 20, max: 50)

**Example:**
```bash
curl "http://localhost:3001/api/spotify/search?q=happy%20songs&limit=10"
```

**Response:**
```json
{
  "tracks": {
    "items": [
      {
        "id": "spotify_track_id",
        "name": "Song Name",
        "artists": [{"id": "...", "name": "Artist Name"}],
        "album": {
          "name": "Album Name",
          "images": [{"url": "https://..."}]
        },
        "preview_url": "https://...30sec.mp3",
        "external_urls": {"spotify": "https://open.spotify.com/track/..."}
      }
    ]
  }
}
```

#### 2. Mood-Based Recommendations
```http
GET /api/spotify/mood-recommendations?mood={mood}&limit={limit}
```

**Parameters:**
- `mood` (required): Mood name - `happy`, `sad`, `calm`, `energetic`, `romantic`, `party`, `focus`, `angry`
- `limit` (optional): Number of results (default: 20)

**Example:**
```bash
curl "http://localhost:3001/api/spotify/mood-recommendations?mood=happy&limit=15"
```

**Response:** Same format as search tracks

---

### 👤 User Authentication Flow Endpoints (Requires User Login)

#### Get Top Tracks
```http
GET /api/spotify/top-tracks?token=<ACCESS_TOKEN>&timeRange=long_term&limit=20
```

Query parameters:
- `token` (required): Spotify access token
- `timeRange` (optional): `short_term`, `medium_term`, or `long_term` (default: `long_term`)
- `limit` (optional): number of tracks (1-50, default: 20)

Response:
```json
{
  "tracks": [
    {
      "id": "track_id",
      "name": "Song Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "imageUrl": "https://...",
      "previewUrl": "https://...",
      "spotifyUrl": "https://open.spotify.com/track/..."
    }
  ]
}
```

#### Get Top Artists
```http
GET /api/spotify/top-artists?token=<ACCESS_TOKEN>&timeRange=long_term&limit=20
```

Similar to top tracks. Returns artists with genres and image URL.

### Search

#### Search Tracks
```http
GET /api/spotify/search?token=<ACCESS_TOKEN>&query=<SEARCH_QUERY>&limit=20
```

Query parameters:
- `token` (required): Spotify access token
- `query` (required): search term (e.g., "Imagine", "The Beatles")
- `limit` (optional): results limit (default: 20)

### Recommendations

#### Get Recommendations
```http
POST /api/spotify/recommendations?token=<ACCESS_TOKEN>
```

Request body:
```json
{
  "seedArtists": ["artist_id_1", "artist_id_2"],
  "seedGenres": ["pop", "rock"],
  "seedTracks": ["track_id_1"],
  "limit": 20
}
```

**Note:** You can provide up to 5 seeds in total (combination of artists, genres, and tracks).

### Track Details

#### Get Track with Audio Features
```http
GET /api/spotify/track/:trackId?token=<ACCESS_TOKEN>
```

Returns track details and audio features (energy, valence, danceability, etc.)

#### Get Current User Profile
```http
GET /api/spotify/me?token=<ACCESS_TOKEN>
```

Returns user ID, email, display name, followers, etc.

### Sync Data

#### Sync Top Tracks to Database
```http
POST /api/spotify/sync-tracks?token=<ACCESS_TOKEN>&limit=50
```

Requires JWT authentication. Syncs user's top Spotify tracks to the `Song` table.

Response:
```json
{
  "message": "Successfully synced 50 tracks to database",
  "count": 50
}
```

## Usage Examples

### PowerShell

#### 1. Get Authorization URL
```powershell
$authUrl = Invoke-RestMethod -Uri http://localhost:3001/api/spotify/login -Method Get
Start-Process $authUrl.url
```

#### 2. After redirecting back, you'll have an access token. Get top tracks:
```powershell
$token = "your_spotify_access_token"
$response = Invoke-RestMethod `
  -Uri "http://localhost:3001/api/spotify/top-tracks?token=$token&limit=5" `
  -Method Get

$response.tracks | ForEach-Object { Write-Host "$($_.name) by $($_.artist)" }
```

#### 3. Search for tracks:
```powershell
$response = Invoke-RestMethod `
  -Uri "http://localhost:3001/api/spotify/search?token=$token&query=Imagine" `
  -Method Get

$response.tracks | ForEach-Object { Write-Host "$($_.name) - $($_.artist)" }
```

#### 4. Sync tracks to database (requires JWT):
```powershell
$jwtToken = "your_jwt_token"
$headers = @{ Authorization = "Bearer $jwtToken" }

Invoke-RestMethod `
  -Uri "http://localhost:3001/api/spotify/sync-tracks?token=$token&limit=50" `
  -Method Post `
  -Headers $headers
```

### curl

#### Get top tracks:
```bash
curl -i "http://localhost:3001/api/spotify/top-tracks?token=ACCESS_TOKEN&limit=5"
```

#### Search tracks:
```bash
curl -i "http://localhost:3001/api/spotify/search?token=ACCESS_TOKEN&query=Imagine"
```

#### Get recommendations:
```bash
curl -X POST http://localhost:3001/api/spotify/recommendations?token=ACCESS_TOKEN \
  -H "Content-Type: application/json" \
  -d '{
    "seedGenres": ["pop", "rock"],
    "limit": 20
  }'
```

## How to Get an Access Token

1. Click on `/api/spotify/login` endpoint
2. You'll be redirected to Spotify login
3. Approve the scopes requested by the app
4. You'll be redirected to the callback endpoint with your access token in the response

Or use the Spotify Web API directly:
```bash
# Get authorization code
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3001/api/spotify/callback&scope=user-read-private+user-read-email+user-top-read

# Exchange code for token (you'll get access_token in response)
```

## Database Integration

The `syncSpotifyTracksToDb()` method automatically:
- Creates entries in the `Song` table
- Stores Spotify track ID, image URL, artist, album, and duration
- Skips duplicates (tracks already synced)

You can then:
- Add synced tracks to playlists
- Mark as favorites
- Use in recommendations
- Filter by genre through the Spotify data

## Scopes

The app requests these Spotify scopes:
- `user-read-private` - Read user profile data
- `user-read-email` - Read user email
- `user-top-read` - Read user's top artists/tracks
- `playlist-read-private` - Read user's private playlists
- `playlist-read-collaborative` - Read user's collaborative playlists

Add more scopes in `spotify.service.ts` if needed (e.g., `playlist-modify-public`, `playlist-modify-private`).

## Error Handling

All endpoints return proper HTTP status codes:
- `200` - Success
- `400` - Bad request (missing parameters)
- `401` - Unauthorized (invalid or expired token)
- `500` - Server error

Error responses include:
```json
{
  "error": "Error description"
}
```

## Troubleshooting

### "No Spotify access token available"
- Make sure you're providing the `token` query parameter
- Token might be expired (valid for 1 hour)

### "Invalid credentials"
- Check your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env`

### CORS errors
- Already configured in `main.ts` to allow requests from `http://localhost:5173`
- Update `enableCors()` if using a different frontend URL

## Next Steps

- [ ] Create a `SpotifyAuth` table to store user's refresh tokens
- [ ] Implement token refresh automatically
- [ ] Add more Spotify endpoints (playlists, saved tracks, etc.)
- [ ] Implement mood-based Spotify recommendations based on emotion history
- [ ] Create scheduled jobs to periodically sync top tracks

## Quick runtime steps (apply to enable DB syncing)

1. Ensure `Backend/.env` includes Spotify keys and server values (see `SPOTIFY_FIXES.md`).
2. Run migrations from `Backend`:

  npx prisma migrate dev --name add_spotify_id_unique

  If that fails because DB already matches the schema, run:

  npx prisma db push

3. Regenerate Prisma client if necessary:

  npx prisma generate

4. Start the server:

  npm run start:dev

5. Use the OAuth flow to get an access token and call the sync endpoint:

  POST /api/spotify/sync-tracks?token=ACCESS_TOKEN&limit=50

To enable automatic background syncing, add a `SpotifyAuth` model (or fields on `User`) to persist `refresh_token` and implement refresh logic in `spotify.service.ts`.
