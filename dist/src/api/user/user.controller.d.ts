import { AddNewLicenseDto, AddBulkNewLicensesDto, UpdateProfileDto } from './dtos/index';
import { UserService } from './user.service';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { LicensekeyService } from '../licensekey/licensekey.service';
export declare class UserController {
    private readonly userServices;
    private readonly licensekeyService;
    constructor(userServices: UserService, licensekeyService: LicensekeyService);
    getUserLicenses(userId: string, queryDto?: ParsedQueryDto): Promise<import("../licensekey/dto/mongoosepaginate-licensekey.dto").MongoosePaginateLicensekeyDto>;
    addNewLicense(userId: string, addNewLicenseDto: AddNewLicenseDto): Promise<import("../licensekey/schemas/licensekey.schema").LicenseKey>;
    addBulkNewLicense(userId: string, addBulkNewLicensesDto: AddBulkNewLicensesDto): Promise<{
        passedData: (import("../licensekey/schemas/licensekey.schema").LicenseKey | {
            promiseError: any;
            data: string;
        })[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    getUserProfile(username: string): Promise<unknown>;
    updateProfile(username: string, updateProfileDto: UpdateProfileDto): Promise<unknown>;
}
