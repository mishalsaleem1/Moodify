import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFeedback(
    @GetUser('id') userId: string,
    @Body() createDto: CreateFeedbackDto,
  ) {
    return this.feedbackService.createFeedback(userId, createDto);
  }

  @Get('my-feedback')
  @UseGuards(JwtAuthGuard)
  async getUserFeedback(
    @GetUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.feedbackService.getUserFeedback(userId, skip, limit);
  }

  @Get('all')
  async getAllFeedback(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.feedbackService.getAllFeedback(skip, limit);
  }

  @Get('stats')
  async getFeedbackStats() {
    return this.feedbackService.getFeedbackStats();
  }

  @Get('status/:status')
  async getFeedbackByStatus(
    @Param('status') status: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.feedbackService.getFeedbackByStatus(status, skip, limit);
  }

  @Get(':id')
  async getFeedbackById(@Param('id') feedbackId: string) {
    return this.feedbackService.getFeedbackById(feedbackId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateFeedback(
    @Param('id') feedbackId: string,
    @Body() updateDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.updateFeedback(feedbackId, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteFeedback(@Param('id') feedbackId: string) {
    return this.feedbackService.deleteFeedback(feedbackId);
  }
}
