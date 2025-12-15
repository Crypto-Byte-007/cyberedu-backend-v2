import { NotificationsService } from '../services/notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: any, unreadOnly: boolean, limit?: number): Promise<{
        notifications: import("../schemas/notification.schema").NotificationDocument[];
        total: number;
        unreadCount: number;
    }>;
    markAsRead(id: string, req: any): Promise<import("../schemas/notification.schema").NotificationDocument>;
    markAllAsRead(req: any): Promise<{
        modifiedCount: number;
    }>;
    deleteNotification(id: string, req: any): Promise<{
        message: string;
    }>;
}
