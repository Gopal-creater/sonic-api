import { RadiostationService } from './radiostation.service';
import { CreateRadiostationDto } from './dto/create-radiostation.dto';
import { UpdateRadiostationDto } from './dto/update-radiostation.dto';
export declare class RadiostationController {
    private readonly radiostationService;
    constructor(radiostationService: RadiostationService);
    create(createRadiostationDto: CreateRadiostationDto): Promise<CreateRadiostationDto>;
    findAll(): Promise<any[]>;
    getOwnersKeys(ownerId: string): Promise<import("../../schemas/radiostation.schema").RadioStation[]>;
    findOne(id: string): Promise<import("../../schemas/radiostation.schema").RadioStation & {
        id: string;
    }>;
    stopListeningStream(id: string): Promise<import("../../schemas/radiostation.schema").RadioStation & {
        id: string;
    }>;
    startListeningStream(id: string): Promise<import("../../schemas/radiostation.schema").RadioStation & {
        id: string;
    }>;
    update(id: string, updateRadiostationDto: UpdateRadiostationDto): Promise<import("../../schemas/radiostation.schema").RadioStation & UpdateRadiostationDto>;
    remove(id: string): Promise<import("../../schemas/radiostation.schema").RadioStation & {
        id: string;
    }>;
    createTable(): Promise<string>;
}
