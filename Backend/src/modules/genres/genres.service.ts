import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateGenreDto, UpdateGenreDto } from './dto/genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async createGenre(createGenreDto: CreateGenreDto) {
    const existingGenre = await this.prisma.genre.findUnique({
      where: { name: createGenreDto.name },
    });

    if (existingGenre) {
      throw new ConflictException('Genre already exists');
    }

    return this.prisma.genre.create({
      data: createGenreDto,
    });
  }

  async getAllGenres(skip: number = 0, take: number = 10) {
    const genres = await this.prisma.genre.findMany({
      skip,
      take,
      include: {
        _count: {
          select: { songs: true },
        },
      },
    });

    const total = await this.prisma.genre.count();

    return {
      data: genres,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async getGenreById(genreId: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: genreId },
      include: {
        songs: true,
      },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return genre;
  }

  async updateGenre(genreId: string, updateGenreDto: UpdateGenreDto) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: genreId },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    // Check if new name already exists
    if (updateGenreDto.name && updateGenreDto.name !== genre.name) {
      const existingGenre = await this.prisma.genre.findUnique({
        where: { name: updateGenreDto.name },
      });

      if (existingGenre) {
        throw new ConflictException('Genre name already exists');
      }
    }

    return this.prisma.genre.update({
      where: { id: genreId },
      data: updateGenreDto,
    });
  }

  async deleteGenre(genreId: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: genreId },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    await this.prisma.genre.delete({
      where: { id: genreId },
    });

    return { message: 'Genre deleted successfully' };
  }
}
