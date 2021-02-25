import { Injectable, NotFoundException } from '@nestjs/common';
import { JobRepository } from '../../../repositories/job.repository';
import { UpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobService } from './job.service';

@Injectable()
export class JobFileService {
  constructor(
    public readonly jobRepository: JobRepository,
    public readonly jobService: JobService,
  ) {}

  async update(jobId: string,fileId:string, updateJobFileDto: UpdateJobFileDto) {
    const job = await this.jobService.findOne(jobId)
    const elementsIndex = job.jobDetails.findIndex(element => element.fileId == fileId )
    if(!elementsIndex){
        return new NotFoundException()
      }
    job.jobDetails[elementsIndex]=Object.assign({...job.jobDetails[elementsIndex]},updateJobFileDto,{fileId:fileId})
    return  this.jobRepository.update(job);
  }
}
