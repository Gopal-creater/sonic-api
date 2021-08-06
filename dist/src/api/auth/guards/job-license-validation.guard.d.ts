import { CanActivate, ExecutionContext } from '@nestjs/common';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
export declare class JobLicenseValidationGuard implements CanActivate {
    private readonly licensekeyService;
    constructor(licensekeyService: LicensekeyService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    isAllowedForJobCreation(remaniningUses: number, usesToBeUsed: number, reserves?: {
        jobId: string;
        count: number;
    }[]): Promise<boolean>;
}
