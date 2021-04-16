import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { Job } from '../../../schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateJobFileDto } from '../dto/update-job-file.dto';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { JSONUtils } from '../../../shared/utils';
import { QueryOptions } from '@aws/dynamodb-data-mapper';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { JobFile } from '../../../schemas/jobfile.schema';


@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) public readonly jobModel: Model<Job>,
    @InjectModel(JobFile.name) public  readonly jobFileModel: Model<JobFile>,
    public readonly keygenService: KeygenService,
  ) {}
  async create(createJobDto: CreateJobDto) {
    const{jobFiles,...job}=createJobDto
    const newJob = new this.jobModel(job);
    var createdJob = await newJob.save();
    const newJobFiles = jobFiles.map(jobFile => {
      const newJobFile = new this.jobFileModel({...jobFile,job:createdJob});
      return newJobFile;
    });
    const savedJobFiles = await this.jobFileModel.insertMany(
      newJobFiles,
    );
    
    createdJob.jobFiles.push(...savedJobFiles)
    const updatedCreatedJob = await this.jobModel.findByIdAndUpdate(createdJob._id,{jobFiles:createdJob.jobFiles},{new:true});
    await this.addReservedDetailsInLicence(createJobDto.license, [
      { jobId: createdJob.id, count: updatedCreatedJob.jobFiles.length },
    ]).catch(async err => {
      await this.jobModel.remove({_id:createdJob._id});
      await this.jobFileModel.remove({job:createdJob._id})
      throw new BadRequestException('Error adding reserved licence count');
    });
    return updatedCreatedJob
  }

  async findAll(queryDto: QueryDto = {}) {
    const { limit, offset, ...query } = queryDto;
        return this.jobModel
        .find(query || {})
        .skip(offset)
        .limit(limit)
        .exec();
    }

  async remove(id: string) {
    const job = await this.jobModel.findById(id);
    if(!job){
      throw new NotFoundException();
    }
    await this.removeReservedDetailsInLicence(job.license, job.id).catch(
      err => {
        throw new BadRequestException('Error removing reserved licence count ');
      },
    );
    await this.jobFileModel.remove({job:id})
    return  this.jobModel.findOneAndDelete({_id:job.id});
  }

  async makeCompleted(jobId: string) {
    const job = await this.jobModel.findById(jobId);
    if (job.isComplete) {
      return job;
    }
    const totalCompletedFiles = job.jobFiles.filter(
      file => file.isComplete == true,
    );
    const totalInCompletedFiles = job.jobFiles.filter(
      file => file.isComplete == false,
    );
    await this.removeReservedDetailsInLicence(job.license, job.id).catch(
      err => {
        throw new BadRequestException('Error removing reserved licence count ');
      },
    );
    await this.keygenService
      .decrementUsage(job.license, totalCompletedFiles.length)
      .catch(err => {
        throw new BadRequestException('Error decrementing licence usages');
      });

      const completedJob  = await this.jobModel.findOneAndUpdate({_id:job.id},{
        isComplete:true,
        completedAt: new Date()
      },{new:true})
      .catch(async err => {
        await this.keygenService.incrementUsage(
          job.license,
          totalCompletedFiles.length,
        );
        throw new BadRequestException('Error making job completed');
      });
    return completedJob as Job
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
}
