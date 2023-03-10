import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { DetectionService } from '../detection.service';
import {
  TopRadioStationWithPlaysDetails,
  TopRadioStationWithTopSonicKey,
} from '../dto/general.dto';
import { Response } from 'express';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { ChannelEnums } from 'src/constants/Enums';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { IsTargetUserLoggedInGuard } from 'src/api/auth/guards/isTargetUserLoggedIn.guard';
import { groupByTime } from 'src/shared/types';
import { ConditionalAuthGuard } from '../../auth/guards/conditional-auth.guard';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { extractFileName } from 'src/shared/utils';
import * as deepmerge from 'deepmerge';
import * as _ from 'lodash';
import { User } from '../../auth/decorators/user.decorator';
import { UserDB } from '../../user/schemas/user.db.schema';
import { toObjectId } from 'src/shared/utils/mongoose.utils';

@ApiTags('Detection Controller')
@Controller('detections/owners/:targetUser')
export class DetectionOwnerController {
  constructor(
    private readonly detectionService: DetectionService,
    private readonly sonickeyServive: SonickeyService,
    private readonly fileHandlerService: FileHandlerService,
  ) {}

  @Get('/plays-dashboard-data')
  @AnyApiQueryTemplate()
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Plays Dashboard data' })
  async getPlaysDashboardData(
    @Param('targetUser') targetUser: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    var { filter } = queryDto;
    filter['owner'] = targetUser;
    return this.detectionService.getPlaysDashboardData(filter);
  }

