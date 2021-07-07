import { OnApplicationBootstrap } from '@nestjs/common';
import { RadioStation } from '../schemas/radiostation.schema';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { RadiostationService } from '../services/radiostation.service';
import { DetectionService } from '../../detection/detection.service';
export declare class RadioStationListener implements OnApplicationBootstrap {
    private schedulerRegistry;
    private sonickeyService;
    private radiostationService;
    private detectionService;
    constructor(schedulerRegistry: SchedulerRegistry, sonickeyService: SonickeyService, radiostationService: RadiostationService, detectionService: DetectionService);
    onApplicationBootstrap(): Promise<void>;
    private readonly radioStationListenerLogger;
    private readonly streamingIntervalLogger;
    handleStartListeningEvent(radioStation: RadioStation): void;
    handleStopListeningEvent(radioStation: RadioStation): void;
    startListeningLikeAStreamAndUpdateTable(radioStation: RadioStation, outputPath: string): Promise<void>;
}
