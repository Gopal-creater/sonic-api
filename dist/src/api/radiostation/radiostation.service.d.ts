import { CreateRadiostationDto } from './dto/create-radiostation.dto';
import { UpdateRadiostationDto } from './dto/update-radiostation.dto';
import { RadioStationRepository } from '../../repositories/radiostation.repository';
import { RadioStation } from '../../schemas/radiostation.schema';
export declare class RadiostationService {
    readonly radioStationRepository: RadioStationRepository;
    constructor(radioStationRepository: RadioStationRepository);
    create(createRadiostationDto: CreateRadiostationDto): Promise<RadioStation & CreateRadiostationDto>;
    stopListeningStream(id: string): Promise<RadioStation>;
    startListeningStream(id: string): Promise<RadioStation>;
    findAll(): Promise<RadioStation[]>;
    findOne(id: string): Promise<RadioStation>;
    update(id: string, updateRadiostationDto: UpdateRadiostationDto): Promise<RadioStation & UpdateRadiostationDto>;
    findByOwner(owner: string): Promise<RadioStation[]>;
    remove(id: string): Promise<RadioStation>;
    bulkRemove(ids: [string]): Promise<RadioStation[]>;
    bulkStartListeningStream(ids: [string]): Promise<RadioStation[]>;
    bulkStopListeningStream(ids: [string]): Promise<RadioStation[]>;
}
