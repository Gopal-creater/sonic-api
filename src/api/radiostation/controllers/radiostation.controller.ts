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
  Query,
} from '@nestjs/common';
import { RadiostationService } from '../services/radiostation.service';
import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { UpdateRadiostationDto } from '../dto/update-radiostation.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BulkRadiostationDto } from '../dto/bulk-radiostation.dto';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { ConvertIntObj } from '../../../shared/pipes/convertIntObj.pipe';


@ApiTags('Radio Station Controller')
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
  @ApiOperation({ summary: 'Get All Radio Stations' })
  findAll(@Query(new ConvertIntObj(['limit','offset'])) queryDto: QueryDto,) {
    return this.radiostationService.findAll(queryDto);
  }

  @Get('/owners/:ownerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All Radio Stations of particular user' })
  async getOwnersRadioStations(@Param('ownerId') ownerId: string,@Query(new ConvertIntObj(['limit','offset'])) queryDto: QueryDto,) {
    const query={
      ...queryDto,
      owner:ownerId
    }
    return this.radiostationService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single Radio Station' })
  async findOne(@Param('id') id: string) {
    const radioStation = await this.radiostationService.radioStationModel.findById(id)
    if(!radioStation){
      throw new NotFoundException()
    }
    return radioStation
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
  async update(
    @Param('id') id: string,
    @Body() updateRadiostationDto: UpdateRadiostationDto,
  ) {
    const updatedRadioStation = await this.radiostationService.radioStationModel.findOneAndUpdate({_id:id},updateRadiostationDto,{new:true})
    if(!updatedRadioStation){
      throw new NotFoundException()
    }
    return updatedRadioStation
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
}
