import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ApiKeyService } from '../../api-key/api-key.service';
export declare class ApiKeyAuthGuard implements CanActivate {
    private readonly apiKeyService;
    constructor(apiKeyService: ApiKeyService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
