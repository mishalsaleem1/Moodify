# API Documentation

Complete API reference for the Music Mood Detection Backend.

## Base URL

```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Logout
**POST** `/auth/logout`
*Protected*

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### Change Password
**POST** `/auth/change-password`
*Protected*

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Get Current User
**GET** `/auth/me`
*Protected*

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username"
}
```

---

## User Endpoints

### Get Profile
**GET** `/users/profile`
*Protected*

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe",
  "profileImage": "url",
  "bio": "User bio",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Update Profile
**PUT** `/users/profile`
*Protected*

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "bio": "Updated bio",
  "profileImage": "url"
}
```

### Delete Account
**DELETE** `/users/account`
*Protected*

### Get All Users
**GET** `/users?page=1&limit=10`
*Protected*

**Response (200):**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

### Get User by ID
**GET** `/users/:id`

---

## Playlist Endpoints

### Create Playlist
**POST** `/playlists`
*Protected*

**Request Body:**
```json
{
  "name": "My Favorite Songs",
  "description": "Songs I love",
  "isPublic": false
}
```

### Get User Playlists
**GET** `/playlists?page=1&limit=10`
*Protected*

### Get Playlist Details
**GET** `/playlists/:id`

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "My Favorite Songs",
  "description": "Songs I love",
  "isPublic": false,
  "songs": [
    {
      "id": "uuid",
      "position": 0,
      "song": { /* Song object */ }
    }
  ]
}
```

