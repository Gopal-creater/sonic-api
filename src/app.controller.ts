import { HttpService } from '@nestjs/axios';
import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  // testing the guard.
  @Get()
  getHello(@Req() req): string {
    return this.appService.getHello();
  }

  // @Get('/get-insance-details')
  // getInstanceDetails() {
  //   return axios
  //     .get('http://169.254.169.254/latest/meta-data/')
  //     .then(res =>{
  //       console.log("res",res)
  //       return res.data
  //     });
  // }
}
