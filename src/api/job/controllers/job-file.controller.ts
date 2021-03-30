import {
    Controller,
    Body,
    Put,
    Post,
    Delete,
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

    @ApiOperation({ summary: 'Update the single file details using fileId' })
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

    @ApiOperation({ summary: 'Add files to job' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('/addfiles')
    async addFilesToJob(
      @Param('jobId') jobId: string,
      @Body() addFilesDto: AddFilesDto,
    ) {
       return this.jobFileService.addFilesToJob(
        jobId,
        addFilesDto,
      );
    }

    @ApiOperation({ summary: 'Delete the file details using fileId' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('/deletefile/:fileId')
    deleteJobFile(
      @Param('jobId') jobId: string,
      @Param('fileId') fileId: string,
    ) {
        return this.jobFileService.deleteFileFromJob(
        jobId,
        fileId
      );
    }
  }
  