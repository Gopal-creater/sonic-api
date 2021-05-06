import { JobFile } from '../schemas/jobfile.schema';
export declare class MongoosePaginateJobFileDto {
    docs: [JobFile];
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
