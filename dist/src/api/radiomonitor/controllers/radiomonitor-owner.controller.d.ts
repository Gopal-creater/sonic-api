import { RadioMonitorService } from '../radiomonitor.service';
import { CreateRadioMonitorDto } from '../dto/create-radiomonitor.dto';
import { RadiostationService } from '../../radiostation/services/radiostation.service';
import { BulkByIdsDto } from '../../../shared/dtos/bulk.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
export declare class RadioMonitorOwnerController {
    private readonly radiomonitorService;
    private readonly radiostationService;
    constructor(radiomonitorService: RadioMonitorService, radiostationService: RadiostationService);
    subscribe(createRadiomonitorDto: CreateRadioMonitorDto, owner: string, license: string): Promise<import("../schemas/radiomonitor.schema").RadioMonitor>;
    subscribeBulk(createRadiomonitorsDto: CreateRadioMonitorDto[], owner: string, license: string): Promise<{
        passedData: import("../schemas/radiomonitor.schema").RadioMonitor[];
        failedData: {
            promiseError: any;
            data: CreateRadioMonitorDto;
        }[];
    }>;
    stopListeningStream(id: string): Promise<import("../schemas/radiomonitor.schema").RadioMonitor>;
    stopListeningStreamBulk(bulkDto: BulkByIdsDto): Promise<{
        passedData: import("../schemas/radiomonitor.schema").RadioMonitor[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    startListeningStream(id: string): Promise<import("../schemas/radiomonitor.schema").RadioMonitor>;
    startListeningStreamBulk(bulkDto: BulkByIdsDto): Promise<{
        passedData: import("../schemas/radiomonitor.schema").RadioMonitor[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    getSubscriberCount(owner: string, ownerId: string, queryDto: ParsedQueryDto): Promise<number>;
    unsubscribe(id: string): Promise<import("../schemas/radiomonitor.schema").RadioMonitor>;
    unsubscribeBulk(bulkDto: BulkByIdsDto): Promise<{
        passedData: import("../schemas/radiomonitor.schema").RadioMonitor[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
}
