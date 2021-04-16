import { ThirdpartyService } from './thirdparty.service';
import { CreateThirdpartyDto } from './dto/create-thirdparty.dto';
import { UpdateThirdpartyDto } from './dto/update-thirdparty.dto';
export declare class ThirdpartyController {
    private readonly thirdpartyService;
    constructor(thirdpartyService: ThirdpartyService);
    create(createThirdpartyDto: CreateThirdpartyDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateThirdpartyDto: UpdateThirdpartyDto): string;
    remove(id: string): string;
}
