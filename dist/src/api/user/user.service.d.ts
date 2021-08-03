import { ConfigService } from '@nestjs/config';
import { GlobalAwsService } from './../../shared/modules/global-aws/global-aws.service';
import { KeygenService } from './../../shared/modules/keygen/keygen.service';
import { LicensekeyService } from '../licensekey/licensekey.service';
export declare class UserService {
    private readonly keygenService;
    private readonly licensekeyService;
    private readonly globalAwsService;
    private readonly configService;
    private cognitoIdentityServiceProvider;
    private cognitoUserPoolId;
    constructor(keygenService: KeygenService, licensekeyService: LicensekeyService, globalAwsService: GlobalAwsService, configService: ConfigService);
    listAllLicensesOfOwner(ownerId: string): Promise<void>;
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
