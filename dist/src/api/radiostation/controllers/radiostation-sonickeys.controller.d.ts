import { RadiostationService } from '../services/radiostation.service';
import { RadiostationSonicKeysService } from '../services/radiostation-sonickeys.service';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
export declare class RadiostationSonicKeysController {
    private readonly radiostationService;
    private readonly radiostationSonicKeysService;
    constructor(radiostationService: RadiostationService, radiostationSonicKeysService: RadiostationSonicKeysService);
    findAll(queryDto: ParsedQueryDto): Promise<import("../dto/mongoosepaginate-radiostationsonickey.dto").MongoosePaginateRadioStationSonicKeyDto>;
    getCount(query: any): Promise<number>;
    getOwnersKeys(radioStationId: string, queryDto: ParsedQueryDto): Promise<import("../dto/mongoosepaginate-radiostationsonickey.dto").MongoosePaginateRadioStationSonicKeyDto>;
}
