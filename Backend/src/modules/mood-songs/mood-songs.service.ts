import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateMoodSongDto, UpdateMoodSongDto } from './dto/mood-song.dto';

@Injectable()
export class MoodSongsService {
  constructor(private prisma: PrismaService) {}

  async createMoodSong(createDto: CreateMoodSongDto) {
    const song = await this.prisma.song.findUnique({
      where: { id: createDto.songId },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    const existing = await this.prisma.moodSong.findUnique({
      where: {
        mood_songId: {
          mood: createDto.mood,
          songId: createDto.songId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Mood-Song mapping already exists');
    }

    return this.prisma.moodSong.create({
      data: createDto,
      include: { song: { include: { genre: true } } },
    });
  }

  async getSongsByMood(mood: string, skip: number = 0, take: number = 20) {
    const moodSongs = await this.prisma.moodSong.findMany({
      where: { mood },
      skip,
      take,
      include: { song: { include: { genre: true } } },
      orderBy: { relevanceScore: 'desc' },
    });

    const total = await this.prisma.moodSong.count({
      where: { mood },
    });

    return {
      data: moodSongs,
      total,
      mood,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async getAllMoods() {
    const moods = await this.prisma.moodSong.groupBy({
      by: ['mood'],
      _count: true,
      orderBy: {
        _count: {
          mood: 'desc',
        },
      },
    });

    return moods.map((m: any) => ({
      mood: m.mood,
      songCount: m._count,
    }));
  }

  async getMoodSongById(moodSongId: string) {
    const moodSong = await this.prisma.moodSong.findUnique({
      where: { id: moodSongId },
      include: { song: { include: { genre: true } } },
    });

    if (!moodSong) {
      throw new NotFoundException('Mood-Song mapping not found');
    }

    return moodSong;
  }

  async updateMoodSong(moodSongId: string, updateDto: UpdateMoodSongDto) {
    const moodSong = await this.prisma.moodSong.findUnique({
      where: { id: moodSongId },
    });

    if (!moodSong) {
      throw new NotFoundException('Mood-Song mapping not found');
    }

    return this.prisma.moodSong.update({
      where: { id: moodSongId },
      data: updateDto,
      include: { song: { include: { genre: true } } },
    });
  }

  async deleteMoodSong(moodSongId: string) {
    const moodSong = await this.prisma.moodSong.findUnique({
      where: { id: moodSongId },
    });

    if (!moodSong) {
      throw new NotFoundException('Mood-Song mapping not found');
    }

    await this.prisma.moodSong.delete({
      where: { id: moodSongId },
    });

    return { message: 'Mood-Song mapping deleted successfully' };
  }

  async getSongMoods(songId: string) {
    const song = await this.prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    return this.prisma.moodSong.findMany({
      where: { songId },
      include: { song: { include: { genre: true } } },
    });
  }
}
