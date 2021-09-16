import { RadiomonitorService } from './radiomonitor.service';
import { CreateRadiomonitorDto } from './dto/create-radiomonitor.dto';
import { UpdateRadiomonitorDto } from './dto/update-radiomonitor.dto';
export declare class RadioMonitorController {
    private readonly radiomonitorService;
    constructor(radiomonitorService: RadiomonitorService);
    create(createRadiomonitorDto: CreateRadiomonitorDto): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateRadiomonitorDto: UpdateRadiomonitorDto): any;
    remove(id: string): any;
}
