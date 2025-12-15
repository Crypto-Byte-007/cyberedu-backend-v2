import { IsBoolean, IsOptional, IsArray, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @IsOptional()
  @IsBoolean()
  archived?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
