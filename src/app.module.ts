import { GlobalAwsModule } from './shared/modules/global-aws/global-aws.module';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { MailModule } from './api/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SonickeyModule } from './api/sonickey/sonickey.module';
import { diskStorage} from 'multer';
import { UserModule } from './api/user/user.module';
import { appConfig } from './config';
import appConfiguration from './config/app.config';
import { JobModule } from './api/job/job.module';
import * as uniqid from 'uniqid';

import { ScheduleModule } from '@nestjs/schedule';
import { AppGateway } from './app.gateway';
import { RadiostationModule } from './api/radiostation/radiostation.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ThirdpartyDetectionModule } from './api/thirdparty-detection/thirdparty-detection.module';
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ApiKeyModule } from './api/api-key/api-key.module';
import { DetectionModule } from './api/detection/detection.module';
import { LicensekeyModule } from './api/licensekey/licensekey.module';
import { S3FileUploadModule } from './api/s3fileupload/s3fileupload.module';
import { RadiomonitorModule } from './api/radiomonitor/radiomonitor.module';
import { HttpModule } from '@nestjs/axios';
import { Ec2InstanceService } from './shared/services/ec2instance.service';
import { PaymentModule } from './api/payment/payment.module';
import { CompanyModule } from './api/company/company.module';
import { GroupModule } from './api/group/group.module';
import { AppVersionModule } from './api/appversions/appversions.module';
import { NestModule, MiddlewareConsumer,RequestMethod } from '@nestjs/common';
import { PlanModule } from './api/plan/plan.module';
import { BullModule } from '@nestjs/bull';
import { QueuejobModule } from './queuejob/queuejob.module';
import { ChargebeeModule } from './api/chargebee/chargebee.module';
import { PartnerModule } from './api/partner/partner.module';
import { TrackModule } from './api/track/track.module';
import testConfig from './config/test.config';

mongoosePaginate.paginate.options = {
  limit: 50,
};
console.log('Node_env', process.env.NODE_ENV);
var connectionNo = 0;
@Module({
  imports: [
    HttpModule,
    AuthModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache:true,
      envFilePath: [
        'override.env',
        process.env.NODE_ENV == 'production' ? 'production.env' : 'staging.env',
      ],
      load: [appConfiguration,testConfig],
    }),
    MailModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectionFactory: connection => {
          connection?.plugin(mongoosePaginate);
          connection?.plugin(aggregatePaginate);
          connection?.plugin(require('mongoose-autopopulate'));
          connection?.plugin(require('mongoose-lean-virtuals'));
          connection.on('connected', () => {
            connectionNo += 1;
            console.log('DB connected, current connectionNo', connectionNo);
          });
          connection.on('disconnected', () => {
            connectionNo -= 1;
            console.log('DB disconnected, current connectionNo', connectionNo);
          });
          connection.on('error', error => {
            console.log('DB connection failed! for error: ', error);
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: appConfig.MULTER_DEST,
        filename: (req, file, cb) => {
          const randomName = uniqid();
          cb(null, `${randomName}-${file.originalname}`);
        },
      }),
    }),
    GlobalAwsModule,
    UserModule,
    SonickeyModule,
    JobModule,
    RadiostationModule,
    ThirdpartyDetectionModule,
    ApiKeyModule,
    DetectionModule,
    LicensekeyModule,
    S3FileUploadModule,
    RadiomonitorModule,
    PaymentModule,
    CompanyModule,
    GroupModule,
    AppVersionModule,
    PlanModule,
    QueuejobModule,
    ChargebeeModule,
    PartnerModule,
    TrackModule
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, Ec2InstanceService],
})
export class AppModule {

}
