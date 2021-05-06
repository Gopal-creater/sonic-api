import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { isNumber } from '../utils/json.utils';

@Injectable()
export class ParseQueryValue implements PipeTransform {
  constructor(private values?:string[]){

  }
  transform(queries: any, metadata: ArgumentMetadata) {
    try {
      const res = {}
      for (const key in queries) {
        var value = queries[key]
        if(isNumber(value)){
          res[key] = parseInt(value)
        }
        else if(value=='true'||value=='false'){
          res[key] = value=='true'
        }
        else{
          res[key] = value
        }
      }
      return res
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}