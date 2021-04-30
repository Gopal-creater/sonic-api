import { Document, Schema as MogSchema } from 'mongoose';
export declare const CornJobSchemaName = "CornJob";
export declare class CornJob extends Document {
    name: string;
    type: string;
}
export declare const CornJobSchema: MogSchema<CornJob, import("mongoose").Model<any, any>, undefined>;
