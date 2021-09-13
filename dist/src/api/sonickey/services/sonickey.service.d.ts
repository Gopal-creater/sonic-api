import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { FileOperationService } from '../../../shared/services/file-operation.service';
import { SonicKey } from '../schemas/sonickey.schema';
import * as mm from 'music-metadata';
import { CreateSonicKeyFromJobDto } from '../dtos/create-sonickey.dto';
import { Model } from 'mongoose';
import { MongoosePaginateSonicKeyDto } from '../dtos/mongoosepaginate-sonickey.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { S3FileUploadService } from '../../s3fileupload/s3fileupload.service';
export declare class SonickeyService {
    sonicKeyModel: Model<SonicKey>;
    private readonly fileOperationService;
    private readonly fileHandlerService;
    private readonly s3FileUploadService;
    constructor(sonicKeyModel: Model<SonicKey>, fileOperationService: FileOperationService, fileHandlerService: FileHandlerService, s3FileUploadService: S3FileUploadService);
    generateUniqueSonicKey(): string;
    testUploadFromPath(): Promise<{
        msg: string;
        result: import("aws-sdk/clients/s3").ManagedUpload.SendData;
    }>;
    testDownloadFile(): Promise<string>;
    createFromJob(createSonicKeyDto: CreateSonicKeyFromJobDto): Promise<SonicKey>;
    getAll(queryDto: ParsedQueryDto): Promise<MongoosePaginateSonicKeyDto>;
    encode(file: IUploadedFile, encodingStrength?: number): Promise<{
        downloadFileUrl: string;
        outFilePath: string;
        sonicKey: string;
    }>;
    encodeAndUploadToS3(file: IUploadedFile, user: string, encodingStrength?: number): Promise<{
        downloadFileUrl: string;
        s3UploadResult: import("aws-sdk/clients/s3").ManagedUpload.SendData;
        sonicKey: string;
    }>;
    decode(file: IUploadedFile): Promise<unknown>;
    decodeAllKeys(file: IUploadedFile): Promise<{
        sonicKeys: string[];
    }>;
    exractMusicMetaFromFile(filePath: string): Promise<mm.IAudioMetadata>;
    autoPopulateSonicContentWithMusicMetaForFile(file: IUploadedFile, sonicKeyDto?: SonicKeyDto): Promise<SonicKeyDto>;
    findBySonicKey(sonicKey: string): Promise<SonicKey>;
    findBySonicKeyOrFail(sonicKey: string): Promise<SonicKey>;
}
