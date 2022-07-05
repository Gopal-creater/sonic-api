import { Module, forwardRef } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { DetectionModule } from '../detection/detection.module';
import { SonickeyModule } from '../sonickey/sonickey.module';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { FileHandlerService } from 'src/shared/services/file-handler.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => AuthModule),
    DetectionModule,
    SonickeyModule
  ],
  controllers: [ReportController],
  providers: [ReportService,FileHandlerService],
})
export class ReportModule {}
