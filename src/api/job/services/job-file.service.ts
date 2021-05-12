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
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { JobFile } from '../schemas/jobfile.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongoosePaginateJobFileDto } from '../dto/mongoosepaginate-jobfile.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';

@Injectable()
export class JobFileService {
  constructor(
    @InjectModel(JobFile.name) public jobFileModel: Model<JobFile>,
    public readonly jobService: JobService,
    public readonly keygenService: KeygenService,
    public readonly sonickeyService: SonickeyService,
  ) {}

  async findAll(queryDto: ParsedQueryDto):Promise<MongoosePaginateJobFileDto> {
    const { limit,skip,sort,page,filter,select, populate} = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;


    return await this.jobFileModel["paginate"](filter,paginateOptions)
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
    const job = await this.jobService.jobModel.findById(jobId)
    const jobFile = await this.jobService.jobFileModel.findOne({_id:fileId,job:job});
    console.log("jobFile",jobFile);
    
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
    const updatedJobFile = await this.jobService.jobFileModel.findOneAndUpdate({_id:fileId},{...addKeyAndUpdateJobFileDto.jobFile,sonicKey:createdSonicKey.sonicKey},{new:true});
    return {
      createdSonicKey: createdSonicKey,
      updatedJobFile: updatedJobFile,
    };
  }
}
