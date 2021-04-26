import { Controller, Get, Req, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CronService } from './shared/services/cron.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly cronService:CronService ) {}

  // testing the guard.
  @Get()
  getHello(@Req() req): string {
    return this.appService.getHello();
  }

  @Get('/add/:name')
  add(@Param('name') name:string) {
    this.cronService.addTimeout(name,0)
    return "added"
  }

  @Get('/remove/:name')
  remove(@Param('name') name:string): string {
    this.cronService.deleteTimeout(name)
    return "removed"
  }
}
