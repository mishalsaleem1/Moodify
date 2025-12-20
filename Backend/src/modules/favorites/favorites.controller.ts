import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './dto/favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('api/favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addFavorite(
    @GetUser('id') userId: string,
    @Body() addFavoriteDto: AddFavoriteDto,
  ) {
    return this.favoritesService.addFavorite(userId, addFavoriteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserFavorites(
    @GetUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    return this.favoritesService.getUserFavorites(userId, skip, limit);
  }

  @Delete(':songId')
  @UseGuards(JwtAuthGuard)
  async removeFavorite(
    @GetUser('id') userId: string,
    @Param('songId') songId: string,
  ) {
    return this.favoritesService.removeFavorite(userId, songId);
  }

  @Get('check/:songId')
  @UseGuards(JwtAuthGuard)
  async isFavorite(
    @GetUser('id') userId: string,
    @Param('songId') songId: string,
  ) {
    const isFav = await this.favoritesService.isFavorite(userId, songId);
    return { isFavorite: isFav };
  }
}
