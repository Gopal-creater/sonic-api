import { RadioMonitorService } from '../radiomonitor.service';
import { RadiostationService } from '../../radiostation/services/radiostation.service';
export declare class RadioMonitorController {
    private readonly radiomonitorService;
    private readonly radiostationService;
    constructor(radiomonitorService: RadioMonitorService, radiostationService: RadiostationService);
}
