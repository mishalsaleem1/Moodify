import api from './api'

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
