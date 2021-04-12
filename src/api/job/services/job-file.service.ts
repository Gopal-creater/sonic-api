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
import { SonickeyService } from '../../sonickey/sonickey.service';
import { SonicKey } from '../../../schemas/sonickey.schema';
import { v4 as uuidv4 } from 'uuid';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { AddJobFilesDto } from '../dto/add-job-files.dto';
import { JobFile } from '../../../schemas/jobfile.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';

@Injectable()
export class JobFileService {
  constructor(
    @InjectModel(JobFile.name) public jobFileModel: Model<JobFile>,
    public readonly jobService: JobService,
    public readonly keygenService: KeygenService,
    public readonly sonickeyService: SonickeyService,
  ) {}

  async findAll(queryDto: QueryDto = {}) {
    const { limit, offset, ...query } = queryDto;
        return this.jobFileModel
        .find(query || {})
        .skip(offset)
        .limit(limit)
        .exec();
    }

  async addKeyToDbAndUpdateJobFile(
    fileId: string,
    addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto,
  ) {
    const jobFile = await this.jobService.jobFileModel.findById(fileId);
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
    const updatedJobFile = await this.jobService.jobFileModel.findOneAndUpdate({id:fileId},{...addKeyAndUpdateJobFileDto.jobFile,sonicKey:createdSonicKey});
    return {
      createdSonicKey: createdSonicKey,
      updatedJobFile: updatedJobFile,
    };
  }
}
