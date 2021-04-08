import { RadiostationService } from '../services/radiostation.service';
import { RadiostationSonicKeysService } from '../services/radiostation-sonickeys.service';
export declare class RadiostationSonicKeysController {
    private readonly radiostationService;
    private readonly radiostationSonicKeysService;
    constructor(radiostationService: RadiostationService, radiostationSonicKeysService: RadiostationSonicKeysService);
    findAllSonicKeys(radiostationId: string): Promise<import("../../../schemas/radiostationSonickey.schema").RadioStationSonicKey[]>;
    createTable(): Promise<string>;
}
