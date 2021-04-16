import { CreateDetectionDto } from './dto/create-detection.dto';
import { UpdateDetectionDto } from './dto/update-detection.dto';
export declare class DetectionService {
    create(createDetectionDto: CreateDetectionDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateDetectionDto: UpdateDetectionDto): string;
    remove(id: string): string;
}
