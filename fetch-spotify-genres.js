// Fetch all available Spotify genre seeds
const https = require('https');

const CLIENT_ID = '418fab50df7a4fa1bced2b76a0edc37b';
const CLIENT_SECRET = '7e506f34ae6c41ec8b1d21a49bc6187d';

function httpsRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function fetchGenres() {
  // Get access token
  const tokenBody = 'grant_type=client_credentials';
  const tokenAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
  const tokenData = await httpsRequest('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': tokenBody.length,
      'Authorization': `Basic ${tokenAuth}`,
    },
    body: tokenBody,
  });

  const accessToken = tokenData.access_token;
  console.log('✅ Got access token\n');

  // Get available genres
  const genresData = await httpsRequest('https://api.spotify.com/v1/recommendations/available-genres', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  const genres = genresData.genres;

  console.log(`📊 Total available genres: ${genres.length}\n`);
  console.log(`All genres:\n${genres.sort().join(', ')}\n`);

  // Check our current genres
  const ourGenres = ['pop', 'dance', 'happy', 'sad', 'blues', 'acoustic', 'edm', 'electronic', 'ambient', 'chill', 'classical', 'piano', 'party', 'hip-hop', 'metal', 'rock', 'punk', 'romance', 'r-n-b', 'soul'];
  const valid = ourGenres.filter(g => genres.includes(g));
  const invalid = ourGenres.filter(g => !genres.includes(g));

  console.log(`✅ Valid genres from our list (${valid.length}):\n${valid.join(', ')}\n`);
  console.log(`❌ Invalid genres from our list (${invalid.length}):\n${invalid.join(', ')}\n`);

  // Suggest replacements for invalid genres
  console.log('💡 Suggested genre mappings for moods:');
  console.log('- happy: pop, dance, pop-film');
  console.log('- sad: sad, blues, acoustic');
  console.log('- energetic: edm, electronic, dance');
  console.log('- calm: ambient, chill, acoustic');
  console.log('- focus: classical, ambient, piano');
  console.log('- party: party, dance, pop');
  console.log('- angry: metal, rock, punk');
  console.log('- romantic: soul, r-n-b, romance');
}

fetchGenres().catch(console.error);
