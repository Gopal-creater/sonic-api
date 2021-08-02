import { AddNewLicenseDto, AddBulkNewLicensesDto, UpdateProfileDto } from './dtos/index';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userServices;
    constructor(userServices: UserService);
    getUserLicenses(userId: string): Promise<any>;
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
