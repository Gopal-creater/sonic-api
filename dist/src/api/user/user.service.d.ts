import { ConfigService } from '@nestjs/config';
import { GlobalAwsService } from './../../shared/modules/global-aws/global-aws.service';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { LicensekeyService } from '../licensekey/services/licensekey.service';
import { AdminGetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
export declare class UserService {
    private readonly licensekeyService;
    private readonly globalAwsService;
    private readonly configService;
    private cognitoIdentityServiceProvider;
    private cognitoUserPoolId;
    constructor(licensekeyService: LicensekeyService, globalAwsService: GlobalAwsService, configService: ConfigService);
    addNewLicense(licenseId: string, ownerIdOrUsername: string): Promise<import("../licensekey/schemas/licensekey.schema").LicenseKey>;
    addBulkNewLicenses(licenseIds: [string], ownerIdOrUsername: string): Promise<{
        passedData: (import("../licensekey/schemas/licensekey.schema").LicenseKey | {
            promiseError: any;
            data: string;
        })[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    getUserProfile(usernameOrSub: string): Promise<AdminGetUserResponse>;
    getGroupsForUser(usernameOrSub: string): Promise<import("aws-sdk/lib/request").PromiseResult<CognitoIdentityServiceProvider.AdminListGroupsForUserResponse, import("aws-sdk").AWSError>>;
    addAttributesObjToProfile(profile: AdminGetUserResponse): CognitoIdentityServiceProvider.AdminGetUserResponse;
    exportFromLic(): Promise<void>;
    getUserFromSub(sub: string): Promise<{
        username: string;
        user: CognitoIdentityServiceProvider.UserType;
    }>;
    updateUserWithCustomField(username: string, updateUserAttributes: [{
        Name: string;
        Value: any;
    }]): Promise<unknown>;
}
