import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isArray } from 'lodash';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { isObjectId, toObjectId } from '../utils/mongoose.utils';
/**
 * This pipe is responsible for parsing api query into mongoose query
 * https://www.npmjs.com/package/mongoose-query-parser
 */
@Injectable()
export class ParseQueryValue implements PipeTransform {
  constructor(private values?: string[]) {}
  transform(queries: any = {}, metadata: ArgumentMetadata) {
    try {
      const { aggregateSearch,relation_filter=JSON.stringify({}), ...query } = queries;
      const parser = new MongooseQueryParser();
      const relationPrefix = 'relation_';
      const queryToParse = {
        page: 1,
        ...query,
      };
      var parsed = parser.parse(queryToParse);
      parsed = {
        limit: 50,
        skip: 0,
        ...parsed,
      };
      //Lets collect all relation_filter which will be used to filter our relation table
      const relationalFilter = JSON.parse(relation_filter) || {};
      const objKeysArr = Object.keys(parsed.filter);
      for (let index = 0; index < objKeysArr.length; index++) {
        const filterFiled = objKeysArr[index];
        console.log('filterFiled', filterFiled);
        if (filterFiled.includes(relationPrefix)) {
          relationalFilter[filterFiled.split(relationPrefix)[1]] =
            parsed.filter[filterFiled];
          delete parsed.filter[filterFiled];
        }
      }
      parsed['relationalFilter'] = relationalFilter;
      if (parsed?.filter?.page) {
        parsed['page'] = parsed?.filter?.page;
        delete parsed?.filter?.page;
      }

      if (aggregateSearch) {
        const parsedAggregate = JSON.parse(aggregateSearch);
        if (!isArray(parsedAggregate)) {
          throw new BadRequestException(
            'aggregateSearch params must be an array of object type in stringify format',
          );
        }
        console.log('passed========>');
        if (parsedAggregate.some(e => typeof e != 'object')) {
          throw new BadRequestException(
            'aggregateSearch params must be an array of object type in stringify format',
          );
        }
        parsed['aggregateSearch'] = parsedAggregate;
      }
      if (parsed?.filter?.topLimit) {
        parsed['topLimit'] = parsed?.filter?.topLimit;
        delete parsed?.filter?.topLimit;
      }

      if (
        parsed?.filter?.includeGraph !== null ||
        parsed?.filter?.includeGraph !== undefined
      ) {
        parsed['includeGraph'] = parsed?.filter?.includeGraph;
        delete parsed?.filter?.includeGraph;
      }

      if (
        parsed?.filter?.includeGroupData !== null ||
        parsed?.filter?.includeGroupData !== undefined
      ) {
        parsed['includeGroupData'] = parsed?.filter?.includeGroupData;
        delete parsed?.filter?.includeGroupData;
      }

      if (parsed?.filter?.groupByTime) {
        parsed['groupByTime'] = parsed?.filter?.groupByTime;
        delete parsed?.filter?.groupByTime;
      }
      // Cast to ObjectId
      if (parsed?.filter) {
        parsed.filter = this.castToObjectId(parsed?.filter);
      }
      if (parsed?.['relationalFilter']) {
        parsed['relationalFilter'] = this.castToObjectId(parsed['relationalFilter']);
      }
      console.log('parsed', JSON.stringify(parsed));
      console.log('parsed filter', parsed.filter);
      console.log('parsed relation filter', parsed['relationalFilter']);
      return parsed;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  castToObjectId(filter: Object) {
    const res = {};
    for (const key in filter) {
      var value = filter[key];
      console.log(`IsObjectId ${isObjectId(value)} :${value}`);
      if (isObjectId(value)) {
        res[key] = toObjectId(value);
      } else {
        res[key] = value;
      }
    }
    return res;
  }
}
