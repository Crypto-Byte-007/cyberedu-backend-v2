import { IsNumber, Min, IsOptional, IsObject } from 'class-validator';

export class UpdateProgressDto {
  @IsNumber()
  @Min(1)
  currentStep: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  timeSpent?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
