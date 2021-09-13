import { CreateSonicKeyFromJobDto } from '../dtos/create-sonickey.dto';
import { UpdateSonicKeyDto } from '../dtos/update-sonickey.dto';
import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { SonickeyService } from '../services/sonickey.service';
import { SonicKey } from '../schemas/sonickey.schema';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { DownloadDto } from '../dtos/download.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { Response } from 'express';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
export declare class SonickeyController {
    private readonly sonicKeyService;
    private readonly licensekeyService;
    private readonly fileHandlerService;
    constructor(sonicKeyService: SonickeyService, licensekeyService: LicensekeyService, fileHandlerService: FileHandlerService);
    getAll(parsedQueryDto: ParsedQueryDto): Promise<import("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto>;
    generateUniqueSonicKey(): Promise<{
        msg: string;
        result: import("aws-sdk/clients/s3").ManagedUpload.SendData;
    }>;
    fileDownloadTest(): Promise<string>;
    createForJob(createSonicKeyDto: CreateSonicKeyFromJobDto, owner: string, req: any): Promise<SonicKey>;
    getOwnersKeys(ownerId: string, parsedQueryDto: ParsedQueryDto): Promise<import("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto>;
    getKeysByJob(jobId: string, parsedQueryDto: ParsedQueryDto): Promise<import("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto>;
    getCount(queryDto: ParsedQueryDto): Promise<number>;
    getOne(sonickey: string): Promise<SonicKey>;
    encode(sonicKeyDto: SonicKeyDto, file: IUploadedFile, owner: string, req: any): Promise<SonicKey>;
    decode(file: IUploadedFile): Promise<any[]>;
    updateMeta(sonickey: string, updateSonicKeyDto: UpdateSonicKeyDto): Promise<SonicKey>;
    delete(sonickey: string): Promise<{
        ok?: number;
        n?: number;
    } & {
        deletedCount?: number;
    }>;
    downloadFile(downloadDto: DownloadDto, userId: string, response: Response): Promise<void>;
}
