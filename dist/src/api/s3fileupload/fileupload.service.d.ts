import { CreateFileuploadDto } from './dto/create-fileupload.dto';
import { UpdateFileuploadDto } from './dto/update-fileupload.dto';
export declare class FileuploadService {
    create(createFileuploadDto: CreateFileuploadDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateFileuploadDto: UpdateFileuploadDto): string;
    remove(id: number): string;
}
