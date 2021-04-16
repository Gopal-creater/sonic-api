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
  Query,
  NotFoundException,
} from '@nestjs/common';
import { JobService } from '../services/job.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../auth/decorators/user.decorator';
import { JobLicenseValidationGuard } from '../../auth/guards/job-license-validation.guard';
import { v4 as uuidv4 } from 'uuid';
import { equals, ConditionExpression } from '@aws/dynamodb-expressions';
import { SonickeyService } from '../../sonickey/sonickey.service';
import { BadRequestException } from '@nestjs/common';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { ConvertIntObj } from '../../../shared/pipes/convertIntObj.pipe';

@ApiTags('Jobs Controller')
@Controller('jobs')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly sonickeyService: SonickeyService,
  ) {}

  @ApiOperation({ summary: 'Get All Jobs' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query(new ConvertIntObj(['limit','offset'])) queryDto: QueryDto,) {
    return this.jobService.findAll(queryDto);
  }

  @ApiOperation({ summary: 'Get All Jobs of particular owner' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/owners/:ownerId')
  getOwnerJobs(@Param('ownerId') ownerId: string,@Query(new ConvertIntObj(['limit','offset'])) queryDto: QueryDto,) {
    const query={
      ...queryDto,
      owner:ownerId
    }
    return this.jobService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Job' })
  @Post()
  async create(
    @Body() createJobDto: CreateJobDto,
    @User('sub') owner: string,
    @Req() req: any,
  ) {
    
    const existingJob = await this.jobService.jobModel.findOne({name:createJobDto.name,owner:owner});
    if (existingJob) {
      throw new BadRequestException('Job with same name already exists.');
    }
    createJobDto.owner = owner;
    if(createJobDto.jobFiles){
      createJobDto.jobFiles = createJobDto.jobFiles.map(job => {
        job['sonicKeyToBe'] =this.sonickeyService.generateUniqueSonicKey()
        // job["sonicKeyToBe"]="2KhHfn0-qo6"
        return job;
      });
    }
    return this.jobService.create(createJobDto);
  }

  @ApiOperation({ summary: 'Make this job completed' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/make-completed')
  makeCompleted(@Param('id') id: string) {
    return this.jobService.makeCompleted(id);
  }

  @ApiOperation({ summary: 'Get One Job By Id' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const job = await this.jobService.jobModel.findById(id)
    if(!job){
      throw new NotFoundException()
    }
    return job
  }

  @ApiOperation({ summary: 'Update one Job' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    const updatedJob = await this.jobService.jobModel.findOneAndUpdate({_id:id},updateJobDto,{new:true})
    if(!updatedJob){
      throw new NotFoundException()
    }
    return updatedJob
  }

  @ApiOperation({ summary: 'Delete one Job' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedJob = await this.jobService.remove(id);
    if(!deletedJob){
      throw new NotFoundException()
    }
    return deletedJob 
  }
}
