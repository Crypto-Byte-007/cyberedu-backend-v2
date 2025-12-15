import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lab, LabDocument } from '../schemas/lab.schema';
import {
  UserProgress,
  UserProgressDocument,
  ProgressStatus,
  StepCompletion,
} from '../schemas/user-progress.schema';
import { StartLabDto } from '../dto/start-lab.dto';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { CompleteStepDto } from '../dto/complete-step.dto';
import { NotificationsService } from '../../notifications/services/notifications.service';

@Injectable()
export class LabsService {
  private readonly logger = new Logger(LabsService.name);

  constructor(
    @InjectModel(Lab.name) private labModel: Model<LabDocument>,
    @InjectModel(UserProgress.name) private progressModel: Model<UserProgressDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAllLabs(
    userId: string,
    query: {
      page: number;
      limit: number;
      difficulty?: string;
      category?: string;
      search?: string;
      isActive?: boolean;
    },
  ): Promise<{
    labs: LabDocument[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const { page, limit, difficulty, category, search, isActive } = query;
    const skip = (page - 1) * limit;

    const filter: any = { isPublished: true };

    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive;
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

  async findLabById(id: string, userId: string): Promise<LabDocument> {
    const lab = await this.labModel
      .findOne({
        $or: [
          { _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null },
          { labId: id.toUpperCase() },
        ],
        isPublished: true,
      })
      .select('-steps.validationCriteria')
      .exec();

    if (!lab) {
      throw new NotFoundException('Lab not found');
    }

    const progress = await this.progressModel
      .findOne({
        userId: new Types.ObjectId(userId),
        labId: lab._id,
      })
      .exec();

    const labObj: any = lab.toObject();
    labObj.userProgress = progress || null;
    return labObj;
  }

  async getLabTheory(id: string, userId: string): Promise<{ theoryContent: any }> {
    const lab = await this.labModel
      .findOne({
        $or: [
          { _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null },
          { labId: id.toUpperCase() },
        ],
        isPublished: true,
      })
      .select('theoryContent title')
      .exec();

    if (!lab) {
      throw new NotFoundException('Lab not found');
    }

    return {
      theoryContent: lab.theoryContent,
    };
  }

  async startLab(id: string, userId: string, startLabDto: StartLabDto): Promise<any> {
    const lab = await this.labModel
      .findOne({
        $or: [
          { _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null },
          { labId: id.toUpperCase() },
        ],
        isPublished: true,
        isActive: true,
      })
      .exec();

    if (!lab) {
      throw new NotFoundException('Lab not found or not available');
    }

    const existingProgress = await this.progressModel.findOne({
      userId: new Types.ObjectId(userId),
      labId: lab._id,
    });

    if (existingProgress) {
      throw new BadRequestException('Lab already started');
    }

    const requiredLabs = lab.simulation?.requiredLabs || [];
    if (requiredLabs && requiredLabs.length > 0) {
      const requiredLabIds = requiredLabs
        .filter(prereq => prereq.required)
        .map(prereq => prereq.labId);

      if (requiredLabIds.length > 0) {
        const completedLabs = await this.progressModel.find({
          userId: new Types.ObjectId(userId),
          labId: { $in: requiredLabIds },
          status: ProgressStatus.COMPLETED,
        });

        if (completedLabs.length < requiredLabIds.length) {
          throw new BadRequestException('Prerequisite labs not completed');
        }
      }
    }

    const progress = await this.progressModel.create({
      userId: new Types.ObjectId(userId),
      labId: lab._id,
      status: ProgressStatus.IN_PROGRESS,
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

  async getUserProgress(labId: string, userId: string): Promise<UserProgressDocument> {
    const lab = await this.labModel.findOne({
      $or: [
        { _id: Types.ObjectId.isValid(labId) ? new Types.ObjectId(labId) : null },
        { labId: labId.toUpperCase() },
      ],
    });

    if (!lab) {
      throw new NotFoundException('Lab not found');
    }

    const progress = await this.progressModel
      .findOne({
        userId: new Types.ObjectId(userId),
        labId: lab._id,
      })
      .populate('lab', 'title labId difficulty category')
      .exec();

    if (!progress) {
      throw new NotFoundException('Lab progress not found. Start the lab first.');
    }

    return progress;
  }

  async updateProgress(
    labId: string,
    userId: string,
    updateProgressDto: UpdateProgressDto,
  ): Promise<UserProgressDocument> {
    const lab = await this.labModel.findOne({
      $or: [
        { _id: Types.ObjectId.isValid(labId) ? new Types.ObjectId(labId) : null },
        { labId: labId.toUpperCase() },
      ],
    });

    if (!lab) {
      throw new NotFoundException('Lab not found');
    }

    const progress = await this.progressModel.findOne({
      userId: new Types.ObjectId(userId),
      labId: lab._id,
    });

    if (!progress) {
      throw new NotFoundException('Lab progress not found. Start the lab first.');
    }

    const steps = lab.simulation?.steps || [];
    if (updateProgressDto.currentStep < 1 || updateProgressDto.currentStep > steps.length) {
      throw new BadRequestException('Invalid step number');
    }

    const updateData: any = {
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

  async completeStep(
    labId: string,
    stepNumber: number,
    userId: string,
    completeStepDto: CompleteStepDto,
  ): Promise<any> {
    const lab = await this.labModel.findOne({
      $or: [
        { _id: Types.ObjectId.isValid(labId) ? new Types.ObjectId(labId) : null },
        { labId: labId.toUpperCase() },
      ],
    });

    if (!lab) {
      throw new NotFoundException('Lab not found');
    }

    const steps = lab.simulation?.steps || [];
    if (stepNumber < 1 || stepNumber > steps.length) {
      throw new BadRequestException('Invalid step number');
    }

    const step = steps[stepNumber - 1];

    const progress = await this.progressModel.findOne({
      userId: new Types.ObjectId(userId),
      labId: lab._id,
    });

    if (!progress) {
      throw new NotFoundException('Lab progress not found. Start the lab first.');
    }

    const alreadyCompleted = progress.completedSteps.find(
      s => s.stepNumber === stepNumber,
    );

    if (alreadyCompleted) {
      throw new BadRequestException('Step already completed');
    }

    const validationPassed = this.validateStepCompletion(
      step,
      completeStepDto.validationResults || [],
    );

    if (!validationPassed) {
      throw new BadRequestException('Step validation failed. Please check your work.');
    }

    const hintsUsed = completeStepDto.hintsUsed || 0;
    const attempts = completeStepDto.attempts || 1;
    const timeSpent = completeStepDto.timeSpent || 0;

    let stepScore = 100;
    if (hintsUsed > 0) stepScore -= hintsUsed * 10;
    if (attempts > 1) stepScore -= (attempts - 1) * 5;
    stepScore = Math.max(stepScore, 0);

    const stepCompletion: StepCompletion = {
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

    const updateData: any = {
      completedSteps,
      progress: progressPercentage,
      timeSpent: progress.timeSpent + timeSpent,
      totalHintsUsed: progress.totalHintsUsed + hintsUsed,
      totalAttempts: progress.totalAttempts + attempts,
      lastAccessed: new Date(),
    };

    if (isLabCompleted) {
      updateData.status = ProgressStatus.COMPLETED;
      updateData.completedAt = new Date();
      
      const averageScore = completedSteps.reduce((sum, step) => sum + step.score, 0) / totalSteps;
      updateData.finalScore = Math.round(averageScore);

      await this.labModel.findByIdAndUpdate(lab._id, {
        $inc: { averageScore: updateData.finalScore, averageCompletionTime: timeSpent / 60 },
      });
    } else {
      updateData.currentStep = stepNumber + 1;
    }

    const updatedProgress = await this.progressModel
      .findByIdAndUpdate(progress._id, updateData, { new: true })
      .populate('lab', 'title labId difficulty category totalSteps')
      .exec();

    // Trigger notification if lab completed
    if (isLabCompleted) {
      try {
        await this.notificationsService.triggerLabCompleted(userId, lab, updatedProgress);
      } catch (error) {
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

  async getStepHints(labId: string, stepNumber: number, userId: string): Promise<string[]> {
    const lab = await this.labModel.findOne({
      $or: [
        { _id: Types.ObjectId.isValid(labId) ? new Types.ObjectId(labId) : null },
        { labId: labId.toUpperCase() },
      ],
    });

    if (!lab) {
      throw new NotFoundException('Lab not found');
    }

    const steps = lab.simulation?.steps || [];
    if (stepNumber < 1 || stepNumber > steps.length) {
      throw new BadRequestException('Invalid step number');
    }

    const progress = await this.progressModel.findOne({
      userId: new Types.ObjectId(userId),
      labId: lab._id,
    });

    if (!progress) {
      throw new NotFoundException('Lab progress not found. Start the lab first.');
    }

    return steps[stepNumber - 1].hints || [];
  }

  async getUserLabsProgress(userId: string, status?: string): Promise<{
    inProgress: UserProgressDocument[];
    completed: UserProgressDocument[];
    notStarted: any[];
  }> {
    const filter: any = { userId: new Types.ObjectId(userId) };
    
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

    const inProgress = progressRecords.filter(p => p.status === ProgressStatus.IN_PROGRESS);
    const completed = progressRecords.filter(p => p.status === ProgressStatus.COMPLETED);

    const startedLabIds = progressRecords.map(p => p.labId.toString());
    const notStarted = allLabs
      .filter(lab => !startedLabIds.includes(lab._id.toString()))
      .map(lab => ({
        lab: lab.toObject(),
        status: ProgressStatus.NOT_STARTED,
        progress: 0,
        currentStep: 1,
      }));

    return {
      inProgress,
      completed,
      notStarted,
    };
  }

  async restartLab(labId: string, userId: string): Promise<any> {
    const lab = await this.labModel.findOne({
      $or: [
        { _id: Types.ObjectId.isValid(labId) ? new Types.ObjectId(labId) : null },
        { labId: labId.toUpperCase() },
      ],
    });

    if (!lab) {
      throw new NotFoundException('Lab not found');
    }

    await this.progressModel.deleteOne({
      userId: new Types.ObjectId(userId),
      labId: lab._id,
    });

    const progress = await this.progressModel.create({
      userId: new Types.ObjectId(userId),
      labId: lab._id,
      status: ProgressStatus.IN_PROGRESS,
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

  private async addProgressToLabs(labs: LabDocument[], userId: string): Promise<any[]> {
    const labIds = labs.map(lab => lab._id);
    const progressRecords = await this.progressModel.find({
      userId: new Types.ObjectId(userId),
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
        canStart: !progress || progress.status === ProgressStatus.NOT_STARTED,
      };
    });
  }

  private validateStepCompletion(
    step: any,
    validationResults: any[],
  ): boolean {
    if (!validationResults || validationResults.length === 0) {
      return false;
    }

    const criteriaCount = step.validationCriteria?.length || 0;
    if (validationResults.length !== criteriaCount) {
      return false;
    }

    return validationResults.every(result => result.passed === true);
  }
}
