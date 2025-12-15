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
var LabsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lab_schema_1 = require("../schemas/lab.schema");
const user_progress_schema_1 = require("../schemas/user-progress.schema");
const notifications_service_1 = require("../../notifications/services/notifications.service");
let LabsService = LabsService_1 = class LabsService {
    constructor(labModel, progressModel, notificationsService) {
        this.labModel = labModel;
        this.progressModel = progressModel;
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger(LabsService_1.name);
    }
    async findAllLabs(userId, query) {
        const { page, limit, difficulty, category, search, isActive } = query;
        const skip = (page - 1) * limit;
        const filter = { isPublished: true };
        if (difficulty)
            filter.difficulty = difficulty;
        if (category)
            filter.category = category;
        if (isActive !== undefined)
            filter.isActive = isActive;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { labId: { $regex: search, $options: 'i' } },
            ];
        }
        const [labs, total] = await Promise.all([
            this.labModel
                .find(filter)
                .select('-theoryContent -steps.validationCriteria')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            this.labModel.countDocuments(filter).exec(),
        ]);
        const labsWithProgress = await this.addProgressToLabs(labs, userId);
        return {
            labs: labsWithProgress,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
    async findLabById(id, userId) {
        const lab = await this.labModel
            .findOne({
            $or: [
                { _id: mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : null },
                { labId: id.toUpperCase() },
            ],
            isPublished: true,
        })
            .select('-steps.validationCriteria')
            .exec();
        if (!lab) {
            throw new common_1.NotFoundException('Lab not found');
        }
        const progress = await this.progressModel
            .findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            labId: lab._id,
        })
            .exec();
        const labObj = lab.toObject();
        labObj.userProgress = progress || null;
        return labObj;
    }
    async getLabTheory(id, userId) {
        const lab = await this.labModel
            .findOne({
            $or: [
                { _id: mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : null },
                { labId: id.toUpperCase() },
            ],
            isPublished: true,
        })
            .select('theoryContent title')
            .exec();
        if (!lab) {
            throw new common_1.NotFoundException('Lab not found');
        }
        return {
            theoryContent: lab.theoryContent,
        };
    }
    async startLab(id, userId, startLabDto) {
        const lab = await this.labModel
            .findOne({
            $or: [
                { _id: mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : null },
                { labId: id.toUpperCase() },
            ],
            isPublished: true,
            isActive: true,
        })
            .exec();
        if (!lab) {
            throw new common_1.NotFoundException('Lab not found or not available');
        }
        const existingProgress = await this.progressModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            labId: lab._id,
        });
        if (existingProgress) {
            throw new common_1.BadRequestException('Lab already started');
        }
        const requiredLabs = lab.simulation?.requiredLabs || [];
        if (requiredLabs && requiredLabs.length > 0) {
            const requiredLabIds = requiredLabs
                .filter(prereq => prereq.required)
                .map(prereq => prereq.labId);
            if (requiredLabIds.length > 0) {
                const completedLabs = await this.progressModel.find({
                    userId: new mongoose_2.Types.ObjectId(userId),
                    labId: { $in: requiredLabIds },
                    status: user_progress_schema_1.ProgressStatus.COMPLETED,
                });
                if (completedLabs.length < requiredLabIds.length) {
                    throw new common_1.BadRequestException('Prerequisite labs not completed');
                }
            }
        }
        const progress = await this.progressModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            labId: lab._id,
            status: user_progress_schema_1.ProgressStatus.IN_PROGRESS,
            currentStep: 1,
            startedAt: new Date(),
            lastAccessed: new Date(),
            metadata: startLabDto.metadata || {},
        });
        await this.labModel.findByIdAndUpdate(lab._id, {
            $inc: { totalCompletions: 1 },
        });
        return {
            lab: {
                id: lab._id,
                labId: lab.labId,
                title: lab.title,
                difficulty: lab.difficulty,
                category: lab.category,
            },
            progress: {
                id: progress._id,
                status: progress.status,
                currentStep: progress.currentStep,
                startedAt: progress.startedAt,
            },
            message: `Lab "${lab.title}" started successfully. Begin with Step 1.`,
        };
    }
    async getUserProgress(labId, userId) {
        const lab = await this.labModel.findOne({
            $or: [
                { _id: mongoose_2.Types.ObjectId.isValid(labId) ? new mongoose_2.Types.ObjectId(labId) : null },
                { labId: labId.toUpperCase() },
            ],
        });
        if (!lab) {
            throw new common_1.NotFoundException('Lab not found');
        }
        const progress = await this.progressModel
            .findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            labId: lab._id,
        })
            .populate('lab', 'title labId difficulty category')
            .exec();
        if (!progress) {
            throw new common_1.NotFoundException('Lab progress not found. Start the lab first.');
        }
        return progress;
    }
    async updateProgress(labId, userId, updateProgressDto) {
        const lab = await this.labModel.findOne({
            $or: [
                { _id: mongoose_2.Types.ObjectId.isValid(labId) ? new mongoose_2.Types.ObjectId(labId) : null },
                { labId: labId.toUpperCase() },
            ],
        });
        if (!lab) {
            throw new common_1.NotFoundException('Lab not found');
        }
        const progress = await this.progressModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            labId: lab._id,
        });
        if (!progress) {
            throw new common_1.NotFoundException('Lab progress not found. Start the lab first.');
        }
        const steps = lab.simulation?.steps || [];
        if (updateProgressDto.currentStep < 1 || updateProgressDto.currentStep > steps.length) {
            throw new common_1.BadRequestException('Invalid step number');
        }
        const updateData = {
            currentStep: updateProgressDto.currentStep,
            lastAccessed: new Date(),
        };
        if (updateProgressDto.timeSpent !== undefined) {
            updateData.timeSpent = progress.timeSpent + (updateProgressDto.timeSpent || 0);
        }
        if (updateProgressDto.metadata) {
            updateData.metadata = {
                ...progress.metadata,
                ...updateProgressDto.metadata,
            };
        }
        const updatedProgress = await this.progressModel
            .findByIdAndUpdate(progress._id, updateData, { new: true })
            .populate('lab', 'title labId difficulty category totalSteps')
            .exec();
        return updatedProgress;
    }
    async completeStep(labId, stepNumber, userId, completeStepDto) {
        const lab = await this.labModel.findOne({
            $or: [
                { _id: mongoose_2.Types.ObjectId.isValid(labId) ? new mongoose_2.Types.ObjectId(labId) : null },
                { labId: labId.toUpperCase() },
            ],
        });
        if (!lab) {
            throw new common_1.NotFoundException('Lab not found');
        }
        const steps = lab.simulation?.steps || [];
        if (stepNumber < 1 || stepNumber > steps.length) {
            throw new common_1.BadRequestException('Invalid step number');
        }
        const step = steps[stepNumber - 1];
        const progress = await this.progressModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            labId: lab._id,
        });
        if (!progress) {
            throw new common_1.NotFoundException('Lab progress not found. Start the lab first.');
        }
        const alreadyCompleted = progress.completedSteps.find(s => s.stepNumber === stepNumber);
        if (alreadyCompleted) {
            throw new common_1.BadRequestException('Step already completed');
        }
        const validationPassed = this.validateStepCompletion(step, completeStepDto.validationResults || []);
        if (!validationPassed) {
            throw new common_1.BadRequestException('Step validation failed. Please check your work.');
        }
        const hintsUsed = completeStepDto.hintsUsed || 0;
        const attempts = completeStepDto.attempts || 1;
        const timeSpent = completeStepDto.timeSpent || 0;
        let stepScore = 100;
        if (hintsUsed > 0)
            stepScore -= hintsUsed * 10;
        if (attempts > 1)
            stepScore -= (attempts - 1) * 5;
        stepScore = Math.max(stepScore, 0);
        const stepCompletion = {
            stepNumber,
            completedAt: new Date(),
            hintsUsed,
            attempts,
            score: stepScore,
            timeSpent,
            validationResults: completeStepDto.validationResults || [],
        };
        const completedSteps = [...progress.completedSteps, stepCompletion];
        const totalSteps = steps.length;
        const progressPercentage = Math.round((completedSteps.length / totalSteps) * 100);
        const isLabCompleted = completedSteps.length === totalSteps;
        const updateData = {
            completedSteps,
            progress: progressPercentage,
            timeSpent: progress.timeSpent + timeSpent,
            totalHintsUsed: progress.totalHintsUsed + hintsUsed,
            totalAttempts: progress.totalAttempts + attempts,
            lastAccessed: new Date(),
        };
        if (isLabCompleted) {
            updateData.status = user_progress_schema_1.ProgressStatus.COMPLETED;
            updateData.completedAt = new Date();
            const averageScore = completedSteps.reduce((sum, step) => sum + step.score, 0) / totalSteps;
            updateData.finalScore = Math.round(averageScore);
            await this.labModel.findByIdAndUpdate(lab._id, {
                $inc: { averageScore: updateData.finalScore, averageCompletionTime: timeSpent / 60 },
            });
        }
        else {
            updateData.currentStep = stepNumber + 1;
        }
        const updatedProgress = await this.progressModel
            .findByIdAndUpdate(progress._id, updateData, { new: true })
            .populate('lab', 'title labId difficulty category totalSteps')
            .exec();
        if (isLabCompleted) {
            try {
                await this.notificationsService.triggerLabCompleted(userId, lab, updatedProgress);
            }
            catch (error) {
                this.logger.error(`Failed to send lab completion notification: ${error.message}`);
            }
        }
        return {
            progress: updatedProgress,
            step: {
                number: stepNumber,
                title: step.title,
                score: stepScore,
                completed: true,
                nextStep: isLabCompleted ? null : stepNumber + 1,
            },
            message: step.successMessage || `Step ${stepNumber} completed successfully!`,
            labCompleted: isLabCompleted,
        };
    }
    async getStepHints(labId, stepNumber, userId) {
        const lab = await this.labModel.findOne({
            $or: [
                { _id: mongoose_2.Types.ObjectId.isValid(labId) ? new mongoose_2.Types.ObjectId(labId) : null },
                { labId: labId.toUpperCase() },
            ],
        });
        if (!lab) {
            throw new common_1.NotFoundException('Lab not found');
        }
        const steps = lab.simulation?.steps || [];
        if (stepNumber < 1 || stepNumber > steps.length) {
            throw new common_1.BadRequestException('Invalid step number');
        }
        const progress = await this.progressModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            labId: lab._id,
        });
        if (!progress) {
            throw new common_1.NotFoundException('Lab progress not found. Start the lab first.');
        }
        return steps[stepNumber - 1].hints || [];
    }
    async getUserLabsProgress(userId, status) {
        const filter = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (status) {
            filter.status = status;
        }
        const progressRecords = await this.progressModel
            .find(filter)
            .populate('lab', 'title labId difficulty category estimatedTime points')
            .sort({ lastAccessed: -1 })
            .exec();
        const allLabs = await this.labModel
            .find({ isPublished: true, isActive: true })
            .select('_id title labId difficulty category')
            .exec();
        const inProgress = progressRecords.filter(p => p.status === user_progress_schema_1.ProgressStatus.IN_PROGRESS);
        const completed = progressRecords.filter(p => p.status === user_progress_schema_1.ProgressStatus.COMPLETED);
        const startedLabIds = progressRecords.map(p => p.labId.toString());
        const notStarted = allLabs
            .filter(lab => !startedLabIds.includes(lab._id.toString()))
            .map(lab => ({
            lab: lab.toObject(),
            status: user_progress_schema_1.ProgressStatus.NOT_STARTED,
            progress: 0,
            currentStep: 1,
        }));
        return {
            inProgress,
            completed,
            notStarted,
        };
    }
    async restartLab(labId, userId) {
        const lab = await this.labModel.findOne({
            $or: [
                { _id: mongoose_2.Types.ObjectId.isValid(labId) ? new mongoose_2.Types.ObjectId(labId) : null },
                { labId: labId.toUpperCase() },
            ],
        });
        if (!lab) {
            throw new common_1.NotFoundException('Lab not found');
        }
        await this.progressModel.deleteOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            labId: lab._id,
        });
        const progress = await this.progressModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            labId: lab._id,
            status: user_progress_schema_1.ProgressStatus.IN_PROGRESS,
            currentStep: 1,
            startedAt: new Date(),
            lastAccessed: new Date(),
        });
        return {
            lab: {
                id: lab._id,
                labId: lab.labId,
                title: lab.title,
            },
            progress: {
                id: progress._id,
                status: progress.status,
                currentStep: progress.currentStep,
                startedAt: progress.startedAt,
            },
            message: `Lab "${lab.title}" restarted successfully.`,
        };
    }
    async addProgressToLabs(labs, userId) {
        const labIds = labs.map(lab => lab._id);
        const progressRecords = await this.progressModel.find({
            userId: new mongoose_2.Types.ObjectId(userId),
            labId: { $in: labIds },
        });
        const progressMap = new Map();
        progressRecords.forEach(progress => {
            progressMap.set(progress.labId.toString(), progress);
        });
        return labs.map(lab => {
            const labObj = lab.toObject();
            const progress = progressMap.get(lab._id.toString());
            return {
                ...labObj,
                userProgress: progress || null,
                canStart: !progress || progress.status === user_progress_schema_1.ProgressStatus.NOT_STARTED,
            };
        });
    }
    validateStepCompletion(step, validationResults) {
        if (!validationResults || validationResults.length === 0) {
            return false;
        }
        const criteriaCount = step.validationCriteria?.length || 0;
        if (validationResults.length !== criteriaCount) {
            return false;
        }
        return validationResults.every(result => result.passed === true);
    }
};
exports.LabsService = LabsService;
exports.LabsService = LabsService = LabsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lab_schema_1.Lab.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_progress_schema_1.UserProgress.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService])
], LabsService);
//# sourceMappingURL=labs.service.js.map