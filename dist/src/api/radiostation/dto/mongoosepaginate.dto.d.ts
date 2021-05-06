import { RadioStation } from '../schemas/radiostation.schema';
export declare class MongoosePaginateDto {
    docs: [RadioStation];
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
