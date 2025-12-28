import api from './api'

// ========== NEW: SPOTIFY WEB API (NO USER LOGIN REQUIRED) ==========

/**
 * Search for tracks using Spotify API (Client Credentials Flow)
 * No authentication required - backend handles token management
 * 
 * @param {string} query - Search query (song name, artist, etc.)
 * @param {number} limit - Number of results (default: 20, max: 50)
 * @returns {Promise} Search results with track details
 */
export async function searchSpotifyTracks(query, limit = 20) {
  console.log(`🔍 Searching Spotify: "${query}" (limit: ${limit})`);
  
  try {
    const res = await api.get('/spotify/search', {
      params: { q: query, limit },
    });
    
    console.log(`✅ Found ${res.data.tracks?.items?.length || 0} tracks`);
    return res.data;
  } catch (error) {
    console.error('❌ Spotify search error:', error);
    throw new Error(error.response?.data?.message || 'Failed to search Spotify');
  }
}

/**
 * Get mood-based song recommendations from Spotify
 * No authentication required - uses Client Credentials Flow
 * 
 * @param {string} mood - Mood name (happy, sad, calm, energetic, etc.)
 * @param {number} limit - Number of results (default: 20)
 * @returns {Promise} Track recommendations for the mood
 */
export async function getSpotifyMoodRecommendations(mood, limit = 20) {
  console.log(`🎵 Getting Spotify recommendations for mood: ${mood}`);
  
  try {
    const res = await api.get('/spotify/mood-recommendations', {
      params: { mood, limit },
    });
    
    console.log(`✅ Got ${res.data.tracks?.length || 0} recommendations`);
    return res.data;
  } catch (error) {
    console.error('❌ Spotify mood recommendations error:', error);
    throw new Error(error.response?.data?.message || 'Failed to get mood recommendations');
  }
}

/**
 * Format Spotify track data for display
 * Extracts key information from Spotify API response
 */
export function formatSpotifyTrack(track) {
  return {
    id: track.id,
    name: track.name,
    artist: track.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
    album: track.album?.name || 'Unknown Album',
    albumArt: track.album?.images?.[0]?.url || track.album?.images?.[1]?.url || '',
    previewUrl: track.preview_url, // 30-second preview (may be null)
    spotifyUrl: track.external_urls?.spotify || '',
    duration: Math.floor((track.duration_ms || 0) / 1000), // Convert to seconds
    popularity: track.popularity || 0,
  };
}

// ========== EXISTING FUNCTIONS (User authentication flow) ==========

export async function getSpotifyConnectUrl() {
  const res = await api.get('/spotify/connect')
  return res.data.url
}

export async function checkSpotifyConnected() {
  const res = await api.get('/spotify/connected')
  return res.data.connected
}

export async function syncSpotifyTopTracks(token) {
  const res = await api.get(`/spotify/sync?token=${encodeURIComponent(token)}`)
  return res.data
}

// Free iTunes API fallback - no authentication required!
export async function getITunesMoodSongs(mood, limit = 20) {
  console.log(`🎵 Using iTunes API for mood: ${mood}`);
  
  // Map moods to iTunes search terms
  const moodKeywords = {
    happy: 'happy upbeat dance pop',
    sad: 'sad emotional acoustic',
    calm: 'calm relaxing ambient chill',
    angry: 'rock metal intense',
    energetic: 'energetic workout electronic dance',
    romantic: 'romantic love ballad',
    party: 'party dance electronic',
    focus: 'instrumental piano classical study',
  };

  const searchTerm = moodKeywords[mood.toLowerCase()] || 'pop music';
  
  try {
    // iTunes Search API is FREE and requires no authentication!
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=${limit}&media=music`
    );
    
    if (!response.ok) {
      throw new Error('iTunes API request failed');
    }
    
    const data = await response.json();
    console.log(`✅ iTunes API returned ${data.results?.length || 0} songs`);
    
    return {
      tracks: data.results.map((track, index) => ({
        id: track.trackId,
        name: track.trackName,
        artists: [{ name: track.artistName }],
        album: {
          name: track.collectionName,
          images: [{ url: track.artworkUrl100.replace('100x100', '300x300') }],
        },
        preview_url: track.previewUrl,
        external_urls: {
          apple: track.trackViewUrl,
        },
        duration_ms: track.trackTimeMillis,
      })),
    };
  } catch (error) {
    console.error('❌ iTunes API error:', error);
    throw error;
  }
}
