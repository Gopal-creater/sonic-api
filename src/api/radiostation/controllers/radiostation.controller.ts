import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { RadiostationService } from '../services/radiostation.service';
import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { UpdateRadiostationDto } from '../dto/update-radiostation.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BulkRadiostationDto } from '../dto/bulk-radiostation.dto';
import { QueryOptions } from '@aws/dynamodb-data-mapper';
import { RadioStation } from '../../../schemas/radiostation.schema';

class Query {
  @ApiProperty()
  limit?: number;

  @ApiProperty()
  lastKey?: RadioStation;
}

@ApiTags('Radio Station Contrller')
@Controller('radiostations')
export class RadiostationController {
  constructor(private readonly radiostationService: RadiostationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Radio Station' })
  create(@Body() createRadiostationDto: CreateRadiostationDto) {
    return this.radiostationService.create(createRadiostationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  // @ApiQuery({ name: 'query', type: Query, required: false })
  @ApiOperation({ summary: 'Get All Radio Stations' })
  findAll() {
    return this.radiostationService.findAll();
  }

  @Get('/owner/:ownerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All Radio Stations of particular user' })
  async getOwnersKeys(@Param('ownerId') ownerId: string) {
    return await this.radiostationService.findByOwner(ownerId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single Radio Station' })
  findOne(@Param('id') id: string) {
    return this.radiostationService.findByIdOrFail(id);
  }

  @Put(':id/stop-listening-stream')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'stop listening stream' })
  stopListeningStream(@Param('id') id: string) {
    return this.radiostationService.stopListeningStream(id).catch(err=>{
      if(err.status==404){
        throw new NotFoundException()
      }
      throw err
    })
  }

  @Put(':id/start-listening-stream')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'start listening stream' })
  startListeningStream(@Param('id') id: string) {
    return this.radiostationService.startListeningStream(id).catch(err=>{
      if(err.status==404){
        throw new NotFoundException()
      }
      throw err
    })
  }

  @Put('start-listening-stream/bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'stop listening stream' })
  bulkStartListeningStream(@Body() bulkDto: BulkRadiostationDto) {
    console.log("bulkDto",bulkDto);
    
    return this.radiostationService.bulkStartListeningStream(bulkDto.ids);
  }

  @Put('stop-listening-stream/bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'stop listening stream' })
  bulkStopListeningStream(@Body() bulkDto: BulkRadiostationDto) {
    return this.radiostationService.bulkStopListeningStream(bulkDto.ids);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Single Radio Station' })
  update(
    @Param('id') id: string,
    @Body() updateRadiostationDto: UpdateRadiostationDto,
  ) {
    return this.radiostationService.update(id, updateRadiostationDto);
  }

  @Delete('delete/bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Radio Station in bulk' })
  removeBulk(@Body() bulkDto: BulkRadiostationDto) {
    return this.radiostationService.bulkRemove(bulkDto.ids)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Radio Station' })
  remove(@Param('id') id: string) {
    return this.radiostationService.removeById(id).catch(err=>{
      if(err.status==404){
        throw new NotFoundException()
      }
      throw err
    })
  }

  @Get('/new/create-table')
  @ApiOperation({ summary: 'Create Radio Stationy table in Dynamo DB' })
  async createTable() {
    return await this.radiostationService.radioStationRepository
      .ensureTableExistsAndCreate()
      .then(() => 'Created New Table');
  }
}
