import { LabsService } from './labs.service';
export declare class LabsController {
    private readonly labsService;
    constructor(labsService: LabsService);
    findAll(): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/lab.schema").Lab, {}, {}> & import("./schemas/lab.schema").Lab & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/lab.schema").Lab, {}, {}> & import("./schemas/lab.schema").Lab & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getTheory(id: string): Promise<import("mongoose").FlattenMaps<Record<string, any>>>;
    getSimulation(id: string): Promise<import("mongoose").FlattenMaps<Record<string, any>>>;
    getQuestions(id: string): Promise<import("mongoose").FlattenMaps<Record<string, any>>[]>;
}
