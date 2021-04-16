import {
  Controller,
  Body,
  Put,
  Post,
  Delete,
  Param,
  UseGuards,
  NotFoundException,
  Get,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  UpdateJobFileDto,
  AddKeyAndUpdateJobFileDto,
} from '../dto/update-job-file.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JobFileService } from '../services/job-file.service';
import { JobService } from '../services/job.service';
import { CreateJobFileDto } from '../dto/create-job-file.dto';
import { JobFile } from '../../../schemas/jobfile.schema';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { ConvertIntObj } from '../../../shared/pipes/convertIntObj.pipe';

@ApiTags('Jobs Files Controller')
@Controller()
export class JobFileController {
  constructor(
    private readonly jobFileService: JobFileService,
    private readonly jobService: JobService,
  ) {}

  @ApiOperation({ summary: 'Get All Job Files' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/job-files')
  findAll(@Query(new ConvertIntObj(['limit', 'offset'])) queryDto: QueryDto) {
    return this.jobFileService.findAll(queryDto);
  }

  @ApiOperation({
    summary: 'Add new sonic key and update the file details using fileId',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('jobs/:jobId/job-files/addkey-updatejobfile/:fileId')
  addKeyToDbAndUpdateJobFile(
    @Param('jobId') jobId: string,
    @Param('fileId') fileId: string,
    @Body() addKeyAndUpdateJobFileDto: AddKeyAndUpdateJobFileDto,
  ) {
    return this.jobFileService.addKeyToDbAndUpdateJobFile(
      jobId,
      fileId,
      addKeyAndUpdateJobFileDto,
    );
  }

  @ApiOperation({ summary: 'Update the single file details using fileId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/job-files/:id')
  async updateJobFile(
    @Param('id') id: string,
    @Body() updateJobFileDto: UpdateJobFileDto,
  ) {
    const updatedJobFile = await this.jobFileService.jobFileModel.updateOne(
      { _id: id },
      updateJobFileDto,
      {new:true}
    );
    if (!updatedJobFile) {
      throw new NotFoundException();
    }

    return updatedJobFile;
  }

  @ApiOperation({ summary: 'Create and Add new jobfile to the job' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('jobs/:jobId/job-files/')
  async createJobFile(
    @Param('jobId') jobId: string,
    @Body() createJobFileDto: CreateJobFileDto,
  ) {
    const jobData = await this.jobService.jobModel.findById(jobId);
    if (!jobData) {
      throw new NotFoundException();
    }
    const dataToSave = {
      ...createJobFileDto,
      sonicKeyToBe: this.jobFileService.sonickeyService.generateUniqueSonicKey()
    }
    const newJobFile = new this.jobFileService.jobFileModel(dataToSave);
    const savedJobFile = await newJobFile.save();
    jobData.jobFiles.push(savedJobFile)
    const updatedJob = await this.jobService.jobModel.findByIdAndUpdate(jobId,{jobFiles:jobData.jobFiles},{new:true});
    await this.jobService
      .incrementReservedDetailsInLicenceBy(jobData.license, jobData.id, 1)
      .catch(async err => {
        await this.jobService.jobFileModel.remove(savedJobFile.id);
        throw new UnprocessableEntityException();
      });
    return {savedJobFile,updatedJob};
  }

  @ApiOperation({ summary: 'Create and Add many new jobfiles to the job' })
  @ApiBearerAuth()
  @ApiBody({ type: [CreateJobFileDto] })
  @UseGuards(JwtAuthGuard)
  @Post('jobs/:jobId/job-files/create-bulk')
  async addFilesToJob(
    @Param('jobId') jobId: string,
    @Body() createJobFileDto: CreateJobFileDto[],
  ) {
    const jobData = await this.jobService.jobModel.findById(jobId);
    if (!jobData) {
      throw new NotFoundException();
    }
    const newJobFiles = createJobFileDto.map(jobFile => {
      const dataToSave = {
        ...jobFile,
        sonicKeyToBe: this.jobFileService.sonickeyService.generateUniqueSonicKey()
      }
      const newJobFile = new this.jobFileService.jobFileModel(dataToSave);
      return newJobFile;
    });
    const savedJobFiles = await this.jobFileService.jobFileModel.insertMany(
      newJobFiles,
    );
    jobData.jobFiles.push(...savedJobFiles)
    const updatedJob = await this.jobService.jobModel.findByIdAndUpdate(jobId,{jobFiles:jobData.jobFiles},{new:true});
    await this.jobService
      .incrementReservedDetailsInLicenceBy(
        jobData.license,
        jobData.id,
        savedJobFiles.length,
      )
      .catch(async err => {
        await this.jobService.jobFileModel.deleteMany(savedJobFiles);
        throw new UnprocessableEntityException();
      });
    return {savedJobFiles,updatedJob};
  }

  @ApiOperation({ summary: 'Delete the job file using fileId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('jobs/:jobId/job-files/:fileId')
  async deleteJobFile(
    @Param('jobId') jobId: string,
    @Param('fileId') fileId: string,
  ) {
    const jobData = await this.jobService.jobModel.findById(jobId);
    if (!jobData) {
      throw new NotFoundException();
    }
    const deletedJobFile = await this.jobFileService.jobFileModel.findOneAndDelete(
      { _id: fileId },
    );
    if (!deletedJobFile) {
      throw new NotFoundException();
    }
    jobData.jobFiles = jobData.jobFiles.filter(file=>file._id!==fileId)
    const updatedJob = await this.jobService.jobModel.findByIdAndUpdate(jobId,{jobFiles:jobData.jobFiles},{new:true});
    await this.jobService.decrementReservedDetailsInLicenceBy(
      jobData.license,
      jobData.id,
      1,
    );
    return {deletedJobFile,updatedJob};
  }
}
