import { IsString, IsOptional } from 'class-validator';

export class AddFavoriteDto {
  @IsString()
  songId: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  userId?: string;  // Optional userId for cases where not using JWT auth
}
