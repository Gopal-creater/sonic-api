import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { toObjectId } from '../utils/mongoose.utils';

@Injectable()
export class ToObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      
      return value && toObjectId(value)
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}