import { RadioStationRepository } from '../../../repositories/radiostation.repository';
import { RadioStationSonicKeyRepository } from '../../../repositories/radiostationSonickey.repository';
import { RadioStationSonicKey } from '../../../schemas/radiostationSonickey.schema';
import { CreateRadiostationSonicKeyDto } from '../dto/radiostation-sonickey-dto/create-radiostation-sonickey.dto';
export declare class RadiostationSonicKeysService {
    readonly radioStationRepository: RadioStationRepository;
    readonly radioStationSonicKeysRepository: RadioStationSonicKeyRepository;
    constructor(radioStationRepository: RadioStationRepository, radioStationSonicKeysRepository: RadioStationSonicKeyRepository);
    create(createRadiostationSonicKeyDto: CreateRadiostationSonicKeyDto): Promise<RadioStationSonicKey & CreateRadiostationSonicKeyDto & {
        count: number;
    }>;
    findAllSonicKeysForRadioStation(radioStation: string): Promise<RadioStationSonicKey[]>;
    findOne(radioStation: string, sonicKey: string): Promise<RadioStationSonicKey & {
        radioStation: string;
        sonicKey: string;
    }>;
    incrementCount(radioStation: string, sonicKey: string): Promise<RadioStationSonicKey & {
        radioStation: string;
        sonicKey: string;
    } & {
        count: number;
    }>;
}
