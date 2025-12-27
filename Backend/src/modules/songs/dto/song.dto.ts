import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSongDto {
  @IsString()
  title: string;

  @IsString()
  artist: string;

  @IsString()
  @IsOptional()
  album?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  genreId?: string;

  @IsString()
  @IsOptional()
  spotifyId?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  albumArt?: string;  // Alias for imageUrl from frontend

  @IsString()
  @IsOptional()
  previewUrl?: string;
}

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  artist?: string;

  @IsString()
  @IsOptional()
  album?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  genreId?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  previewUrl?: string;
}
