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
import { ChannelEnums, DETECTION_ORIGINS } from 'src/constants/Enums';
import {
  CreateDetectionFromBinaryDto,
  CreateThirdPartyStreamReaderDetectionFromBinaryDto,
  CreateDetectionFromHardwareDto,
  CreateThirdPartyStreamReaderDetectionFromLamdaDto,
  CreateThirdPartyStreamReaderDetectionFromFingerPrintDto,
} from '../dto/create-detection.dto';
import * as _ from 'lodash';
import { ApiKeyAuthGuard } from '../../auth/guards/apikey-auth.guard';
import { ApiKey } from '../../api-key/decorators/apikey.decorator';
import { User } from '../../auth/decorators/user.decorator';
import { RadiostationService } from '../../radiostation/services/radiostation.service';
import { AppgenService } from '../../../shared/services/appgen.service';

@ApiTags('ThirdParty Integration Controller, Protected By XAPI-Key')
@ApiSecurity('x-api-key')
@Controller('thirdparty/detection')
export class DetectionThirdPartyController {
  constructor(
    private readonly sonickeyServive: SonickeyService,
    private readonly detectionService: DetectionService,
    private readonly radiostationService: RadiostationService,
		private readonly appGenService: AppgenService,
  ) {}

  @ApiOperation({ summary: 'Create Detection From Binary' })
  @UseGuards(ApiKeyAuthGuard)
  @ApiSecurity('x-api-key')
  @Post('detection-from-binary')
  async create(
    @Body() createDetectionFromBinaryDto: CreateDetectionFromBinaryDto,
    @User('sub') customer: string,
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
      owner: isKeyFound.owner,
      company:isKeyFound.company,
      partner:isKeyFound.partner,
      sonicKeyOwnerId: isKeyFound.owner,
      sonicKeyOwnerName: isKeyFound.contentOwner,
      channel: ChannelEnums.BINARY,
    });
    return newDetection.save();
  }

  @ApiOperation({ summary: 'Create Radio Detection From Binary' })
  @UseGuards(ApiKeyAuthGuard)
  @ApiSecurity('x-api-key')
  @Post('stream-detection-from-binary')
  async createThirdPartyRadioDetectionFromBinary(
    @Body()
    createThirdPartyStreamReaderDetectionFromBinaryDto: CreateThirdPartyStreamReaderDetectionFromBinaryDto,
    @User('sub') customer: string,
    @ApiKey('_id') apiKey: string,
  ) {
    var {
      sonicKey,
      detectedAt,
      metaData,
      thirdpartyStreamReaderDetection,
    } = createThirdPartyStreamReaderDetectionFromBinaryDto;
    const isKeyFound = await this.sonickeyServive.findBySonicKey(sonicKey);
    if (!isKeyFound) {
      throw new NotFoundException(
        'Provided sonickey is not found on our database.',
      );
    }
    if (!detectedAt) {
      detectedAt = new Date();
    }

    const newDetection = new this.detectionService.detectionModel({
      sonicKey: sonicKey,
      detectedAt: detectedAt,
      metaData: metaData,
      apiKey: apiKey,
      owner: isKeyFound.owner,
      company:isKeyFound.company,
      partner:isKeyFound.partner,
      sonicKeyOwnerId: isKeyFound.owner,
      sonicKeyOwnerName: isKeyFound.contentOwner,
      channel: ChannelEnums.THIRDPARTY_STREAMREADER,
      thirdpartyStreamReaderDetection: thirdpartyStreamReaderDetection,
    });
    return newDetection.save();
  }

  @ApiOperation({ summary: 'Create Stream Detection From Lamda Function' })
  @UseGuards(ApiKeyAuthGuard)
  @ApiSecurity('x-api-key')
  @Post('stream-detection-from-lamda')
  async createThirdPartyRadioDetectionFromLamda(
    @Body()
    createThirdPartyStreamReaderDetectionFromLamdaDto: CreateThirdPartyStreamReaderDetectionFromLamdaDto,
    @User('sub') customer: string,
    @ApiKey('_id') apiKey: string,
  ) {
    var {
      decodeResponsesFromBinary,
      radioStation,
      detectedAt,
      metaData,
      detectionSourceFileName,
      streamDetectionInterval,
    } = createThirdPartyStreamReaderDetectionFromLamdaDto;

		// For appgen.
		const detectedTime = new Date(detectedAt);

    const isValidRadioStation = await this.radiostationService.radioStationModel.findById(
      radioStation,
    );
    if (!isValidRadioStation) {
      throw new NotFoundException('Given radio doesnot exists in our database');
    }
     //Identify the decode origins either from SonicKey or Fingerprint
     var detectionOrigins:string[]=[]
     var isAlreadyDetectionWithSameDetectionSourceFileName = await this.detectionService.detectionModel.findOne({
       radioStation: radioStation,
       detectionSourceFileName: detectionSourceFileName
     });
     if(isAlreadyDetectionWithSameDetectionSourceFileName){
       detectionOrigins=isAlreadyDetectionWithSameDetectionSourceFileName.detectionOrigins
     }
     detectionOrigins.push(DETECTION_ORIGINS.SONICKEY)


    var savedKeys: string[] = [];
    var errorKeys: string[] = [];
    for await (const decodeRes of decodeResponsesFromBinary) {
      const isKeyPresent = await this.sonickeyServive.findBySonicKey(
        decodeRes.sonicKey,
      );
      if (isKeyPresent) {
        const sonicKeyContentDurationInSec = isKeyPresent.contentDuration || 60;
        //Get the old detection which is detected less than its original contentDuration
        var detection = await this.detectionService.detectionModel.findOne({
          radioStation: radioStation,
          sonicKey: decodeRes.sonicKey,
          detectedAt: {
            $gt: new Date(
              new Date().getTime() - 1000 * sonicKeyContentDurationInSec,
            ),
          },
        });
        if (
          detection &&
          detection.detectedDuration < sonicKeyContentDurationInSec
        ) {
          //If within its original contentDuration, just do updation
					//Lets not update the AppGen program details because we are not sure what is the scenario.
          detection.detectedDuration =
            detection.detectedDuration + streamDetectionInterval >
            sonicKeyContentDurationInSec
              ? sonicKeyContentDurationInSec
              : detection.detectedDuration + streamDetectionInterval;
          detection.detectionSourceFileName=detectionSourceFileName;
          detection.detectionOrigins=_.uniq(detectionOrigins);
          detection.detectedTimestamps = [
            ...detection.detectedTimestamps,
            ...decodeRes.timestamps||[],
          ];
          detection.metaData={...detection.metaData,...metaData}
        } else {
          //If not within its original contentDuration, just do insertation
					
					//First, find program details if this is a appgen station
					var program = {title:'', subtitle: '', dj:''};
					if(isValidRadioStation.isFromAppGen) {
						program = await this.appGenService.appGenGetRadioProgramming(isValidRadioStation.appGenStationId, detectedTime);
						console.log('Appgen station. program: ', program);
					} else {
						console.log('Non-Appgen station. No program details');
					}

          detection = await this.detectionService.detectionModel.create({
            radioStation: radioStation,
            sonicKey: decodeRes.sonicKey,
            owner: isKeyPresent.owner,
            company:isKeyPresent.company,
            partner:isKeyPresent.partner,
            sonicKeyOwnerId: isKeyPresent.owner,
            sonicKeyOwnerName: isKeyPresent.contentOwner,
            channel: ChannelEnums.STREAMREADER,
            detectedDuration: streamDetectionInterval,
            detectedTimestamps: decodeRes.timestamps,
            detectedAt: detectedAt || new Date(),
            detectionSourceFileName:detectionSourceFileName,
            detectionOrigins:_.uniq(detectionOrigins),
            apiKey:apiKey,
            metaData: metaData,
						program: program,
          });
        }
        await detection
          .save()
          .then(() => {
            savedKeys.push(decodeRes.sonicKey);
          })
          .catch(err => {});
      } else {
        errorKeys.push(decodeRes.sonicKey);
      }
    }
    return{
      savedSonicKeys:savedKeys,
      errorOrNotFoundSonicKeys:errorKeys
    }
  }

  @ApiOperation({ summary: 'Create Stream Detection From Fingerprint Function' })
  // @UseGuards(ApiKeyAuthGuard)
  // @ApiSecurity('x-api-key')
  @Post('stream-detection-from-fingerprint')
  async createThirdPartyRadioDetectionFromFingerPrint(
    @Body()
    createThirdPartyStreamReaderDetectionFromFingerPrintDto: CreateThirdPartyStreamReaderDetectionFromFingerPrintDto,
    @User('sub') customer: string,
    // @ApiKey('_id') apiKey: string,
  ) {
    var {
      decodeResponsesFromFingerPrint,
      radioStation,
      detectedAt,
      metaData,
      detectionSourceFileName,
      streamDetectionInterval,
    } = createThirdPartyStreamReaderDetectionFromFingerPrintDto;
    const isValidRadioStation = await this.radiostationService.radioStationModel.findById(
      radioStation,
    );
    if (!isValidRadioStation) {
      throw new NotFoundException('Given radio doesnot exists in our database');
    }

		// For appgen.
		const detectedTime = new Date(detectedAt);

    //Identify the decode origins either from SonicKey or Fingerprint
    var detectionOrigins:string[]=[]
    var isAlreadyDetectionWithSameDetectionSourceFileName = await this.detectionService.detectionModel.findOne({
      radioStation: radioStation,
      detectionSourceFileName: detectionSourceFileName
    });
    if(isAlreadyDetectionWithSameDetectionSourceFileName){
      detectionOrigins=isAlreadyDetectionWithSameDetectionSourceFileName.detectionOrigins
    }
    detectionOrigins.push(DETECTION_ORIGINS.FINGERPRINT)

    var savedKeys: string[] = [];
    var errorKeys: string[] = [];
    for await (const decodeRes of decodeResponsesFromFingerPrint) {
      const isKeyPresent = await this.sonickeyServive.findOne({
        "fingerPrintMetaData.song_id":decodeRes.songId
      });
      if (isKeyPresent) {
        const sonicKeyContentDurationInSec = isKeyPresent.contentDuration || 60;
        //Get the old detection which is detected less than its original contentDuration
        var detection = await this.detectionService.detectionModel.findOne({
          radioStation: radioStation,
          sonicKey: isKeyPresent.sonicKey,
          detectedAt: {
            $gt: new Date(
              new Date().getTime() - 1000 * sonicKeyContentDurationInSec,
            ),
          },
        });
        if (
          detection &&
          detection.detectedDuration < sonicKeyContentDurationInSec
        ) {
          //If within its original contentDuration, just do updation
          detection.detectedDuration =
            detection.detectedDuration + streamDetectionInterval >
            sonicKeyContentDurationInSec
              ? sonicKeyContentDurationInSec
              : detection.detectedDuration + streamDetectionInterval;
          detection.detectionSourceFileName=detectionSourceFileName;
          detection.detectionOrigins=_.uniq(detectionOrigins);
          detection.detectedTimestamps = [
            ...detection.detectedTimestamps,
            ...decodeRes.timestamps||[],
          ];
          detection.metaData={...detection.metaData,...metaData}
        } else {
          //If not within its original contentDuration, just do insertation
					//First, find program details if this is a appgen station
					var program = {title:'', subtitle: '', dj:''};
					if(isValidRadioStation.isFromAppGen) {
						program = await this.appGenService.appGenGetRadioProgramming(isValidRadioStation.appGenStationId, detectedTime);
						console.log('Appgen station. program: ', program);
					} else {
						console.log('Non-Appgen station. No program details');
					}
          detection = await this.detectionService.detectionModel.create({
            radioStation: radioStation,
            sonicKey: isKeyPresent.sonicKey,
            owner: isKeyPresent.owner,
            company:isKeyPresent.company,
            partner:isKeyPresent.partner,
            sonicKeyOwnerId: isKeyPresent.owner,
            sonicKeyOwnerName: isKeyPresent.contentOwner,
            channel: ChannelEnums.STREAMREADER,
            detectedDuration: streamDetectionInterval,
            detectedTimestamps: decodeRes.timestamps,
            detectedAt: detectedAt || new Date(),
            detectionSourceFileName:detectionSourceFileName,
            detectionOrigins:_.uniq(detectionOrigins),
            // apiKey:apiKey,
            metaData: metaData,
						program:program,
          });
        }
        await detection
          .save()
          .then(() => {
            savedKeys.push(isKeyPresent.sonicKey);
          })
          .catch(err => {});
      } else {
        errorKeys.push(decodeRes.songId);
      }
    }
    return{
      savedSonicKeys:savedKeys,
      errorOrNotFoundSongIds:errorKeys
    }
  }

  @ApiOperation({ summary: 'Create Detection From Hardware' })
  @UseGuards(ApiKeyAuthGuard)
  @ApiSecurity('x-api-key')
  @Post('detection-from-hardware')
  async createFromHardware(
    @Body() createDetectionFromHardwareDto: CreateDetectionFromHardwareDto,
    @User('sub') customer: string,
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
      owner: isKeyFound.owner,
      company:isKeyFound.company,
      partner:isKeyFound.partner,
      sonicKeyOwnerId: isKeyFound.owner,
      sonicKeyOwnerName: isKeyFound.contentOwner,
      channel: ChannelEnums.HARDWARE,
    });
    return newDetection.save();
  }
}
