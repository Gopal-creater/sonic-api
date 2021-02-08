import { Injectable } from '@nestjs/common';
import * as appPackage from '../package.json'
@Injectable()
export class AppService {
  getHello(): string {
    return `Hello Sonic Server Version: ${appPackage.version}`;
  }
}
