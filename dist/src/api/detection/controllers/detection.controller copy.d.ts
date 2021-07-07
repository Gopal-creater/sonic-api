import { DetectionService } from '../detection.service';
import { CreateDetectionFromBinaryDto, CreateDetectionFromHardwareDto } from '../dto/create-detection.dto';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
export declare class DetectionController {
    private readonly detectionService;
    private readonly sonickeyServive;
    constructor(detectionService: DetectionService, sonickeyServive: SonickeyService);
    findAll(queryDto?: ParsedQueryDto): Promise<import("../dto/mongoosepaginate-radiostationsonickey.dto").MongoosePaginateDeectionDto>;
    createFromBinary(createDetectionFromBinaryDto: CreateDetectionFromBinaryDto, customer: string, apiKey: string): Promise<import("../schemas/detection.schema").Detection>;
    createFromHardware(createDetectionFromHardwareDto: CreateDetectionFromHardwareDto, customer: string, apiKey: string): Promise<import("../schemas/detection.schema").Detection>;
    getCount(queryDto: ParsedQueryDto): Promise<number>;
}
