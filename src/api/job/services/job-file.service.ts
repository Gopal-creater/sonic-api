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
import { v4 as uuidv4 } from 'uuid';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { AddJobFilesDto } from '../dto/add-job-files.dto';
import { JobFile } from '../schemas/jobfile.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { Job } from '../schemas/job.schema';
import { MongoosePaginateJobFileDto } from '../dto/mongoosepaginate-jobfile.dto';

@Injectable()
export class JobFileService {
  constructor(
    @InjectModel(JobFile.name) public jobFileModel: Model<JobFile>,
    public readonly jobService: JobService,
    public readonly keygenService: KeygenService,
    public readonly sonickeyService: SonickeyService,
  ) {}

  async findAll(queryDto: QueryDto = {}):Promise<MongoosePaginateJobFileDto> {
    const { _limit, _offset, _sort,_page, ...query } = queryDto;
    var paginateOptions={}
    var sort = {};
    if (_sort) {
      var sortItems = _sort?.split(',') || [];
      for (let index = 0; index < sortItems.length; index++) {
        const sortItem = sortItems[index];
        var sortKeyValue = sortItem?.split(':');
        sort[sortKeyValue[0]] =
          sortKeyValue[1]?.toLowerCase() == 'desc' ? -1 : 1;
      }
    }

    paginateOptions["sort"]=sort
    paginateOptions["offset"]=_offset
    paginateOptions["page"]=_page
    paginateOptions["limit"]=_limit


    return await this.jobFileModel["paginate"](query,paginateOptions)
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
