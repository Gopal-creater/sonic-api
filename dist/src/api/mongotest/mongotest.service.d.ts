import { CreateMongotestDto } from './dto/create-mongotest.dto';
import { UpdateMongotestDto } from './dto/update-mongotest.dto';
export declare class MongotestService {
    create(createMongotestDto: CreateMongotestDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateMongotestDto: UpdateMongotestDto): string;
    remove(id: number): string;
}
