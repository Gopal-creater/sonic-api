import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { DetectionService } from '../detection.service';
import { TopRadioStationWithTopSonicKey } from '../dto/general.dto';

import { SonickeyService } from '../../sonickey/services/sonickey.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ChannelEnums } from 'src/constants/Channels.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { IsTargetUserLoggedInGuard } from 'src/api/auth/guards/isTargetUserLoggedIn.guard';
import { groupByTime } from 'src/shared/types';
import { IsOptional } from 'class-validator';

@ApiTags('Detection Controller')
@Controller('detections')
export class DetectionOwnerController {
  constructor(
    private readonly detectionService: DetectionService,
    private readonly sonickeyServive: SonickeyService,
  ) {}

  @Get('/:targetUser/top-radiostations-with-top-sonickeys')
  @AnyApiQueryTemplate({
    additionalHtmlDescription:`
    <fieldset>
        <legend><h3>Example with graph inclusion:</h3></legend>
    <code><small>BASE_URL/:targetUser/top-radiostations-with-top-sonickeys?detectedAt<2021-06-30&detectedAt>2021-06-01&includeGraph=true&groupByTime=month</small></code>
    </fieldset>
    `
  })
  // @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  // @ApiBearerAuth()
  @ApiQuery({name:"includeGraph",type:Boolean,required:false})
  @ApiQuery({name:"groupByTime",enum:['month','year','dayOfMonth'],required:false})
  @ApiOperation({ summary: 'Get Top radiostations with top sonickeys' })
  async getTopRadiostations(
    @Param('targetUser') targetUser: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ):Promise<TopRadioStationWithTopSonicKey[]> {
    const { topLimit = 3, includeGraph, groupByTime, filter } = queryDto;
    const topStationsWithSonicKeys = await this.detectionService.findTopRadioStationsWithSonicKeysForOwner(
      targetUser,
      topLimit,
      filter,
    );
    if(includeGraph){
      if(!groupByTime) throw new BadRequestException("groupByTime query params required for includeGraph type")
      var topStationsWithTopKeysAndGraphs = [];
      for await (const station of topStationsWithSonicKeys) {
        const graphs = await this.detectionService.findGraphOfSonicKeysForRadioStationInSpecificTime(
          station._id,
          groupByTime,
          filter,
        );
        station['graphs'] = graphs;
        topStationsWithTopKeysAndGraphs.push(station);
      }
      return topStationsWithTopKeysAndGraphs;
    }
    return topStationsWithSonicKeys
  }

  @Get('/:targetUser/:channel')
  @ApiParam({ name: 'channel', enum: [...Object.values(ChannelEnums), 'ALL'] })
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All Detections' })
  findAll(
    @Param('targetUser') targetUser: string,
    @Param('channel') channel: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    if (channel !== 'ALL') {
      queryDto.filter['channel'] = channel;
    }
    queryDto.filter['owner'] = targetUser;
    return this.detectionService.findAll(queryDto);
  }

  @Get('/:targetUser/:radioStation/sonickey-graph/:groupByTime')
  @ApiParam({ name: 'groupByTime', enum: ['month', 'year', 'dayOfMonth'] })
  @AnyApiQueryTemplate()
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Top radiostations with top sonickeys' })
  async getSonicKeyGraphs(
    @Param('targetUser') targetUser: string,
    @Param('radioStation') radioStation: string,
    @Param('groupByTime') time: groupByTime,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    const { filter } = queryDto;
    return this.detectionService.findGraphOfSonicKeysForRadioStationInSpecificTime(
      radioStation,
      time,
      { ...filter, owner: targetUser },
    );
  }

  @Get('/:targetUser/:channel/count')
  @ApiParam({ name: 'channel', enum: [...Object.values(ChannelEnums), 'ALL'] })
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @AnyApiQueryTemplate({
    additionalHtmlDescription: `
        <fieldset>
        <legend><h1>Example with detectedDate:</h1></legend>
        <code><small>BASE_URL/:targetUser/:channel/count/?detectedAt<2021-06-30&detectedAt>2021-06-01</small></code>
          <br/>
      <h4>OR For Specific RadioStation</h4>
      <code><small>BASE_URL/:targetUser/:channel/count/?detectedAt<2021-06-30&detectedAt>2021-06-01&radioStation=609cd75081fe3a15732162ef</small></code>
        </fieldset>
 `,
  })
  @ApiOperation({ summary: 'Get Count' })
  getCount(
    @Param('targetUser') targetUser: string,
    @Param('channel') channel: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    if (channel !== 'ALL') {
      queryDto.filter['channel'] = channel;
    }
    queryDto.filter['owner'] = targetUser;
    const filter = queryDto.filter || {};
    return this.detectionService.detectionModel.where(filter).countDocuments();
  }
}