### Update Playlist
**PUT** `/playlists/:id`
*Protected*

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "isPublic": true
}
```

### Delete Playlist
**DELETE** `/playlists/:id`
*Protected*

### Add Song to Playlist
**POST** `/playlists/:playlistId/songs`
*Protected*

**Request Body:**
```json
{
  "songId": "uuid",
  "position": 0
}
```

### Remove Song from Playlist
**DELETE** `/playlists/:playlistId/songs/:songId`
*Protected*

### Reorder Playlist Songs
**PUT** `/playlists/:playlistId/reorder`
*Protected*

**Request Body:**
```json
{
  "songIds": ["uuid1", "uuid2", "uuid3"]
}
```

---

## Song Endpoints

### Create Song
**POST** `/songs`
*Protected*

**Request Body:**
```json
{
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "duration": 200,
  "genreId": "uuid",
  "spotifyId": "spotify-id",
  "imageUrl": "url"
}
```

### Get All Songs
**GET** `/songs?page=1&limit=20`

### Search Songs
**GET** `/songs/search?q=query&page=1&limit=20`

### Get Songs by Genre
**GET** `/songs/genre/:genreId?page=1&limit=20`

### Get Song Details
**GET** `/songs/:id`

### Update Song
**PUT** `/songs/:id`
*Protected*

**Request Body:**
```json
{
  "title": "Updated Title",
  "artist": "Updated Artist",
  "duration": 250
}
```

### Delete Song
**DELETE** `/songs/:id`
*Protected*

---

## Genre Endpoints

### Create Genre
**POST** `/genres`
*Protected*

**Request Body:**
```json
{
  "name": "Genre Name",
  "description": "Genre description"
}
```

### Get All Genres
**GET** `/genres?page=1&limit=10`

### Get Genre Details
**GET** `/genres/:id`

### Update Genre
**PUT** `/genres/:id`
*Protected*

### Delete Genre
**DELETE** `/genres/:id`
*Protected*

---

## Favorites Endpoints

### Add Favorite
**POST** `/favorites`
*Protected*

**Request Body:**
```json
{
  "songId": "uuid"
}
```

### Get User Favorites
**GET** `/favorites?page=1&limit=20`
*Protected*

### Check if Favorited
**GET** `/favorites/check/:songId`
*Protected*

**Response (200):**
```json
{
  "isFavorite": true
}
```

### Remove Favorite
**DELETE** `/favorites/:songId`
*Protected*

---

## Emotion History Endpoints

### Create Emotion Record
**POST** `/emotion-history`
*Protected*

**Request Body:**
```json
{
  "emotion": "happy",
  "confidence": 0.85,
  "description": "Feeling great today"
}
```

### Get Emotion History
**GET** `/emotion-history?page=1&limit=20`
*Protected*

### Get Emotion Statistics
**GET** `/emotion-history/stats`
*Protected*

**Response (200):**
```json
[
  { "emotion": "happy", "_count": 15 },
  { "emotion": "sad", "_count": 8 }
]
```

### Get Emotions by Type
**GET** `/emotion-history/type/:emotion?page=1&limit=20`
*Protected*

### Get Emotion Details
**GET** `/emotion-history/:id`

### Update Emotion Record
**PUT** `/emotion-history/:id`
*Protected*

### Delete Emotion Record
**DELETE** `/emotion-history/:id`
*Protected*

### Clear All Emotion History
**DELETE** `/emotion-history`
*Protected*

---

## Mood-Songs Endpoints

### Create Mood-Song Mapping
**POST** `/mood-songs`
*Protected*

**Request Body:**
```json
{
  "mood": "happy",
  "songId": "uuid",
  "relevanceScore": 0.9
}
```

### Get All Moods
**GET** `/mood-songs/moods`

**Response (200):**
```json
[
  { "mood": "happy", "songCount": 150 },
  { "mood": "sad", "songCount": 120 }
]
```

### Get Songs by Mood
**GET** `/mood-songs/mood/:mood?page=1&limit=20`

### Get Moods for a Song
**GET** `/mood-songs/song/:songId`

### Get Mood-Song Details
**GET** `/mood-songs/:id`

### Update Mood-Song Mapping
**PUT** `/mood-songs/:id`
*Protected*

**Request Body:**
```json
{
  "relevanceScore": 0.95
}
```

### Delete Mood-Song Mapping
**DELETE** `/mood-songs/:id`
*Protected*

---

## Recommendations Endpoints

### Create Recommendation
**POST** `/recommendations`
*Protected*

**Request Body:**
```json
{
  "songId": "uuid",
  "reason": "Based on your mood"
}
```

### Get User Recommendations
**GET** `/recommendations?page=1&limit=20`
*Protected*

### Get Recommendation Statistics
**GET** `/recommendations/stats`
*Protected*

**Response (200):**
```json
{
  "total": 100,
  "liked": 60,
  "disliked": 20,
  "neutral": 20
}
```

### Get Liked Recommendations
**GET** `/recommendations/liked?page=1&limit=20`
*Protected*

### Get Recommendation Details
**GET** `/recommendations/:id`

### Update Recommendation (Mark Liked/Disliked)
**PUT** `/recommendations/:id`
*Protected*

**Request Body:**
```json
{
  "liked": true,
  "reason": "Great song"
}
```

### Delete Recommendation
**DELETE** `/recommendations/:id`
*Protected*

---

## Feedback Endpoints

### Create Feedback
**POST** `/feedback`
*Protected*

**Request Body:**
```json
{
  "title": "Great App",
  "message": "Love the music recommendations",
  "rating": 5
}
```

### Get User Feedback
**GET** `/feedback/my-feedback?page=1&limit=10`
*Protected*

### Get All Feedback
**GET** `/feedback/all?page=1&limit=10`

### Get Feedback Statistics
**GET** `/feedback/stats`

**Response (200):**
```json
{
  "byStatus": [
    { "status": "pending", "count": 10 },
    { "status": "reviewed", "count": 5 }
  ],
  "total": 15
}
```

### Get Feedback by Status
**GET** `/feedback/status/:status?page=1&limit=10`

### Get Feedback Details
**GET** `/feedback/:id`

### Update Feedback
**PUT** `/feedback/:id`
*Protected*

**Request Body:**
```json
{
  "title": "Updated Title",
  "rating": 4,
  "status": "reviewed"
}
```

### Delete Feedback
**DELETE** `/feedback/:id`
*Protected*

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid input",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You cannot perform this action",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Resource already exists",
  "error": "Conflict"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Pagination

Most list endpoints support pagination with query parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: varies by endpoint)

**Example:**
```
GET /api/songs?page=2&limit=20
```

**Response includes:**
```json
{
  "data": [...],
  "total": 100,
  "page": 2,
  "pageSize": 20
}
```

---

## Rate Limiting

No rate limiting implemented yet. Consider adding in production.

## CORS

CORS is enabled for `http://localhost:5173` (Vite frontend).

## Version

API Version: 1.0.0
NestJS Version: 10.x
Node.js: v16+
