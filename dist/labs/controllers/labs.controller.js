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
exports.LabsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_schema_1 = require("../../users/schemas/user.schema");
const labs_service_1 = require("../services/labs.service");
const start_lab_dto_1 = require("../dto/start-lab.dto");
const update_progress_dto_1 = require("../dto/update-progress.dto");
const complete_step_dto_1 = require("../dto/complete-step.dto");
let LabsController = class LabsController {
    constructor(labsService) {
        this.labsService = labsService;
    }
    async findAll(req, page, limit, difficulty, category, search, isActive) {
        return await this.labsService.findAllLabs(req.user.id, {
            page,
            limit,
            difficulty,
            category,
            search,
            isActive,
        });
    }
    async getMyProgress(req, status) {
        return await this.labsService.getUserLabsProgress(req.user.id, status);
    }
    async findOne(id, req) {
        return await this.labsService.findLabById(id, req.user.id);
    }
    async getTheory(id, req) {
        return await this.labsService.getLabTheory(id, req.user.id);
    }
    async startLab(id, req, startLabDto) {
        return await this.labsService.startLab(id, req.user.id, startLabDto);
    }
    async getProgress(id, req) {
        return await this.labsService.getUserProgress(id, req.user.id);
    }
    async updateProgress(id, req, updateProgressDto) {
        return await this.labsService.updateProgress(id, req.user.id, updateProgressDto);
    }
    async completeStep(id, step, req, completeStepDto) {
        return await this.labsService.completeStep(id, step, req.user.id, completeStepDto);
    }
    async getHints(id, step, req) {
        return await this.labsService.getStepHints(id, step, req.user.id);
    }
    async restartLab(id, req) {
        return await this.labsService.restartLab(id, req.user.id);
    }
};
exports.LabsController = LabsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.STUDENT, user_schema_1.UserRole.INSTRUCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('difficulty')),
    __param(4, (0, common_1.Query)('category')),
    __param(5, (0, common_1.Query)('search')),
    __param(6, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-progress'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.STUDENT, user_schema_1.UserRole.INSTRUCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "getMyProgress", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.STUDENT, user_schema_1.UserRole.INSTRUCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/theory'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.STUDENT, user_schema_1.UserRole.INSTRUCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "getTheory", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.STUDENT, user_schema_1.UserRole.INSTRUCTOR, user_schema_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, start_lab_dto_1.StartLabDto]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "startLab", null);
__decorate([
    (0, common_1.Get)(':id/progress'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.STUDENT, user_schema_1.UserRole.INSTRUCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Post)(':id/progress'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.STUDENT, user_schema_1.UserRole.INSTRUCTOR, user_schema_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_progress_dto_1.UpdateProgressDto]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "updateProgress", null);
__decorate([
    (0, common_1.Post)(':id/steps/:step/complete'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.STUDENT, user_schema_1.UserRole.INSTRUCTOR, user_schema_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('step', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object, complete_step_dto_1.CompleteStepDto]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "completeStep", null);
__decorate([
    (0, common_1.Get)(':id/hints/:step'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.STUDENT, user_schema_1.UserRole.INSTRUCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('step', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "getHints", null);
__decorate([
    (0, common_1.Post)(':id/restart'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.STUDENT, user_schema_1.UserRole.INSTRUCTOR, user_schema_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "restartLab", null);
exports.LabsController = LabsController = __decorate([
    (0, common_1.Controller)('labs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [labs_service_1.LabsService])
], LabsController);
//# sourceMappingURL=labs.controller.js.map