  @Get('/get-monitor-dashboard-data')
  @ApiQuery({ name: 'includeCompanies', type: Boolean, required: false })
  @AnyApiQueryTemplate()
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Monitor Dashboard data' })
  async getMonitorDashboardData(
    @Param('targetUser') targetUser: string,
    @User() user: UserDB,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    var includeCompanies = queryDto.filter['includeCompanies'] as boolean;
    delete queryDto.filter['includeCompanies'];
    const userCompaniesIds = user.companies.map(com => toObjectId(com._id));
    if (includeCompanies == false) {
      queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
        $or: [{ 'owner._id': user._id }],
      });
    } else {
      queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
        $or: [
          { 'owner._id': user._id },
          { 'owner.companies': { $in: userCompaniesIds } },
        ],
      });
    }
    return this.detectionService.getMonitorDashboardData(queryDto);
  }

  @Get('/plays-dashboard-graph-data')
  @AnyApiQueryTemplate()
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Plays Dashboard graph data' })
  async getPlaysDashboardGraphData(
    @Param('targetUser') targetUser: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    var { filter } = queryDto;
    filter['owner'] = targetUser;
    return this.detectionService.getPlaysDashboardGraphData(filter);
  }

  @Get(`/radioStations/top-radiostations-with-top-sonickeys`)
  @AnyApiQueryTemplate({
    additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example:</h1></legend>
  <code><small>BASE_URL/detections/owners/:targetUser/top-radiostations-with-top-sonickeys?detectedAt<2021-06-30&detectedAt>2021-06-01</small></code>
 <br/>
 <h4>Example including Graph</h4>
 <code><small>BASE_URL/detections/owners/:targetUser/top-radiostations-with-top-sonickeys?detectedAt<2021-06-30&detectedAt>2021-06-01&includeGraph=true&groupByTime=month</small></code>
  </fieldset>
 `,
  })
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiQuery({ name: 'includeGraph', type: Boolean, required: false })
  @ApiQuery({
    name: 'groupByTime',
    enum: ['month', 'year', 'dayOfMonth'],
    required: false,
  })
  @ApiOperation({ summary: 'Get Top radiostations with top sonickeys' })
  async getTopRadiostations(
    @Param('targetUser') targetUser: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ): Promise<TopRadioStationWithTopSonicKey[]> {
    const { topLimit = 3, includeGraph, groupByTime, filter } = queryDto;
    const graph_detectedAt = filter.graph_detectedAt; //support for different detectedAt time for graph query

    delete filter.graph_detectedAt;
    const topStationsWithSonicKeys = await this.detectionService.findTopRadioStationsWithSonicKeysForOwner(
      targetUser,
      topLimit,
      filter,
    );
    if (includeGraph) {
      if (!groupByTime)
        throw new BadRequestException(
          'groupByTime query params required for includeGraph type',
        );
      var topStationsWithTopKeysAndGraphs = [];
      if (graph_detectedAt) {
        //add graph_detectedAt date if it is preset
        filter['detectedAt'] = graph_detectedAt;
      }
      console.log('filter in graph', filter);
      for await (const station of topStationsWithSonicKeys) {
        const graphs = await this.detectionService.findGraphOfSonicKeysForRadioStationInSpecificTime(
          station._id,
          groupByTime,
          filter,
        );
        station['graphsData'] = graphs;
        topStationsWithTopKeysAndGraphs.push(station);
      }
      return topStationsWithTopKeysAndGraphs;
    }
    return topStationsWithSonicKeys;
  }

  @Get(`/radioStations/top-radiostations-with-plays-details`)
  @AnyApiQueryTemplate({
    additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example:</h1></legend>
  <code><small>BASE_URL/detections/owners/:targetUser/top-radiostations-with-plays-details?detectedAt<2021-06-30&detectedAt>2021-06-01</small></code>
  </fieldset>
 `,
  })
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Top radiostations with its plays details' })
  async getTopRadiostationsWithPlays(
    @Param('targetUser') targetUser: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    const { topLimit = 5 } = queryDto;

    const topStationsWithPlaysDetails = await this.detectionService.findTopRadioStationsWithPlaysCountForOwner(
      topLimit,
      queryDto,
    );
    return topStationsWithPlaysDetails;
  }

  @Get('/radioStations/:radioStation/sonickey-graph/:groupByTime')
  @ApiParam({ name: 'groupByTime', enum: ['month', 'year', 'dayOfMonth'] })
  @AnyApiQueryTemplate({
    additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example:</h1></legend>
  <code><small>BASE_URL/detections/owners/:targetUser/radioStations/:radioStation/sonickey-graph/:groupByTime?detectedAt<2021-06-30&detectedAt>2021-06-01</small></code>
  </fieldset>
 `,
  })
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

  @Get('/:channel/data')
  @ApiQuery({ name: 'radioStation', type: String, required: false })
  @ApiParam({ name: 'channel', enum: [...Object.values(ChannelEnums), 'ALL'] })
  @UseGuards(ConditionalAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @ApiQuery({ name: 'includeGroupData', type: Boolean, required: false })
  @AnyApiQueryTemplate()
  @ApiOperation({
    summary: 'Get All Detections for specific channel and specific user',
  })
  findAll(
    @Param('targetUser') targetUser: string,
    @Param('channel') channel: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    if (channel !== 'ALL') {
      queryDto.filter['channel'] = channel;
    }
    queryDto.filter['owner'] = targetUser;
    return this.detectionService.findAll(queryDto, true);
  }

  /**
   * @param targetUser
   * @param queryDto
   * @returns
   */
  @Get('/export/dashboard-plays-view/:format')
  @ApiParam({ name: 'format', enum: ['xlsx', 'csv'] })
  @UseGuards(ConditionalAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Export Dashboard Plays View' })
  async exportDashboardPlaysView(
    @Res() res: Response,
    @Param('targetUser') targetUser: string,
    @Param('format') format: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    if (!['xlsx', 'csv'].includes(format))
      throw new BadRequestException('unsupported format');
    queryDto.filter['owner'] = targetUser;
    queryDto.limit = queryDto?.limit <= 2000 ? queryDto?.limit : 2000;
    const filePath = await this.detectionService.exportDashboardPlaysView(
      queryDto,
      format,
    );
    const fileName = extractFileName(filePath);
    res.download(
      filePath,
      `exported_dashboard_plays_view_${format}.${fileName.split('.')[1]}`,
      err => {
        if (err) {
          this.fileHandlerService.deleteFileAtPath(filePath);
          res.send(err);
        }
        this.fileHandlerService.deleteFileAtPath(filePath);
      },
    );
  }

  /**
   * @param targetUser
   * @param queryDto
   * @returns
   */
  @Get('/export/history-of-sonickey/:format')
  @ApiParam({ name: 'format', enum: ['xlsx', 'csv'] })
  @ApiQuery({ name: 'radioStation', type: String, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'sonicKey', type: String, required: false })
  @ApiQuery({
    name: 'channel',
    enum: [...Object.values(ChannelEnums), 'ALL'],
    required: false,
  })
  @UseGuards(ConditionalAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Export History Of Sonickey View' })
  async exportHistoryOfSonicKeyView(
    @Res() res: Response,
    @Param('targetUser') targetUser: string,
    @Param('format') format: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    queryDto.filter['owner'] = targetUser;
    queryDto.limit = queryDto?.limit <= 2000 ? queryDto?.limit : 2000;
    const filePath = await this.detectionService.exportHistoryOfSonicKeyPlays(
      queryDto,
      format,
    );
    const fileName = extractFileName(filePath);
    res.download(
      filePath,
      `exported_history_of_sonickey_${format}.${fileName.split('.')[1]}`,
      err => {
        if (err) {
          this.fileHandlerService.deleteFileAtPath(filePath);
          res.send(err);
        }
        this.fileHandlerService.deleteFileAtPath(filePath);
      },
    );
  }
  /**
   * Eg: http://[::1]:8000/detections/owners/9ab5a58b-09e0-46ce-bb50-1321d927c382/list-plays?channel=STREAMREADER&limit=2&detectedAt%3E=2021-12-01&detectedAt%3C2021-12-11&relation_sonicKey.contentOwner=ArBa&relation_filter={%22sonicKey.contentName%22:{%20%22$regex%22:%20%22bo%22,%20%22$options%22:%20%22i%22%20}}
   * @param targetUser
   * @param queryDto
   * @returns
   */
  @Get('/list-plays')
  @ApiQuery({
    name: 'playsBy',
    enum: ['ARTISTS', 'COUNTRIES', 'TRACKS', 'RADIOSTATIONS'],
    required: false,
  })
  @ApiQuery({ name: 'includeCompanies', type: Boolean, required: false })
  @ApiQuery({ name: 'radioStation', type: String, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({
    name: 'channel',
    enum: [...Object.values(ChannelEnums), 'ALL'],
    required: false,
  })
  @UseGuards(ConditionalAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @AnyApiQueryTemplate()
  @ApiOperation({
    summary: 'Get All Plays for specific user by specific groupBy Aggregation',
  })
  listPlays(
    @Param('targetUser') targetUser: string,
    @User() user: UserDB,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    const playsBy = queryDto.filter['playsBy'] as string;
    var includeCompanies = queryDto.filter['includeCompanies'] as boolean;
    delete queryDto.filter['playsBy'];
    delete queryDto.filter['includeCompanies'];
    const userCompaniesIds = user.companies.map(com => toObjectId(com._id));
    if (includeCompanies == false) {
      queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
        $or: [{ 'owner._id': user._id }],
      });
    } else {
      queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
        $or: [
          { 'owner._id': user._id },
          { 'owner.companies': { $in: userCompaniesIds } },
        ],
      });
    }

    switch (playsBy) {
      case 'ARTISTS':
        return this.detectionService.listPlaysByArtists(queryDto);
      case 'COUNTRIES':
        return this.detectionService.listPlaysByCountries(queryDto);
      case 'TRACKS':
        return this.detectionService.listPlaysByTracks(queryDto);
      case 'RADIOSTATIONS':
        return this.detectionService.listPlaysByRadioStations(queryDto);
      default:
        return this.detectionService.listPlays(queryDto, queryDto.recentPlays);
    }
  }

  @Get('/get-plays-count-by')
  @ApiQuery({
    name: 'playsBy',
    enum: ['ARTISTS', 'COUNTRIES', 'TRACKS', 'RADIOSTATIONS'],
    required: false,
  })
  @ApiQuery({ name: 'includeCompanies', type: Boolean, required: false })
  @ApiQuery({ name: 'radioStation', type: String, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({
    name: 'channel',
    enum: [...Object.values(ChannelEnums), 'ALL'],
    required: false,
  })
  @UseGuards(ConditionalAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @AnyApiQueryTemplate()
  @ApiOperation({
    summary:
      'Get  Plays count for specific user by specific groupBy Aggregation',
  })
  getPlaysCountBy(
    @Param('targetUser') targetUser: string,
    @User() user: UserDB,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    const playsBy = queryDto.filter['playsBy'] as string;
    var includeCompanies = queryDto.filter['includeCompanies'] as boolean;
    delete queryDto.filter['playsBy'];
    delete queryDto.filter['includeCompanies'];
    const userCompaniesIds = user.companies.map(com => toObjectId(com._id));
    if (includeCompanies == false) {
      queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
        $or: [{ 'owner._id': user._id }],
      });
    } else {
      queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
        $or: [
          { 'owner._id': user._id },
          { 'owner.companies': { $in: userCompaniesIds } },
        ],
      });
    }

    switch (playsBy) {
      case 'ARTISTS':
        return this.detectionService.countPlaysByArtists(queryDto);
      case 'COUNTRIES':
        return this.detectionService.countPlaysByCountries(queryDto);
      case 'TRACKS':
        return this.detectionService.countPlaysByTracks(queryDto);
      case 'RADIOSTATIONS':
        return this.detectionService.countPlaysByRadioStations(queryDto);
      default:
        return this.detectionService.countPlays(queryDto);
    }
  }

  /**
   * @param targetUser
   * @param queryDto
   * @returns
   */
  @Get('/export-plays-by/:format')
  @ApiQuery({
    name: 'playsBy',
    enum: ['ARTISTS', 'COUNTRIES', 'TRACKS', 'RADIOSTATIONS'],
    required: false,
  })
  @ApiParam({ name: 'format', enum: ['xlsx', 'csv'] })
  @UseGuards(ConditionalAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Export Plays View' })
  async exportPlaysBy(
    @Res() res: Response,
    @Param('targetUser') targetUser: string,
    @User() user: UserDB,
    @Param('format') format: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    if (!['xlsx', 'csv'].includes(format))
      throw new BadRequestException('unsupported format');
    queryDto.limit = queryDto?.limit <= 2000 ? queryDto?.limit : 2000;

    const playsBy = queryDto.filter['playsBy'] as string;
    var includeCompanies = queryDto.filter['includeCompanies'] as boolean;
    delete queryDto.filter['playsBy'];
    delete queryDto.filter['includeCompanies'];
    const userCompaniesIds = user.companies.map(com => toObjectId(com._id));
    if (includeCompanies == false) {
      queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
        $or: [{ 'owner._id': user._id }],
      });
    } else {
      queryDto.relationalFilter = _.merge({}, queryDto.relationalFilter, {
        $or: [
          { 'owner._id': user._id },
          { 'owner.companies': { $in: userCompaniesIds } },
        ],
      });
    }

    var exportedFilePath: string;
    switch (playsBy) {
      case 'ARTISTS':
        exportedFilePath = await this.detectionService.exportPlaysByArtists(
          queryDto,
          format,
        );
        break;
      case 'COUNTRIES':
        exportedFilePath = await this.detectionService.exportPlaysByCountries(
          queryDto,
          format,
        );
        break;
      case 'TRACKS':
        exportedFilePath = await this.detectionService.exportPlaysByTracks(
          queryDto,
          format,
        );
        break;
      case 'RADIOSTATIONS':
        exportedFilePath = await this.detectionService.exportPlaysByRadioStations(
          queryDto,
          format,
        );
        break;
      default:
        exportedFilePath = await this.detectionService.exportPlays(
          queryDto,
          format,
        );
        break;
    }
    const fileName = extractFileName(exportedFilePath);
    res.download(
      exportedFilePath,
      `${fileName.split('_nameseperator_')[1]}`,
      err => {
        if (err) {
          this.fileHandlerService.deleteFileAtPath(exportedFilePath);
          res.send(err);
        }
        this.fileHandlerService.deleteFileAtPath(exportedFilePath);
      },
    );
  }

  @Get('/:channel/sonicKeys/:sonicKey/detected-details')
  @ApiQuery({ name: 'radioStation', type: String, required: false })
  // @ApiQuery({name:"select",type:String,required:false})
  @ApiQuery({ name: 'includeGroupData', type: Boolean, required: false })
  @ApiParam({ name: 'channel', enum: [...Object.values(ChannelEnums), 'ALL'] })
  @UseGuards(ConditionalAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @AnyApiQueryTemplate()
  @ApiOperation({
    summary: 'Get Detected Details for specific channel and specific sonickey',
  })
  getDetectedDetailsOfSingleSonicKey(
    @Param('targetUser') targetUser: string,
    @Param('channel') channel: string,
    @Param('sonicKey') sonicKey: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    if (channel !== 'ALL') {
      queryDto.filter['channel'] = channel;
    }
    queryDto.filter['owner'] = targetUser;
    queryDto.filter['sonicKey'] = sonicKey;
    return this.detectionService.findAll(queryDto);
  }

  @Get('/:channel/count')
  @ApiQuery({ name: 'includeGroupData', type: Boolean, required: false })
  @ApiQuery({ name: 'radioStation', type: String, required: false })
  @ApiParam({ name: 'channel', enum: [...Object.values(ChannelEnums), 'ALL'] })
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @AnyApiQueryTemplate({
    additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example:</h1></legend>
  <code><small>BASE_URL/detections/owners/:targetUser/:channel/count/?detectedAt<2021-06-30&detectedAt>2021-06-01</small></code>
 <br/>
 <h4>OR For Specific RadioStation</h4>
 <code><small>BASE_URL/detections/owners/:targetUser/:channel/count/?detectedAt<2021-06-30&detectedAt>2021-06-01&radioStation=609cd75081fe3a15732162ef</small></code>
  </fieldset>
 `,
  })
  @ApiOperation({ summary: 'Get Count' })
  @ApiQuery({ name: 'includeGroupData', type: Boolean, required: false })
  getCount(
    @Param('targetUser') targetUser: string,
    @Param('channel') channel: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    if (channel !== 'ALL') {
      queryDto.filter['channel'] = channel;
    }
    queryDto.filter['owner'] = targetUser;
    return this.detectionService.getTotalHitsCount(queryDto);
  }

  @Get('/:channel/count-plays')
  @ApiQuery({ name: 'includeGroupData', type: Boolean, required: false })
  @ApiQuery({ name: 'radioStation', type: String, required: false })
  @ApiParam({ name: 'channel', enum: [...Object.values(ChannelEnums), 'ALL'] })
  @UseGuards(JwtAuthGuard, new IsTargetUserLoggedInGuard('Param'))
  @ApiBearerAuth()
  @AnyApiQueryTemplate({
    additionalHtmlDescription: `
  <fieldset>
  <legend><h1>Example:</h1></legend>
  <code><small>BASE_URL/detections/owners/:targetUser/:channel/count-plays/?detectedAt<2021-06-30&detectedAt>2021-06-01</small></code>
 <br/>
 <h4>OR For Specific RadioStation</h4>
 <code><small>BASE_URL/detections/owners/:targetUser/:channel/count-plays/?detectedAt<2021-06-30&detectedAt>2021-06-01&radioStation=609cd75081fe3a15732162ef</small></code>
  </fieldset>
 `,
  })
  @ApiOperation({ summary: 'Get Plays Count' })
  getPlaysCount(
    @Param('targetUser') targetUser: string,
    @Param('channel') channel: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    if (channel !== 'ALL') {
      queryDto.filter['channel'] = channel;
    }
    queryDto.filter['owner'] = targetUser;
    return this.detectionService.getTotalPlaysCount(queryDto);
  }
}
