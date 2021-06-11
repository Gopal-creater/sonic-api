import { RadioStationSonicKey } from '../schemas/radiostation-sonickey.schema';
import { CreateRadiostationSonicKeyDto } from '../dto/radiostation-sonickey-dto/create-radiostation-sonickey.dto';
import { Model } from 'mongoose';
import { RadioStation } from '../schemas/radiostation.schema';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { RadiostationService } from './radiostation.service';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
export declare class RadiostationSonicKeysService {
    radioStationSonickeyModel: Model<RadioStationSonicKey>;
    radiostationService: RadiostationService;
    private sonickeyService;
    constructor(radioStationSonickeyModel: Model<RadioStationSonicKey>, radiostationService: RadiostationService, sonickeyService: SonickeyService);
    private readonly streamingLogger;
    create(createRadiostationSonicKeyDto: CreateRadiostationSonicKeyDto): Promise<RadioStationSonicKey>;
    createOrUpdate(createRadiostationSonicKeyDto: CreateRadiostationSonicKeyDto): Promise<RadioStationSonicKey>;
    findAll(queryDto: ParsedQueryDto): Promise<any>;
    findTopRadioStations(filter: object, topLimit: number): Promise<{
        _id: string;
        totalKeysDetected: number;
        radioStation: RadioStation;
    }[]>;
    findOne(radioStation: string, sonicKey: string): Promise<RadioStationSonicKey>;
    findById(id: string): Promise<RadioStationSonicKey>;
}
