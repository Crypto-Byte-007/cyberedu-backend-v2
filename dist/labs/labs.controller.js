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
const labs_service_1 = require("./labs.service");
let LabsController = class LabsController {
    constructor(labsService) {
        this.labsService = labsService;
    }
    async findAll() {
        return this.labsService.findAll();
    }
    async findOne(id) {
        return this.labsService.findOne(id);
    }
    async getTheory(id) {
        return this.labsService.getTheory(id);
    }
    async getSimulation(id) {
        return this.labsService.getSimulation(id);
    }
    async getQuestions(id) {
        return this.labsService.getQuestions(id);
    }
};
exports.LabsController = LabsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/theory'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "getTheory", null);
__decorate([
    (0, common_1.Get)(':id/simulation'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "getSimulation", null);
__decorate([
    (0, common_1.Get)(':id/questions'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabsController.prototype, "getQuestions", null);
exports.LabsController = LabsController = __decorate([
    (0, common_1.Controller)('labs'),
    __metadata("design:paramtypes", [labs_service_1.LabsService])
], LabsController);
//# sourceMappingURL=labs.controller.js.map