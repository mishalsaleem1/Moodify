import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;
}

export class UpdateFeedbackDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
