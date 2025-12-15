import { IsNumber, Min, IsOptional, IsArray, IsObject, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class ValidationResultDto {
  @IsNumber()
  criteriaIndex: number;

  @IsBoolean()
  passed: boolean;

  @IsOptional()
  actualResult?: string;
}

export class CompleteStepDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  hintsUsed?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  attempts?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  timeSpent?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidationResultDto)
  validationResults?: ValidationResultDto[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
