import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SonicKeyDto } from '../dtos/sonicKey.dto';

@Injectable()
export class CustomSonicKeyValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      const req = context.switchToHttp().getRequest();
    const data = req.body['data']
    if(!data) throw new BadRequestException("data can not be empty")
    const sonicKeyDto = JSON.parse(data) as SonicKeyDto;
    if(!sonicKeyDto.contentOwner) throw new BadRequestException({message:["contentOwner can not be empty"]})
    return next
      .handle()
    } catch (error) {
      throw new BadRequestException("Validation Failed")
    }
    
  }
}