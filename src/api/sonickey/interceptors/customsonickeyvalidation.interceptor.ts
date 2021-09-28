import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SonicKeyDto } from '../dtos/sonicKey.dto';

@Injectable()
export class CustomSonicKeyValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      const req = context.switchToHttp().getRequest();
      console.log("req",req)
    const data = req.body['data']
    console.log("data",data)
    if(!data) throw new BadRequestException("data can not be empty")
    const sonicKeyDto = JSON.parse(data) as SonicKeyDto;
    if(!sonicKeyDto.contentOwner) throw new BadRequestException({message:["contentOwner can not be empty"]})
    throw new BadRequestException("Done Error")
    return next
      .handle()
    } catch (error) {
      throw new BadRequestException("Validation Failed")
    }
    
  }
}