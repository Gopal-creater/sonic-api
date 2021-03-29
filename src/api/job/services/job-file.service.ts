import { Injectable, NotFoundException } from '@nestjs/common';
import { JobRepository } from '../../../repositories/job.repository';
import { UpdateJobFileDto,AddKeyAndUpdateJobFileDto } from '../dto/update-job-file.dto';
import { JobService } from './job.service';
import { SonickeyService } from '../../sonickey/sonickey.service';
import { SonicKey } from '../../../schemas/sonickey.schema';

@Injectable()
export class JobFileService {
  constructor(
    public readonly jobRepository: JobRepository,
    public readonly jobService: JobService,
    public readonly sonickeyService: SonickeyService,
  ) {}

  async updateJobFile(jobId: string,fileId:string, updateJobFileDto: UpdateJobFileDto) {
    const job = await this.jobService.findOne(jobId)
    if(!job){
      new NotFoundException()
    }
    const elementsIndex = job.jobDetails.findIndex(element => element.fileId == fileId )
    if(!elementsIndex || elementsIndex<0){
        return new NotFoundException()
      }
    job.jobDetails[elementsIndex]=Object.assign({...job.jobDetails[elementsIndex]},updateJobFileDto.fileDetail,{fileId:fileId})
    return  this.jobRepository.update(job);
  }

  async addKeyToDbAndUpdateJobFile(jobId: string,fileId:string, addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto) {
    const job = await this.jobService.findOne(jobId)
    if(!job){
      new NotFoundException()
    }
    console.log("job",job,fileId);
    
    const elementsIndex = job.jobDetails.findIndex(element => element.fileId == fileId )
    console.log("elementsIndex",elementsIndex);
    if(elementsIndex<0){
        return new NotFoundException()
      }
    //Add sonickey to db
    const createdSonicKey = await this.sonickeyService.createFromJob(addKeyAndUpdateJobFileDto.sonicKey) as SonicKey
    const updatedOldFile = Object.assign({...job.jobDetails[elementsIndex]},addKeyAndUpdateJobFileDto.fileDetail,{fileId:fileId})
    job.jobDetails[elementsIndex]=updatedOldFile
    const updatedJob = await this.jobRepository.update(job);
    return {
      createdSonicKey:createdSonicKey,
      fileDetail:updatedOldFile,
      updatedJob:updatedJob
    }
  }
}
