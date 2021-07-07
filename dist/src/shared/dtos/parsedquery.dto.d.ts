import { QueryOptions } from 'mongoose-query-parser';
import { groupByTime } from 'src/shared/types';
export declare class ParsedQueryDto implements QueryOptions {
    filter: any;
    sort?: any;
    limit?: number;
    skip?: number;
    select?: any;
    populate?: any;
    page?: number;
    topLimit?: number;
    includeGraph?: boolean;
    groupByTime?: groupByTime;
}
