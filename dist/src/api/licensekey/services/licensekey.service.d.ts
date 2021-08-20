import { CreateLicensekeyDto } from '../dto/create-licensekey.dto';
import { LicenseKey, LKOwner, LKReserve } from '../schemas/licensekey.schema';
import { Model } from 'mongoose';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { MongoosePaginateLicensekeyDto } from '../dto/mongoosepaginate-licensekey.dto';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { UserService } from '../../user/user.service';
declare type usesFor = 'encode' | 'decode';
export declare class LicensekeyService {
    readonly licenseKeyModel: Model<LicenseKey>;
    readonly keygenService: KeygenService;
    readonly userService: UserService;
    constructor(licenseKeyModel: Model<LicenseKey>, keygenService: KeygenService, userService: UserService);
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
    addReservedDetailsInLicence(licenseId: string, reserves: LKReserve[]): Promise<LicenseKey>;
    removeReservedDetailsInLicence(licenseId: string, jobId: string): Promise<LicenseKey>;
    incrementReservedDetailsInLicenceBy(licenseId: string, jobId: string, count: number): Promise<LicenseKey>;
    decrementReservedDetailsInLicenceBy(licenseId: string, jobId: string, count: number): Promise<LicenseKey>;
    migrateKeyFromKeygenToDB(): Promise<any>;
}
export {};
