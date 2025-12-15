import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Lab } from './lab.schema';
export type UserProgressDocument = UserProgress & Document;
export declare enum ProgressStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    PAUSED = "paused",
    ABANDONED = "abandoned"
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
export declare class UserProgress {
    userId: MongooseSchema.Types.ObjectId;
    labId: MongooseSchema.Types.ObjectId;
    status: ProgressStatus;
    currentStep: number;
    completedSteps: StepCompletion[];
    progress: number;
    timeSpent: number;
    lastAccessed: Date;
    startedAt: Date;
    completedAt: Date;
    finalScore: number;
    totalHintsUsed: number;
    totalAttempts: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    user?: User;
    lab?: Lab;
    get timeSpentMinutes(): number;
    get completionRate(): number;
}
export declare const UserProgressSchema: MongooseSchema<UserProgress, import("mongoose").Model<UserProgress, any, any, any, Document<unknown, any, UserProgress, any, {}> & UserProgress & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserProgress, Document<unknown, {}, import("mongoose").FlatRecord<UserProgress>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<UserProgress> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
