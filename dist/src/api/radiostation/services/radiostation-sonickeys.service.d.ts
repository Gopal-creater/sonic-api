import { RadioStationSonicKey } from '../../../schemas/radiostation-sonickey.schema';
import { CreateRadiostationSonicKeyDto } from '../dto/radiostation-sonickey-dto/create-radiostation-sonickey.dto';
import { Model } from 'mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { RadioStation } from '../../../schemas/radiostation.schema';
import { SonicKey } from '../../../schemas/sonickey.schema';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
export declare class RadiostationSonicKeysService {
    radioStationSonickeyModel: Model<RadioStationSonicKey>;
    radioStationModel: Model<RadioStation>;
    sonicKeyModel: Model<SonicKey>;
    private sonickeyService;
    constructor(radioStationSonickeyModel: Model<RadioStationSonicKey>, radioStationModel: Model<RadioStation>, sonicKeyModel: Model<SonicKey>, sonickeyService: SonickeyService);
    private readonly streamingLogger;
    create(createRadiostationSonicKeyDto: CreateRadiostationSonicKeyDto): Promise<RadioStationSonicKey>;
    findAll(queryDto?: QueryDto): Promise<RadioStationSonicKey[]>;
    findOne(radioStation: string, sonicKey: string): Promise<RadioStationSonicKey>;
    findById(id: string): Promise<RadioStationSonicKey>;
}
