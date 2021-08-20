import { LKOwner, LKReserve } from '../schemas/licensekey.schema';
export declare class CreateLicensekeyDto {
    name: string;
    disabled?: boolean;
    suspended?: boolean;
    maxEncodeUses: number;
    encodeUses: number;
    maxDecodeUses: number;
    decodeUses: number;
    validity: Date;
    metaData?: Map<string, any>;
}
export declare class AdminUpdateLicensekeyDto extends CreateLicensekeyDto {
    owners?: LKOwner[];
    reserves?: LKReserve[];
}
