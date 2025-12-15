import { Model } from 'mongoose';
import { LabDocument } from '../schemas/lab.schema';
import { UserProgressDocument } from '../schemas/user-progress.schema';
import { StartLabDto } from '../dto/start-lab.dto';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { CompleteStepDto } from '../dto/complete-step.dto';
import { NotificationsService } from '../../notifications/services/notifications.service';
export declare class LabsService {
    private labModel;
    private progressModel;
    private readonly notificationsService;
    private readonly logger;
    constructor(labModel: Model<LabDocument>, progressModel: Model<UserProgressDocument>, notificationsService: NotificationsService);
    findAllLabs(userId: string, query: {
        page: number;
        limit: number;
        difficulty?: string;
        category?: string;
        search?: string;
        isActive?: boolean;
    }): Promise<{
        labs: LabDocument[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findLabById(id: string, userId: string): Promise<LabDocument>;
    getLabTheory(id: string, userId: string): Promise<{
        theoryContent: any;
    }>;
    startLab(id: string, userId: string, startLabDto: StartLabDto): Promise<any>;
    getUserProgress(labId: string, userId: string): Promise<UserProgressDocument>;
    updateProgress(labId: string, userId: string, updateProgressDto: UpdateProgressDto): Promise<UserProgressDocument>;
    completeStep(labId: string, stepNumber: number, userId: string, completeStepDto: CompleteStepDto): Promise<any>;
    getStepHints(labId: string, stepNumber: number, userId: string): Promise<string[]>;
    getUserLabsProgress(userId: string, status?: string): Promise<{
        inProgress: UserProgressDocument[];
        completed: UserProgressDocument[];
        notStarted: any[];
    }>;
    restartLab(labId: string, userId: string): Promise<any>;
    private addProgressToLabs;
    private validateStepCompletion;
}
