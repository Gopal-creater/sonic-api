import { RadiostationService } from '../services/radiostation.service';
import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { UpdateRadiostationDto } from '../dto/update-radiostation.dto';
import { BulkRadiostationDto } from '../dto/bulk-radiostation.dto';
import { QueryDto } from '../../../shared/dtos/query.dto';
export declare class RadiostationController {
    private readonly radiostationService;
    constructor(radiostationService: RadiostationService);
    create(createRadiostationDto: CreateRadiostationDto): Promise<import("../schemas/radiostation.schema").RadioStation>;
    findAll(queryDto?: QueryDto): Promise<import("../dto/mongoosepaginate.dto").MongoosePaginateDto>;
    getOwnersRadioStations(ownerId: string, queryDto: QueryDto): Promise<import("../dto/mongoosepaginate.dto").MongoosePaginateDto>;
    getCount(query: any): Promise<number>;
    findOne(id: string): Promise<import("../schemas/radiostation.schema").RadioStation>;
    stopListeningStream(id: string): Promise<import("../schemas/radiostation.schema").RadioStation>;
    startListeningStream(id: string): Promise<import("../schemas/radiostation.schema").RadioStation>;
    bulkStartListeningStream(bulkDto: BulkRadiostationDto): Promise<{
        passedData: import("../schemas/radiostation.schema").RadioStation[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    bulkStopListeningStream(bulkDto: BulkRadiostationDto): Promise<{
        passedData: import("../schemas/radiostation.schema").RadioStation[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    update(id: string, updateRadiostationDto: UpdateRadiostationDto): Promise<import("../schemas/radiostation.schema").RadioStation>;
    removeBulk(bulkDto: BulkRadiostationDto): Promise<{
        passedData: import("../schemas/radiostation.schema").RadioStation[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    remove(id: string): Promise<import("../schemas/radiostation.schema").RadioStation>;
}
