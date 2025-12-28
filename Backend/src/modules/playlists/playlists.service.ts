import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePlaylistDto, UpdatePlaylistDto, AddSongToPlaylistDto } from './dto/playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(private prisma: PrismaService) {}

  async createPlaylist(userId: string, createPlaylistDto: CreatePlaylistDto) {
    return this.prisma.playlist.create({
      data: {
        ...createPlaylistDto,
        userId,
      },
      include: { songs: { include: { song: true } } },
    });
  }

  async getUserPlaylists(userId: string, skip: number = 0, take: number = 10) {
    const playlists = await this.prisma.playlist.findMany({
      where: { userId },
      skip,
      take,
      include: {
        songs: {
          include: { song: true },
        },
        _count: {
          select: { songs: true },
        },
      },
    });

    const total = await this.prisma.playlist.count({
      where: { userId },
    });

    return {
      data: playlists,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async getPlaylistById(playlistId: string) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        songs: {
          include: { song: true },
          orderBy: { position: 'asc' },
        },
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    return playlist;
  }

  async updatePlaylist(
    userId: string,
    playlistId: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only update your own playlists');
    }

    return this.prisma.playlist.update({
      where: { id: playlistId },
      data: updatePlaylistDto,
      include: { songs: { include: { song: true } } },
    });
  }

  async deletePlaylist(userId: string, playlistId: string) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only delete your own playlists');
    }

    await this.prisma.playlist.delete({
      where: { id: playlistId },
    });

    return { message: 'Playlist deleted successfully' };
  }

  async addSongToPlaylist(
    userId: string,
    playlistId: string,
    addSongDto: AddSongToPlaylistDto,
  ) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only add songs to your own playlists');
    }

    const song = await this.prisma.song.findUnique({
      where: { id: addSongDto.songId },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    // Check if song already in playlist
    const existing = await this.prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId,
          songId: addSongDto.songId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Song already in playlist');
    }

    return this.prisma.playlistSong.create({
      data: {
        playlistId,
        songId: addSongDto.songId,
        position: addSongDto.position,
      },
      include: { song: true },
    });
  }

  async removeSongFromPlaylist(
    userId: string,
    playlistId: string,
    songId: string,
  ) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only modify your own playlists');
    }

    const playlistSong = await this.prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId,
          songId,
        },
      },
    });

    if (!playlistSong) {
      throw new NotFoundException('Song not in playlist');
    }

    await this.prisma.playlistSong.delete({
      where: {
        playlistId_songId: {
          playlistId,
          songId,
        },
      },
    });

    return { message: 'Song removed from playlist' };
  }

  async reorderPlaylistSongs(
    userId: string,
    playlistId: string,
    songIds: string[],
  ) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only modify your own playlists');
    }

    // Update positions
    await Promise.all(
      songIds.map((songId, index) =>
        this.prisma.playlistSong.update({
          where: {
            playlistId_songId: {
              playlistId,
              songId,
            },
          },
          data: { position: index },
        }),
      ),
    );

    return this.getPlaylistById(playlistId);
  }
}
