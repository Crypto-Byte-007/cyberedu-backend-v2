import { Types } from 'mongoose';
import { NotificationType, NotificationPriority } from '../schemas/notification.schema';
export declare class CreateNotificationDto {
    userId: Types.ObjectId;
    type: NotificationType;
    priority?: NotificationPriority;
    title: string;
    message: string;
    data?: Record<string, any>;
    actionUrl?: string;
    actionText?: string;
    expiresAt?: Date;
    metadata?: Record<string, any>;
}
