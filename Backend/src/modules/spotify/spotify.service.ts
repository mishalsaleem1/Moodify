import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.clientId = this.config.get('SPOTIFY_CLIENT_ID') || '';
    this.clientSecret = this.config.get('SPOTIFY_CLIENT_SECRET') || '';
    this.redirectUri = this.config.get('SPOTIFY_REDIRECT_URI') || '';
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

  async getRecommendations(token: string, genres: string[]): Promise<any> {
    const params = new URLSearchParams({
      seed_genres: genres.join(','),
      limit: '20',
    });

    return this.spotifyFetch(`v1/recommendations?${params}`, token);
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
}
