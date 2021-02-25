import { Injectable } from '@nestjs/common';
import * as appPackage from '../package.json';
@Injectable()
export class AppService {
  getHello(): string {
    return `
    <head>
      <style>
          a.button {
            -webkit-appearance: button;
            -moz-appearance: button;
            appearance: button;
        
            text-decoration: none;
            color: white;
            background-color:#32a840;
            padding:10px;
          }
          .fancy {
            -webkit-appearance: button;
            -moz-appearance: button;
            appearance: button;

            text-decoration: none;
            color: white;
            background-color:#32a840;
            padding:10px;
          }
      </style>
    </head>
    <div>
      <h3 style="text-decoration:underline;">Server Info</h3>
      <p>Hello Sonic Server Version: <span class="fancy">${appPackage.version}</span></p>
      <h3 style="text-decoration:underline;">Api Spec Info</h3>
      <a href="/swagger-api" class="button">GO TO API SPEC</a>
    </div>
    `;
  }
}
