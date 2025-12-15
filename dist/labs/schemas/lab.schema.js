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
exports.LabSchema = exports.Lab = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Lab = class Lab {
    get steps() {
        return this.simulation?.steps || [];
    }
    get requiredLabs() {
        return this.simulation?.requiredLabs || [];
    }
};
exports.Lab = Lab;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Lab.prototype, "labId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lab.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lab.prototype, "difficulty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lab.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lab.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Lab.prototype, "theoryContent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Lab.prototype, "simulation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], Lab.prototype, "questions", void 0);
exports.Lab = Lab = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Lab);
exports.LabSchema = mongoose_1.SchemaFactory.createForClass(Lab);
//# sourceMappingURL=lab.schema.js.map