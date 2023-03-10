import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  UpdateJobFileDto,
  AddKeyAndUpdateJobFileDto,
} from '../dto/update-job-file.dto';
import { JobService } from './job.service';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { SonicKey } from '../../sonickey/schemas/sonickey.schema';
import { JobFile } from '../schemas/jobfile.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongoosePaginateJobFileDto } from '../dto/mongoosepaginate-jobfile.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';

@Injectable()
export class JobFileService {
  constructor(
    @InjectModel(JobFile.name) public jobFileModel: Model<JobFile>,
    public readonly jobService: JobService,
    public readonly sonickeyService: SonickeyService,
    public readonly licensekeyService: LicensekeyService,
  ) {}

  async findAll(queryDto: ParsedQueryDto): Promise<MongoosePaginateJobFileDto> {
    const { limit, skip, sort, page, filter, select, populate } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;

    return await this.jobFileModel['paginate'](filter, paginateOptions);
    // return this.jobFileModel
    // .find(query || {})
    // .skip(_offset)
    // .limit(_limit)
    // .sort(sort)
    // .exec();
  }

  async addKeyToDbAndUpdateJobFile(
    jobId: string,
    fileId: string,
    addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto,
  ) {
    const job = await this.jobService.jobModel.findById(jobId);
    const jobFile = await this.jobService.jobFileModel.findOne({
      _id: fileId,
      job: job,
    });

    if (!jobFile) {
      throw new NotFoundException();
    }
    //Add sonickey to db if not present.
    var createdSonicKey = await this.sonickeyService.findBySonicKey(
      addKeyAndUpdateJobFileDto.sonicKeyDetail.sonicKey,
    );
    if (!createdSonicKey) {
      createdSonicKey = (await this.sonickeyService.createFromJob(
        addKeyAndUpdateJobFileDto.sonicKeyDetail,
      )) as SonicKey;
    }
    const updatedJobFile = await this.jobService.jobFileModel.findOneAndUpdate(
      { _id: fileId },
      {
        ...addKeyAndUpdateJobFileDto.jobFile,
        sonicKey: createdSonicKey.sonicKey,
      },
      { new: true },
    );
    // Increment Uses and remove reserved from license if encode is completed
    if (jobFile.isComplete==false &&  updatedJobFile.isComplete==true) {
      try {
        await this.licensekeyService.incrementUses(job.license, 'encode', 1);
        await this.licensekeyService.decrementReservedDetailsInLicenceBy(
          job.license,
          job._id,
          1,
        );
      } catch (error) {
        console.log('Error while increment uses or decrement Reserved', error);
        // Roll back
        await this.jobService.jobFileModel.findOneAndUpdate(
          { _id: fileId },
          jobFile,
        );
        throw new UnprocessableEntityException(
          'Error while increment uses or decrement reserved',
        );
      }
    }
    return {
      createdSonicKey: createdSonicKey,
      updatedJobFile: updatedJobFile,
    };
  }


  async updateJobFile(
    fileId: string,
    updateJobFileDto: UpdateJobFileDto,
  ) {
    const jobFile = await this.jobService.jobFileModel.findOne({
      _id: fileId
    }).populate('job').exec();

    if (!jobFile) {
      throw new NotFoundException();
    }
    const updatedJobFile = await this.jobService.jobFileModel.findOneAndUpdate(
      { _id: fileId },
      updateJobFileDto,
      { new: true },
    );
    // Increment Uses and remove reserved from license if encode is completed
    if (jobFile.isComplete==false &&  updatedJobFile.isComplete==true) {
      try {
        await this.licensekeyService.incrementUses(jobFile?.job?.license, 'encode', 1);
        await this.licensekeyService.decrementReservedDetailsInLicenceBy(
          jobFile?.job?.license,
          jobFile?.job?._id,
          1,
        );
      } catch (error) {
        console.log('Error while increment uses or decrement Reserved', error);
        // Roll back
        await this.jobService.jobFileModel.findOneAndUpdate(
          { _id: fileId },
          jobFile,
        );
        throw new UnprocessableEntityException(
          'Error while increment uses or decrement reserved',
        );
      }
    }
    return updatedJobFile
  }
}
