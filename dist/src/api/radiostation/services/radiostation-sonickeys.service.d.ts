import { RadioStationSonicKey } from '../../../schemas/radiostation-sonickey.schema';
import { CreateRadiostationSonicKeyDto } from '../dto/radiostation-sonickey-dto/create-radiostation-sonickey.dto';
import { Model } from 'mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
export declare class RadiostationSonicKeysService {
    radioStationSonickeyModel: Model<RadioStationSonicKey>;
    constructor(radioStationSonickeyModel: Model<RadioStationSonicKey>);
    create(createRadiostationSonicKeyDto: CreateRadiostationSonicKeyDto): Promise<RadioStationSonicKey>;
    findAll(queryDto?: QueryDto): Promise<RadioStationSonicKey[]>;
    findOne(radioStation: string, sonicKey: string): Promise<RadioStationSonicKey>;
    findById(id: string): Promise<RadioStationSonicKey>;
    incrementCount(radioStation: string, sonicKey: string): Promise<any>;
}
