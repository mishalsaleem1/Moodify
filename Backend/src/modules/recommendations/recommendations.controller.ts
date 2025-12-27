import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { CreateRecommendationDto, UpdateRecommendationDto } from './dto/recommendation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRecommendation(
    @GetUser('id') userId: string,
    @Body() createDto: CreateRecommendationDto,
  ) {
    return this.recommendationsService.createRecommendation(userId, createDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserRecommendations(
    @GetUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    return this.recommendationsService.getUserRecommendations(userId, skip, limit);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getRecommendationStats(@GetUser('id') userId: string) {
    return this.recommendationsService.getRecommendationStats(userId);
  }

  @Get('liked')
  @UseGuards(JwtAuthGuard)
  async getLikedRecommendations(
    @GetUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    return this.recommendationsService.getLikedRecommendations(userId, skip, limit);
  }

  @Get(':id')
  async getRecommendationById(@Param('id') recommendationId: string) {
    return this.recommendationsService.getRecommendationById(recommendationId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateRecommendation(
    @Param('id') recommendationId: string,
    @Body() updateDto: UpdateRecommendationDto,
  ) {
    return this.recommendationsService.updateRecommendation(recommendationId, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteRecommendation(@Param('id') recommendationId: string) {
    return this.recommendationsService.deleteRecommendation(recommendationId);
  }
}
