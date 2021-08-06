import { ConfigService } from '@nestjs/config';
import { GlobalAwsService } from './../../shared/modules/global-aws/global-aws.service';
import { LicensekeyService } from '../licensekey/services/licensekey.service';
export declare class UserService {
    private readonly licensekeyService;
    private readonly globalAwsService;
    private readonly configService;
    private cognitoIdentityServiceProvider;
    private cognitoUserPoolId;
    constructor(licensekeyService: LicensekeyService, globalAwsService: GlobalAwsService, configService: ConfigService);
    addNewLicense(licenseId: string, ownerId: string): Promise<import("../licensekey/schemas/licensekey.schema").LicenseKey>;
    addBulkNewLicenses(licenseIds: [string], ownerId: string): Promise<{
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
    exportFromLic(): Promise<void>;
    updateUserWithCustomField(username: string, updateUserAttributes: [{
        Name: string;
        Value: any;
    }]): Promise<unknown>;
}
