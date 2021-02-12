import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';
export declare class StreamService {
    create(createStreamDto: CreateStreamDto): string;
    readStream(): void;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateStreamDto: UpdateStreamDto): string;
    remove(id: number): string;
}
