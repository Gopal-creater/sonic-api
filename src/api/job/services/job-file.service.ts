import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JobRepository } from '../../../repositories/job.repository';
import {
  UpdateJobFileDto,
  AddKeyAndUpdateJobFileDto,
} from '../dto/update-job-file.dto';
import { JobService } from './job.service';
import { SonickeyService } from '../../sonickey/sonickey.service';
import { SonicKey } from '../../../schemas/sonickey.schema';
import { v4 as uuidv4 } from 'uuid';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { AddFilesDto } from '../dto/add-files.dto';

@Injectable()
export class JobFileService {
  constructor(
    public readonly jobRepository: JobRepository,
    public readonly jobService: JobService,
    public readonly keygenService: KeygenService,
    public readonly sonickeyService: SonickeyService,
  ) {}

  async updateJobFile(
    jobId: string,
    fileId: string,
    updateJobFileDto: UpdateJobFileDto,
  ) {
    const job = await this.jobService.findOne(jobId);
    if (!job) {
      throw new NotFoundException();
    }

    const elementsIndex = job.jobDetails.findIndex(
      element => element.fileId == fileId,
    );
    if (elementsIndex < 0) {
      throw new NotFoundException();
    }

    const updatedOldFile = Object.assign(
      { ...job.jobDetails[elementsIndex] },
      updateJobFileDto.fileDetail,
      { fileId: fileId },
    );
    job.jobDetails[elementsIndex] = updatedOldFile;
    const updatedJob = await this.jobRepository.update(job);
    return {
      fileDetail: updatedOldFile,
      updatedJob: updatedJob,
    };
  }

  async addKeyToDbAndUpdateJobFile(
    jobId: string,
    fileId: string,
    addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto,
  ) {
    const job = await this.jobService.findOne(jobId);
    if (!job) {
      throw new NotFoundException();
    }

    const elementsIndex = job.jobDetails.findIndex(
      element => element.fileId == fileId,
    );
    if (elementsIndex < 0) {
      throw new NotFoundException();
    }
    //Add sonickey to db if not present.
    var createdSonicKey = await this.sonickeyService.findBySonicKey(
      addKeyAndUpdateJobFileDto.sonicKeyDetail.sonicKey,
    );
    // if (!createdSonicKey) {
    //   createdSonicKey = (await this.sonickeyService.createFromJob(
    //     addKeyAndUpdateJobFileDto.sonicKeyDetail,
    //   )) as SonicKey;
    // }
    const updatedOldFile = Object.assign(
      { ...job.jobDetails[elementsIndex] },
      addKeyAndUpdateJobFileDto.fileDetail,
      { fileId: fileId },
    );
    job.jobDetails[elementsIndex] = updatedOldFile;
    const updatedJob = await this.jobRepository.update(job);
    return {
      createdSonicKey: createdSonicKey,
      fileDetail: updatedOldFile,
      updatedJob: updatedJob,
    };
  }

  async addFilesToJob(jobId: string, addFilesDto: AddFilesDto) {
    const job = await this.jobService.findOne(jobId);
    if (!job) {
      throw new NotFoundException();
    }
    addFilesDto.jobFiles = addFilesDto.jobFiles.map(job => {
      job['fileId'] = uuidv4();
      job['isComplete'] = false;
      job['sonicKey'] = this.sonickeyService.generateUniqueSonicKey();
      return job;
    });
    job.jobDetails = [...job.jobDetails, ...addFilesDto.jobFiles];
    await this.jobService.incrementReservedDetailsInLicenceBy(
      job.licenseId,
      job.id,
      addFilesDto.jobFiles.length,
    );
    const updatedJob = await this.jobRepository.update(job);
    return updatedJob;
  }

  async deleteFileFromJob(jobId: string, fileId: string) {
    var job = await this.jobService.findOne(jobId);
    if (!job) {
      throw new NotFoundException();
    }
    job.jobDetails = job.jobDetails.filter(file => file.fileId !== fileId);
    await this.jobService.decrementReservedDetailsInLicenceBy(
      job.licenseId,
      job.id,
      1,
    );
    const updatedJob = await this.jobRepository.update(job);
    return updatedJob;
  }
}
