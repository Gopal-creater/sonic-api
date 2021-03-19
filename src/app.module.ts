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

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true,envFilePath:'.env' }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(){

  }
}
