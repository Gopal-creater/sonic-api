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
import { ApiKeyAuthGuard } from '../../auth/guards/apikey-auth.guard';
import { ApiKey } from '../../auth/decorators/apikey.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { ChannelEnums } from 'src/constants/Channels.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';

@ApiTags('Detection Controller')
@Controller('detections')
export class DetectionController {
  constructor(
    private readonly detectionService: DetectionService,
    private readonly sonickeyServive: SonickeyService,
  ) {}

  // @Get('/test-add')
  // async addDummy() {
  //   return this.detectionService.findGraphOfSonicKeysForRadioStationInSpecificTime(
  //     '609d86cc81fe3a1573217507',
  //     'month',
  //     {
  //       detectedAt: { $gte: new Date('2021/1/1'), $lt: new Date('2022/1/1') },
  //       owner:"5728f50d-146b-47d2-aa7b-a50bc37d641d"
  //     },
  //   );
  // }

  // @Get('/test-add-data')
  // async addDum() {
  //   const sonicKey = {
  //     key: 'SctBt6A7eMZ',
  //     owner: '5728f50d-146b-47d2-aa7b-a50bc37d641d',
  //     contentOwner: 'ArBa owner details with spaces',
  //   };
  //   const radio = {
  //     id: '609d86cc81fe3a1573217507',
  //     owner: '5728f50d-146b-47d2-aa7b-a50bc37d641d',
  //   };
  //   const newDetection = await this.detectionService.detectionModel.create({
  //     radioStation: radio.id,
  //     sonicKey: sonicKey.key,
  //     owner: radio.owner,
  //     sonicKeyOwnerId: sonicKey.owner,
  //     sonicKeyOwnerName: sonicKey.contentOwner,
  //     channel: ChannelEnums.RADIOSTATION,
  //     detectedAt: new Date('2021/8/1'),
  //   });
  //   await newDetection.save();
  // }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @AnyApiQueryTemplate()
  // @ApiOperation({ summary: 'Get All Detections' })
  // findAll(@Query(new ParseQueryValue()) queryDto?: ParsedQueryDto) {
  //   return this.detectionService.findAll(queryDto);
  // }

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
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    const filter = queryDto.filter || {};
    return this.detectionService.detectionModel.where(filter).countDocuments();
  }
}
