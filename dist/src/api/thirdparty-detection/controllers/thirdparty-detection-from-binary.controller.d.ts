import { ThirdpartyDetectionService } from '../thirdparty-detection.service';
import { CreateThirdpartyDetectionDto } from '../dto/create-thirdparty-detection.dto';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { DetectionService } from '../../detection/detection.service';
export declare class ThirdpartyDetectionFromBinaryController {
    private readonly thirdpartyDetectionService;
    private readonly sonickeyServive;
    private readonly detectionService;
    constructor(thirdpartyDetectionService: ThirdpartyDetectionService, sonickeyServive: SonickeyService, detectionService: DetectionService);
    create(createThirdpartyDetectionDto: CreateThirdpartyDetectionDto, customer: string, apiKey: string): Promise<import("../../detection/schemas/detection.schema").Detection>;
}
