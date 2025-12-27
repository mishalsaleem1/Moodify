# Music Mood Detection Backend

A comprehensive NestJS backend API for the Music Mood Detection application, built with PostgreSQL and Prisma ORM.

## Features

### 1. **User Management**
- User registration and authentication
- Profile management (create, read, update, delete)
- Session management
- Password management

### 2. **Playlist Management**
- Create, read, update, and delete playlists
- Add/remove songs from playlists
- Reorder songs within playlists
- Public/private playlist support

### 3. **Song Management**
- Create, read, update, and delete songs
- Search songs by title, artist, or album
- Genre classification
- Song metadata management

### 4. **Emotion Detection History**
- Log detected emotions
- View emotion history
- Filter by emotion type
- Emotion statistics

### 5. **Mood-based Song Library**
- Create mood-song mappings
- Browse songs by mood
- Relevance scoring
- Update and delete mappings

### 6. **Recommendations**
- Generate and manage recommendations
- Mark recommendations as liked/disliked
- Track recommendation statistics
- View liked recommendations

### 7. **Favorites**
- Add/remove favorite songs
- View user favorites
- Check if a song is favorited

### 8. **Genres**
- Manage music genres
- View songs by genre
- Genre statistics

### 9. **Feedback/Comments**
- Submit feedback and comments
- View feedback by status
- Rating system (1-5 stars)
- Feedback statistics

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (via Neon)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   
   # Update .env with your Neon database connection string
   ```

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Start the server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3001`

## Environment Variables

```
DATABASE_URL=postgresql://neondb_owner:npg_6v9HFqgQXOMD@ep-curly-breeze-adm2rvyn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=7d

PORT=3001
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists` - Get user playlists
- `GET /api/playlists/:id` - Get playlist by ID
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:playlistId/songs` - Add song to playlist
- `DELETE /api/playlists/:playlistId/songs/:songId` - Remove song from playlist
- `PUT /api/playlists/:playlistId/reorder` - Reorder playlist songs

### Songs
- `POST /api/songs` - Create song
- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get song by ID
- `GET /api/songs/search?q=query` - Search songs
- `GET /api/songs/genre/:genreId` - Get songs by genre
- `PUT /api/songs/:id` - Update song
- `DELETE /api/songs/:id` - Delete song

### Genres
- `POST /api/genres` - Create genre
- `GET /api/genres` - Get all genres
- `GET /api/genres/:id` - Get genre by ID
- `PUT /api/genres/:id` - Update genre
- `DELETE /api/genres/:id` - Delete genre

### Favorites
- `POST /api/favorites` - Add favorite
- `GET /api/favorites` - Get user favorites
- `DELETE /api/favorites/:songId` - Remove favorite
- `GET /api/favorites/check/:songId` - Check if song is favorite

### Emotion History
- `POST /api/emotion-history` - Create emotion record
- `GET /api/emotion-history` - Get emotion history
- `GET /api/emotion-history/:id` - Get emotion by ID
- `GET /api/emotion-history/type/:emotion` - Get emotions by type
- `GET /api/emotion-history/stats` - Get emotion statistics
- `PUT /api/emotion-history/:id` - Update emotion record
- `DELETE /api/emotion-history/:id` - Delete emotion record
- `DELETE /api/emotion-history` - Clear all emotion history

### Mood Songs
- `POST /api/mood-songs` - Create mood-song mapping
- `GET /api/mood-songs/moods` - Get all moods
- `GET /api/mood-songs/mood/:mood` - Get songs by mood
- `GET /api/mood-songs/song/:songId` - Get moods for a song
- `GET /api/mood-songs/:id` - Get mood-song mapping by ID
- `PUT /api/mood-songs/:id` - Update mood-song mapping
- `DELETE /api/mood-songs/:id` - Delete mood-song mapping

### Recommendations
- `POST /api/recommendations` - Create recommendation
- `GET /api/recommendations` - Get user recommendations
- `GET /api/recommendations/:id` - Get recommendation by ID
- `GET /api/recommendations/stats` - Get recommendation statistics
- `GET /api/recommendations/liked` - Get liked recommendations
- `PUT /api/recommendations/:id` - Update recommendation
- `DELETE /api/recommendations/:id` - Delete recommendation

### Feedback
- `POST /api/feedback` - Create feedback
- `GET /api/feedback/my-feedback` - Get user feedback
- `GET /api/feedback/all` - Get all feedback
- `GET /api/feedback/:id` - Get feedback by ID
- `GET /api/feedback/status/:status` - Get feedback by status
- `GET /api/feedback/stats` - Get feedback statistics
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback

## Database Schema

The database includes the following tables:

- **User** - User accounts and profiles
- **Session** - User sessions and authentication tokens
- **Song** - Music songs with metadata
- **Genre** - Music genres
- **Playlist** - User playlists
- **PlaylistSong** - Junction table for playlist-song relationships
- **Favorite** - User favorite songs
- **EmotionHistory** - Emotion detection records
- **MoodSong** - Mood-song mappings
- **Recommendation** - Song recommendations
- **Feedback** - User feedback and comments

## Development

### Available Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with watch
- `npm run build` - Build the project
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with sample data

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## CORS Configuration

CORS is enabled for the frontend running on `http://localhost:5173` (Vite default).

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please create an issue in the repository or contact the development team.
