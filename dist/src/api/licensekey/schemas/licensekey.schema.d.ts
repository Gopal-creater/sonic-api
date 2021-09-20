import { Document, Schema as MogSchema } from 'mongoose';
export declare const LicenseKeySchemaName = "LicenseKey";
export declare class LKOwner {
    ownerId: string;
    username: string;
    email?: string;
    name: string;
}
export declare class LKReserve {
    jobId: string;
    count: number;
}
export declare class LicenseKey extends Document {
    _id: string;
    name: string;
    key: string;
    disabled?: boolean;
    suspended?: boolean;
    maxEncodeUses: number;
    encodeUses: number;
    isUnlimitedEncode: boolean;
    maxDecodeUses: number;
    decodeUses: number;
    isUnlimitedDecode: boolean;
    maxMonitoringUses: number;
    monitoringUses: number;
    isUnlimitedMonitor: boolean;
    validity?: Date;
    metaData?: Map<string, any>;
    createdBy?: string;
    updatedBy?: string;
    owners?: LKOwner[];
    reserves?: LKReserve[];
}
export declare const LicenseKeySchema: MogSchema<LicenseKey, import("mongoose").Model<any, any>, undefined>;
