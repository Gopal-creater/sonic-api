import { Controller, Get, Req} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService) {}

  // testing the guard.
  @Get()
  getHello(@Req() req): string {
    return this.appService.getHello();
  }
}
