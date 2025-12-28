import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRecommendationDto, UpdateRecommendationDto } from './dto/recommendation.dto';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async createRecommendation(userId: string, createDto: CreateRecommendationDto) {
    const song = await this.prisma.song.findUnique({
      where: { id: createDto.songId },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    const existing = await this.prisma.recommendation.findFirst({
      where: {
        userId,
        songId: createDto.songId,
      },
    });

    if (existing) {
      throw new ConflictException('Recommendation already exists for this song');
    }

    return this.prisma.recommendation.create({
      data: {
        userId,
        ...createDto,
      },
      include: { song: { include: { genre: true } } },
    });
  }

  async getUserRecommendations(userId: string, skip: number = 0, take: number = 20) {
    const recommendations = await this.prisma.recommendation.findMany({
      where: { userId },
      skip,
      take,
      include: { song: { include: { genre: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.recommendation.count({
      where: { userId },
    });

    return {
      data: recommendations,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async getRecommendationById(recommendationId: string) {
    const recommendation = await this.prisma.recommendation.findUnique({
      where: { id: recommendationId },
      include: { song: { include: { genre: true } } },
    });

    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }

    return recommendation;
  }

  async updateRecommendation(recommendationId: string, updateDto: UpdateRecommendationDto) {
    const recommendation = await this.prisma.recommendation.findUnique({
      where: { id: recommendationId },
    });

    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }

    return this.prisma.recommendation.update({
      where: { id: recommendationId },
      data: updateDto,
      include: { song: { include: { genre: true } } },
    });
  }

  async deleteRecommendation(recommendationId: string) {
    const recommendation = await this.prisma.recommendation.findUnique({
      where: { id: recommendationId },
    });

    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }

    await this.prisma.recommendation.delete({
      where: { id: recommendationId },
    });

    return { message: 'Recommendation deleted successfully' };
  }

  async getRecommendationStats(userId: string) {
    const stats = await this.prisma.recommendation.groupBy({
      by: ['liked'],
      where: { userId },
      _count: true,
    });

    return {
      total: stats.reduce((sum: any, s: any) => sum + s._count, 0),
      liked: stats.find((s: any) => s.liked === true)?._count || 0,
      disliked: stats.find((s: any) => s.liked === false)?._count || 0,
      neutral: stats.find((s: any) => s.liked === null)?._count || 0,
    };
  }

  async getLikedRecommendations(userId: string, skip: number = 0, take: number = 20) {
    const recommendations = await this.prisma.recommendation.findMany({
      where: { userId, liked: true },
      skip,
      take,
      include: { song: { include: { genre: true } } },
      orderBy: { updatedAt: 'desc' },
    });

    const total = await this.prisma.recommendation.count({
      where: { userId, liked: true },
    });

    return {
      data: recommendations,
      total,
    };
  }
}
