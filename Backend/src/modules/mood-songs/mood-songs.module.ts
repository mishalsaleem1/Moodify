import { Module } from '@nestjs/common';
import { MoodSongsService } from './mood-songs.service';
import { MoodSongsController } from './mood-songs.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MoodSongsService],
  controllers: [MoodSongsController],
  exports: [MoodSongsService],
})
export class MoodSongsModule {}
