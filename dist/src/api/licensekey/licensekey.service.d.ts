import { CreateLicensekeyDto } from './dto/create-licensekey.dto';
import { LicenseKey, LKOwner } from './schemas/licensekey.schema';
import { Model } from 'mongoose';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { MongoosePaginateLicensekeyDto } from './dto/mongoosepaginate-licensekey.dto';
declare type usesFor = 'encode' | 'decode';
export declare class LicensekeyService {
    readonly licenseKeyModel: Model<LicenseKey>;
    constructor(licenseKeyModel: Model<LicenseKey>);
    create(createLicensekeyDto: CreateLicensekeyDto, createdBy: string): Promise<LicenseKey>;
    findAll(queryDto: ParsedQueryDto): Promise<MongoosePaginateLicensekeyDto>;
    validateLicence(id: string): Promise<{
        validationResult: {
            valid: boolean;
            message: string;
        };
        licenseKey: LicenseKey;
    }>;
    addOwnersToLicense(id: string, owners: LKOwner[]): Promise<LicenseKey>;
    addOwnerToLicense(id: string, lKOwner: LKOwner): Promise<LicenseKey>;
    removeOwnerFromLicense(id: string, ownerId: string): Promise<LicenseKey>;
    removeOwnersFromLicense(id: string, ownerIds: string[]): Promise<LicenseKey>;
    incrementUses(id: string, usesFor: usesFor, incrementBy?: number): Promise<LicenseKey>;
    decrementUses(id: string, usesFor: usesFor, decrementBy?: number): Promise<LicenseKey>;
    resetUses(id: string, usesFor: usesFor | 'both'): Promise<LicenseKey>;
}
export {};
