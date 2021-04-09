import {
  Controller,
  Body,
  Put,
  Post,
  Delete,
  Param,
  UseGuards,
  NotImplementedException,
  NotFoundException,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  UpdateJobFileDto,
  AddKeyAndUpdateJobFileDto,
} from '../dto/update-job-file.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JobFileService } from '../services/job-file.service';
import { AddJobFilesDto } from '../dto/add-job-files.dto';
import { JobService } from '../services/job.service';
import { CreateJobFileDto } from '../dto/create-job-file.dto';
import { JobFile } from '../../../schemas/jobfile.schema';
import { QueryDto } from '../../../shared/dtos/query.dto';

@ApiTags('Jobs Files Controller')
@Controller('job-files')
export class JobFileController {
  constructor(
    private readonly jobFileService: JobFileService,
    private readonly jobService: JobService,
  ) {}

  @ApiOperation({ summary: 'Get All Job Files' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() queryDto: QueryDto,) {
    return this.jobFileService.findAll(queryDto);
  }

  @ApiOperation({
    summary: 'Add new sonic key and update the file details using fileId',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/addkey-updatejobfile/:fileId')
  addKeyToDbAndUpdateJobFile(
    @Param('fileId') fileId: string,
    @Body() addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto,
  ) {
    return this.jobFileService.addKeyToDbAndUpdateJobFile(
      fileId,
      addKeyAndUpdateJobFileDto,
    );
  }

  @ApiOperation({ summary: 'Update the single file details using fileId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateJobFile(
    @Param('id') id: string,
    @Body() updateJobFileDto: UpdateJobFileDto,
  ) {
    const updatedJobFile = await this.jobFileService.jobFileModel.updateOne(
      { id: id },
      updateJobFileDto,
    );
    if (!updatedJobFile) {
      throw new NotFoundException();
    }

    return updatedJobFile;
  }

  @ApiOperation({ summary: 'Create job file' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createJobFile(
    @Body() createJobFileDto: CreateJobFileDto,
  ) {
    const dataToSave = Object.assign(new JobFile(), createJobFileDto, {
      sonicKey: this.jobFileService.sonickeyService.generateUniqueSonicKey(),
    });
    const newJob = new this.jobFileService.jobFileModel(dataToSave);
    return newJob.save();
  }

  @ApiOperation({ summary: 'Create many job file' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/create-bulk')
  async addFilesToJob(
    @Body() createJobFileDto: CreateJobFileDto[],
  ) {
    const newJobFiles =  createJobFileDto.map(jobFile=>{
      const dataToSave = Object.assign(new JobFile(), jobFile, {
        sonicKey: this.jobFileService.sonickeyService.generateUniqueSonicKey(),
      });
      const newJob = new this.jobFileService.jobFileModel(dataToSave);
      return newJob
    })
    return this.jobFileService.jobFileModel.insertMany(newJobFiles)
  }

  @ApiOperation({ summary: 'Delete the file details using fileId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteJobFile(
    @Param('id') id: string
  ) {
    const deletedJobFile = await this.jobFileService.jobFileModel.findOneAndDelete({id:id});
    if(!deletedJobFile){
      throw new NotFoundException()
    }
    return deletedJobFile
  }
}
