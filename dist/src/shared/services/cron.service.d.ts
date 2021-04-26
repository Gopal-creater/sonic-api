import { SchedulerRegistry } from '@nestjs/schedule';
export declare class CronService {
    private schedulerRegistry;
    constructor(schedulerRegistry: SchedulerRegistry);
    private readonly logger;
    onceAfter0Seconds(): void;
    getCrons(): void;
    getCron(name: string): void;
    addCronJob(name: string, cronTime: string | Date): void;
    deleteCron(name: string): void;
    getIntervals(): void;
    getInterval(name: string): void;
    addInterval(name: string, milliseconds: number): void;
    deleteInterval(name: string): void;
    getTimeouts(): void;
    getTimeout(name: string): void;
    addTimeout(name: string, milliseconds: number): void;
    deleteTimeout(name: string): void;
    testFunc(name: string): Promise<unknown>;
}
