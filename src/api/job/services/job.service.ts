import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateJobDto } from '../dto/create-job.dto';
import { Job } from '../schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobFile } from '../schemas/jobfile.schema';
import { MongoosePaginateJobDto } from '../dto/mongoosepaginate-job.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { LKReserve } from '../../licensekey/schemas/licensekey.schema';


@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) public readonly jobModel: Model<Job>,
    @InjectModel(JobFile.name) public  readonly jobFileModel: Model<JobFile>,
    public readonly licensekeyService: LicensekeyService,
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
  
    await this.licensekeyService.addReservedDetailsInLicence(createJobDto.license, [
      { jobId: createdJob.id, count: updatedCreatedJob.jobFiles.length },
    ]).catch(async err => {
      await this.jobModel.remove({_id:createdJob._id});
      await this.jobFileModel.remove({job:createdJob._id})
      throw new BadRequestException('Error adding reserved licence count');
    });
    return updatedCreatedJob
  }

  async findAll(queryDto: ParsedQueryDto):Promise<MongoosePaginateJobDto> {
    const { limit,skip,sort,page,filter,select, populate} = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;


    return await this.jobModel["paginate"](filter,paginateOptions)
    }

  async remove(id: string) {
    const job = await this.jobModel.findById(id);
    if(!job){
      throw new NotFoundException();
    }
    await this.licensekeyService.removeReservedDetailsInLicence(job.license, job.id).catch(
      err => {
        throw new BadRequestException('Error removing reserved licence count ',err.message || "");
      },
    );
    return  this.jobModel.findOneAndDelete({_id:job.id});
  }

  async makeCompleted(jobId: string) {
    const job = await this.jobModel.findById(jobId);
    if(!job){
      throw new NotFoundException()
    }
    if (job.isComplete) {
      return job;
    }
    // const totalCompletedFiles = job.jobFiles.filter(
    //   file => file.isComplete == true,
    // );
    // const totalInCompletedFiles = job.jobFiles.filter(
    //   file => file.isComplete == false,
    // );
    await this.licensekeyService.removeReservedDetailsInLicence(job.license, job.id).catch(
      err => {
        throw new BadRequestException('Error removing reserved licence count ');
      },
    );
 
      const completedJob  = await this.jobModel.findOneAndUpdate({_id:job.id},{
        isComplete:true,
        completedAt: new Date()
      },{new:true})
    return completedJob as Job
  }
}
