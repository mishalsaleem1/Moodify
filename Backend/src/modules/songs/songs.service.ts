import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateSongDto, UpdateSongDto } from './dto/song.dto';

@Injectable()
export class SongsService {
  constructor(private prisma: PrismaService) {}

  async createSong(createSongDto: CreateSongDto) {
    // Map albumArt to imageUrl if provided
    const songData = {
      ...createSongDto,
      imageUrl: createSongDto.albumArt || createSongDto.imageUrl,
    };
    
    // Remove albumArt as it's not in the database schema
    delete songData.albumArt;
    
    // Check if song with spotifyId already exists
    if (songData.spotifyId) {
      const existing = await this.prisma.song.findUnique({
        where: { spotifyId: songData.spotifyId },
        include: { genre: true },
      });
      
      if (existing) {
        console.log('ℹ️ Song with spotifyId already exists, returning existing song');
        return existing;
      }
    }
    
    // Create new song
    console.log('🎵 Creating new song:', songData);
    return this.prisma.song.create({
      data: songData,
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

  async searchSongs(
    searchParams: { query?: string; spotifyId?: string; title?: string; artist?: string },
    skip: number = 0,
    take: number = 20,
  ) {
    const { query, spotifyId, title, artist } = searchParams;
    
    // Build where clause
    const where: any = {};
    
    // If spotifyId is provided, search by that first (unique)
    if (spotifyId) {
      where.spotifyId = spotifyId;
    }
    // If title and artist are provided, search by exact match
    else if (title && artist) {
      where.AND = [
        { title: { contains: title, mode: 'insensitive' } },
        { artist: { contains: artist, mode: 'insensitive' } },
      ];
    }
    // If query is provided, search across multiple fields
    else if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { artist: { contains: query, mode: 'insensitive' } },
        { album: { contains: query, mode: 'insensitive' } },
      ];
    }
    
    const songs = await this.prisma.song.findMany({
      where,
      skip,
      take,
      include: { genre: true },
    });

    const total = await this.prisma.song.count({ where });

    return {
      data: songs,
      total,
      query,
    };
  }
}
