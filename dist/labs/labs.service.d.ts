import { Model } from 'mongoose';
import { Lab, LabDocument } from './schemas/lab.schema';
export declare class LabsService {
    private readonly labModel;
    private allLabs;
    constructor(labModel: Model<LabDocument>);
    private loadLabs;
    findAll(): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Lab, {}, {}> & Lab & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Lab, {}, {}> & Lab & {
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
