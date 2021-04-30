import { RadioStationSonicKey } from '../schemas/radiostation-sonickey.schema';
import { CreateRadiostationSonicKeyDto } from '../dto/radiostation-sonickey-dto/create-radiostation-sonickey.dto';
import { Model } from 'mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { RadiostationService } from './radiostation.service';
export declare class RadiostationSonicKeysService {
    radioStationSonickeyModel: Model<RadioStationSonicKey>;
    radiostationService: RadiostationService;
    private sonickeyService;
    constructor(radioStationSonickeyModel: Model<RadioStationSonicKey>, radiostationService: RadiostationService, sonickeyService: SonickeyService);
    private readonly streamingLogger;
    create(createRadiostationSonicKeyDto: CreateRadiostationSonicKeyDto): Promise<RadioStationSonicKey>;
    findAll(queryDto?: QueryDto): Promise<RadioStationSonicKey[]>;
    findOne(radioStation: string, sonicKey: string): Promise<RadioStationSonicKey>;
    findById(id: string): Promise<RadioStationSonicKey>;
}
