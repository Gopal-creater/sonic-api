import { RadiostationService } from '../services/radiostation.service';
import { RadiostationSonicKeysService } from '../services/radiostation-sonickeys.service';
import { QueryDto } from '../../../shared/dtos/query.dto';
export declare class RadiostationSonicKeysController {
    private readonly radiostationService;
    private readonly radiostationSonicKeysService;
    constructor(radiostationService: RadiostationService, radiostationSonicKeysService: RadiostationSonicKeysService);
    findAll(queryDto: QueryDto): Promise<import("../dto/mongoosepaginate-radiostationsonickey.dto").MongoosePaginateRadioStationSonicKeyDto>;
    getCount(query: any): Promise<number>;
    getOwnersKeys(radioStationId: string, queryDto: QueryDto): Promise<import("../dto/mongoosepaginate-radiostationsonickey.dto").MongoosePaginateRadioStationSonicKeyDto>;
}
