import { RadiostationService } from '../services/radiostation.service';
import { RadiostationSonicKeysService } from '../services/radiostation-sonickeys.service';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { RadioStationSonicKey } from '../schemas/radiostation-sonickey.schema';
export declare class RadiostationSonicKeysController {
    private readonly radiostationService;
    private readonly radiostationSonicKeysService;
    constructor(radiostationService: RadiostationService, radiostationSonicKeysService: RadiostationSonicKeysService);
    getOwnersRadioStationsSonicKeys(targetUser: string, queryDto: ParsedQueryDto): Promise<any>;
    retriveDashboardCountData(targetUser: string, queryDto: ParsedQueryDto): Promise<number>;
    retriveDashboardTopStationsData(targetUser: string, queryDto: ParsedQueryDto): Promise<{
        _id: string;
        totalKeysDetected: number;
        radioStation: import("../schemas/radiostation.schema").RadioStation;
    }[]>;
    retriveDashboardTopStationsWithTopSonciKeysData(targetUser: string, queryDto: ParsedQueryDto): Promise<RadioStationSonicKey[][]>;
    getCount(queryDto: ParsedQueryDto): Promise<number>;
    getOwnersKeys(radioStationId: string, queryDto: ParsedQueryDto): Promise<any>;
}
