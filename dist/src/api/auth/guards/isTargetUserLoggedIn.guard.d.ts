import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare type targetValue = 'Query' | 'Param';
export declare class IsTargetUserLoggedInGuard implements CanActivate {
    private target;
    private name;
    constructor(target?: targetValue, name?: string);
    canActivate(context: ExecutionContext): boolean;
}
