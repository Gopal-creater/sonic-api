import { RadioStationSonicKey } from '../schemas/radiostation-sonickey.schema';
export declare class MongoosePaginateRadioStationSonicKeyDto {
    docs: [RadioStationSonicKey];
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
