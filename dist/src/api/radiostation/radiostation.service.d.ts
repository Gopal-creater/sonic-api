import { CreateRadiostationDto } from './dto/create-radiostation.dto';
import { UpdateRadiostationDto } from './dto/update-radiostation.dto';
import { RadioStationRepository } from '../../repositories/radiostation.repository';
import { RadioStation } from '../../schemas/radiostation.schema';
export declare class RadiostationService {
    readonly radioStationRepository: RadioStationRepository;
    constructor(radioStationRepository: RadioStationRepository);
    create(createRadiostationDto: CreateRadiostationDto): Promise<CreateRadiostationDto>;
    stopListeningStream(id: string): Promise<RadioStation & {
        id: string;
    }>;
    startListeningStream(id: string): Promise<RadioStation & {
        id: string;
    }>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<RadioStation & {
        id: string;
    }>;
    update(id: string, updateRadiostationDto: UpdateRadiostationDto): Promise<RadioStation & UpdateRadiostationDto>;
    findByOwner(owner: string): Promise<RadioStation[]>;
    remove(id: string): Promise<RadioStation & {
        id: string;
    }>;
}
