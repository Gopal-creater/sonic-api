import {
    Controller,
    Body,
    Put,
    Param,
    UseGuards,
    NotImplementedException
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
  import { UpdateJobFileDto,AddKeyAndUpdateJobFileDto } from '../dto/update-job-file.dto';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { JobFileService } from '../services/job-file.service';
import { AddFilesDto } from '../dto/add-files.dto';
import { JobService } from '../services/job.service';

  @ApiTags('Jobs Files Controller')
  @Controller('jobs/:jobId')
  export class JobFileController {
    constructor(private readonly jobFileService: JobFileService,private readonly jobService: JobService) {}
  
    @ApiOperation({ summary: 'Add new sonic key and update the file details using fileId' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('/addkey-updatefile/:fileId')
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

    @ApiOperation({ summary: 'Update the file details using fileId' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('/updatefile/:fileId')
    updateJobFile(
      @Param('jobId') jobId: string,
      @Param('fileId') fileId: string,
      @Body() updateJobFileDto: UpdateJobFileDto,
    ) {
      return this.jobFileService.updateJobFile(
        jobId,
        fileId,
        updateJobFileDto,
      );
    }

    @ApiOperation({ summary: 'Update the file details using fileId' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('/addfiles')
    async addFilesToJob(
      @Param('jobId') jobId: string,
      @Body() addFilesDto: AddFilesDto,
    ) {
     throw new NotImplementedException()
    }
  }
  