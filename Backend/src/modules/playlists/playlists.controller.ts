import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto, UpdatePlaylistDto, AddSongToPlaylistDto } from './dto/playlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('api/playlists')
export class PlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPlaylist(
    @GetUser('id') userId: string,
    @Body() createPlaylistDto: CreatePlaylistDto,
  ) {
    return this.playlistsService.createPlaylist(userId, createPlaylistDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserPlaylists(
    @GetUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.playlistsService.getUserPlaylists(userId, skip, limit);
  }

  @Get(':id')
  async getPlaylistById(@Param('id') playlistId: string) {
    return this.playlistsService.getPlaylistById(playlistId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePlaylist(
    @GetUser('id') userId: string,
    @Param('id') playlistId: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.updatePlaylist(userId, playlistId, updatePlaylistDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePlaylist(
    @GetUser('id') userId: string,
    @Param('id') playlistId: string,
  ) {
    return this.playlistsService.deletePlaylist(userId, playlistId);
  }

  @Post(':playlistId/songs')
  @UseGuards(JwtAuthGuard)
  async addSongToPlaylist(
    @GetUser('id') userId: string,
    @Param('playlistId') playlistId: string,
    @Body() addSongDto: AddSongToPlaylistDto,
  ) {
    return this.playlistsService.addSongToPlaylist(userId, playlistId, addSongDto);
  }

  @Delete(':playlistId/songs/:songId')
  @UseGuards(JwtAuthGuard)
  async removeSongFromPlaylist(
    @GetUser('id') userId: string,
    @Param('playlistId') playlistId: string,
    @Param('songId') songId: string,
  ) {
    return this.playlistsService.removeSongFromPlaylist(userId, playlistId, songId);
  }

  @Put(':playlistId/reorder')
  @UseGuards(JwtAuthGuard)
  async reorderPlaylistSongs(
    @GetUser('id') userId: string,
    @Param('playlistId') playlistId: string,
    @Body('songIds') songIds: string[],
  ) {
    return this.playlistsService.reorderPlaylistSongs(userId, playlistId, songIds);
  }
}
