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
import { JobSchema,JobSchemaName} from '../../schemas/job.schema';
import { JobFileSchema,JobFileSchemaName } from '../../schemas/jobfile.schema';

@Module({
  imports: [
    SonickeyModule,
    KeygenModule,
    MongooseModule.forFeature([
      { name: JobSchemaName, schema: JobSchema },
      { name: JobFileSchemaName, schema: JobFileSchema }
    ]),
  ],
  controllers: [JobController, JobFileController],
  providers: [JobService, JobFileService, JobRepository, KeygenService],
})
export class JobModule {}
