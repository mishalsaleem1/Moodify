import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AddFavoriteDto } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: string, addFavoriteDto: AddFavoriteDto) {
    const song = await this.prisma.song.findUnique({
      where: { id: addFavoriteDto.songId },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_songId: {
          userId,
          songId: addFavoriteDto.songId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Song already in favorites');
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        songId: addFavoriteDto.songId,
      },
      include: { song: true },
    });
  }

  async getUserFavorites(userId: string, skip: number = 0, take: number = 20) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      skip,
      take,
      include: { 
        song: { 
          include: { genre: true },
        } 
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.favorite.count({
      where: { userId },
    });

    // Map the response to include both property name formats for compatibility
    const mappedFavorites = favorites.map((fav: any) => ({
      ...fav,
      song: fav.song ? {
        ...fav.song,
        // Add property aliases for compatibility
        albumArt: fav.song.imageUrl,
        album_art: fav.song.imageUrl,
        preview_url: fav.song.previewUrl,
      } : null,
    }));

    return {
      data: mappedFavorites,
      favorites: mappedFavorites,  // Add for compatibility with frontend
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async removeFavorite(userId: string, songId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_songId: {
          userId,
          songId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: {
        userId_songId: {
          userId,
          songId,
        },
      },
    });

    return { message: 'Favorite removed successfully' };
  }

  async isFavorite(userId: string, songId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_songId: {
          userId,
          songId,
        },
      },
    });

    return !!favorite;
  }

  async reorderFavorites(userId: string, songIds: string[]) {
    // For now, favorites are ordered by creation date
    // If you want custom ordering, you'd need to add an order field to the Favorite model
    return this.getUserFavorites(userId);
  }
}
