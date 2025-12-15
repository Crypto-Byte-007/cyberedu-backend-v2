import { IsOptional, IsObject } from 'class-validator';

export class StartLabDto {
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
