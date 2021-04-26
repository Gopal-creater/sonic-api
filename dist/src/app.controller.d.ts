import { AppService } from './app.service';
import { CronService } from './shared/services/cron.service';
export declare class AppController {
    private readonly appService;
    private readonly cronService;
    constructor(appService: AppService, cronService: CronService);
    getHello(req: any): string;
    add(name: string): string;
    remove(name: string): string;
}
