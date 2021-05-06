import { ApiKey } from '../schemas/api-key.schema';
export declare class MongoosePaginateDto {
    docs: [ApiKey];
    totalDocs: number;
    offset: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number;
    nextPage: number;
}
