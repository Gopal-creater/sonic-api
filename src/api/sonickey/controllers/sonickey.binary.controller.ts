import {CreateSonicKeyDto } from '../dtos/create-sonickey.dto';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException
} from '@nestjs/common';
import { SonickeyService } from '../services/sonickey.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiSecurity
} from '@nestjs/swagger';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { ApiKeyAuthGuard } from '../../auth/guards/apikey-auth.guard';
import { ApiKey } from '../../api-key/decorators/apikey.decorator';
import { ValidatedLicense } from '../../licensekey/decorators/validatedlicense.decorator';
import { LicenseValidationGuard } from '../../licensekey/guards/license-validation.guard';
import { User } from '../../auth/decorators/user.decorator';
import { identifyDestinationFolderAndResourceOwnerFromUser } from 'src/shared/utils';
import { UserDB } from '../../user/schemas/user.db.schema';
import { SonicKey } from '../schemas/sonickey.schema';
import { Track } from 'src/api/track/schemas/track.schema';
import { ChannelEnums } from '../../../constants/Enums';

//REMOVABLE:  Added on thirdparty-controller

@ApiTags('SonicKeys ThirdParty-Binary Controller (protected by x-api-key)')
@ApiSecurity('x-api-key')
@Controller('sonic-keys/binary')
export class SonickeyBinaryController {
  constructor(
    private readonly sonicKeyService: SonickeyService,
    private readonly licensekeyService: LicensekeyService,
  ) {}

  @UseGuards(ApiKeyAuthGuard, LicenseValidationGuard)
  @Post('/create-from-binary')
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Save to database after local encode from binary.' })
  async createFormBinary(
    @Body() createSonicKeyDto: CreateSonicKeyDto,
    @User() loggedInUser: UserDB,
    @ApiKey('_id') apiKey: string,
    @ValidatedLicense('key') licenseId: string
  ) {
    createSonicKeyDto.channel=ChannelEnums.BINARY
    var {
      sonicKey,
      channel,
      contentFileType,
      contentName,
      contentOwner,
      contentType,
      contentDuration,
      contentSize,
      contentEncoding,
      contentSamplingFrequency,
      contentFilePath
    } = createSonicKeyDto;
    if(!sonicKey){
      throw new BadRequestException('SonicKey is required')
    }
    const {
      resourceOwnerObj,
    } = identifyDestinationFolderAndResourceOwnerFromUser(loggedInUser);
    const newTrack: Partial<Track> = {
      channel: channel,
      artist: contentOwner,
      title: contentName,
      fileType: contentType,
      mimeType: contentFileType,
      duration:contentDuration,
      fileSize:contentSize,
      encoding:contentEncoding,
      localFilePath:contentFilePath,
      samplingFrequency:contentSamplingFrequency,
      trackMetaData: createSonicKeyDto,
      ...resourceOwnerObj,
      createdBy: loggedInUser?.sub,
    };
    var track = await this.sonicKeyService.trackService.findOne({
      mimeType:contentFileType,
      fileSize:contentSize,
      duration:contentDuration
    })
    if(!track){
      track = await this.sonicKeyService.trackService.create(newTrack)
    }
    const sonickeyDoc: Partial<SonicKey> = {
      ...createSonicKeyDto,
      ...resourceOwnerObj,
      _id: createSonicKeyDto.sonicKey,
      apiKey: apiKey,
      license: licenseId,
      createdBy: loggedInUser?.sub,
      track:track?._id
    };
    const savedSonicKey = await this.sonicKeyService.create(sonickeyDoc)
     await this.licensekeyService.incrementUses(licenseId,"encode", 1)
     .catch(async err=>{
      await this.sonicKeyService.sonicKeyModel.deleteOne({_id:savedSonicKey.id})
      throw new BadRequestException(
        'Unable to increment the license usage!',
      );
     })
    return savedSonicKey
  }
}
