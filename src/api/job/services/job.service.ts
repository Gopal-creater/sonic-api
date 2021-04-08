import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { JobRepository } from '../../../repositories/job.repository';
import { Job } from '../../../schemas/job.schema';
import { UpdateJobFileDto } from '../dto/update-job-file.dto';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { JSONUtils } from '../../../shared/utils';
import { QueryOptions } from '@aws/dynamodb-data-mapper';

@Injectable()
export class JobService {
  constructor(
    public readonly jobRepository: JobRepository,
    public readonly keygenService: KeygenService,
  ) {}
  async create(createJobDto: CreateJobDto) {
    const dataToSave = Object.assign(new Job(), createJobDto) as Job;

    const createdJob = await this.jobRepository.put(dataToSave);
    await this.addReservedDetailsInLicence(createJobDto.licenseId, [
      { jobId: createdJob.id, count: createJobDto.jobDetails.length },
    ]).catch(async err => {
      await this.jobRepository.delete(createdJob);
      throw new BadRequestException('Error adding reserved licence count');
    });
    return createdJob;
  }

  async findAll() {
    const items:Job[] =[];
    for await (const item of this.jobRepository.scan(Job)) {
      // individual items will be yielded as the scan is performed
      items.push(item);
    }
    return items;
  }

  findOne(id: string){
    return this.jobRepository.get(Object.assign(new Job(), { id: id }) as Job);
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const job = await this.findOne(id);
    return this.jobRepository.update(Object.assign(job, updateJobDto) as Job);
  }

  async updateJobDetailByFileId(
    id: string,
    fileId: string,
    updateJobFileDto: UpdateJobFileDto,
  ) {
    const job = await this.findOne(id);
    const oldFile = job.jobDetails.find(itm => itm.fileId == fileId)
    if (!oldFile) {
      return new NotFoundException();
    }
    const updatedFile = Object.assign(oldFile, updateJobFileDto, {
      fileId: fileId,
    });
    const index = job.jobDetails.findIndex(itm => itm.fileId == fileId)
    //Add updated
    job.jobDetails[index]=updatedFile
    return this.jobRepository.update(job);
  }

  async remove(id: string) {
    const job = await this.findOne(id);
    if(!job){
      return new NotFoundException();
    }
    await this.removeReservedDetailsInLicence(job.licenseId, job.id).catch(
      err => {
        throw new BadRequestException('Error removing reserved licence count ');
      },
    );
    return this.jobRepository.delete(job);
  }

  async makeCompleted(jobId: string) {
    const job = await this.findOne(jobId);
    if (job.isComplete) {
      return job;
    }
    const totalCompletedFiles = job.jobDetails.filter(
      file => file.isComplete == true,
    );
    const totalInCompletedFiles = job.jobDetails.filter(
      file => file.isComplete == false,
    );
    await this.removeReservedDetailsInLicence(job.licenseId, job.id).catch(
      err => {
        throw new BadRequestException('Error removing reserved licence count ');
      },
    );
    await this.keygenService
      .decrementUsage(job.licenseId, totalCompletedFiles.length)
      .catch(err => {
        throw new BadRequestException('Error decrementing licence usages');
      });
    const completedJob = await this.jobRepository
      .update(
        Object.assign(job, {
          isComplete: true,
          completedAt: new Date()
        }) as Job
      )
      .catch(async err => {
        await this.keygenService.incrementUsage(
          job.licenseId,
          totalCompletedFiles.length,
        );
        throw new BadRequestException('Error making job completed');
      });
    return completedJob;
  }

  async addReservedDetailsInLicence(
    licenseId: string,
    reserves: { jobId: string; count: number }[],
  ) {
    const { data, errors } = await this.keygenService.getLicenseById(licenseId);
    const oldReserves = JSONUtils.parse(data?.attributes?.metadata?.reserves,[])as {
      jobId: string;
      count: number;
    }[];
    const {
      data: updatedData,
      errors: errorsUpdate,
    } = await this.keygenService.updateLicense(licenseId, {
      metadata: {
        ...data?.attributes?.metadata,
        reserves: JSON.stringify([...oldReserves, ...reserves]),
      },
    });
    if (errorsUpdate) return Promise.reject(errorsUpdate);
    return updatedData;
  }
  async removeReservedDetailsInLicence(licenseId: string, jobId: string) {
    const { data, errors } = await this.keygenService.getLicenseById(licenseId);
    const oldReserves = JSONUtils.parse(data?.attributes?.metadata?.reserves,[])as {
      jobId: string;
      count: number;
    }[];
    const {
      data: updatedData,
      errors: errorsUpdate,
    } = await this.keygenService.updateLicense(licenseId, {
      metadata: {
        ...data?.attributes?.metadata,
        reserves: JSON.stringify(oldReserves?.filter(reser => reser.jobId !== jobId)),
      },
    });
    if (errorsUpdate) return Promise.reject(errorsUpdate);
    return updatedData;
  }

  async incrementReservedDetailsInLicenceBy(licenseId: string, jobId: string,count:number) {
    const { data, errors } = await this.keygenService.getLicenseById(licenseId);
    const oldReserves = JSONUtils.parse(data?.attributes?.metadata?.reserves,[])as {
      jobId: string;
      count: number;
    }[];
    const updatedReserves = oldReserves.map(reserve=>{
      if(reserve.jobId==jobId){
        reserve.count=reserve.count+count
      }
      return reserve
    })
    const {
      data: updatedData,
      errors: errorsUpdate,
    } = await this.keygenService.updateLicense(licenseId, {
      metadata: {
        ...data?.attributes?.metadata,
        reserves: JSON.stringify(updatedReserves),
      },
    });
    if (errorsUpdate) return Promise.reject(errorsUpdate);
    return updatedData;
  }

  async decrementReservedDetailsInLicenceBy(licenseId: string, jobId: string,count:number) {
    const { data, errors } = await this.keygenService.getLicenseById(licenseId);
    const oldReserves = JSONUtils.parse(data?.attributes?.metadata?.reserves,[])as {
      jobId: string;
      count: number;
    }[];
    const updatedReserves = oldReserves.map(reserve=>{
      if(reserve.jobId==jobId){
        reserve.count=reserve.count-count
      }
      return reserve
    })
    const {
      data: updatedData,
      errors: errorsUpdate,
    } = await this.keygenService.updateLicense(licenseId, {
      metadata: {
        ...data?.attributes?.metadata,
        reserves: JSON.stringify(updatedReserves),
      },
    });
    if (errorsUpdate) return Promise.reject(errorsUpdate);
    return updatedData;
  }

  async findByOwner(owner: string,queryOptions?:QueryOptions) {
    var items: Job[] = [];
    for await (const item of this.jobRepository.query(
      Job,
      { owner: owner},
      { indexName: 'ownerIndex',...queryOptions },
    )) {
      items.push(item);
    }
    return items;
  }
}
