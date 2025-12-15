import { Model } from 'mongoose';
import { NotificationDocument } from '../schemas/notification.schema';
import { CreateNotificationDto } from '../dto/create-notification.dto';
export declare class NotificationsService {
    private notificationModel;
    private readonly logger;
    constructor(notificationModel: Model<NotificationDocument>);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<NotificationDocument>;
    getUserNotifications(userId: string, options?: {
        unreadOnly?: boolean;
        limit?: number;
    }): Promise<{
        notifications: NotificationDocument[];
        total: number;
        unreadCount: number;
    }>;
    markAsRead(notificationId: string, userId: string): Promise<NotificationDocument>;
    markAllAsRead(userId: string): Promise<{
        modifiedCount: number;
    }>;
    deleteNotification(notificationId: string, userId: string): Promise<void>;
    triggerLabCompleted(userId: string, labData: any, progressData: any): Promise<void>;
    triggerWelcomeNotification(userId: string, userData: any): Promise<void>;
}
