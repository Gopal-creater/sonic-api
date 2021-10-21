"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const global_aws_module_1 = require("./shared/modules/global-aws/global-aws.module");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./api/auth/auth.module");
const config_1 = require("@nestjs/config");
const sonickey_module_1 = require("./api/sonickey/sonickey.module");
const multer_1 = require("multer");
const user_module_1 = require("./api/user/user.module");
const config_2 = require("./config");
const job_module_1 = require("./api/job/job.module");
const uniqid = require("uniqid");
const schedule_1 = require("@nestjs/schedule");
const app_gateway_1 = require("./app.gateway");
const radiostation_module_1 = require("./api/radiostation/radiostation.module");
const mongoose_1 = require("@nestjs/mongoose");
const thirdparty_detection_module_1 = require("./api/thirdparty-detection/thirdparty-detection.module");
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const event_emitter_1 = require("@nestjs/event-emitter");
const api_key_module_1 = require("./api/api-key/api-key.module");
const detection_module_1 = require("./api/detection/detection.module");
const licensekey_module_1 = require("./api/licensekey/licensekey.module");
const s3fileupload_module_1 = require("./api/s3fileupload/s3fileupload.module");
const radiomonitor_module_1 = require("./api/radiomonitor/radiomonitor.module");
const axios_1 = require("@nestjs/axios");
mongoosePaginate.paginate.options = {
    limit: 50,
};
console.log('Node_env', process.env.NODE_ENV);
let AppModule = class AppModule {
    constructor() { }
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            axios_1.HttpModule,
            auth_module_1.AuthModule,
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot(),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: process.env.NODE_ENV == 'production' ? '.env' : '.env.arba',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    connectionFactory: connection => {
                        connection === null || connection === void 0 ? void 0 : connection.plugin(mongoosePaginate);
                        connection === null || connection === void 0 ? void 0 : connection.plugin(aggregatePaginate);
                        connection === null || connection === void 0 ? void 0 : connection.plugin(require('mongoose-autopopulate'));
                        connection === null || connection === void 0 ? void 0 : connection.plugin(require('mongoose-lean-virtuals'));
                        return connection;
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            platform_express_1.MulterModule.register({
                storage: multer_1.diskStorage({
                    destination: config_2.appConfig.MULTER_DEST,
                    filename: (req, file, cb) => {
                        const randomName = uniqid();
                        cb(null, `${randomName}-${file.originalname}`);
                    },
                }),
            }),
            global_aws_module_1.GlobalAwsModule,
            user_module_1.UserModule,
            sonickey_module_1.SonickeyModule,
            job_module_1.JobModule,
            radiostation_module_1.RadiostationModule,
            thirdparty_detection_module_1.ThirdpartyDetectionModule,
            api_key_module_1.ApiKeyModule,
            detection_module_1.DetectionModule,
            licensekey_module_1.LicensekeyModule,
            s3fileupload_module_1.S3FileUploadModule,
            radiomonitor_module_1.RadiomonitorModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, app_gateway_1.AppGateway],
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map