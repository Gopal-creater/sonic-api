import { Module } from '@nestjs/common';
import { JobService } from './services/job.service';
import { JobController } from './controllers/job.controller';
import { JobFileController } from './controllers/job-file.controller';
import { JobRepository } from '../../repositories/job.repository';
import { KeygenService } from '../../shared/modules/keygen/keygen.service';
import { SonickeyModule } from '../sonickey/sonickey.module';
import { JobFileService } from './services/job-file.service';
import { KeygenModule } from '../../shared/modules/keygen/keygen.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from '../../schemas/job.schema';
import { JobFile, JobFileSchema } from '../../schemas/jobfile.schema';

@Module({
  imports: [
    SonickeyModule,
    KeygenModule,
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: JobFile.name, schema: JobFileSchema }
    ]),
  ],
  controllers: [JobController, JobFileController],
  providers: [JobService, JobFileService, JobRepository, KeygenService],
})
export class JobModule {}
