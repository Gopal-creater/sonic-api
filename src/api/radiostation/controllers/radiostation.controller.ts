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
import { RadiostationSonicKeysService } from '../services/radiostation-sonickeys.service';
import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { UpdateRadiostationDto } from '../dto/update-radiostation.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BulkRadiostationDto } from '../dto/bulk-radiostation.dto';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';

@ApiTags('Radio Station Controller')
@Controller('radiostations')
export class RadiostationController {
  constructor(
    private readonly radiostationService: RadiostationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Radio Station' })
  create(@Body() createRadiostationDto: CreateRadiostationDto) {
    return this.radiostationService.create(createRadiostationDto);
  }

  /**
   * We can add or query filter as follows
   * http://[::1]:8000/radiostations/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d?filter={ "$or": [ { "name": { "$regex": "Sonic", "$options": "i" } }, { "streamingUrl": { "$regex": "Sonic", "$options": "i" } } ] } 
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All Radio Stations' })
  findAll(@Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,) {
    return this.radiostationService.findAll(queryDto);
  }

  @Get('/owners/:ownerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All Radio Stations of particular user' })
  async getOwnersRadioStations(@Param('ownerId') ownerId: string,@Query(new ParseQueryValue()) queryDto: ParsedQueryDto,) {
    queryDto.filter["owner"]=ownerId
    return this.radiostationService.findAll(queryDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get count of all radiostations' })
  async getCount(@Query() query) {
    return this.radiostationService.radioStationModel.estimatedDocumentCount({...query})
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
