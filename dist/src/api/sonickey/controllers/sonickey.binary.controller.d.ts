import { CreateSonicKeyFromBinaryDto } from '../dtos/create-sonickey.dto';
import { SonickeyService } from '../services/sonickey.service';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
export declare class SonickeyBinaryController {
    private readonly sonicKeyService;
    private readonly licensekeyService;
    constructor(sonicKeyService: SonickeyService, licensekeyService: LicensekeyService);
    createFormBinary(createSonicKeyDto: CreateSonicKeyFromBinaryDto, customer: string, apiKey: string, licenseKey: string): Promise<import("../schemas/sonickey.schema").SonicKey>;
}
