import { SonicKey } from '../schemas/sonickey.schema';
export declare class MongoosePaginateSonicKeyDto {
    docs: [SonicKey];
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
