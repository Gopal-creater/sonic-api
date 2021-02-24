import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Jobs Contrller')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}
  
  @ApiOperation({ summary: 'Create a Job' })
  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

  @ApiOperation({ summary: 'Get All Jobs' })
  @Get()
  findAll() {
    return this.jobService.findAll();
  }

  @ApiOperation({ summary: 'Get One Job' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @ApiOperation({ summary: 'Get All Jobs of particular user' })
  @Get('/owners/:ownerId')
  async getOwnersJobs(@Param('ownerId') ownerId: string) {
    return this.jobService.findByOwner(ownerId);
  }

  @ApiOperation({ summary: 'Update one Job' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(id, updateJobDto);
  }

  @ApiOperation({ summary: 'Update single jobDetails using filePath' })
  @Put(':id/:filePath')
  updateJobDetailByFilePath(@Param('id') id: string,@Param('filePath') filePath: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.updateJobDetailByFilePath(id,filePath, updateJobDto);
  }

  @ApiOperation({ summary: 'Delete one Job' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobService.remove(id);
  }

  @Get('/new/create-table')
  @ApiOperation({ summary: 'Create Job table in Dynamo DB' })
  async createTable() {
    return await this.jobService.jobRepository
      .ensureTableExistsAndCreate()
      .then(() => 'Created New Table');
  }
}
