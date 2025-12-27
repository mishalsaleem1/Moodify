# Quick Start Guide - FSWD-SEM-PROJECT

Get the music mood detection system running in minutes!

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- PostgreSQL running (or Neon connection string)
- Git (optional)

## 5-Minute Setup

### Step 1: Backend Setup (2 minutes)

```bash
cd FSWD-SEM-PROJECT/Backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Create .env file from example
copy .env.example .env

# OPTIONAL: Run database migrations
# npm run prisma:migrate

# Start backend
npm run start:dev
```

✅ **Backend running on:** http://localhost:3001

### Step 2: Frontend Setup (2 minutes)

```bash
cd FSWD-SEM-PROJECT/Frontend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Start frontend
npm run dev
```

✅ **Frontend running on:** http://localhost:5173

### Step 3: Test the Integration (1 minute)

1. Open http://localhost:5173 in your browser
2. Click **"Sign up"** or **"Sign in"**
3. Create a new account
4. You should be redirected to the dashboard
5. ✅ Integration is working!

## Default Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend (React/Vite) | 5173 | http://localhost:5173 |
| Backend (NestJS) | 3001 | http://localhost:3001 |
| Backend API | 3001 | http://localhost:3001/api |
| Database | 5432 | postgresql://localhost:5432 |

## Environment Variables

### Backend `.env`
```dotenv
# REQUIRED
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key_here
PORT=3001

# OPTIONAL (for Spotify integration)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

### Frontend `.env`
```dotenv
# REQUIRED
VITE_API_URL=http://localhost:3001/api

# OPTIONAL (for Spotify integration)
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/spotify-callback
```

## Common Commands

### Backend
```bash
# Development with auto-reload
npm run start:dev

# Build for production
npm run build

# Start production build
npm run start:prod

# Database operations
npm run prisma:migrate          # Run migrations
npm run prisma:generate         # Generate Prisma client
npm run prisma:studio           # Open Prisma Studio UI
npm run prisma:seed             # Seed database

# Code quality
npm run lint                     # Run ESLint
npm run format                   # Format code with Prettier
npm run test                     # Run tests
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Troubleshooting

### Backend won't start
```
Error: ECONNREFUSED
→ Check if PostgreSQL is running
→ Check DATABASE_URL is correct
```

### Frontend can't connect to backend
```
Error: Cannot POST /api/auth/login
→ Check backend is running on port 3001
→ Check VITE_API_URL in .env
→ Check browser console for CORS errors
```

### Database errors
```
Error: FATAL: database does not exist
→ Run: npm run prisma:migrate
→ Or manually create database in PostgreSQL
```

### Port already in use
```
Error: listen EADDRINUSE :::3001
→ Kill process: npx kill-port 3001
→ Or change PORT in backend .env
```

## Project Structure

```
FSWD-SEM-PROJECT/
├── Backend/              # NestJS API
│   ├── src/
│   │   ├── modules/     # Feature modules (auth, users, etc.)
│   │   ├── main.ts      # App entry point
│   │   └── app.module.ts
│   ├── prisma/          # Database schema & migrations
│   ├── package.json
│   └── .env
│
├── Frontend/            # React + Vite
│   ├── src/
│   │   ├── context/     # Auth context
│   │   ├── services/    # API services
│   │   ├── pages/       # Page components
│   │   ├── components/  # UI components
│   │   └── utils/       # Constants, helpers
│   ├── package.json
│   ├── .env
│   └── vite.config.js
│
├── INTEGRATION_GUIDE.md       # Full integration guide
└── INTEGRATION_COMPLETE.md    # Detailed documentation
```

## API Examples

### Sign Up
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get User Profile (requires token)
```bash
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Features

✅ User Authentication (Sign up, Login, Logout)
✅ Email/Password Security
✅ JWT Token Management
✅ Auto Token Refresh
✅ Emotion Detection
✅ Music Recommendations
✅ Playlist Management
✅ Song Favorites
✅ Spotify Integration (optional)
✅ User Profile Management
✅ Settings & Preferences

## Next Steps

1. ✅ Backend running
2. ✅ Frontend running  
3. ✅ Integration working
4. **→ Explore the dashboard**
5. Create your first emotion/recommendation
6. Connect Spotify (optional)
7. Build your first playlist

## Useful Links

- [Full Integration Guide](INTEGRATION_GUIDE.md)
- [Detailed Architecture](INTEGRATION_COMPLETE.md)
- [API Documentation](Backend/API.md)
- [Backend Setup Guide](Backend/SETUP.md)

## Getting Help

1. Check browser console (F12) for errors
2. Check backend terminal for logs
3. Review DevTools Network tab
4. Read the full integration guides
5. Check environment variables

## Performance Tips

- Close unnecessary browser tabs
- Use Chrome DevTools Performance tab
- Check network throttling settings
- Monitor backend logs for slow queries
- Clear browser cache if having issues

## Security Notes

- 🔐 Never commit `.env` files
- 🔐 Use strong JWT_SECRET in production
- 🔐 Use HTTPS for production
- 🔐 Keep dependencies updated
- 🔐 Validate all user inputs

---

**Ready?** Run both commands and start developing! 🎵

```bash
# Terminal 1
cd Backend && npm run start:dev

# Terminal 2
cd Frontend && npm run dev
```

Then visit: http://localhost:5173

Happy coding! 🚀
