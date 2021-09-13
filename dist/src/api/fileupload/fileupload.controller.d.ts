import { FileuploadService } from './fileupload.service';
import { CreateFileuploadDto } from './dto/create-fileupload.dto';
import { UpdateFileuploadDto } from './dto/update-fileupload.dto';
export declare class FileuploadController {
    private readonly fileuploadService;
    constructor(fileuploadService: FileuploadService);
    create(createFileuploadDto: CreateFileuploadDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateFileuploadDto: UpdateFileuploadDto): string;
    remove(id: string): string;
}
