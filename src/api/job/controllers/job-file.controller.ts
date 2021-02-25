import {
    Controller,
    Body,
    Put,
    Param,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
  import { UpdateJobFileDto } from '../dto/update-job-file.dto';
  import { JobFileService } from '../services/job-file.service';

  @ApiTags('Jobs Files Contrller')
  @Controller('jobs/:jobId/files')
  export class JobFileController {
    constructor(private readonly jobFileService: JobFileService) {}
  
    @ApiOperation({ summary: 'Update single jobDetails using filePath' })
    @Put('/:fileId')
    updateJobDetailByFileId(
      @Param('jobId') jobId: string,
      @Param('fileId') fileId: string,
      @Body() updateJobFileDto: UpdateJobFileDto,
    ) {
      return this.jobFileService.update(
        jobId,
        fileId,
        updateJobFileDto,
      );
    }
  
    // @ApiOperation({ summary: 'Delete one file' })
    // @Delete('/:fileId')
    // remove(  @Param('jobId') jobId: string,
    // @Param('fileId') fileId: string,) {
    //   return this.jobService.remove(fileId);
    // }
  }
  