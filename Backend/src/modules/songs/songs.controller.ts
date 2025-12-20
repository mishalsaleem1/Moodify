import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto, UpdateSongDto } from './dto/song.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSong(@Body() createSongDto: CreateSongDto) {
    return this.songsService.createSong(createSongDto);
  }

  @Get()
  async getAllSongs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    return this.songsService.getAllSongs(skip, limit);
  }

  @Get('search')
  async searchSongs(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    return this.songsService.searchSongs(query, skip, limit);
  }

  @Get('genre/:genreId')
  async getSongsByGenre(
    @Param('genreId') genreId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    return this.songsService.getSongsByGenre(genreId, skip, limit);
  }

  @Get(':id')
  async getSongById(@Param('id') songId: string) {
    return this.songsService.getSongById(songId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateSong(
    @Param('id') songId: string,
    @Body() updateSongDto: UpdateSongDto,
  ) {
    return this.songsService.updateSong(songId, updateSongDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteSong(@Param('id') songId: string) {
    return this.songsService.deleteSong(songId);
  }
}
