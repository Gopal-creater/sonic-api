import { ExternalSonickeyModule } from './api/external-api/externalsonickey/externalsonickey.module';
import { GlobalAwsModule } from './shared/modules/global-aws/global-aws.module';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { SonickeyModule } from './api/sonickey/sonickey.module';
import { diskStorage } from 'multer';
import { UserModule } from './api/user/user.module';
import { appConfig } from './config';
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
mongoosePaginate.paginate.options = {
  limit: 50,
};
console.log("Node_env",process.env.NODE_ENV);


@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.arba'}),
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false,
        connectionFactory: (connection) => {
          connection?.plugin(mongoosePaginate);
          connection?.plugin(aggregatePaginate);
          connection?.plugin(require('mongoose-autopopulate'))
          connection?.plugin(require('mongoose-lean-virtuals'))
          return connection;
        }
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
    ExternalSonickeyModule,
    JobModule,
    RadiostationModule,
    ThirdpartyDetectionModule,
    ApiKeyModule
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {
  constructor() {}
}
