import { ThirdpartyDetectionService } from '../thirdparty-detection.service';
import { CreateThirdpartyDetectionDto } from '../dto/create-thirdparty-detection.dto';
import { UpdateThirdpartyDetectionDto } from '../dto/update-thirdparty-detection.dto';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
export declare class ThirdpartyDetectionFromBinaryController {
    private readonly thirdpartyDetectionService;
    private readonly sonickeyServive;
    constructor(thirdpartyDetectionService: ThirdpartyDetectionService, sonickeyServive: SonickeyService);
    create(createThirdpartyDetectionDto: CreateThirdpartyDetectionDto, customer: string): Promise<import("../schemas/thirdparty-detection.schema").ThirdpartyDetection>;
    findAll(queryDto: QueryDto): Promise<import("../dto/mongoosepaginate-thirdpartydetection.dto").MongoosePaginateThirdPartyDetectionDto>;
    findById(id: string): Promise<import("../schemas/thirdparty-detection.schema").ThirdpartyDetection>;
    update(id: string, updateThirdpartyDetectionDto: UpdateThirdpartyDetectionDto): Promise<import("../schemas/thirdparty-detection.schema").ThirdpartyDetection>;
    remove(id: string): Promise<import("../schemas/thirdparty-detection.schema").ThirdpartyDetection>;
}