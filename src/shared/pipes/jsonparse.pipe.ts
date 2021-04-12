import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class JsonParsePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      console.log("value",value);
      
      return value && JSON.parse(value);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}