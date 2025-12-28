import { Controller, Post, Body, UseGuards, Get, Param, Req, Res, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdatePasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SpotifyAuthGuard } from './guards/spotify-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Response } from 'express';
import { GoogleTokenResponse, GoogleUserInfo } from './interfaces/google.interface';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('🌐 POST /api/auth/register endpoint hit');
    console.log('📦 Request body:', registerDto);
    try {
      const result = await this.authService.register(registerDto);
      console.log('✅ Registration successful, sending response');
      return result;
    } catch (error) {
      console.error('❌ Registration controller error:', error.message);
      throw error;
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@GetUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @GetUser('id') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(userId, updatePasswordDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@GetUser() user: any) {
    return user;
  }

  // Spotify OAuth endpoints
  @Get('spotify/authorize')
  async spotifyAuthorize() {
    return this.authService.getSpotifyAuthUrl();
  }

  @Get('spotify/callback')
  async spotifyCallback(@Query('code') code: string, @Res() res: Response) {
    const result = await this.authService.handleSpotifyCallback(code);
    res.redirect(`http://localhost:5173/spotify-callback?token=${result.access_token}`);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshAccessToken(body.refreshToken);
  }

  // Google OAuth endpoints
  @Get('google')
  async googleAuth() {
    // This endpoint is not used - Google OAuth flow is initiated from frontend
    return { message: 'Use frontend to initiate Google OAuth' };
  }

  @Get('google/callback')
  async googleAuthCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      console.log('🔵 Google OAuth Callback received');
      console.log('📦 Authorization code:', code ? 'Present' : 'Missing');
      
      // Exchange code for tokens
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = process.env.GOOGLE_CALLBACK_URL;

      console.log('🔑 Google Client ID:', clientId ? 'Present' : 'Missing');
      console.log('🔑 Google Client Secret:', clientSecret ? 'Present' : 'Missing');
      console.log('🔗 Redirect URI:', redirectUri);

      if (!clientId || !clientSecret || !redirectUri) {
        console.error('❌ Google OAuth configuration is missing');
        throw new Error('Google OAuth configuration is missing');
      }

      if (!code) {
        console.error('❌ No authorization code received');
        throw new Error('No authorization code received');
      }

      console.log('🔄 Exchanging code for tokens...');
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        } as Record<string, string>),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        console.error('❌ Token exchange failed:', errorData);
        throw new Error(`Token exchange failed: ${errorData}`);
      }

      const tokens = await tokenResponse.json() as GoogleTokenResponse;
      console.log('✅ Tokens received from Google');

      // Get user info
      console.log('🔄 Fetching user info from Google...');
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      if (!userInfoResponse.ok) {
        const errorData = await userInfoResponse.text();
        console.error('❌ User info fetch failed:', errorData);
        throw new Error(`User info fetch failed: ${errorData}`);
      }

      const googleUser = await userInfoResponse.json() as GoogleUserInfo;
      console.log('✅ User info received:', googleUser.email);

      // Process login/registration
      console.log('🔄 Processing login/registration...');
      const result = await this.authService.handleGoogleLogin({
        email: googleUser.email,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        picture: googleUser.picture,
        googleId: googleUser.id,
      });

      console.log('✅ User authenticated successfully');
      console.log('🔄 Redirecting to frontend with token...');
      
      // Get frontend URL from environment
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
      const redirectUrl = `${frontendUrl}/auth/google/callback?token=${result.accessToken}`;
      
      console.log('🔗 Frontend URL:', frontendUrl);
      console.log('🔗 Full Redirect URL:', redirectUrl);
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ Google callback error:', error);
      console.error('Error stack:', error.stack);
      
      // Get frontend URL from environment for error redirect too
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
  }
}
