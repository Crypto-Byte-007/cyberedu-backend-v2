import { IsEnum, IsString, IsOptional, IsObject, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { NotificationType, NotificationPriority } from '../schemas/notification.schema';

export class CreateNotificationDto {
  userId: Types.ObjectId;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsOptional()
  @IsString()
  actionUrl?: string;

  @IsOptional()
  @IsString()
  actionText?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
