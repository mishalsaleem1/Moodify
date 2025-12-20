import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateEmotionHistoryDto {
  @IsString()
  emotion: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  confidence?: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateEmotionHistoryDto {
  @IsString()
  @IsOptional()
  emotion?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  confidence?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
