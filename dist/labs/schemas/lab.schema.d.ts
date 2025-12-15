import { HydratedDocument } from 'mongoose';
export type LabDocument = HydratedDocument<Lab>;
export declare class Lab {
    labId: string;
    title: string;
    difficulty: string;
    category: string;
    description: string;
    theoryContent: Record<string, any>;
    simulation: Record<string, any>;
    questions: Record<string, any>[];
    get steps(): any;
    get requiredLabs(): any;
}
export declare const LabSchema: import("mongoose").Schema<Lab, import("mongoose").Model<Lab, any, any, any, import("mongoose").Document<unknown, any, Lab, any, {}> & Lab & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Lab, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Lab>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Lab> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
