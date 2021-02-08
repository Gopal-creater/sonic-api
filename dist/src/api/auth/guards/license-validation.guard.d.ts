import { CanActivate, ExecutionContext } from '@nestjs/common';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
export declare class LicenseValidationGuard implements CanActivate {
    private readonly keygenService;
    constructor(keygenService: KeygenService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    isValidLicense(id: string): Promise<boolean>;
}
