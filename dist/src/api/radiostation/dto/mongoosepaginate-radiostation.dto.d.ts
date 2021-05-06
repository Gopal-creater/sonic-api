import { RadioStation } from '../schemas/radiostation.schema';
export declare class MongoosePaginateRadioStationDto {
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
