import { LicenseKey } from '../schemas/licensekey.schema';
export declare class MongoosePaginateLicensekeyDto {
    docs: [LicenseKey];
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
