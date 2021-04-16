import { ThirdpartyDetectionService } from './thirdparty-detection.service';
import { CreateThirdpartyDetectionDto } from './dto/create-thirdparty-detection.dto';
import { UpdateThirdpartyDetectionDto } from './dto/update-thirdparty-detection.dto';
import { QueryDto } from '../../shared/dtos/query.dto';
export declare class ThirdpartyDetectionController {
    private readonly thirdpartyDetectionService;
    constructor(thirdpartyDetectionService: ThirdpartyDetectionService);
    create(createThirdpartyDetectionDto: CreateThirdpartyDetectionDto): Promise<import("./schemas/thirdparty-detection.schema").ThirdpartyDetection>;
    findAll(queryDto: QueryDto): Promise<import("./schemas/thirdparty-detection.schema").ThirdpartyDetection[]>;
    findById(id: string): Promise<import("./schemas/thirdparty-detection.schema").ThirdpartyDetection>;
    update(id: string, updateThirdpartyDetectionDto: UpdateThirdpartyDetectionDto): Promise<import("./schemas/thirdparty-detection.schema").ThirdpartyDetection>;
    remove(id: string): Promise<import("./schemas/thirdparty-detection.schema").ThirdpartyDetection>;
}
