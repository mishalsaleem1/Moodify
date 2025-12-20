import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MoodSongsService } from './mood-songs.service';
import { CreateMoodSongDto, UpdateMoodSongDto } from './dto/mood-song.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/mood-songs')
export class MoodSongsController {
  constructor(private moodSongsService: MoodSongsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMoodSong(@Body() createDto: CreateMoodSongDto) {
    return this.moodSongsService.createMoodSong(createDto);
  }

  @Get('moods')
  async getAllMoods() {
    return this.moodSongsService.getAllMoods();
  }

  @Get('mood/:mood')
  async getSongsByMood(
    @Param('mood') mood: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    return this.moodSongsService.getSongsByMood(mood, skip, limit);
  }

  @Get('song/:songId')
  async getSongMoods(@Param('songId') songId: string) {
    return this.moodSongsService.getSongMoods(songId);
  }

  @Get(':id')
  async getMoodSongById(@Param('id') moodSongId: string) {
    return this.moodSongsService.getMoodSongById(moodSongId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateMoodSong(
    @Param('id') moodSongId: string,
    @Body() updateDto: UpdateMoodSongDto,
  ) {
    return this.moodSongsService.updateMoodSong(moodSongId, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteMoodSong(@Param('id') moodSongId: string) {
    return this.moodSongsService.deleteMoodSong(moodSongId);
  }
}
