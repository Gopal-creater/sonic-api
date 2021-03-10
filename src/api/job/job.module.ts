import { Module } from '@nestjs/common';
import { JobService } from './services/job.service';
import { JobController } from './controllers/job.controller';
import { JobFileController } from './controllers/job-file.controller';
import { JobRepository } from '../../repositories/job.repository';
import { KeygenService } from '../../shared/modules/keygen/keygen.service';
import { SonickeyModule } from '../sonickey/sonickey.module';
import { JobFileService } from './services/job-file.service';
import { KeygenModule } from 'src/shared/modules/keygen/keygen.module';

@Module({
  imports: [SonickeyModule,KeygenModule],
controllers: [JobController,JobFileController],
  providers: [JobService,JobFileService, JobRepository, KeygenService],
})
export class JobModule {}
