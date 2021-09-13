import { Document, Schema as MogSchema } from 'mongoose';
import { S3FileUploadI } from '../../s3fileupload/interfaces';
export declare const SonicKeySchemaName = "SonicKey";
export declare class S3FileMeta implements S3FileUploadI {
    ETag: string;
    Location: string;
    key: string;
    Key: string;
    Bucket: string;
}
export declare class SonicKey extends Document {
    _id: string;
    sonicKey: string;
    owner: string;
    job: any;
    apiKey: any;
    channel: string;
    channelUuid: string;
    license: string;
    downloadable: boolean;
    status: boolean;
    encodingStrength: number;
    contentType?: string;
    contentDescription: string;
    contentCreatedDate: Date;
    contentDuration?: number;
    contentSize: number;
    contentFilePath: string;
    s3FileMeta: S3FileMeta;
    contentFileType: string;
    contentEncoding: string;
    contentSamplingFrequency: string;
    isrcCode?: string;
    iswcCode?: string;
    tuneCode?: string;
    contentName?: string;
    contentOwner?: string;
    contentValidation?: boolean;
    contentFileName: string;
    contentQuality: string;
    additionalMetadata: Map<string, any>;
}
export declare const SonicKeySchema: MogSchema<SonicKey, import("mongoose").Model<any, any>, undefined>;
