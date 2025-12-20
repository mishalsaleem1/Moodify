import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { SongsModule } from './modules/songs/songs.module';
import { GenresModule } from './modules/genres/genres.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { EmotionHistoryModule } from './modules/emotion-history/emotion-history.module';
import { MoodSongsModule } from './modules/mood-songs/mood-songs.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { SpotifyModule } from './modules/spotify/spotify.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PlaylistsModule,
    SongsModule,
    GenresModule,
    FavoritesModule,
    EmotionHistoryModule,
    MoodSongsModule,
    RecommendationsModule,
    FeedbackModule,
    SpotifyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
