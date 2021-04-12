import { Document } from 'mongoose';
export declare type CatDocument = Cat & Document;
export declare class Credential {
    username: string;
    password: string;
}
export declare class Cat extends Document {
    constructor(data?: Partial<Cat>);
    name: string;
    streamingUrl: string;
    website: string;
    logo: string;
    credential: Credential;
    owner: string;
    startedAt: Date;
    stopAt: Date;
    isStreamStarted: boolean;
    notes: string;
    metaData: Map<string, any>;
}
export declare const CatSchema: import("mongoose").Schema<Cat, import("mongoose").Model<any, any>, undefined>;
