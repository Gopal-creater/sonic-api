import { ConfigService } from '@nestjs/config';
import { GlobalAwsService } from './../../shared/modules/global-aws/global-aws.service';
import { KeygenService } from 'src/shared/modules/keygen/keygen.service';
export declare class UserService {
    private readonly keygenService;
    private readonly globalAwsService;
    private readonly configService;
    private cognitoIdentityServiceProvider;
    private cognitoUserPoolId;
    constructor(keygenService: KeygenService, globalAwsService: GlobalAwsService, configService: ConfigService);
    listAllLicensesOfOwner(ownerId: string): Promise<any>;
    addNewLicense(licenseId: string, ownerId: string): Promise<any>;
    addBulkNewLicenses(licenseIds: [string], ownerId: string): Promise<{
        passedData: any[];
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
