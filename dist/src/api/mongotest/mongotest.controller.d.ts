import { MongotestService } from './mongotest.service';
import { CreateMongotestDto } from './dto/create-mongotest.dto';
import { UpdateMongotestDto } from './dto/update-mongotest.dto';
export declare class MongotestController {
    private readonly mongotestService;
    constructor(mongotestService: MongotestService);
    create(createMongotestDto: CreateMongotestDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateMongotestDto: UpdateMongotestDto): string;
    remove(id: string): string;
}
