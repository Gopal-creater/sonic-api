import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ConvertIntObj implements PipeTransform {
  constructor(private values?:string[]){

  }
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      console.log("value",value);
      console.log("this.values",this.values);
      
      return convertIntObj(value,this.values);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

function convertIntObj(obj:Object,value?:string[]) {
  const res = {}
  for (const key in obj) {
    if(value.includes(key)){
      const parsed = parseInt(obj[key]);
      res[key] = isNaN(parsed) ? obj[key] : parsed;
    }else{
      res[key]=obj[key]
    }
  }
  return res;
}