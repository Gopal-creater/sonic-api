import { AddNewLicenseDto, AddBulkNewLicensesDto, UpdateProfileDto } from './dtos/index';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userServices;
    constructor(userServices: UserService);
    getUserLicenses(userId: string): Promise<any>;
    addNewLicense(userId: string, addNewLicenseDto: AddNewLicenseDto): Promise<any>;
    addBulkNewLicense(userId: string, addBulkNewLicensesDto: AddBulkNewLicensesDto): Promise<{
        passedData: any[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    getUserProfile(username: string): Promise<unknown>;
    updateProfile(username: string, updateProfileDto: UpdateProfileDto): Promise<unknown>;
}
