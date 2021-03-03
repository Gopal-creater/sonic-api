import { CronService } from './shared/services/cron.service';
import { ExternalSonickeyModule } from './api/externalApi/externalsonickey/externalsonickey.module';
import { GlobalAwsModule } from './shared/modules/global-aws/global-aws.module';
import { Module } from '@nestjs/common';
import { MulterModule} from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';

import { ConfigModule } from '@nestjs/config';
import { SonickeyModule } from './api/sonickey/sonickey.module';
import { diskStorage } from 'multer';
import { UserModule } from './api/user/user.module';
import {appConfig} from './config';
import * as uniqid from 'uniqid';

import { ScheduleModule } from '@nestjs/schedule';
import { AppGateway } from './app.gateway';
import { RadiostationModule } from './api/radiostation/radiostation.module';
import { SonicKeyRepository } from './repositories/sonickey.repository';
@Module({
  imports: [
  ScheduleModule.forRoot(),
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true,envFilePath:'.env.arba' }),
    MulterModule.register({
      storage: diskStorage({
        destination: appConfig.MULTER_DEST,
        filename: (req, file, cb) => {
          const randomName = uniqid()
          cb(null, `${randomName}-${file.originalname}`)
        }
      }),
    }),
    GlobalAwsModule,
    UserModule,
    SonickeyModule,
    ExternalSonickeyModule,
    RadiostationModule,
  ],
  controllers: [AppController],
  providers: [AppService,SonicKeyRepository,CronService, AppGateway],
})
export class AppModule {
  constructor(){

  }
}
