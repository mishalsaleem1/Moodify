import { Module } from '@nestjs/common';
import { EmotionHistoryService } from './emotion-history.service';
import { EmotionHistoryController } from './emotion-history.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EmotionHistoryService],
  controllers: [EmotionHistoryController],
  exports: [EmotionHistoryService],
})
export class EmotionHistoryModule {}
