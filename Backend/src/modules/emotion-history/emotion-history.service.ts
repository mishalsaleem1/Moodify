import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateEmotionHistoryDto, UpdateEmotionHistoryDto } from './dto/emotion-history.dto';

@Injectable()
export class EmotionHistoryService {
  constructor(private prisma: PrismaService) {}

  async createEmotionRecord(userId: string, createDto: CreateEmotionHistoryDto) {
    return this.prisma.emotionHistory.create({
      data: {
        userId,
        ...createDto,
      },
    });
  }

  async getUserEmotionHistory(userId: string, skip: number = 0, take: number = 20) {
    const emotions = await this.prisma.emotionHistory.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { detectedAt: 'desc' },
    });

    const total = await this.prisma.emotionHistory.count({
      where: { userId },
    });

    return {
      data: emotions,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async getEmotionById(emotionId: string) {
    const emotion = await this.prisma.emotionHistory.findUnique({
      where: { id: emotionId },
    });

    if (!emotion) {
      throw new NotFoundException('Emotion record not found');
    }

    return emotion;
  }

  async getEmotionsByType(userId: string, emotion: string, skip: number = 0, take: number = 20) {
    const emotions = await this.prisma.emotionHistory.findMany({
      where: {
        userId,
        emotion: {
          contains: emotion,
          mode: 'insensitive',
        },
      },
      skip,
      take,
      orderBy: { detectedAt: 'desc' },
    });

    const total = await this.prisma.emotionHistory.count({
      where: {
        userId,
        emotion: {
          contains: emotion,
          mode: 'insensitive',
        },
      },
    });

    return {
      data: emotions,
      total,
      emotion,
    };
  }

  async updateEmotionRecord(
    emotionId: string,
    updateDto: UpdateEmotionHistoryDto,
  ) {
    const emotion = await this.prisma.emotionHistory.findUnique({
      where: { id: emotionId },
    });

    if (!emotion) {
      throw new NotFoundException('Emotion record not found');
    }

    return this.prisma.emotionHistory.update({
      where: { id: emotionId },
      data: updateDto,
    });
  }

  async deleteEmotionRecord(emotionId: string) {
    const emotion = await this.prisma.emotionHistory.findUnique({
      where: { id: emotionId },
    });

    if (!emotion) {
      throw new NotFoundException('Emotion record not found');
    }

    await this.prisma.emotionHistory.delete({
      where: { id: emotionId },
    });

    return { message: 'Emotion record deleted successfully' };
  }

  async clearUserEmotionHistory(userId: string) {
    const result = await this.prisma.emotionHistory.deleteMany({
      where: { userId },
    });

    return { message: `Deleted ${result.count} emotion records` };
  }

  async getEmotionStats(userId: string) {
    const emotions = await this.prisma.emotionHistory.groupBy({
      by: ['emotion'],
      where: { userId },
      _count: true,
      orderBy: {
        _count: {
          emotion: 'desc',
        },
      },
    });

    return emotions;
  }
}
