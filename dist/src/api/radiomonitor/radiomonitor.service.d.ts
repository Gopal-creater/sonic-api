import { RadioMonitor } from './schemas/radiomonitor.schema';
import { Model } from 'mongoose';
import { RadiostationService } from '../radiostation/services/radiostation.service';
import { CreateRadioMonitorDto } from './dto/create-radiomonitor.dto';
import { LicensekeyService } from '../licensekey/services/licensekey.service';
export declare class RadioMonitorService {
    readonly radioMonitorModel: Model<RadioMonitor>;
    readonly radiostationService: RadiostationService;
    readonly licensekeyService: LicensekeyService;
    constructor(radioMonitorModel: Model<RadioMonitor>, radiostationService: RadiostationService, licensekeyService: LicensekeyService);
    subscribeRadioToMonitor(createRadioMonitorDto: CreateRadioMonitorDto, owner: string, license: string): Promise<RadioMonitor>;
    subscribeRadioToMonitorBulk(createRadioMonitorsDto: CreateRadioMonitorDto[], owner: string, license: string): Promise<{
        passedData: RadioMonitor[];
        failedData: {
            promiseError: any;
            data: CreateRadioMonitorDto;
        }[];
    }>;
    findByIdOrFail(id: string): Promise<RadioMonitor>;
    unsubscribeById(id: string): Promise<RadioMonitor>;
    unsubscribeBulk(ids: [string]): Promise<{
        passedData: RadioMonitor[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    stopListeningStream(id: string): Promise<RadioMonitor>;
    startListeningStream(id: string): Promise<RadioMonitor>;
    startListeningStreamBulk(ids: [string]): Promise<{
        passedData: RadioMonitor[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
    stopListeningStreamBulk(ids: [string]): Promise<{
        passedData: RadioMonitor[];
        failedData: {
            promiseError: any;
            data: string;
        }[];
    }>;
}
