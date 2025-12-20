import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async createFeedback(userId: string, createDto: CreateFeedbackDto) {
    return this.prisma.feedback.create({
      data: {
        userId,
        ...createDto,
      },
      include: { user: { select: { id: true, email: true, username: true } } },
    });
  }

  async getUserFeedback(userId: string, skip: number = 0, take: number = 10) {
    const feedback = await this.prisma.feedback.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.feedback.count({
      where: { userId },
    });

    return {
      data: feedback,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async getAllFeedback(skip: number = 0, take: number = 10) {
    const feedback = await this.prisma.feedback.findMany({
      skip,
      take,
      include: { user: { select: { id: true, email: true, username: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.feedback.count();

    return {
      data: feedback,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async getFeedbackById(feedbackId: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id: feedbackId },
      include: { user: { select: { id: true, email: true, username: true } } },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    return feedback;
  }

  async updateFeedback(feedbackId: string, updateDto: UpdateFeedbackDto) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    return this.prisma.feedback.update({
      where: { id: feedbackId },
      data: updateDto,
      include: { user: { select: { id: true, email: true, username: true } } },
    });
  }

  async deleteFeedback(feedbackId: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    await this.prisma.feedback.delete({
      where: { id: feedbackId },
    });

    return { message: 'Feedback deleted successfully' };
  }

  async getFeedbackByStatus(status: string, skip: number = 0, take: number = 10) {
    const feedback = await this.prisma.feedback.findMany({
      where: { status },
      skip,
      take,
      include: { user: { select: { id: true, email: true, username: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.feedback.count({
      where: { status },
    });

    return {
      data: feedback,
      total,
      status,
    };
  }

  async getFeedbackStats() {
    const stats = await this.prisma.feedback.groupBy({
      by: ['status', 'rating'],
      _count: true,
    });

    const byStatus = await this.prisma.feedback.groupBy({
      by: ['status'],
      _count: true,
    });

    return {
      byStatus: byStatus.map(s => ({
        status: s.status,
        count: s._count,
      })),
      total: stats.reduce((sum, s) => sum + s._count, 0),
    };
  }
}
