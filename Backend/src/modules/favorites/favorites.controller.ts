import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './dto/favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('api/favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post()
  async addFavorite(
    @Body() addFavoriteDto: AddFavoriteDto,
    @Query('userId') userId?: string,
  ) {
    // Use userId from query params or body
    const userIdentifier = userId || addFavoriteDto.userId;
    
    if (!userIdentifier) {
      throw new Error('userId is required');
    }
    
    console.log('💜 Adding favorite for user:', userIdentifier);
    return this.favoritesService.addFavorite(userIdentifier, addFavoriteDto);
  }

  @Get()
  async getUserFavorites(
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (!userId) {
      throw new Error('userId is required');
    }
    
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const skip = (pageNum - 1) * limitNum;
    
    console.log('📂 Getting favorites for user:', userId, 'skip:', skip, 'take:', limitNum);
    return this.favoritesService.getUserFavorites(userId, skip, limitNum);
  }

  @Delete(':songId')
  async removeFavorite(
    @Query('userId') userId: string,
    @Param('songId') songId: string,
  ) {
    if (!userId) {
      throw new Error('userId is required');
    }
    
    console.log('🗑️ Removing favorite for user:', userId);
    return this.favoritesService.removeFavorite(userId, songId);
  }

  @Get('check/:songId')
  async isFavorite(
    @Query('userId') userId: string,
    @Param('songId') songId: string,
  ) {
    if (!userId) {
      return { isFavorite: false };
    }
    
    const isFav = await this.favoritesService.isFavorite(userId, songId);
    return { isFavorite: isFav };
  }
}
