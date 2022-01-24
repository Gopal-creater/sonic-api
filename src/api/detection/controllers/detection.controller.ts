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
} from '@nestjs/common';
import { DetectionService } from '../detection.service';
import {
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
} from '@nestjs/swagger';
import { ChannelEnums, Roles } from 'src/constants/Enums';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { ApiKeyAuthGuard } from '../../auth/guards/apikey-auth.guard';
import { ApiKey } from '../../api-key/decorators/apikey.decorator';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { RolesAllowed } from 'src/api/auth/decorators';

@ApiTags('Detection Controller')
@Controller('detections')
export class DetectionController {
  constructor(
    private readonly detectionService: DetectionService,
    private readonly sonickeyServive: SonickeyService,
  ) {}

  @Get('/list-plays')
  @ApiQuery({
    name: 'channel',
    enum: [...Object.values(ChannelEnums), 'ALL'],
    required: false,
  })
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate({
    additionalHtmlDescription:`<div>
      To Get plays for specific company ?relation_owner.companies=companyId <br/>
      To Get plays for specific user ?relation_owner.id=ownerId
    <div>`
  })
  @ApiOperation({ summary: 'Get All Plays' })
  listPlays(
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    return this.detectionService.listPlays(queryDto);
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
      owner: customer,
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
      owner: customer,
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
  async getTotalHitsCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.detectionService.getTotalHitsCount(queryDto)
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
}
