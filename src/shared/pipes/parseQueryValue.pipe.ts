import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { isObjectId, toObjectId } from '../utils/mongoose.utils';
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
        limit: 50,
        skip: 0,
        ...parsed,
      };
      //Page is our custom filed here for pagination
      if (parsed?.filter?.page) {
        parsed['page'] = parsed?.filter?.page;
        delete parsed?.filter?.page;
      }
      if (parsed?.filter?.topLimit) {
        parsed['topLimit'] = parsed?.filter?.topLimit;
        delete parsed?.filter?.topLimit;
      }

      if (parsed?.filter?.includeGraph!==null || parsed?.filter?.includeGraph!==undefined) {
        parsed['includeGraph'] = parsed?.filter?.includeGraph;
        delete parsed?.filter?.includeGraph;
      }

      if (parsed?.filter?.groupByTime) {
        parsed['groupByTime'] = parsed?.filter?.groupByTime;
        delete parsed?.filter?.groupByTime;
      }
      // Cast to ObjectId
      if(parsed?.filter){
        parsed.filter=this.castToObjectId(parsed?.filter)
      }
      console.log('parsed', JSON.stringify(parsed));
      console.log('parsed filter', parsed.filter);
      return parsed;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  castToObjectId(filter:Object){
    const res = {}
      for (const key in filter) {
        var value = filter[key]
        if(isObjectId(value)){
          res[key] = toObjectId(value)
        }
        else{
          res[key] = value
        }
      }
      return res
  }
}
