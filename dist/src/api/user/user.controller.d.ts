import { AddNewLicenseDto, AddBulkNewLicensesDto } from './dtos/index';
import { UserService } from './user.service';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { LicensekeyService } from '../licensekey/services/licensekey.service';
export declare class UserController {
    private readonly userServices;
    private readonly licensekeyService;
    constructor(userServices: UserService, licensekeyService: LicensekeyService);
    getUserLicenses(userId: string, queryDto?: ParsedQueryDto): Promise<import("../licensekey/dto/mongoosepaginate-licensekey.dto").MongoosePaginateLicensekeyDto>;
    addNewLicense(userIdOrUsername: string, addNewLicenseDto: AddNewLicenseDto): Promise<import("../licensekey/schemas/licensekey.schema").LicenseKey>;
    addBulkNewLicense(userIdOrUsername: string, addBulkNewLicensesDto: AddBulkNewLicensesDto): Promise<{
        passedData: (import("../licensekey/schemas/licensekey.schema").LicenseKey | {
            promiseError: any;
            data: string;
        })[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    getUserProfile(username: string): Promise<void>;
    getGroupsOfUser(username: string): Promise<import("aws-sdk/lib/request").PromiseResult<import("aws-sdk/clients/cognitoidentityserviceprovider").AdminListGroupsForUserResponse, import("aws-sdk").AWSError>>;
}
