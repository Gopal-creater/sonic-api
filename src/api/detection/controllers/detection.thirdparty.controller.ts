import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { DetectionService } from '../../detection/detection.service';
import { ChannelEnums } from 'src/constants/Enums';
import { CreateDetectionFromBinaryDto, CreateDetectionFromHardwareDto } from '../dto/create-detection.dto';
import { ApiKeyAuthGuard } from '../../api-key/guards/apikey-auth.guard';
import { ApiKey } from '../../api-key/decorators/apikey.decorator';

@ApiTags('ThirdParty Integration Controller, Protected By XAPI-Key')
@ApiSecurity('x-api-key')
@Controller('thirdparty/detection')
export class DetectionThirdPartyController {
  constructor(
    private readonly sonickeyServive: SonickeyService,
    private readonly detectionService: DetectionService,
  ) {}

  @ApiOperation({ summary: 'Create Detection From Binary' })
  @UseGuards(ApiKeyAuthGuard)
  @Post('detection-from-binary')
  async create(
    @Body() createDetectionFromBinaryDto: CreateDetectionFromBinaryDto,
    @ApiKey('customer') customer: string,
    @ApiKey('_id') apiKey: string,
  ) {
    const isKeyFound = await this.sonickeyServive.findBySonicKey(
      createDetectionFromBinaryDto.sonicKey,
    );
    if (!isKeyFound) {
      throw new NotFoundException(
        'Provided sonickey is not found on our database.',
      );
    }
    if (!createDetectionFromBinaryDto.detectedAt) {
      createDetectionFromBinaryDto.detectedAt = new Date();
    }

    const newDetection = new this.detectionService.detectionModel({
      sonicKey: createDetectionFromBinaryDto.sonicKey,
      detectedAt: createDetectionFromBinaryDto.detectedAt,
      metadata: createDetectionFromBinaryDto.metaData,
      apiKey: apiKey,
      owner: customer,
      sonicKeyOwnerId: isKeyFound.owner,
      sonicKeyOwnerName: isKeyFound.contentOwner,
      channel: ChannelEnums.BINARY,
    });
    return newDetection.save();
  }

  @ApiOperation({ summary: 'Create Detection From Hardware' })
  @UseGuards(ApiKeyAuthGuard)
  @Post('detection-from-hardware')
  async createFromHardware(
    @Body() createDetectionFromHardwareDto: CreateDetectionFromHardwareDto,
    @ApiKey('customer') customer: string,
    @ApiKey('_id') apiKey: string,
  ) {
    const isKeyFound = await this.sonickeyServive.findBySonicKey(
        createDetectionFromHardwareDto.sonicKey,
    );
    if (!isKeyFound) {
      throw new NotFoundException(
        'Provided sonickey is not found on our database.',
      );
    }
    if (!createDetectionFromHardwareDto.detectedAt) {
      createDetectionFromHardwareDto.detectedAt = new Date();
    }

    const newDetection = new this.detectionService.detectionModel({
      sonicKey: createDetectionFromHardwareDto.sonicKey,
      detectedAt: createDetectionFromHardwareDto.detectedAt,
      metadata: createDetectionFromHardwareDto.metaData,
      apiKey: apiKey,
      owner: customer,
      sonicKeyOwnerId: isKeyFound.owner,
      sonicKeyOwnerName: isKeyFound.contentOwner,
      channel: ChannelEnums.HARDWARE,
    });
    return newDetection.save();
  }
}
