import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateMoodSongDto {
  @IsString()
  mood: string;

  @IsString()
  songId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  relevanceScore?: number;
}

export class UpdateMoodSongDto {
  @IsString()
  @IsOptional()
  mood?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  relevanceScore?: number;
}
