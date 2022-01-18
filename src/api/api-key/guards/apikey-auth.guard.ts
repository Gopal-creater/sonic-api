import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CognitoUserSession } from 'src/api/user/schemas/user.aws.schema';
import { ApiKeyService } from '../api-key.service';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService,private readonly userService: UserService) {}
  async canActivate(
    context: ExecutionContext,
  ){
    const request = context.switchToHttp().getRequest();

    const apikey = request.headers['x-api-key'];
    
    if(!apikey) throw new ForbiddenException("Forbidden resource deuto no apikey");

    const apikeyFromDb = await this.apiKeyService.apiKeyModel.findById(apikey)
    .catch(err=>{throw new ForbiddenException("Forbidden resource deuto invalid apikey")})

    if(!apikeyFromDb) throw new ForbiddenException("Forbidden resource deuto invalid apikey");

    if(apikeyFromDb.revoked)  throw new ForbiddenException("This api key is revoked")

    if(apikeyFromDb.disabled || apikeyFromDb.suspended)  throw new ForbiddenException("Forbidden resource deuto apikey is disabled or suspended")
   
    if (new Date(apikeyFromDb.validity).getTime() < new Date().getTime()) throw new ForbiddenException("Forbidden resource deuto no apikey is expired")
   
    const userProfile = await this.userService.getUserProfile(apikeyFromDb.customer,true)
    if(!userProfile) throw new ForbiddenException("User not found for this apikey")
    const userSession:CognitoUserSession = {
      sub:userProfile.sub,
      email_verified:userProfile.userAttributeObj.email_verified,
      phone_number_verified:userProfile.userAttributeObj.phone_number_verified,
      "cognito:username":userProfile.username,
      email:userProfile.userAttributeObj.email,
      "cognito:groups":userProfile.groups,
      phone_number:userProfile.userAttributeObj.phone_number,
      from:'apikey'
    }
    request.user = userSession
    request.apikey = apikeyFromDb
    return true
  }
}


