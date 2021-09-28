import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class JsonParsePipe implements PipeTransform {
  constructor(private field?:string){

  }
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      console.log("JsonParsePipe-value",value);
      const data = this.field ? value[this.field]:value
      return data && JSON.parse(data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}