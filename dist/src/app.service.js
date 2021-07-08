"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const appPackage = require("../package.json");
let AppService = class AppService {
    getHello() {
        var _a;
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
      <p>Hello Sonic Server Version: <span class="fancy">${appPackage.version} ( ${((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) || "development"} )</span></p>
      <h3 style="text-decoration:underline;">Api Spec Info</h3>
      <a href="/swagger-api" class="button">GO TO API SPEC</a>
    </div>
    `;
    }
};
AppService = __decorate([
    common_1.Injectable()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map