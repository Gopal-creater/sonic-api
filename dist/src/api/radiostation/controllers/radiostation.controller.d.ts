import { RadiostationService } from '../services/radiostation.service';
import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { UpdateRadiostationDto } from '../dto/update-radiostation.dto';
import { BulkRadiostationDto } from '../dto/bulk-radiostation.dto';
export declare class RadiostationController {
    private readonly radiostationService;
    constructor(radiostationService: RadiostationService);
    create(createRadiostationDto: CreateRadiostationDto): Promise<import("../../../schemas/radiostation.schema").RadioStation & CreateRadiostationDto>;
    findAll(): Promise<import("../../../schemas/radiostation.schema").RadioStation[]>;
    getOwnersKeys(ownerId: string): Promise<import("../../../schemas/radiostation.schema").RadioStation[]>;
    findOne(id: string): Promise<import("../../../schemas/radiostation.schema").RadioStation>;
    stopListeningStream(id: string): Promise<import("../../../schemas/radiostation.schema").RadioStation>;
    startListeningStream(id: string): Promise<import("../../../schemas/radiostation.schema").RadioStation>;
    update(id: string, updateRadiostationDto: UpdateRadiostationDto): Promise<import("../../../schemas/radiostation.schema").RadioStation & UpdateRadiostationDto>;
    remove(id: string): Promise<import("../../../schemas/radiostation.schema").RadioStation>;
    removeBulk(bulkDto: BulkRadiostationDto): Promise<import("../../../schemas/radiostation.schema").RadioStation[]>;
    bulkStartListeningStream(bulkDto: BulkRadiostationDto): Promise<import("../../../schemas/radiostation.schema").RadioStation[]>;
    bulkStopListeningStream(bulkDto: BulkRadiostationDto): Promise<import("../../../schemas/radiostation.schema").RadioStation[]>;
    createTable(): Promise<string>;
}
