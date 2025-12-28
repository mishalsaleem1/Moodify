import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create genres
  const genres = await Promise.all([
    prisma.genre.upsert({
      where: { name: 'Pop' },
      update: {},
      create: { name: 'Pop', description: 'Popular music' },
    }),
    prisma.genre.upsert({
      where: { name: 'Rock' },
      update: {},
      create: { name: 'Rock', description: 'Rock music' },
    }),
    prisma.genre.upsert({
      where: { name: 'Hip Hop' },
      update: {},
      create: { name: 'Hip Hop', description: 'Hip hop and rap music' },
    }),
    prisma.genre.upsert({
      where: { name: 'Jazz' },
      update: {},
      create: { name: 'Jazz', description: 'Jazz music' },
    }),
    prisma.genre.upsert({
      where: { name: 'Classical' },
      update: {},
      create: { name: 'Classical', description: 'Classical music' },
    }),
    prisma.genre.upsert({
      where: { name: 'Electronic' },
      update: {},
      create: { name: 'Electronic', description: 'Electronic and EDM music' },
    }),
  ]);

  console.log('✓ Created genres');

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      bio: 'A test user for the music app',
    },
  });

  console.log('✓ Created test user');

  // Create sample songs (use createMany and then fetch created rows)
  const songsData = [
    {
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      genreId: genres[0].id,
    },
    {
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷',
      duration: 234,
      genreId: genres[0].id,
    },
    {
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      duration: 354,
      genreId: genres[1].id,
    },
    {
      title: 'Lose Yourself',
      artist: 'Eminem',
      album: '8 Mile',
      duration: 326,
      genreId: genres[2].id,
    },
  ];

  await prisma.song.createMany({ data: songsData, skipDuplicates: true });

  const songs = await Promise.all(
    songsData.map((s) => prisma.song.findFirstOrThrow({ where: { title: s.title } }))
  );

  console.log('✓ Created sample songs');

  // Create mood-song mappings
  await Promise.all([
    prisma.moodSong.upsert({
      where: { mood_songId: { mood: 'happy', songId: songs[0].id } },
      update: {},
      create: { mood: 'happy', songId: songs[0].id, relevanceScore: 0.9 },
    }),
    prisma.moodSong.upsert({
      where: { mood_songId: { mood: 'energetic', songId: songs[0].id } },
      update: {},
      create: { mood: 'energetic', songId: songs[0].id, relevanceScore: 0.8 },
    }),
    prisma.moodSong.upsert({
      where: { mood_songId: { mood: 'calm', songId: songs[2].id } },
      update: {},
      create: { mood: 'calm', songId: songs[2].id, relevanceScore: 0.7 },
    }),
    prisma.moodSong.upsert({
      where: { mood_songId: { mood: 'sad', songId: songs[2].id } },
      update: {},
      create: { mood: 'sad', songId: songs[2].id, relevanceScore: 0.6 },
    }),
  ]);

  console.log('✓ Created mood-song mappings');

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
