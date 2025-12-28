# Backend Setup and Installation Guide

## Quick Start

### 1. Prerequisites
- Node.js v16 or higher
- npm or yarn
- PostgreSQL with Neon (connection string provided)

### 2. Installation Steps

```bash
# Navigate to Backend folder
cd Backend

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run prisma:seed

# Start development server
npm run start:dev
```

The server will start on `http://localhost:3001`

### 3. Environment Variables

The `.env` file is already configured with your Neon database connection string:

```
DATABASE_URL=postgresql://neondb_owner:npg_6v9HFqgQXOMD@ep-curly-breeze-adm2rvyn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=7d
PORT=3001
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` in production!

## Available Commands

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with auto-reload
- `npm run build` - Build the project for production
- `npm run lint` - Check code quality
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run prisma:generate` - Regenerate Prisma Client
- `npm run prisma:migrate` - Run pending migrations
- `npm run prisma:studio` - Open Prisma Studio (GUI for database)
- `npm run prisma:seed` - Populate database with sample data

## Project Structure

```
Backend/
├── src/
│   ├── modules/          # Feature modules
│   │   ├── auth/         # Authentication (JWT, login, register)
│   │   ├── users/        # User management
│   │   ├── playlists/    # Playlist CRUD operations
│   │   ├── songs/        # Song management
│   │   ├── genres/       # Genre management
│   │   ├── favorites/    # Favorite songs
│   │   ├── emotion-history/  # Emotion detection records
│   │   ├── mood-songs/   # Mood-song mappings
│   │   ├── recommendations/ # Song recommendations
│   │   └── feedback/     # User feedback
│   ├── common/           # Shared utilities
│   │   ├── prisma/       # Database service
│   │   ├── decorators/   # Custom decorators
│   │   └── dtos/         # Data transfer objects
│   ├── app.module.ts     # Root module
│   └── main.ts           # Application entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding script
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Full documentation
```

## Database Tables

The application includes 10 main tables:

1. **User** - User accounts and authentication
2. **Session** - User sessions and tokens
3. **Song** - Music tracks
4. **Genre** - Music categories
5. **Playlist** - User playlists
6. **PlaylistSong** - Playlist-song relationships
7. **Favorite** - Favorite songs
8. **EmotionHistory** - Mood/emotion detection records
9. **MoodSong** - Mood-song mappings for recommendations
10. **Recommendation** - Song recommendations
11. **Feedback** - User feedback and comments

## API Testing

You can test the API using:

- **Postman** - Import the API endpoints
- **Thunder Client** - VS Code extension
- **cURL** - Command line tool
- **Frontend** - Connect the React frontend

Example requests:

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get user profile (requires authentication)
curl http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Connecting Frontend to Backend

Update the API base URL in Frontend's `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

## Database Management

### Open Prisma Studio (Visual Database Manager)

```bash
npm run prisma:studio
```

This opens a browser-based GUI to view and edit your database.

### View Database Migrations

All migrations are automatically tracked in `prisma/migrations/`

### Reset Database

```bash
# Reset (deletes all data)
npx prisma migrate reset
```

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
npm install
```

### "Database connection error"
- Check the `DATABASE_URL` in `.env`
- Verify Neon database is active
- Check internet connection

### "Port 3001 already in use"
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Migration issues
```bash
# Create new migration
npm run prisma:migrate -- --name description_of_changes

# View migration status
npx prisma migrate status
```

## Performance Optimization Tips

1. Add database indexes for frequently queried fields
2. Use pagination for large datasets (implemented)
3. Implement caching strategies
4. Use query optimization in services
5. Monitor with Prisma Studio

## Security Checklist

- [ ] Change `JWT_SECRET` in production
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate all inputs (already done with class-validator)
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for your frontend domain
- [ ] Implement password hashing (already done with bcrypt)

## Next Steps

1. Start the development server: `npm run start:dev`
2. Seed database with sample data: `npm run prisma:seed`
3. Test endpoints using Postman or similar tool
4. Connect the React frontend to the backend
5. Deploy to production

## Support

For issues or questions:
1. Check the README.md in the Backend folder
2. Review the code in relevant module folders
3. Check Prisma documentation: https://www.prisma.io/docs/
4. Check NestJS documentation: https://docs.nestjs.com/
