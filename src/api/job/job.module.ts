import { Module } from '@nestjs/common';
import { JobService } from './services/job.service';
import { JobController } from './controllers/job.controller';
import { JobFileController } from './controllers/job-file.controller';
import { SonickeyModule } from '../sonickey/sonickey.module';
import { JobFileService } from './services/job-file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema, JobSchemaName } from './schemas/job.schema';
import { JobFileSchema, JobFileSchemaName } from './schemas/jobfile.schema';
import { LicensekeyModule } from '../licensekey/licensekey.module';

@Module({
  imports: [
    SonickeyModule,
    LicensekeyModule,
    MongooseModule.forFeature([
      { name: JobSchemaName, schema: JobSchema },
      { name: JobFileSchemaName, schema: JobFileSchema },
    ]),
  ],
  controllers: [JobController, JobFileController],
  providers: [JobService, JobFileService],
})
export class JobModule {}
