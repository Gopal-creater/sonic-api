import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiKeyAuthGuard } from '../../api-key/guards/apikey-auth.guard';

@Injectable()
export class ConditionalAuthGuard implements CanActivate {
  constructor(
    private jwtAuthGuard: JwtAuthGuard,
    private apiKeyAuthGuard: ApiKeyAuthGuard,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const xApikey = request.headers['x-api-key'];
    if (xApikey) {
      console.log('x-api-key', xApikey);
      return this.apiKeyAuthGuard.canActivate(context);
    } else {
      return this.jwtAuthGuard.canActivate(context);
    }
  }
}
