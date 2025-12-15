import { LabsService } from '../services/labs.service';
import { StartLabDto } from '../dto/start-lab.dto';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { CompleteStepDto } from '../dto/complete-step.dto';
export declare class LabsController {
    private readonly labsService;
    constructor(labsService: LabsService);
    findAll(req: any, page: number, limit: number, difficulty?: string, category?: string, search?: string, isActive?: boolean): Promise<{
        labs: import("../schemas/lab.schema").LabDocument[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getMyProgress(req: any, status?: string): Promise<{
        inProgress: import("../schemas/user-progress.schema").UserProgressDocument[];
        completed: import("../schemas/user-progress.schema").UserProgressDocument[];
        notStarted: any[];
    }>;
    findOne(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/lab.schema").Lab, {}, {}> & import("../schemas/lab.schema").Lab & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getTheory(id: string, req: any): Promise<{
        theoryContent: any;
    }>;
    startLab(id: string, req: any, startLabDto: StartLabDto): Promise<any>;
    getProgress(id: string, req: any): Promise<import("../schemas/user-progress.schema").UserProgressDocument>;
    updateProgress(id: string, req: any, updateProgressDto: UpdateProgressDto): Promise<import("../schemas/user-progress.schema").UserProgressDocument>;
    completeStep(id: string, step: number, req: any, completeStepDto: CompleteStepDto): Promise<any>;
    getHints(id: string, step: number, req: any): Promise<string[]>;
    restartLab(id: string, req: any): Promise<any>;
}
