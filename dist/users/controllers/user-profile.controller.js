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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const users_service_1 = require("../users.service");
const update_profile_dto_1 = require("../dto/update-profile.dto");
const change_password_dto_1 = require("../dto/change-password.dto");
const password_util_1 = require("../../common/utils/password.util");
let UserProfileController = class UserProfileController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(req) {
        return await this.usersService.findById(req.user.id);
    }
    async updateProfile(req, updateProfileDto) {
        return await this.usersService.updateProfile(req.user.id, updateProfileDto);
    }
    async changePassword(req, changePasswordDto) {
        const user = await this.usersService.getUserWithPassword(req.user.id);
        const isPasswordValid = await password_util_1.PasswordUtil.compare(changePasswordDto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        if (!password_util_1.PasswordUtil.validateStrength(changePasswordDto.newPassword)) {
            throw new common_1.BadRequestException('New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
        }
        const hashedPassword = await password_util_1.PasswordUtil.hash(changePasswordDto.newPassword);
        await this.usersService.updatePassword(req.user.id, hashedPassword);
        return { message: 'Password changed successfully' };
    }
};
exports.UserProfileController = UserProfileController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "changePassword", null);
exports.UserProfileController = UserProfileController = __decorate([
    (0, common_1.Controller)('users/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UserProfileController);
//# sourceMappingURL=user-profile.controller.js.map