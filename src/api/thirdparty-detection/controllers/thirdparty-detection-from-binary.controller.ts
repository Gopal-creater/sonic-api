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
import { ThirdpartyDetectionService } from '../thirdparty-detection.service';
import { CreateThirdpartyDetectionDto } from '../dto/create-thirdparty-detection.dto';
import { UpdateThirdpartyDetectionDto } from '../dto/update-thirdparty-detection.dto';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { DetectionService } from '../../detection/detection.service';
import { ChannelEnums } from 'src/constants/Enums';
import { ApiKeyAuthGuard } from '../../api-key/guards/apikey-auth.guard';
import { ApiKey } from '../../api-key/decorators/apikey.decorator';

@ApiTags('ThirdParty-Binary Controller (protected by x-api-key)')
@ApiSecurity('x-api-key')
@Controller('thirdparty-detection-from-binary')
export class ThirdpartyDetectionFromBinaryController {
  constructor(
    private readonly thirdpartyDetectionService: ThirdpartyDetectionService,
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
      owner: customer,
      sonicKeyOwnerId: isKeyFound.owner,
      sonicKeyOwnerName: isKeyFound.contentOwner,
      channel: ChannelEnums.BINARY,
    });
    return newDetection.save();

    // const newDetection = new this.thirdpartyDetectionService.thirdpartyDetectionModel(
    //   {
    //     ...createThirdpartyDetectionDto,
    //     apiKey: apiKey,
    //     customer: customer,
    //   },
    // );
    // return newDetection.save();
  }

  // @ApiOperation({ summary: 'Get All Detection' })
  // @AnyApiQueryTemplate()
  // @UseGuards(ApiKeyAuthGuard)
  // @Get()
  // findAll(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
  //   return this.thirdpartyDetectionService.findAll(queryDto);
  // }

  // @ApiOperation({ summary: 'Get One Detection' })
  // @UseGuards(ApiKeyAuthGuard)
  // @Get(':id')
  // async findById(@Param('id') id: string) {
  //   const detection = await this.thirdpartyDetectionService.findById(id);
  //   if (!detection) {
  //     throw new NotFoundException();
  //   }
  //   return detection;
  // }

  // @ApiOperation({ summary: 'Update One Detection' })
  // @UseGuards(ApiKeyAuthGuard)
  // @Put(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateThirdpartyDetectionDto: UpdateThirdpartyDetectionDto,
  // ) {
  //   const detection = await this.thirdpartyDetectionService.update(
  //     id,
  //     updateThirdpartyDetectionDto,
  //   );
  //   if (!detection) {
  //     throw new NotFoundException();
  //   }
  //   return detection;
  // }

  // @ApiOperation({ summary: 'Remove One Detection' })
  // @UseGuards(ApiKeyAuthGuard)
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   const detection = await this.thirdpartyDetectionService.remove(id);
  //   if (!detection) {
  //     throw new NotFoundException();
  //   }
  //   return detection;
  // }
}
