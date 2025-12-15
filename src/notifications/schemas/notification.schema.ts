import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  LAB_STARTED = 'lab_started',
  LAB_COMPLETED = 'lab_completed',
  REPORT_GENERATED = 'report_generated',
  SYSTEM_ALERT = 'system_alert',
  ANNOUNCEMENT = 'announcement',
  WELCOME = 'welcome',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ type: String, enum: NotificationPriority, default: NotificationPriority.MEDIUM })
  priority: NotificationPriority;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Boolean, default: false })
  read: boolean;

  @Prop({ type: Boolean, default: false })
  archived: boolean;

  @Prop({ type: Object })
  data?: Record<string, any>;

  @Prop({ type: String })
  actionUrl?: string;

  @Prop({ type: String })
  actionText?: string;

  @Prop({ type: Date })
  expiresAt?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ read: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ userId: 1, read: 1 });
