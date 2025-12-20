import { Controller, Get, UseGuards, Query, HttpException, Res } from '@nestjs/common';
import { Response } from 'express';
import { SpotifyService } from './spotify.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { PrismaService } from '../../common/prisma/prisma.service';

@Controller('api/spotify')
export class SpotifyController {
  constructor(
    private spotify: SpotifyService,
    private prisma: PrismaService,
  ) {}

  @Get('login')
  @UseGuards(JwtAuthGuard)
  login() {
    return { url: this.spotify.getAuthorizationUrl() };
  }

  // Frontend-friendly alias used in the app (PUBLIC - no auth required)
  @Get('connect')
  connect() {
    return { url: this.spotify.getAuthorizationUrl() };
  }

  // Check if any Spotify-linked songs exist (simple connected heuristic)
  @Get('connected')
  @UseGuards(JwtAuthGuard)
  async connected(@GetUser('id') userId: string) {
    const count = await this.prisma.song.count({ where: { spotifyId: { not: null } } });
    return { connected: count > 0 };
  }

  // Sync top tracks for the logged-in user into the DB (requires token param)
  // Can be used by authenticated OR unauthenticated users with a Spotify token
  @Get('sync')
  async sync(@Query('token') token: string) {
    if (!token) {
      throw new HttpException('Spotify access token required', 401);
    }

    try {
      const top = await this.spotify.getTopTracks(token);
      const synced = await this.spotify.syncTracksToDb(top.items || []);
      return { synced };
    } catch (err) {
      throw new HttpException('Failed to sync tracks', 400);
    }
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Query('error') error: string, @Res() res: Response) {
    if (error) {
      // User denied authorization
      const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontend}/profile?spotify_error=denied`);
    }

    try {
      const tokenData = (await this.spotify.exchangeCodeForToken(code)) as any;

      // Redirect to frontend with token (frontend should read from query and store in localStorage)
      const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectUrl = `${frontend}/spotify-callback?accessToken=${encodeURIComponent(
        tokenData.access_token,
      )}&expiresIn=${encodeURIComponent(String(tokenData.expires_in))}`;

      return res.redirect(redirectUrl);
    } catch (err) {
      const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontend}/profile?spotify_error=exchange_failed`);
    }
  }

  @Get('top-tracks')
  async topTracks(@Query('token') token: string) {
    if (!token) {
      throw new HttpException('Spotify access token required', 401);
    }
    return this.spotify.getTopTracks(token);
  }

  @Get('recommendations')
  async moodMusic(
    @Query('token') token: string,
    @Query('mood') mood: string,
  ) {
    if (!token) {
      throw new HttpException('Spotify access token required', 401);
    }

    const moodGenres: { [key: string]: string[] } = {
      happy: ['pop', 'dance'],
      sad: ['acoustic'],
      angry: ['rock'],
      calm: ['ambient'],
    };

    return this.spotify.getRecommendations(
      token,
      moodGenres[mood] || ['pop'],
    );
  }
}
