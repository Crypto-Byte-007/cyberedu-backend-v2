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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = exports.Notification = exports.NotificationPriority = exports.NotificationType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var NotificationType;
(function (NotificationType) {
    NotificationType["LAB_STARTED"] = "lab_started";
    NotificationType["LAB_COMPLETED"] = "lab_completed";
    NotificationType["REPORT_GENERATED"] = "report_generated";
    NotificationType["SYSTEM_ALERT"] = "system_alert";
    NotificationType["ANNOUNCEMENT"] = "announcement";
    NotificationType["WELCOME"] = "welcome";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["MEDIUM"] = "medium";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: NotificationType, required: true }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: NotificationPriority, default: NotificationPriority.MEDIUM }),
    __metadata("design:type", String)
], Notification.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "read", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "archived", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Notification.prototype, "data", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Notification.prototype, "actionUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Notification.prototype, "actionText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Notification.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Notification.prototype, "metadata", void 0);
exports.Notification = Notification = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Notification);
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);
exports.NotificationSchema.index({ userId: 1 });
exports.NotificationSchema.index({ read: 1 });
exports.NotificationSchema.index({ createdAt: -1 });
exports.NotificationSchema.index({ userId: 1, read: 1 });
//# sourceMappingURL=notification.schema.js.map