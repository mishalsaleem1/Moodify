import { Controller, Post, Body, UseGuards, Get, Param, Req, Res, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdatePasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SpotifyAuthGuard } from './guards/spotify-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
