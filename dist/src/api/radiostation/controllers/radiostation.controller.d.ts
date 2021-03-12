import { RadiostationService } from '../services/radiostation.service';
import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { UpdateRadiostationDto } from '../dto/update-radiostation.dto';
import { BulkRadiostationDto } from '../dto/bulk-radiostation.dto';
import { RadioStation } from '../../../schemas/radiostation.schema';
export declare class RadiostationController {
    private readonly radiostationService;
    constructor(radiostationService: RadiostationService);
    create(createRadiostationDto: CreateRadiostationDto): Promise<RadioStation & CreateRadiostationDto>;
    findAll(): Promise<RadioStation[]>;
    getOwnersKeys(ownerId: string): Promise<RadioStation[]>;
    findOne(id: string): Promise<RadioStation>;
    stopListeningStream(id: string): Promise<RadioStation>;
    startListeningStream(id: string): Promise<RadioStation>;
    update(id: string, updateRadiostationDto: UpdateRadiostationDto): Promise<RadioStation & UpdateRadiostationDto>;
    remove(id: string): Promise<RadioStation>;
    removeBulk(bulkDto: BulkRadiostationDto): Promise<{
        passedData: RadioStation[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    bulkStartListeningStream(bulkDto: BulkRadiostationDto): Promise<{
        passedData: RadioStation[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    bulkStopListeningStream(bulkDto: BulkRadiostationDto): Promise<{
        passedData: RadioStation[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    createTable(): Promise<string>;
}
