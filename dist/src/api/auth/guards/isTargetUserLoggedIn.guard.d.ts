import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare type targetValue = 'Query' | 'Param';
export declare class IsTargetUserLoggedInGuard implements CanActivate {
    private target;
    constructor(target?: targetValue);
    canActivate(context: ExecutionContext): boolean;
}
