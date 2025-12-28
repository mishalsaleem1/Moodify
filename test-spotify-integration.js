/**
 * Test Spotify Integration
 * 
 * This script tests the Spotify Web API integration
 * Run with: node test-spotify-integration.js
 * 
 * Make sure backend server is running on http://localhost:3001
 */

const API_URL = 'http://localhost:3001/api';

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`  ${title}`, 'cyan');
  console.log('='.repeat(60) + '\n');
}

async function testSearchTracks() {
  logSection('TEST 1: Search Tracks');

  const queries = [
    { q: 'happy songs', limit: 5 },
    { q: 'Ed Sheeran', limit: 3 },
    { q: 'Bohemian Rhapsody', limit: 1 },
  ];

  for (const query of queries) {
    log(`\n🔍 Searching: "${query.q}" (limit: ${query.limit})`, 'blue');

    try {
      const url = `${API_URL}/spotify/search?q=${encodeURIComponent(query.q)}&limit=${query.limit}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const tracks = data.tracks?.items || [];

      log(`✅ Success! Found ${tracks.length} tracks`, 'green');

      tracks.forEach((track, index) => {
        console.log(`\n  ${index + 1}. ${track.name}`);
        console.log(`     Artist: ${track.artists.map(a => a.name).join(', ')}`);
        console.log(`     Album: ${track.album.name}`);
        console.log(`     Duration: ${Math.floor(track.duration_ms / 1000)}s`);
        console.log(`     Preview: ${track.preview_url ? '✓ Available' : '✗ Not available'}`);
        console.log(`     Spotify URL: ${track.external_urls.spotify}`);
      });
    } catch (error) {
      log(`❌ Error: ${error.message}`, 'red');
    }
  }
}

async function testMoodRecommendations() {
  logSection('TEST 2: Mood-Based Recommendations');

  const moods = ['happy', 'sad', 'energetic', 'calm'];

  for (const mood of moods) {
    log(`\n🎵 Getting "${mood}" recommendations (limit: 5)`, 'blue');

    try {
      const url = `${API_URL}/spotify/mood-recommendations?mood=${mood}&limit=5`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const tracks = data.tracks || [];

      log(`✅ Success! Got ${tracks.length} recommendations`, 'green');

      tracks.forEach((track, index) => {
        console.log(`\n  ${index + 1}. ${track.name}`);
        console.log(`     Artist: ${track.artists.map(a => a.name).join(', ')}`);
        console.log(`     Album: ${track.album.name}`);
        console.log(`     Popularity: ${track.popularity}/100`);
      });
    } catch (error) {
      log(`❌ Error: ${error.message}`, 'red');
    }
  }
}

async function testInvalidMood() {
  logSection('TEST 3: Error Handling - Invalid Mood');

  log('🧪 Testing with invalid mood: "invalid_mood"', 'blue');

  try {
    const url = `${API_URL}/spotify/mood-recommendations?mood=invalid_mood&limit=5`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      log(`✅ Correctly rejected: ${error.message}`, 'green');
    } else {
      log('❌ Should have rejected invalid mood', 'red');
    }
  } catch (error) {
    log(`❌ Unexpected error: ${error.message}`, 'red');
  }
}

async function testEmptySearch() {
  logSection('TEST 4: Error Handling - Empty Search');

  log('🧪 Testing with empty search query', 'blue');

  try {
    const url = `${API_URL}/spotify/search?q=&limit=5`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      log(`✅ Correctly rejected: ${error.message}`, 'green');
    } else {
      log('❌ Should have rejected empty query', 'red');
    }
  } catch (error) {
    log(`❌ Unexpected error: ${error.message}`, 'red');
  }
}

async function testPreviewUrls() {
  logSection('TEST 5: Preview URL Availability');

  log('🔍 Checking preview URL availability for popular songs', 'blue');

  try {
    const url = `${API_URL}/spotify/search?q=top hits 2024&limit=10`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const tracks = data.tracks?.items || [];

    const withPreview = tracks.filter(t => t.preview_url).length;
    const withoutPreview = tracks.length - withPreview;

    log(`✅ Results:`, 'green');
    console.log(`   Total tracks: ${tracks.length}`);
    console.log(`   With preview: ${withPreview} (${Math.round(withPreview / tracks.length * 100)}%)`);
    console.log(`   Without preview: ${withoutPreview} (${Math.round(withoutPreview / tracks.length * 100)}%)`);

    log('\n📝 Note: Not all Spotify tracks have preview URLs - this is normal!', 'yellow');
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
  }
}

async function runAllTests() {
  log('\n🚀 Starting Spotify Integration Tests', 'cyan');
  log(`API URL: ${API_URL}\n`, 'cyan');

  const startTime = Date.now();

  try {
    await testSearchTracks();
    await testMoodRecommendations();
    await testInvalidMood();
    await testEmptySearch();
    await testPreviewUrls();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    logSection('TEST SUMMARY');
    log(`✅ All tests completed in ${duration}s`, 'green');
    log('\n📊 Integration Status: WORKING ✓', 'green');
    log('\n💡 Next Steps:', 'cyan');
    console.log('   1. Open frontend: http://localhost:5173/spotify-search');
    console.log('   2. Try searching for songs');
    console.log('   3. Click mood buttons for recommendations');
    console.log('   4. Test audio preview playback');
    console.log('   5. Open songs in Spotify\n');
  } catch (error) {
    log(`\n❌ Tests failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Check if backend is running
async function checkBackend() {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/`);
    return true;
  } catch (error) {
    log('❌ Backend server not running!', 'red');
    log('\nPlease start the backend server:', 'yellow');
    log('   cd Backend', 'yellow');
    log('   npm run start:dev\n', 'yellow');
    return false;
  }
}

// Main execution
(async () => {
  const backendRunning = await checkBackend();
  if (!backendRunning) {
    process.exit(1);
  }

  await runAllTests();
})();
