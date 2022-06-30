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
import { CreateThirdpartyDetectionDto } from '../dto/create-thirdparty-detection.dto';
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
import { ApiKeyAuthGuard } from '../../auth/guards/apikey-auth.guard';
import { ApiKey } from '../../api-key/decorators/apikey.decorator';

@ApiTags('ThirdParty-Binary Controller (protected by x-api-key)')
@ApiSecurity('x-api-key')
@Controller('thirdparty-detection-from-binary')
export class ThirdpartyDetectionFromBinaryController {
  constructor(
    private readonly sonickeyServive: SonickeyService,
    private readonly detectionService: DetectionService,
  ) {}

  @ApiOperation({ summary: 'Create Detection' })
  @UseGuards(ApiKeyAuthGuard)
  @Post()
  async create(
    @Body() createThirdpartyDetectionDto: CreateThirdpartyDetectionDto,
    @ApiKey('customer') customer: string,
    @ApiKey('_id') apiKey: string,
  ) {
    const isKeyFound = await this.sonickeyServive.findBySonicKey(
      createThirdpartyDetectionDto.sonicKey,
    );
    if (!isKeyFound) {
      throw new NotFoundException(
        'Provided sonickey is not found on our database.',
      );
    }
    if (!createThirdpartyDetectionDto.detectionTime) {
      createThirdpartyDetectionDto.detectionTime = new Date();
    }

    const newDetection = new this.detectionService.detectionModel({
      sonicKey:createThirdpartyDetectionDto.sonicKey,
      detectedAt:createThirdpartyDetectionDto.detectionTime,
      metadata:createThirdpartyDetectionDto.metaData,
      apiKey: apiKey,
      owner: isKeyFound.owner,
      company:isKeyFound.company,
      partner:isKeyFound.partner,
      sonicKeyOwnerId: isKeyFound.owner,
      sonicKeyOwnerName: isKeyFound.contentOwner,
      channel: ChannelEnums.BINARY,
    });
    return newDetection.save();
  }
}
