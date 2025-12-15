"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("../schemas/notification.schema");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async createNotification(createNotificationDto) {
        const notification = await this.notificationModel.create(createNotificationDto);
        this.logger.log(`Notification created: ${notification.type} for user ${notification.userId}`);
        return notification;
    }
    async getUserNotifications(userId, options) {
        const filter = { userId: new mongoose_2.Types.ObjectId(userId), archived: false };
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
                userId: new mongoose_2.Types.ObjectId(userId),
                read: false,
                archived: false,
            }).exec(),
        ]);
        return { notifications, total, unreadCount };
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.notificationModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(notificationId), userId: new mongoose_2.Types.ObjectId(userId) }, { read: true }, { new: true }).exec();
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return notification;
    }
    async markAllAsRead(userId) {
        const result = await this.notificationModel.updateMany({ userId: new mongoose_2.Types.ObjectId(userId), read: false }, { read: true }).exec();
        return { modifiedCount: result.modifiedCount };
    }
    async deleteNotification(notificationId, userId) {
        const result = await this.notificationModel.deleteOne({
            _id: new mongoose_2.Types.ObjectId(notificationId),
            userId: new mongoose_2.Types.ObjectId(userId),
        }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Notification not found');
        }
    }
    async triggerLabCompleted(userId, labData, progressData) {
        await this.createNotification({
            userId: new mongoose_2.Types.ObjectId(userId),
            type: notification_schema_1.NotificationType.LAB_COMPLETED,
            priority: notification_schema_1.NotificationPriority.MEDIUM,
            title: 'Lab Completed!',
            message: `Congratulations! You completed "${labData.title}" with ${progressData.finalScore}% score`,
            data: { labId: labData.id, score: progressData.finalScore },
            actionUrl: `/labs/${labData.id}`,
            actionText: 'View Details',
            metadata: { source: 'labs_service', event: 'lab_completed' },
        });
    }
    async triggerWelcomeNotification(userId, userData) {
        await this.createNotification({
            userId: new mongoose_2.Types.ObjectId(userId),
            type: notification_schema_1.NotificationType.WELCOME,
            priority: notification_schema_1.NotificationPriority.HIGH,
            title: 'Welcome to CyberEdu!',
            message: `Welcome ${userData.firstName}! Start your cybersecurity journey.`,
            actionUrl: '/labs',
            actionText: 'Browse Labs',
            metadata: { source: 'auth_service', event: 'user_registered' },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map