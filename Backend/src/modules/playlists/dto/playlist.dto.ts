import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = false;
}

export class UpdatePlaylistDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class AddSongToPlaylistDto {
  @IsString()
  songId: string;

  @IsOptional()
  position?: number;
}
