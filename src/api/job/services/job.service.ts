import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { JobRepository } from '../../../repositories/job.repository';
import { Job } from '../../../schemas/job.schema';
import { UpdateJobFileDto } from '../dto/update-job-file.dto';

@Injectable()
export class JobService {
  constructor(
    public readonly jobRepository: JobRepository,
  ) {}
  create(createJobDto: CreateJobDto) {
    return this.jobRepository.put(createJobDto)
  }

  async findAll() {
    const items = [];
    for await (const item of this.jobRepository.scan(Job)) {
      // individual items will be yielded as the scan is performed
      items.push(item);
    }
    return items;
  }

  findOne(id: string) {
    return this.jobRepository.get(Object.assign(new Job, {id: id}))
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const job = await this.findOne(id)
    return  this.jobRepository.update(Object.assign(job,updateJobDto));
  }

  async updateJobDetailByFileId(id: string,fileId:string, updateJobFileDto: UpdateJobFileDto) {
    const job = await this.findOne(id)
    const oldFile = job.jobDetails.find(itm=>itm.fileId==fileId)
    if(!oldFile){
      return new NotFoundException()
    }
    const updatedFile = Object.assign(oldFile,updateJobFileDto,{fileId:fileId})
    //Add updated
    return  this.jobRepository.update(job);
  }

  remove(id: string) {
    return this.jobRepository.delete(Object.assign(new Job, {id: id}))
  }

  async makeCompleted(id:string){
    const job = await this.findOne(id)
    return  this.jobRepository.update(Object.assign(job,{isComplete:true,completedAt:new Date()}));
  }

  async findByOwner(owner:string){
    var items: Job[] = [];
    for await (const item of this.jobRepository.query(
      Job,
      { owner: owner },
      { indexName: 'ownerIndex' },
    )) {
      items.push(item);
    }
    return items;
  }
}
