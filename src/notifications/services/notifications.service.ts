import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType, NotificationPriority } from '../schemas/notification.schema';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto): Promise<NotificationDocument> {
    const notification = await this.notificationModel.create(createNotificationDto);
    this.logger.log(`Notification created: ${notification.type} for user ${notification.userId}`);
    return notification;
  }

  async getUserNotifications(userId: string, options?: { unreadOnly?: boolean; limit?: number }): Promise<{
    notifications: NotificationDocument[];
    total: number;
    unreadCount: number;
  }> {
    const filter: any = { userId: new Types.ObjectId(userId), archived: false };
    
    if (options?.unreadOnly) {
      filter.read = false;
    }
    
    const [notifications, total, unreadCount] = await Promise.all([
      this.notificationModel
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(options?.limit || 50)
        .exec(),
      this.notificationModel.countDocuments(filter).exec(),
      this.notificationModel.countDocuments({
        userId: new Types.ObjectId(userId),
        read: false,
        archived: false,
      }).exec(),
    ]);
    
    return { notifications, total, unreadCount };
  }

  async markAsRead(notificationId: string, userId: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(notificationId), userId: new Types.ObjectId(userId) },
      { read: true },
      { new: true },
    ).exec();
    
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    
    return notification;
  }

  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel.updateMany(
      { userId: new Types.ObjectId(userId), read: false },
      { read: true },
    ).exec();
    
    return { modifiedCount: result.modifiedCount };
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const result = await this.notificationModel.deleteOne({
      _id: new Types.ObjectId(notificationId),
      userId: new Types.ObjectId(userId),
    }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException('Notification not found');
    }
  }

  async triggerLabCompleted(userId: string, labData: any, progressData: any): Promise<void> {
    await this.createNotification({
      userId: new Types.ObjectId(userId),
      type: NotificationType.LAB_COMPLETED,
      priority: NotificationPriority.MEDIUM,
      title: 'Lab Completed!',
      message: `Congratulations! You completed "${labData.title}" with ${progressData.finalScore}% score`,
      data: { labId: labData.id, score: progressData.finalScore },
      actionUrl: `/labs/${labData.id}`,
      actionText: 'View Details',
      metadata: { source: 'labs_service', event: 'lab_completed' },
    });
  }

  async triggerWelcomeNotification(userId: string, userData: any): Promise<void> {
    await this.createNotification({
      userId: new Types.ObjectId(userId),
      type: NotificationType.WELCOME,
      priority: NotificationPriority.HIGH,
      title: 'Welcome to CyberEdu!',
      message: `Welcome ${userData.firstName}! Start your cybersecurity journey.`,
      actionUrl: '/labs',
      actionText: 'Browse Labs',
      metadata: { source: 'auth_service', event: 'user_registered' },
    });
  }
}
