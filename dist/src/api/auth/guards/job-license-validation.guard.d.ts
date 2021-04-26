import { CanActivate, ExecutionContext } from '@nestjs/common';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
export declare class JobLicenseValidationGuard implements CanActivate {
    private readonly keygenService;
    constructor(keygenService: KeygenService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    isAllowedForJobCreation(remaniningUses: number, usesToBeUsed: number, reserves?: {
        jobId: string;
        count: number;
    }[]): Promise<boolean>;
}