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

@Injectable()
export class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

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

  // Spotify seed genres for each mood
  private moodGenres: Record<string, string[]> = {
    happy: ['pop', 'dance', 'indie-pop', 'summer', 'party'],
    sad: ['sad', 'blues', 'acoustic', 'piano', 'indie'],
    energetic: ['edm', 'dance', 'electro', 'hardstyle', 'electronic'],
    calm: ['ambient', 'chill', 'acoustic', 'classical', 'study'],
    focus: ['study', 'classical', 'ambient', 'minimal', 'piano'],
    party: ['party', 'dance', 'electronic', 'hip-hop', 'pop'],
    angry: ['metal', 'rock', 'punk', 'hardcore', 'hard-rock'],
    romantic: ['romance', 'r-n-b', 'soul', 'indie', 'acoustic'],
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

    // Save recommendations to database
    await this.syncTracksToDb(recommendations.tracks);

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
