import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { MongooseQueryParser } from 'mongoose-query-parser';
/**
 * This pipe is responsible for parsing api query into mongoose query
 * https://www.npmjs.com/package/mongoose-query-parser
 */
@Injectable()
export class ParseQueryValue implements PipeTransform {
  constructor(private values?: string[]) {}
  transform(queries: any, metadata: ArgumentMetadata) {
    try {
      const parser = new MongooseQueryParser();
      queries = queries || {};
      const queryToParse = {
        page: 1,
        ...queries,
      };
      var parsed = parser.parse(queryToParse);
      parsed = {
        limit: 100,
        skip: 0,
        ...parsed,
      };
      //Page is our custom filed here for pagination
      if (parsed?.filter?.page) {
        parsed['page'] = parsed?.filter?.page;
        delete parsed?.filter?.page;
      }
      return parsed;
      // const res = {}
      // for (const key in queries) {
      //   var value = queries[key]
      //   if(isNumber(value)){
      //     res[key] = parseInt(value)
      //   }
      //   else if(value=='true'||value=='false'){
      //     res[key] = value=='true'
      //   }
      //   else{
      //     res[key] = value
      //   }
      // }
      // return res
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
