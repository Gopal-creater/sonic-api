import { ThirdpartyDetection } from '../schemas/thirdparty-detection.schema';
export declare class MongoosePaginateThirdPartyDetectionDto {
    docs: [ThirdpartyDetection];
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
