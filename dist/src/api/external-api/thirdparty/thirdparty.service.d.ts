import { CreateThirdpartyDto } from './dto/create-thirdparty.dto';
import { UpdateThirdpartyDto } from './dto/update-thirdparty.dto';
export declare class ThirdpartyService {
    create(createThirdpartyDto: CreateThirdpartyDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateThirdpartyDto: UpdateThirdpartyDto): string;
    remove(id: number): string;
}
