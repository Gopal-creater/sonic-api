import { CanActivate, ExecutionContext } from '@nestjs/common';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
export declare class LicenseValidationGuard implements CanActivate {
    private readonly licensekeyService;
    constructor(licensekeyService: LicensekeyService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    isValidLicense(id: string): Promise<boolean>;
}
