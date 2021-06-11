import { QueryOptions } from 'mongoose-query-parser';
export declare class ParsedQueryDto implements QueryOptions {
    filter: any;
    sort?: any;
    limit?: number;
    skip?: number;
    select?: any;
    populate?: any;
    page?: number;
    topLimit?: number;
}
