import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto, UpdateGenreDto } from './dto/genre.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/genres')
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createGenre(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.createGenre(createGenreDto);
  }

  @Get()
  async getAllGenres(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.genresService.getAllGenres(skip, limit);
  }

  @Get(':id')
  async getGenreById(@Param('id') genreId: string) {
    return this.genresService.getGenreById(genreId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateGenre(
    @Param('id') genreId: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    return this.genresService.updateGenre(genreId, updateGenreDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteGenre(@Param('id') genreId: string) {
    return this.genresService.deleteGenre(genreId);
  }
}
