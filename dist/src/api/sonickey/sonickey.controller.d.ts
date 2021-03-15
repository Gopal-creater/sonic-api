import { CreateSonicKeyDto } from './dtos/create-sonickey.dto';
import { UpdateSonicKeyDto } from './dtos/update-sonickey.dto';
import { SonicKeyDto } from './dtos/sonicKey.dto';
import { IUploadedFile } from './../../shared/interfaces/UploadedFile.interface';
import { KeygenService } from './../../shared/modules/keygen/keygen.service';
import { SonickeyService } from './sonickey.service';
import { SonicKey } from '../../schemas/sonickey.schema';
export declare class SonickeyController {
    private readonly sonicKeyService;
    private readonly keygenService;
    constructor(sonicKeyService: SonickeyService, keygenService: KeygenService);
    getAll(): Promise<any[]>;
    create(createSonicKeyDto: CreateSonicKeyDto, owner: string, req: any): Promise<SonicKey>;
    getOwnersKeys(ownerId: string): Promise<SonicKey[]>;
    getOne(sonickey: string): Promise<SonicKey>;
    encode(sonicKeyDto: SonicKeyDto, file: IUploadedFile, owner: string, req: any): Promise<SonicKey>;
    decode(file: IUploadedFile): Promise<any[]>;
    updateMeta(sonickey: string, updateSonicKeyDto: UpdateSonicKeyDto): Promise<SonicKey>;
    delete(sonickey: string): Promise<SonicKey>;
    createTable(): Promise<string>;
}
