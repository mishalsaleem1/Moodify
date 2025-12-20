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
}
