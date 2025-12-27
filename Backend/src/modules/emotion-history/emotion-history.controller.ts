import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EmotionHistoryService } from './emotion-history.service';
import { CreateEmotionHistoryDto, UpdateEmotionHistoryDto } from './dto/emotion-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('emotion-history')
export class EmotionHistoryController {
  constructor(private emotionHistoryService: EmotionHistoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createEmotionRecord(
    @GetUser('id') userId: string,
    @Body() createDto: CreateEmotionHistoryDto,
  ) {
    return this.emotionHistoryService.createEmotionRecord(userId, createDto);
  }

  @Get()
  async getUserEmotionHistory(
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (!userId) {
      return {
        data: [],
        total: 0,
        page: 1,
        pageSize: 20,
      };
    }
    
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const skip = (pageNum - 1) * limitNum;
    
    return this.emotionHistoryService.getUserEmotionHistory(userId, skip, limitNum);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getEmotionStats(@GetUser('id') userId: string) {
    return this.emotionHistoryService.getEmotionStats(userId);
  }

  @Get('type/:emotion')
  @UseGuards(JwtAuthGuard)
  async getEmotionsByType(
    @GetUser('id') userId: string,
    @Param('emotion') emotion: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    return this.emotionHistoryService.getEmotionsByType(userId, emotion, skip, limit);
  }

  @Get(':id')
  async getEmotionById(@Param('id') emotionId: string) {
    return this.emotionHistoryService.getEmotionById(emotionId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateEmotionRecord(
    @Param('id') emotionId: string,
    @Body() updateDto: UpdateEmotionHistoryDto,
  ) {
    return this.emotionHistoryService.updateEmotionRecord(emotionId, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteEmotionRecord(@Param('id') emotionId: string) {
    return this.emotionHistoryService.deleteEmotionRecord(emotionId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async clearEmotionHistory(@GetUser('id') userId: string) {
    return this.emotionHistoryService.clearUserEmotionHistory(userId);
  }
}
