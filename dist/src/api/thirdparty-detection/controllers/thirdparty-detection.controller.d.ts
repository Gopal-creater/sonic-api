import { ThirdpartyDetectionService } from '../thirdparty-detection.service';
import { UpdateThirdpartyDetectionDto } from '../dto/update-thirdparty-detection.dto';
import { QueryDto } from '../../../shared/dtos/query.dto';
export declare class ThirdpartyDetectionController {
    private readonly thirdpartyDetectionService;
    constructor(thirdpartyDetectionService: ThirdpartyDetectionService);
    findAll(queryDto: QueryDto): Promise<import("../dto/mongoosepaginate-thirdpartydetection.dto").MongoosePaginateThirdPartyDetectionDto>;
    getOwnersKeys(ownerId: string, queryDto: QueryDto): Promise<import("../dto/mongoosepaginate-thirdpartydetection.dto").MongoosePaginateThirdPartyDetectionDto>;
    getCount(query: any): Promise<number>;
    findById(id: string): Promise<import("../schemas/thirdparty-detection.schema").ThirdpartyDetection>;
    update(id: string, updateThirdpartyDetectionDto: UpdateThirdpartyDetectionDto): Promise<import("../schemas/thirdparty-detection.schema").ThirdpartyDetection>;
    remove(id: string): Promise<import("../schemas/thirdparty-detection.schema").ThirdpartyDetection>;
}