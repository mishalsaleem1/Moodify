import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateRecommendationDto {
  @IsString()
  songId: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class UpdateRecommendationDto {
  @IsBoolean()
  @IsOptional()
  liked?: boolean;

  @IsString()
  @IsOptional()
  reason?: string;
}
