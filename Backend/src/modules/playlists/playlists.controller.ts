import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto, UpdatePlaylistDto, AddSongToPlaylistDto } from './dto/playlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('playlists')
export class PlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}

  @Post()
  async createPlaylist(
    @Body() createPlaylistDto: CreatePlaylistDto,
  ) {
    // Get userId from body (can be userId, email, or username)
    const userId = createPlaylistDto.userId || createPlaylistDto.email || createPlaylistDto.username;
    
    if (!userId) {
      throw new Error('userId, email, or username is required');
    }
    
    console.log('🎵 Creating playlist for user:', userId);
    return this.playlistsService.createPlaylist(userId, createPlaylistDto);
  }

  @Get()
  async getUserPlaylists(
    @Query('userId') userId: string,
    @Query('email') email: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userIdentifier = userId || email;
    
    if (!userIdentifier) {
      throw new Error('userId or email is required');
    }
    
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    const skip = (pageNum - 1) * limitNum;
    
    console.log('📂 Fetching playlists for user:', userIdentifier);
    return this.playlistsService.getUserPlaylists(userIdentifier, skip, limitNum);
  }

  @Get(':id')
  async getPlaylistById(@Param('id') playlistId: string) {
    return this.playlistsService.getPlaylistById(playlistId);
  }

  @Put(':id')
  async updatePlaylist(
    @Query('userId') userId: string,
    @Param('id') playlistId: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.updatePlaylist(userId, playlistId, updatePlaylistDto);
  }

  @Delete(':id')
  async deletePlaylist(
    @Query('userId') userId: string,
    @Param('id') playlistId: string,
  ) {
    return this.playlistsService.deletePlaylist(userId, playlistId);
  }

  @Post(':playlistId/songs')
  async addSongToPlaylist(
    @Query('userId') userId: string,
    @Param('playlistId') playlistId: string,
    @Body() addSongDto: AddSongToPlaylistDto,
  ) {
    return this.playlistsService.addSongToPlaylist(userId, playlistId, addSongDto);
  }

  @Delete(':playlistId/songs/:songId')
  async removeSongFromPlaylist(
    @Query('userId') userId: string,
    @Param('playlistId') playlistId: string,
    @Param('songId') songId: string,
  ) {
    return this.playlistsService.removeSongFromPlaylist(userId, playlistId, songId);
  }

  @Put(':playlistId/reorder')
  async reorderPlaylistSongs(
    @Query('userId') userId: string,
    @Param('playlistId') playlistId: string,
    @Body('songIds') songIds: string[],
  ) {
    return this.playlistsService.reorderPlaylistSongs(userId, playlistId, songIds);
  }
}
