import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Lab } from './lab.schema';

export type UserProgressDocument = UserProgress & Document;

export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  ABANDONED = 'abandoned',
}

export interface StepCompletion {
  stepNumber: number;
  completedAt: Date;
  hintsUsed: number;
  attempts: number;
  score: number;
  timeSpent: number;
  validationResults: {
    criteriaIndex: number;
    passed: boolean;
    actualResult?: string;
  }[];
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class UserProgress {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lab', required: true })
  labId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: ProgressStatus, default: ProgressStatus.NOT_STARTED })
  status: ProgressStatus;

  @Prop({ type: Number, default: 1 })
  currentStep: number;

  @Prop([{
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
  }])
  completedSteps: StepCompletion[];

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  progress: number;

  @Prop({ type: Number, default: 0 })
  timeSpent: number;

  @Prop({ type: Date })
  lastAccessed: Date;

  @Prop({ type: Date })
  startedAt: Date;

  @Prop({ type: Date })
  completedAt: Date;

  @Prop({ type: Number, default: 0 })
  finalScore: number;

  @Prop({ type: Number, default: 0 })
  totalHintsUsed: number;

  @Prop({ type: Number, default: 0 })
  totalAttempts: number;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;

  user?: User;
  lab?: Lab;

  get timeSpentMinutes(): number {
    return Math.round(this.timeSpent / 60);
  }

  get completionRate(): number {
    if (!this.lab) return 0;
    const totalSteps = (this.lab as any).totalSteps || 0;
    return totalSteps > 0 ? (this.completedSteps.length / totalSteps) * 100 : 0;
  }
}

export const UserProgressSchema = SchemaFactory.createForClass(UserProgress);

UserProgressSchema.index({ userId: 1, labId: 1 }, { unique: true });
UserProgressSchema.index({ userId: 1, status: 1 });
UserProgressSchema.index({ labId: 1, status: 1 });
UserProgressSchema.index({ status: 1 });
UserProgressSchema.index({ lastAccessed: -1 });
UserProgressSchema.index({ createdAt: -1 });
UserProgressSchema.index({ completedAt: -1 });

UserProgressSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

UserProgressSchema.virtual('lab', {
  ref: 'Lab',
  localField: 'labId',
  foreignField: '_id',
  justOne: true,
});
