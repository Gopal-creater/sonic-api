import { RadioStation } from '../../../schemas/radiostation.schema';
import { SchedulerRegistry } from '@nestjs/schedule';
export declare class RadioStationListener {
    private schedulerRegistry;
    constructor(schedulerRegistry: SchedulerRegistry);
    private readonly logger;
    handleStartListeningEvent(event: RadioStation): void;
    handleStopListeningEvent(event: RadioStation): void;
}
