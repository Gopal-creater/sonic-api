import { Controller, Get, Query, UseGuards, Param, Post } from '@nestjs/common';
import { RadiostationService } from '../services/radiostation.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RadiostationSonicKeysService } from '../services/radiostation-sonickeys.service';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { CreateRadiostationSonicKeyDto } from '../dto/radiostation-sonickey-dto/create-radiostation-sonickey.dto';
import { Schema, Types } from 'mongoose';
import { RadioStationSonicKey } from '../schemas/radiostation-sonickey.schema';
import { ToObjectIdPipe } from '../../../shared/pipes/toObjectId.pipe';

@ApiTags('RadioStation-SonicKeys Controller')
@Controller('radiostations-sonickeys')
export class RadiostationSonicKeysController {
  constructor(
    private readonly radiostationService: RadiostationService,
    private readonly radiostationSonicKeysService: RadiostationSonicKeysService,
  ) {}

  // @Get('/add-dummy')
  // @ApiOperation({ summary: 'Get All radiostations-sonickeys' })
  // addDummy() {
  //   const createRadiostationSonicKeyDto = new CreateRadiostationSonicKeyDto();
  //   createRadiostationSonicKeyDto.radioStation = '609cd75081fe3a15732162ef';
  //   createRadiostationSonicKeyDto.sonicKey = 'KKcXwhTxujy';
  //   createRadiostationSonicKeyDto.owner =
  //     '5728f50d-146b-47d2-aa7b-a50bc37d641d';
  //   createRadiostationSonicKeyDto.sonicKeyOwner =
  //     '5728f50d-146b-47d2-aa7b-a50bc37d641d';
  //   return this.radiostationSonicKeysService.createOrUpdate(
  //     createRadiostationSonicKeyDto,
  //   );
  // }

  // @Get('/')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @AnyApiQueryTemplate()
  // @ApiOperation({ summary: 'Get All radiostations-sonickeys' })
  // findAll(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
  //   return this.radiostationSonicKeysService.findAll(queryDto);
  // }

  @Get('/owners/:targetUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All RadioStations Sonic Keys of particular user' })
  async getOwnersRadioStationsSonicKeys(
    @Param('targetUser') targetUser: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    queryDto.filter['owner'] = targetUser;
    return this.radiostationSonicKeysService.findAll(queryDto);
  }

  @Get('/owners/:targetUser/dashboard/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate({additionalHtmlDescription:`
  <fieldset>
  <legend><h1>Example For This Endpoint:</h1></legend>
  <code><small>BASE_URL?radiostations-sonickeys/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d/dashboard/count/?detectedDetails.detectedAt<2021-06-30&detectedDetails.detectedAt>2021-06-01</small></code>
 <br/>
 <h4>OR For Specific RadioStation</h4>
 <code><small>BASE_URL?radiostations-sonickeys/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d/dashboard/count/?detectedDetails.detectedAt<2021-06-30&detectedDetails.detectedAt>2021-06-01&radioStation=609cd75081fe3a15732162ef</small></code>
  </fieldset>
 `})
  @ApiOperation({ summary: 'Get All sonickeys detected count within month or radioStation' })
  async retriveDashboardCountData(
    @Param('targetUser') targetUser: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ):Promise<number> {
    const { filter } = queryDto;
    const detectedKeys = await this.radiostationSonicKeysService.radioStationSonickeyModel.aggregate(
      [
        { $match: { ...filter, owner: targetUser } },
        { $group: { _id: null, totalKeys: { $sum: '$count' } } },
      ],
    );
    return detectedKeys?.[0]?.totalKeys || 0
  }

  @Get('/owners/:targetUser/radio-stations/:radioStation/dashboard/chart')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate({additionalHtmlDescription:`
  <fieldset>
  <legend><h1>Example For This Endpoint:</h1></legend>
  <code><small>BASE_URL?radiostations-sonickeys/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d/dashboard/count/?detectedDetails.detectedAt<2021-06-30&detectedDetails.detectedAt>2021-06-01</small></code>
 <br/>
 <h4>OR For Specific RadioStation</h4>
 <code><small>BASE_URL?radiostations-sonickeys/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d/dashboard/count/?detectedDetails.detectedAt<2021-06-30&detectedDetails.detectedAt>2021-06-01&radioStation=609cd75081fe3a15732162ef</small></code>
  </fieldset>
 `})
  @ApiOperation({ summary: 'Get All chart data from particulat radioStation' })
  async retriveDashboardChartData(
    @Param('targetUser') targetUser: string,
    @Param('radioStation',ToObjectIdPipe) radioStation: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    const { filter } = queryDto;
    const detectedKeys = await this.radiostationSonicKeysService.radioStationSonickeyModel.aggregate(
      [
        { $match: { ...filter, owner: targetUser,radioStation:radioStation } },
        // { $unwind: "$detectedDetails" }
        // { $group: { _id: null, totalKeys: { $sum: '$count' } } },
      ],
    );
    // return detectedKeys?.[0]?.totalKeys || 0
    return detectedKeys
  }

  @Get('/owners/:targetUser/dashboard/top-stations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate({additionalHtmlDescription:`
  <fieldset>
  <legend><h1>Example For This Endpoint:</h1></legend>
  <code><small>BASE_URL?radiostations-sonickeys/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d/dashboard/top-stations?createdAt<2021-06-30&createdAt>2021-06-01</small></code>
  </fieldset>
 `})
  @ApiOperation({ summary: 'Get All dashboard top stations data' })
  async retriveDashboardTopStationsData(
    @Param('targetUser') targetUser: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    const { topLimit, filter } = queryDto;
    return this.radiostationSonicKeysService.findTopRadioStations(
      { ...filter, owner: targetUser },
      topLimit || 3,
    );
  }

  @Get('/owners/:targetUser/dashboard/top-stations-with-top-sonickey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate({additionalHtmlDescription:`
  <fieldset>
  <legend><h1>Example For This Endpoint:</h1></legend>
  <code><small>BASE_URL?radiostations-sonickeys/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d/dashboard/top-stations-with-top-sonickey?createdAt<2021-06-30&createdAt>2021-06-01<small></code>
  </fieldset>
 `})
  @ApiOperation({
    summary: 'Get All dashboard top stations with top sonickeys data',
  })
  async retriveDashboardTopStationsWithTopSonciKeysData(
    @Param('targetUser') targetUser: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    const { topLimit = 3, filter } = queryDto;
    const top3RadioStations = await this.radiostationSonicKeysService.findTopRadioStations(
      { ...filter, owner: targetUser },
      topLimit,
    );
    var responseDataWithStationAndKeys:RadioStationSonicKey[][] = [];
    for await (const radioStation of top3RadioStations) {
      const data = await this.radiostationSonicKeysService.radioStationSonickeyModel
        .find({ radioStation: radioStation._id })
        .sort({ count: -1 }) //to get higest first
        .limit(topLimit);
      responseDataWithStationAndKeys.push(data);
    }
    return responseDataWithStationAndKeys;
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get count of all radiostation-sonickeys' })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.radiostationSonicKeysService.radioStationSonickeyModel.estimatedDocumentCount(
      { ...queryDto.filter },
    );
  }

  @Get('/radio-stations/:radioStationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All Sonic Keys of particular radioStationId' })
  async getOwnersKeys(
    @Param('radioStationId') radioStationId: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    queryDto.filter['radioStation'] = radioStationId;
    return this.radiostationSonicKeysService.findAll(queryDto);
  }


}
