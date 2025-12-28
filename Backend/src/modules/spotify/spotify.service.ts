import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

interface AudioFeatures {
  valence: number;
  energy: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  tempo: number;
}

interface SpotifyTokenRefreshResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
}

interface ClientCredentialsToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number; // Timestamp when token expires
}

@Injectable()
export class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  // Client Credentials Flow - App-level token (NO user login required)
  private clientCredentialsToken: ClientCredentialsToken | null = null;

  // Mood profiles based on audio features
  private moodProfiles: Record<string, Partial<AudioFeatures>> = {
    happy: { valence: 0.8, energy: 0.7, danceability: 0.7 },
    sad: { valence: 0.2, energy: 0.3, acousticness: 0.6 },
    energetic: { energy: 0.9, valence: 0.7, tempo: 130 },
    calm: { energy: 0.2, acousticness: 0.8, valence: 0.5 },
    focus: { instrumentalness: 0.7, energy: 0.4, acousticness: 0.6 },
    party: { energy: 0.9, danceability: 0.8, valence: 0.8 },
    angry: { energy: 0.9, valence: 0.3 },
    romantic: { valence: 0.6, energy: 0.4, acousticness: 0.5 },
  };

  // Seed track IDs for each mood (popular tracks that represent the mood)
  // Using track seeds instead of genre seeds because recommendations endpoint
  // with genre seeds requires user authorization (not available with Client Credentials)
  private moodTracks: Record<string, string[]> = {
    // Happy tracks
    happy: ['60nZcImufyMA1MKQY3dcCH', '3GCdLUSnKSMJhs4Tj6CV3s', '6NPVjNh8Jhru9xOmyQigds'], // Happy - Pharrell, Don't Stop Me Now, Walking on Sunshine
    // Sad/emotional tracks
    sad: ['5CQ30WqJwcep0pYcV4AMNc', '3JWxTB3NlVogv1cWt9WLfR', '1BxfuPKGuaTgP7aM0Bbdwr'], // Someone Like You, The Night We Met, Hurt
    // Energetic/workout tracks
    energetic: ['11dFghVXANMlKmJXsNCbNl', '0VjIjW4GlUZAMYd2vXMi3b', '3XVozq1aeqsJwpXrEZrDJ9'], // Till I Collapse, Blinding Lights, Titanium
    // Calm/relaxing tracks
    calm: ['6RUKPb4LETWmmr3iAEQktW', '0u2P5u6lvoDfwTYjAADbn4', '6v3KW9xbzN5yKLt9YKDYAOTR'], // Weightless, Clair de Lune, Sunset Lover
    // Focus/concentration tracks
    focus: ['7J1uxwnxfQLu4APicE5Rnj', '2VuSW8XqPdYU3kZlcJFBxK', '0GNHOCuTBcMTWXnvpMQP2s'], // Moonlight Sonata, River Flows in You, Ludovico Einaudi
    // Party/dance tracks
    party: ['58zsLZPvfflkW3xglOxaI0', '0WqIKmW4BTrj3eJFmnCKMv', '2XU0oxnq2qxCpomAAuJY8K'], // Uptown Funk, Don't Start Now, Dance Monkey
    // Angry/intense tracks
    angry: ['2LTlO3NuNVN8Br2BNW8OmA', '0eKc99wFRqBJ9lX5Xv4kkY', '6l8GvAyoUZwWDgF1e4822w'], // In The End, Enter Sandman, Down With The Sickness
    // Romantic tracks
    romantic: ['37FXw4GW6HCvvNW73sCmH5', '1dGr1c8CrMLDpV6mPbImSI', '2tVHvZK4YYzTloSCBPm2tg'], // Perfect - Ed Sheeran, Lover, All of Me
  };

  // Genre seeds for user-authenticated recommendations (OAuth flow)
  // Only used when user is logged in with Spotify OAuth
  private moodGenres: Record<string, string[]> = {
    happy: ['pop', 'dance'],
    sad: ['sad', 'blues', 'acoustic'],
    energetic: ['edm', 'dance', 'electronic'],
    calm: ['ambient', 'chill', 'acoustic'],
    focus: ['classical', 'ambient', 'piano'],
    party: ['party', 'dance', 'hip-hop'],
    angry: ['metal', 'rock', 'punk'],
    romantic: ['soul', 'r-n-b'],
  };

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.clientId = this.config.get<string>('SPOTIFY_CLIENT_ID') || '';
    this.clientSecret = this.config.get<string>('SPOTIFY_CLIENT_SECRET') || '';
    this.redirectUri = this.config.get<string>('SPOTIFY_REDIRECT_URI') || '';

    // Validate that Spotify credentials are configured
    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      console.warn('⚠️  Spotify credentials not configured. Spotify features will be limited.');
    }
  }

  /**
   * CLIENT CREDENTIALS FLOW - Get app-level access token (NO user login required)
   * This token allows searching tracks and getting recommendations without user authentication
   * Token expires in 1 hour and is automatically refreshed
   */
  private async getClientCredentialsToken(): Promise<string> {
    // Check if we have a valid token that hasn't expired
    if (
      this.clientCredentialsToken &&
      this.clientCredentialsToken.expires_at &&
      Date.now() < this.clientCredentialsToken.expires_at
    ) {
      console.log('✅ Using cached Spotify Client Credentials token');
      return this.clientCredentialsToken.access_token;
    }

    console.log('🔄 Fetching new Spotify Client Credentials token...');

    try {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64'),
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json() as any;
        console.error('❌ Spotify token error:', errorData);
        throw new HttpException(
          `Failed to get Spotify token: ${errorData.error_description || errorData.error}`,
          res.status,
        );
      }

      const tokenData = await res.json() as ClientCredentialsToken;

      // Store token with expiration timestamp (expires_in is in seconds)
      this.clientCredentialsToken = {
        ...tokenData,
        expires_at: Date.now() + (tokenData.expires_in - 60) * 1000, // Refresh 1 min before expiry
      };

      console.log(
        `✅ Got new Spotify token, expires in ${tokenData.expires_in} seconds`,
      );

      return this.clientCredentialsToken.access_token;
    } catch (error) {
      console.error('❌ Failed to get Spotify Client Credentials token:', error);
      throw new HttpException(
        'Failed to authenticate with Spotify API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Make authenticated request to Spotify API using Client Credentials token
   */
  private async spotifyFetchWithClientCredentials(
    endpoint: string,
  ): Promise<any> {
    const token = await this.getClientCredentialsToken();

    const fullUrl = `https://api.spotify.com/${endpoint}`;
    console.log(`🌐 Spotify API Request: ${fullUrl}`);

    const res = await fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const responseText = await res.text();
      console.error(`❌ Spotify API error (${res.status}):`, responseText);
      
      let errorMessage = 'Spotify API error';
      try {
        const err = JSON.parse(responseText);
        errorMessage = err.error?.message || errorMessage;
      } catch (parseError) {
        errorMessage = responseText || errorMessage;
      }
      
      throw new HttpException(
        errorMessage,
        res.status,
      );
    }

    return res.json();
  }

  /**
   * SEARCH TRACKS - Search for songs using Spotify Search API
   * No user authentication required (uses Client Credentials Flow)
   * 
   * @param query - Search query (song name, artist, etc.)
   * @param limit - Number of results (default: 20, max: 50)
   * @returns Search results with track details, preview URLs, and album art
   */
  async searchTracks(query: string, limit: number = 20): Promise<any> {
    if (!query || query.trim() === '') {
      throw new HttpException('Search query is required', HttpStatus.BAD_REQUEST);
    }

    if (limit > 50) {
      limit = 50; // Spotify API max limit
    }

    console.log(`🔍 Searching Spotify for: "${query}" (limit: ${limit})`);

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        type: 'track',
        limit: String(limit),
        market: 'US', // Get preview URLs for US market
      });

      const result = await this.spotifyFetchWithClientCredentials(
        `v1/search?${params}`,
      );

      console.log(`✅ Found ${result.tracks?.items?.length || 0} tracks`);

      // Transform results to include all required fields
      return {
        tracks: {
          items: result.tracks.items.map((track: any) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist: any) => ({
              id: artist.id,
              name: artist.name,
            })),
            album: {
              id: track.album.id,
              name: track.album.name,
              images: track.album.images, // Array of image URLs (640x640, 300x300, 64x64)
            },
            duration_ms: track.duration_ms,
            preview_url: track.preview_url, // 30-second preview (may be null)
            external_urls: {
              spotify: track.external_urls.spotify, // Spotify web player URL
            },
            uri: track.uri,
            popularity: track.popularity,
          })),
          total: result.tracks.total,
        },
      };
    } catch (error) {
      console.error('❌ Spotify search error:', error);
      throw error;
    }
  }

  /**
   * GET MOOD-BASED RECOMMENDATIONS - Using Client Credentials Flow
   * No user authentication required
   * 
   * NOTE: Spotify's recommendations endpoint requires user authorization (OAuth),
   * which is not available with Client Credentials flow. As a workaround, we use
   * search with mood-related queries to find relevant tracks.
   * Updated: Using search-based recommendations
   */
  async getMoodRecommendationsWithClientCredentials(
    mood: string,
    limit: number = 20,
  ): Promise<any> {
    const moodKey = mood.toLowerCase();
    const profile = this.moodProfiles[moodKey];
    
    if (!profile) {
      throw new HttpException(`Unknown mood: ${mood}`, HttpStatus.BAD_REQUEST);
    }

    // Mood-based search queries (using popular artists/songs that have previews)
    const moodQueries: Record<string, string[]> = {
      happy: ['pharrell williams happy', 'mark ronson uptown funk', 'dua lipa levitating', 'bruno mars'],
      sad: ['adele someone like you', 'billie eilish when the party', 'lewis capaldi', 'sam smith'],
      energetic: ['imagine dragons believer', 'eminem lose yourself', 'calvin harris', 'david guetta'],
      calm: ['ed sheeran photograph', 'coldplay fix you', 'john legend', 'norah jones'],
      focus: ['ludovico einaudi', 'hans zimmer', 'max richter', 'yiruma river flows'],
      party: ['lady gaga bad romance', 'rihanna pon de replay', 'pitbull', 'flo rida'],
      angry: ['linkin park in the end', 'metallica enter sandman', 'rage against', 'slipknot'],
      romantic: ['ed sheeran perfect', 'john legend all of me', 'bruno mars marry you', 'sheeran thinking'],
    };

    const queries = moodQueries[moodKey] || moodQueries['happy'];
    const queryIndex = Math.floor(Math.random() * queries.length);
    const searchQuery = queries[queryIndex];

    console.log(
      `🎵 Getting ${mood} recommendations using search: "${searchQuery}"`,
    );

    try {
      // Use search to find mood-appropriate tracks
      // Request more tracks than needed to filter for ones with previews
      const searchResult = await this.searchTracks(
        searchQuery,
        Math.min(limit * 3, 50), // Request 3x tracks to filter for previews (max 50)
      );

      const allTracks = searchResult.tracks?.items || [];
      console.log(`✅ Found ${allTracks.length} total tracks`);
      
      // Prioritize tracks with preview URLs
      const tracksWithPreview = allTracks.filter((t: any) => t.preview_url);
      const tracksWithoutPreview = allTracks.filter((t: any) => !t.preview_url);
      
      console.log(`🎵 Tracks with preview: ${tracksWithPreview.length}, without: ${tracksWithoutPreview.length}`);
      
      // Combine: previews first, then others to reach the limit
      const tracks = [...tracksWithPreview, ...tracksWithoutPreview].slice(0, limit);

      // Save to database asynchronously (don't wait for it)
      if (tracks.length > 0) {
        this.syncTracksToDb(tracks).catch(err => 
          console.error('⚠️  Failed to sync tracks to DB:', err)
        );
      }

      return {
        tracks: tracks,
        mood: moodKey,
        query: searchQuery,
        stats: {
          total: allTracks.length,
          withPreview: tracksWithPreview.length,
          returned: tracks.length,
        },
      };
    } catch (error) {
      console.error('❌ Mood recommendations error:', error);
      throw error;
    }
  }

  getAuthorizationUrl(): string {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
    ].join(' ');

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: scopes,
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<any> {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
            'base64',
          ),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!res.ok) {
      throw new HttpException('Spotify auth failed', 400);
    }

    return res.json();
  }

  private async spotifyFetch(endpoint: string, token: string): Promise<any> {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = (await res.json()) as any;
      throw new HttpException(err.error?.message || 'Spotify API error', res.status);
    }

    return res.json();
  }

  async getTopTracks(token: string): Promise<any> {
    return this.spotifyFetch('v1/me/top/tracks?limit=20', token);
  }

  async getTopArtists(token: string): Promise<any> {
    return this.spotifyFetch('v1/me/top/artists?limit=20', token);
  }

  async getRecommendations(token: string, mood: string): Promise<any> {
    const profile = this.moodProfiles[mood.toLowerCase()];
    if (!profile) {
      throw new HttpException(`Unknown mood: ${mood}`, 400);
    }

    const params = new URLSearchParams({
      limit: '20',
      target_valence: String(profile.valence || 0.5),
      target_energy: String(profile.energy || 0.5),
      target_danceability: String(profile.danceability || 0.5),
    });

    return this.spotifyFetch(`v1/recommendations?${params}`, token);
  }

  async getMoodBasedRecommendations(
    token: string,
    mood: string,
    limit: number = 20,
  ): Promise<any> {
    const moodKey = mood.toLowerCase();
    const profile = this.moodProfiles[moodKey];
    if (!profile) {
      throw new HttpException(`Unknown mood: ${mood}`, 400);
    }

    // Get seed genres for this mood
    const genres = this.moodGenres[moodKey] || ['pop'];
    const selectedGenres = genres.slice(0, 3); // Spotify allows max 5 seeds, use 3 genres

    // Build parameters based on mood profile
    const params = new URLSearchParams({
      limit: String(limit),
      seed_genres: selectedGenres.join(','), // REQUIRED: seed parameter
    });

    if (profile.valence !== undefined) {
      params.append('target_valence', String(profile.valence));
    }
    if (profile.energy !== undefined) {
      params.append('target_energy', String(profile.energy));
    }
    if (profile.danceability !== undefined) {
      params.append('target_danceability', String(profile.danceability));
    }
    if (profile.acousticness !== undefined) {
      params.append('target_acousticness', String(profile.acousticness));
    }
    if (profile.instrumentalness !== undefined) {
      params.append('target_instrumentalness', String(profile.instrumentalness));
    }
    if (profile.tempo !== undefined) {
      params.append('target_tempo', String(profile.tempo));
    }

    console.log(`🎵 Spotify Recommendations - Mood: ${mood}, Genres: ${selectedGenres.join(', ')}`);

    const recommendations = await this.spotifyFetch(
      `v1/recommendations?${params}`,
      token,
    );

    // Save recommendations to database asynchronously (don't wait)
    if (recommendations.tracks) {
      this.syncTracksToDb(recommendations.tracks).catch(err =>
        console.error('⚠️  Failed to sync tracks to DB:', err)
      );
    }

    return recommendations;
  }

  async refreshSpotifyToken(
    refreshToken: string,
  ): Promise<{ access_token: string; expires_in: number }> {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
            'base64',
          ),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) {
      throw new HttpException('Failed to refresh Spotify token', res.status);
    }

    return (await res.json()) as SpotifyTokenRefreshResponse;
  }

  async syncTracksToDb(tracks: any[]): Promise<number> {
    let count = 0;

    for (const track of tracks) {
      const exists = await this.prisma.song.findFirst({
        where: { spotifyId: track.id },
      });

      if (!exists) {
        await this.prisma.song.create({
          data: {
            title: track.name,
            artist: track.artists.map((a: any) => a.name).join(', '),
            album: track.album?.name,
            duration: Math.floor(track.duration_ms / 1000),
            spotifyId: track.id,
            imageUrl: track.album?.images?.[0]?.url,
          },
        });
        count++;
      }
    }

    return count;
  }

  async getUserProfile(token: string): Promise<any> {
    return this.spotifyFetch('v1/me', token);
  }

  async saveTrackToLibrary(token: string, trackId: string): Promise<any> {
    const res = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new HttpException('Failed to save track', res.status);
    }

    return { message: 'Track saved to library' };
  }
}
