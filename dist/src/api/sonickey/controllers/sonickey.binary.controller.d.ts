import { CreateSonicKeyFromBinaryDto } from '../dtos/create-sonickey.dto';
import { SonickeyService } from '../services/sonickey.service';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
export declare class SonickeyBinaryController {
    private readonly sonicKeyService;
    private readonly keygenService;
    constructor(sonicKeyService: SonickeyService, keygenService: KeygenService);
    createForJob(createSonicKeyDto: CreateSonicKeyFromBinaryDto, customer: string, apiKey: string, licenseKey: string): Promise<import("../schemas/sonickey.schema").SonicKey>;
}
