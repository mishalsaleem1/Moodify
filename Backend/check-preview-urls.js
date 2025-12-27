const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPreviewUrls() {
  try {
    console.log('🔍 Checking songs and their preview URLs...\n');

    // Get all songs
    const songs = await prisma.song.findMany({
      select: {
        id: true,
        title: true,
        artist: true,
        previewUrl: true,
        spotifyId: true,
      },
    });

    console.log(`📊 Total songs in database: ${songs.length}\n`);

    const songsWithPreview = songs.filter(s => s.previewUrl);
    const songsWithoutPreview = songs.filter(s => !s.previewUrl);

    console.log(`✅ Songs WITH preview URLs: ${songsWithPreview.length}`);
    console.log(`❌ Songs WITHOUT preview URLs: ${songsWithoutPreview.length}\n`);

    if (songsWithPreview.length > 0) {
      console.log('✅ Songs with preview URLs:');
      songsWithPreview.forEach(song => {
        console.log(`  - ${song.title} by ${song.artist}`);
        console.log(`    Preview: ${song.previewUrl}\n`);
      });
    }

    if (songsWithoutPreview.length > 0) {
      console.log('\n❌ Songs WITHOUT preview URLs (these won\'t play):');
      songsWithoutPreview.forEach(song => {
        console.log(`  - ${song.title} by ${song.artist}`);
        console.log(`    Spotify ID: ${song.spotifyId || 'N/A'}\n`);
      });
    }

    // Check favorites
    console.log('\n📋 Checking favorites...');
    const favorites = await prisma.favorite.findMany({
      include: {
        song: {
          select: {
            id: true,
            title: true,
            artist: true,
            previewUrl: true,
          },
        },
      },
    });

    console.log(`📊 Total favorites: ${favorites.length}`);
    const favoritesWithPreview = favorites.filter(f => f.song?.previewUrl);
    console.log(`✅ Favorites with playable songs: ${favoritesWithPreview.length}`);
    console.log(`❌ Favorites with non-playable songs: ${favorites.length - favoritesWithPreview.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPreviewUrls();
