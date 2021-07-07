import { Detection } from '../schemas/detection.schema';
export declare class MongoosePaginateDeectionDto {
    docs: [Detection];
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
