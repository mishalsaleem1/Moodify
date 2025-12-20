import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateSongDto, UpdateSongDto } from './dto/song.dto';

@Injectable()
export class SongsService {
  constructor(private prisma: PrismaService) {}

  async createSong(createSongDto: CreateSongDto) {
    return this.prisma.song.create({
      data: createSongDto,
      include: { genre: true },
    });
  }

  async getAllSongs(skip: number = 0, take: number = 20) {
    const songs = await this.prisma.song.findMany({
      skip,
      take,
      include: { genre: true },
    });

    const total = await this.prisma.song.count();

    return {
      data: songs,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async getSongById(songId: string) {
    const song = await this.prisma.song.findUnique({
      where: { id: songId },
      include: {
        genre: true,
        playlists: {
          include: { playlist: true },
        },
      },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    return song;
  }

  async getSongsByGenre(genreId: string, skip: number = 0, take: number = 20) {
    const songs = await this.prisma.song.findMany({
      where: { genreId },
      skip,
      take,
      include: { genre: true },
    });

    const total = await this.prisma.song.count({
      where: { genreId },
    });

    return {
      data: songs,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async updateSong(songId: string, updateSongDto: UpdateSongDto) {
    const song = await this.prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    return this.prisma.song.update({
      where: { id: songId },
      data: updateSongDto,
      include: { genre: true },
    });
  }

  async deleteSong(songId: string) {
    const song = await this.prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    await this.prisma.song.delete({
      where: { id: songId },
    });

    return { message: 'Song deleted successfully' };
  }

  async searchSongs(query: string, skip: number = 0, take: number = 20) {
    const songs = await this.prisma.song.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { artist: { contains: query, mode: 'insensitive' } },
          { album: { contains: query, mode: 'insensitive' } },
        ],
      },
      skip,
      take,
      include: { genre: true },
    });

    const total = await this.prisma.song.count({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { artist: { contains: query, mode: 'insensitive' } },
          { album: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return {
      data: songs,
      total,
      query,
    };
  }
}
