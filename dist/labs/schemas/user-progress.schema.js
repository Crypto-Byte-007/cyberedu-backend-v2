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
exports.UserProgressSchema = exports.UserProgress = exports.ProgressStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ProgressStatus;
(function (ProgressStatus) {
    ProgressStatus["NOT_STARTED"] = "not_started";
    ProgressStatus["IN_PROGRESS"] = "in_progress";
    ProgressStatus["COMPLETED"] = "completed";
    ProgressStatus["PAUSED"] = "paused";
    ProgressStatus["ABANDONED"] = "abandoned";
})(ProgressStatus || (exports.ProgressStatus = ProgressStatus = {}));
let UserProgress = class UserProgress {
    get timeSpentMinutes() {
        return Math.round(this.timeSpent / 60);
    }
    get completionRate() {
        if (!this.lab)
            return 0;
        const totalSteps = this.lab.totalSteps || 0;
        return totalSteps > 0 ? (this.completedSteps.length / totalSteps) * 100 : 0;
    }
};
exports.UserProgress = UserProgress;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], UserProgress.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Lab', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], UserProgress.prototype, "labId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ProgressStatus, default: ProgressStatus.NOT_STARTED }),
    __metadata("design:type", String)
], UserProgress.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 1 }),
    __metadata("design:type", Number)
], UserProgress.prototype, "currentStep", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            stepNumber: { type: Number, required: true },
            completedAt: { type: Date, required: true },
            hintsUsed: { type: Number, default: 0 },
            attempts: { type: Number, default: 1 },
            score: { type: Number, min: 0, max: 100, default: 100 },
            timeSpent: { type: Number, default: 0 },
            validationResults: [{
                    criteriaIndex: { type: Number, required: true },
                    passed: { type: Boolean, required: true },
                    actualResult: { type: String },
                }],
        }]),
    __metadata("design:type", Array)
], UserProgress.prototype, "completedSteps", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0, min: 0, max: 100 }),
    __metadata("design:type", Number)
], UserProgress.prototype, "progress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], UserProgress.prototype, "timeSpent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], UserProgress.prototype, "lastAccessed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], UserProgress.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], UserProgress.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], UserProgress.prototype, "finalScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], UserProgress.prototype, "totalHintsUsed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], UserProgress.prototype, "totalAttempts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], UserProgress.prototype, "metadata", void 0);
exports.UserProgress = UserProgress = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })
], UserProgress);
exports.UserProgressSchema = mongoose_1.SchemaFactory.createForClass(UserProgress);
exports.UserProgressSchema.index({ userId: 1, labId: 1 }, { unique: true });
exports.UserProgressSchema.index({ userId: 1, status: 1 });
exports.UserProgressSchema.index({ labId: 1, status: 1 });
exports.UserProgressSchema.index({ status: 1 });
exports.UserProgressSchema.index({ lastAccessed: -1 });
exports.UserProgressSchema.index({ createdAt: -1 });
exports.UserProgressSchema.index({ completedAt: -1 });
exports.UserProgressSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});
exports.UserProgressSchema.virtual('lab', {
    ref: 'Lab',
    localField: 'labId',
    foreignField: '_id',
    justOne: true,
});
//# sourceMappingURL=user-progress.schema.js.map