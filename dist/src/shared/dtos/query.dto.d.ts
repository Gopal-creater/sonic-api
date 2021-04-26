import { PaginationQueryDto } from './paginationquery.dto';
export declare class QueryDto extends PaginationQueryDto {
    filter?: Record<string, any>;
    _sort?: string;
}
