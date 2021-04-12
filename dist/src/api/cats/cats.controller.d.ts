import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './schemas/cat.schema';
import { CreateRadiostationDto } from '../radiostation/dto/create-radiostation.dto';
export declare class CatsController {
    private readonly catsService;
    constructor(catsService: CatsService);
    create(createCatDto: CreateCatDto): Promise<void>;
    createRS(createRadiostationDto: CreateRadiostationDto): Promise<import("../../schemas/radiostation.schema").RadioStation>;
    findAll(): Promise<Cat[]>;
}
