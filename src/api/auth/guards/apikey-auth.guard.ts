import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiKeyService } from '../../api-key/api-key.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}
  async canActivate(
    context: ExecutionContext,
  ){
    const request = context.switchToHttp().getRequest();

    const apikey = request.headers['x-api-key'];
    
    if(!apikey) throw new ForbiddenException("Forbidden resource deuto no apikey");

    const apikeyFromDb = await this.apiKeyService.apiKeyModel.findById(apikey)
    .catch(err=>{throw new ForbiddenException("Forbidden resource deuto invalid apikey")})

    if(!apikeyFromDb) throw new ForbiddenException("Forbidden resource deuto invalid apikey");

    if(apikeyFromDb.disabled || apikeyFromDb.disabledByAdmin)  throw new ForbiddenException("Forbidden resource deuto no apikey is disabled")
   
    if (new Date(apikeyFromDb.validity).getTime() < new Date().getTime()) throw new ForbiddenException("Forbidden resource deuto no apikey is expired")
   
    request.apikey = apikeyFromDb
    return true
  }
}


