import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JobService } from '../services/job.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../auth/decorators/user.decorator';
import { JobLicenseValidationGuard } from '../../auth/guards/job-license-validation.guard';
import { v4 as uuidv4 } from 'uuid';
import { SonickeyService } from '../../sonickey/sonickey.service';

@ApiTags('Jobs Controller')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService,private readonly sonickeyService: SonickeyService) {}

  @UseGuards(JwtAuthGuard, JobLicenseValidationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Job' })
  @Post()
  async create(
    @Body() createJobDto: CreateJobDto,
    @User('sub') owner: string,
    @Req() req: any,
  ) {
    createJobDto.owner=owner
    createJobDto.jobDetails=createJobDto.jobDetails.map((job)=>{
      job["fileId"]=uuidv4()
      job["isComplete"]=false
      job["sonicKey"]=this.sonickeyService.generateUniqueSonicKey()
      return job
    })
    return this.jobService.create(createJobDto);
  }

  @ApiOperation({ summary: 'Get All Jobs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.jobService.findAll();
  }

  @ApiOperation({ summary: 'Make this job completed' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/make-completed')
  makeCompleted(@Param('id') id: string) {
    return this.jobService.makeCompleted(id);
  }

  @ApiOperation({ summary: 'Get One Job' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @ApiOperation({ summary: 'Get All Jobs of particular user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/owners/:ownerId')
  async getOwnersJobs(@Param('ownerId') ownerId: string) {
    return this.jobService.findByOwner(ownerId);
  }

  @ApiOperation({ summary: 'Update one Job' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(id, updateJobDto);
  }

  @ApiOperation({ summary: 'Delete one Job' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
