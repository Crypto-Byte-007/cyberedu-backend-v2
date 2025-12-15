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
exports.UserSchema = exports.User = exports.UserStatus = exports.UserRole = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_transformer_1 = require("class-transformer");
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "student";
    UserRole["INSTRUCTOR"] = "instructor";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["PENDING"] = "pending";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
let User = class User {
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    get isLocked() {
        return this.metadata?.lockedUntil ? this.metadata.lockedUntil > new Date() : false;
    }
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: UserRole, default: UserRole.STUDENT }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: UserStatus, default: UserStatus.PENDING }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], User.prototype, "institution", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], User.prototype, "department", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], User.prototype, "studentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], User.prototype, "preferences", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "lastPasswordChangeAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "verificationToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "verificationTokenExpires", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "passwordResetToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "passwordResetExpires", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], User.prototype, "metadata", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                delete ret.refreshToken;
                delete ret.verificationToken;
                delete ret.passwordResetToken;
                delete ret.passwordResetExpires;
                delete ret.__v;
                return ret;
            },
        },
    })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.index({ email: 1 }, { unique: true });
exports.UserSchema.index({ role: 1 });
exports.UserSchema.index({ status: 1 });
exports.UserSchema.index({ isActive: 1 });
exports.UserSchema.index({ isDeleted: 1 });
exports.UserSchema.index({ createdAt: -1 });
exports.UserSchema.index({ 'metadata.lastIpAddress': 1 });
exports.UserSchema.index({ studentId: 1 }, { sparse: true });
//# sourceMappingURL=user.schema.js.map