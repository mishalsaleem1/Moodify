import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto, LoginDto, UpdatePasswordDto } from './dto/auth.dto';
import { SpotifyTokenResponse, SpotifyUserProfile } from './interfaces/spotify.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password, firstName, lastName } = registerDto;

    console.log('🔵 ========== REGISTRATION REQUEST ==========');
    console.log('📧 Email:', email);
    console.log('👤 Username:', username);
    console.log('📝 First Name:', firstName);
    console.log('📝 Last Name:', lastName);
    console.log('🔐 Password provided:', !!password);

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      console.log('❌ Registration failed: User already exists');
      console.log('   Existing user email:', existingUser.email);
      console.log('   Existing user username:', existingUser.username);
      throw new ConflictException('Email or username already exists');
    }

    console.log('✅ User validation passed - email and username are unique');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');

    // Create user
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          firstName,
          lastName,
        },
      });

      console.log('✅ User created successfully in database');
      console.log('   User ID:', user.id);
      console.log('   User email:', user.email);
      console.log('   User username:', user.username);
      
      const authResponse = await this.generateAuthResponse(user);
      console.log('✅ Auth tokens generated successfully');
      console.log('✅ Registration complete - sending response to client');
      console.log('========================================');
      
      return authResponse;
    } catch (createError) {
      console.error('❌ Error creating user in database:', createError);
      throw createError;
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    console.log('Login attempt for email:', email);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('User not found:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('User found, checking password...');
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      console.log('Invalid password for user:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('Login successful for user:', email);
    return this.generateAuthResponse(user);
  }

  async validateUser(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const { currentPassword, newPassword } = updatePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordValid = await bcrypt.compare(currentPassword, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async logout(userId: string) {
    await this.prisma.session.deleteMany({
      where: { userId },
    });

    return { message: 'Logged out successfully' };
  }

  getSpotifyAuthUrl(): string {
    const clientId = this.configService.get('SPOTIFY_CLIENT_ID');
    const redirectUri = this.configService.get('SPOTIFY_REDIRECT_URI');
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'playlist-modify-public',
      'playlist-modify-private',
    ].join(' ');

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scopes,
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async handleSpotifyCallback(code: string): Promise<any> {
    const clientId = this.configService.get('SPOTIFY_CLIENT_ID');
    const clientSecret = this.configService.get('SPOTIFY_CLIENT_SECRET');
    const redirectUri = this.configService.get('SPOTIFY_REDIRECT_URI');

    // Exchange code for token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new UnauthorizedException('Failed to exchange code for token');
    }

    const tokenData = (await tokenResponse.json()) as SpotifyTokenResponse;

    // Get user profile from Spotify
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      throw new UnauthorizedException('Failed to get user profile');
    }

    const spotifyProfile = (await profileResponse.json()) as SpotifyUserProfile;

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email: spotifyProfile.email },
    });

    if (!user) {
      // Create new user from Spotify profile
      user = await this.prisma.user.create({
        data: {
          email: spotifyProfile.email,
          username: spotifyProfile.display_name || spotifyProfile.id,
          password: await bcrypt.hash(Math.random().toString(), 10), // Random password for Spotify users
          firstName: spotifyProfile.display_name?.split(' ')[0] || 'Spotify User',
          profileImage: spotifyProfile.images?.[0]?.url,
          spotifyAccessToken: tokenData.access_token,
          spotifyTokenExpiry: new Date(Date.now() + tokenData.expires_in * 1000),
          spotifyRefreshToken: tokenData.refresh_token,
        },
      });
    } else {
      // Update existing user with Spotify tokens
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          spotifyAccessToken: tokenData.access_token,
          spotifyTokenExpiry: new Date(Date.now() + tokenData.expires_in * 1000),
          spotifyRefreshToken: tokenData.refresh_token,
        },
      });
    }

    return this.generateAuthResponse(user);
  }

  async refreshAccessToken(refreshToken: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateAuthResponse(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateAuthResponse(user: any) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    // Create session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
      },
    };
  }
}
