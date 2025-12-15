import { Document, Schema as MongooseSchema } from 'mongoose';
export type NotificationDocument = Notification & Document;
export declare enum NotificationType {
    LAB_STARTED = "lab_started",
    LAB_COMPLETED = "lab_completed",
    REPORT_GENERATED = "report_generated",
    SYSTEM_ALERT = "system_alert",
    ANNOUNCEMENT = "announcement",
    WELCOME = "welcome"
}
export declare enum NotificationPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class Notification {
    userId: MongooseSchema.Types.ObjectId;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    read: boolean;
    archived: boolean;
    data?: Record<string, any>;
    actionUrl?: string;
    actionText?: string;
    expiresAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const NotificationSchema: MongooseSchema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification, any, {}> & Notification & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Notification> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
