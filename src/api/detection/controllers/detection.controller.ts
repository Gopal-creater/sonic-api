import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Delete,
  NotFoundException,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { DetectionService } from '../detection.service';
import {
  CreateDetectionDto,
  CreateDetectionFromBinaryDto,
  CreateDetectionFromHardwareDto,
} from '../dto/create-detection.dto';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ChannelEnums, Roles } from 'src/constants/Enums';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { ApiKeyAuthGuard } from '../../auth/guards/apikey-auth.guard';
import { ApiKey } from '../../api-key/decorators/apikey.decorator';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { RolesAllowed, User } from 'src/api/auth/decorators';
import { UserDB } from 'src/api/user/schemas/user.db.schema';
import { ConditionalAuthGuard } from 'src/api/auth/guards/conditional-auth.guard';
import { Response } from 'express';
import { extractFileName } from 'src/shared/utils';
import { FileHandlerService } from 'src/shared/services/file-handler.service';

@ApiTags('Detection Controller')
@Controller('detections')
export class DetectionController {
  constructor(
    private readonly detectionService: DetectionService,
    private readonly sonickeyServive: SonickeyService,
    private readonly fileHandlerService: FileHandlerService,
  ) {}

  @Get('/list-plays')
  @ApiQuery({
    name: 'playsBy',
    enum: ['ARTISTS', 'COUNTRIES', 'TRACKS', 'RADIOSTATIONS','COMPANIES'],
    required: false,
  })
  @ApiQuery({ name: 'radioStation', type: String, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'recentPlays', type: Boolean, required: false })
  @ApiQuery({
    name: 'channel',
    enum: [...Object.values(ChannelEnums)],
    required: false,
  })
  @RolesAllowed()
  @UseGuards(ConditionalAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @AnyApiQueryTemplate({
    additionalHtmlDescription: `<div>
      To Get plays for specific company ?relation_sonickey.company=companyId <br/>
      To Get plays for specific partner ?relation_sonickey.partner=partnerId <br/>
      To Get plays for specific user ?relation_sonickey.owner=ownerId
    <div>`,
  })
  @ApiOperation({ summary: 'Get All Plays' })
  listPlays(@Query(new ParseQueryValue()) queryDto?: ParsedQueryDto) {
    const playsBy = queryDto.filter['playsBy'] as string;
    delete queryDto.filter['playsBy'];
    switch (playsBy) {
      case 'ARTISTS':
        return this.detectionService.listPlaysByArtists(queryDto);
      case 'COUNTRIES':
        return this.detectionService.listPlaysByCountries(queryDto);
      case 'TRACKS':
        return this.detectionService.listPlaysByTracks(queryDto);
      case 'RADIOSTATIONS':
        return this.detectionService.listPlaysByRadioStations(queryDto);
      case 'COMPANIES':
        return this.detectionService.listPlaysByCompanies(queryDto);
      default:
        return this.detectionService.listPlays(queryDto, queryDto.recentPlays);
    }
  }

  @Get('/:channel/data')
  @ApiQuery({ name: 'radioStation', type: String, required: false })
  @ApiParam({ name: 'channel', enum: [...Object.values(ChannelEnums)] })
  @UseGuards(ConditionalAuthGuard)
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @ApiQuery({ name: 'includeGroupData', type: Boolean, required: false })
  @AnyApiQueryTemplate()
  @ApiOperation({
    summary: 'Get All Detections for specific channel and specific user',
  })
  findAll(
    @Param('channel') channel: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    if (channel !== 'ALL') {
      queryDto.filter['channel'] = channel;
    }
    return this.detectionService.getSonicKeysDetails(queryDto, true);
  }

  @Get('/get-monitor-dashboard-data')
  @AnyApiQueryTemplate({
    additionalHtmlDescription: `<div>
      To Get plays for specific company ?relation_sonickey.company=companyId <br/>
      To Get plays for specific partner ?relation_sonickey.partner=partnerId <br/>
      To Get plays for specific user ?relation_sonickey.owner=ownerId
    <div>`,
  })  
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Monitor Dashboard data' })
  async getMonitorDashboardData(
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {    
    return this.detectionService.getMonitorDashboardData(queryDto);
  }

  @Get('/get-monitor-high-level-count-data')
  @AnyApiQueryTemplate({
    additionalHtmlDescription: `<div>
      To Get plays for specific company ?relation_sonickey.company=companyId <br/>
      To Get plays for specific partner ?relation_sonickey.partner=partnerId <br/>
      To Get plays for specific user ?relation_sonickey.owner=ownerId
    <div>`,
  })  
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Monitor Count data such as PlaysCount, TracksCount etc.' })
  async getMonitorCountData(
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {    
    return this.detectionService.getMonitorCountData(queryDto);
  }

  @ApiSecurity('x-api-key')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[NEW]: Create Detection from specific channel',
  })
  @UseGuards(ConditionalAuthGuard)
  @Post(`/create`)
  async createDetection(
    @Body() createDetectionDto: CreateDetectionDto,
    @ApiKey('_id') apiKey: string,
  ) {
    const keyFound = await this.sonickeyServive.findBySonicKey(
      createDetectionDto.sonicKey,
    );
    if (!keyFound) {
      throw new NotFoundException(
        'Provided sonickey is not found on our database.',
      );
    }
    if (!createDetectionDto.detectedAt) {
      createDetectionDto.detectedAt = new Date();
    }
    const newDetection = new this.detectionService.detectionModel({
      ...createDetectionDto,
      apiKey: apiKey,
      owner: keyFound.owner,
      company:keyFound.owner,
      partner:keyFound.partner,
      sonicKeyOwnerId: keyFound.owner,
      sonicKeyOwnerName: keyFound.contentOwner,
    });
    return newDetection.save();
  }

  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Create Detection From Binary [protected by x-api-key]',
  })
  @UseGuards(ApiKeyAuthGuard)
  @Post(`/channels/${ChannelEnums.BINARY}`)
  async createFromBinary(
    @Body() createDetectionFromBinaryDto: CreateDetectionFromBinaryDto,
    @ApiKey('customer') customer: string,
    @ApiKey('_id') apiKey: string,
  ) {
    const keyFound = await this.sonickeyServive.findBySonicKey(
      createDetectionFromBinaryDto.sonicKey,
    );
    if (!keyFound) {
      throw new NotFoundException(
        'Provided sonickey is not found on our database.',
      );
    }
    if (!createDetectionFromBinaryDto.detectedAt) {
      createDetectionFromBinaryDto.detectedAt = new Date();
    }
    const newDetection = new this.detectionService.detectionModel({
      ...createDetectionFromBinaryDto,
      apiKey: apiKey,
      owner: keyFound.owner,
      sonicKeyOwnerId: keyFound.owner,
      sonicKeyOwnerName: keyFound.contentOwner,
      channel: ChannelEnums.BINARY,
    });
    return newDetection.save();
  }



  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Create Detection From Hardware [protected by x-api-key]',
  })
  @UseGuards(ApiKeyAuthGuard)
  @Post(`/channels/${ChannelEnums.HARDWARE}`)
  async createFromHardware(
    @Body() createDetectionFromHardwareDto: CreateDetectionFromHardwareDto,
    @ApiKey('customer') customer: string,
    @ApiKey('_id') apiKey: string,
  ) {
    const keyFound = await this.sonickeyServive.findBySonicKey(
      createDetectionFromHardwareDto.sonicKey,
    );
    if (!keyFound) {
      throw new NotFoundException(
        'Provided sonickey is not found on our database.',
      );
    }
    if (!createDetectionFromHardwareDto.detectedAt) {
      createDetectionFromHardwareDto.detectedAt = new Date();
    }
    const newDetection = new this.detectionService.detectionModel({
      ...createDetectionFromHardwareDto,
      apiKey: apiKey,
      owner: keyFound.owner,
      company:keyFound.company,
      partner:keyFound.partner,
      sonicKeyOwnerId: keyFound.owner,
      sonicKeyOwnerName: keyFound.contentOwner,
      channel: ChannelEnums.HARDWARE,
    });
    return newDetection.save();
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all detection also accept filter as query params',
  })
  async getTotalHitsCount(
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    return this.detectionService.getTotalHitsCount(queryDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @AnyApiQueryTemplate()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all detections also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.detectionService.getCount(queryDto);
  }

  @Get('/estimate-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all detections',
  })
  async getEstimateCount() {
    return this.detectionService.getEstimateCount();
  }

  @Delete('/:detectionId')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Detection data' })
  async delete(@Param('detectionId') detectionId: string) {
    const deletedDetection = await this.detectionService.detectionModel.findByIdAndRemove(detectionId);
    if (!deletedDetection) {
      throw new NotFoundException('Given detection id is not found');
    }
    return deletedDetection;
  }


    /**
   * @param targetUser
   * @param queryDto
   * @returns
   */
     @Get('/export/dashboard-plays-view/:format')
     @ApiParam({ name: 'format', enum: ['xlsx', 'csv'] })
     @UseGuards(ConditionalAuthGuard)
     @ApiBearerAuth()
     @ApiSecurity('x-api-key')
     @AnyApiQueryTemplate()
     @ApiOperation({ summary: 'Export Dashboard Plays View' })
     async exportDashboardPlaysView(
       @Res() res: Response,
       @Param('format') format: string,
       @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
     ) {
       if (!['xlsx', 'csv'].includes(format))
         throw new BadRequestException('Unsupported format');
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
    enum: [...Object.values(ChannelEnums)],
    required: false,
  })
  @UseGuards(ConditionalAuthGuard)
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
   * @param queryDto
   * @returns
   */
     @Get('/export-plays-by/:format')
     @ApiQuery({
       name: 'playsBy',
       enum: ['ARTISTS', 'COUNTRIES', 'TRACKS', 'RADIOSTATIONS','COMPANIES'],
       required: false,
     })
     @ApiParam({ name: 'format', enum: ['xlsx', 'csv'] })
     @UseGuards(ConditionalAuthGuard)
     @ApiBearerAuth()
     @ApiSecurity('x-api-key')
     @AnyApiQueryTemplate()
     @ApiOperation({ summary: 'Export Plays View' })
     async exportPlaysBy(
       @Res() res: Response,
       @User() user: UserDB,
       @Param('format') format: string,
       @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
     ) {
       if (!['xlsx', 'csv'].includes(format))
         throw new BadRequestException('Unsupported format');
       queryDto.limit = queryDto?.limit <= 2000 ? queryDto?.limit : 2000;
   
       const playsBy = queryDto.filter['playsBy'] as string;
       delete queryDto.filter['playsBy'];
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
          case 'COMPANIES':
           exportedFilePath = await this.detectionService.exportPlaysByCompanies(
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
}
