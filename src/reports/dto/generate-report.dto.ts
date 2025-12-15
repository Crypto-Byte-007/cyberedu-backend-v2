import { IsBoolean, IsOptional } from 'class-validator';

export class GenerateReportDto {
  @IsOptional()
  @IsBoolean()
  forceRegenerate?: boolean;

  @IsOptional()
  @IsBoolean()
  includeAnalytics?: boolean;
}
