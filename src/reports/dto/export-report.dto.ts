import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export enum ExportFormat {
  PDF = 'pdf',
  CSV = 'csv',
  JSON = 'json',
  EXCEL = 'excel',
}

export class ExportReportDto {
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @IsOptional()
  @IsBoolean()
  includeDetails?: boolean;

  @IsOptional()
  @IsString()
  filename?: string;
}
