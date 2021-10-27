import { HttpService } from '@nestjs/axios';
import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import { Ec2InstanceService } from './shared/services/ec2instance.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
    private readonly ec2InstanceService: Ec2InstanceService,
  ) {}

  // testing the guard.
  @Get()
  getHello(@Req() req): string {
    return this.appService.getHello();
  }

  @Get('/get-insance-details')
  getInstanceDetails() {
    return this.ec2InstanceService.getInstanceDetails()
  }
}
