import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        bio: true,
      },
    });

    return user;
  }

  async deleteUserAccount(userId: string) {
    // Delete all related data (handled by cascade in schema)
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User account deleted successfully' };
  }

  async getAllUsers(skip: number = 0, take: number = 10) {
    const users = await this.prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    const total = await this.prisma.user.count();

    return {
      data: users,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
