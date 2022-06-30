import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { SonickeyService } from '../services/sonickey.service';
import { S3FileMeta, SonicKey } from '../schemas/sonickey.schema';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { ChannelEnums } from '../../../constants/Enums';
import {
  FileFromUrlInterceptor,
  UploadedFileFromUrl,
} from '../../../shared/interceptors/FileFromUrl.interceptor';
import { EncodeFromUrlDto } from '../dtos/encode.dto';
import {
  UseGuards,
  BadRequestException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from 'src/api/auth/decorators';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import {
  CreateSonicKeyDto,
  CreateSonicKeyFromBinaryDto,
} from '../dtos/create-sonickey.dto';
import { ApiKeyAuthGuard } from '../../auth/guards/apikey-auth.guard';
import { LicenseValidationGuard } from '../../licensekey/guards/license-validation.guard';
import { ValidatedLicense } from '../../licensekey/decorators/validatedlicense.decorator';
import { ApiKey } from '../../api-key/decorators/apikey.decorator';
import { UpdateSonicKeyFromBinaryDto } from '../dtos/update-sonickey.dto';
import { UserDB } from '../../user/schemas/user.db.schema';
import { identifyDestinationFolderAndResourceOwnerFromUser } from 'src/shared/utils';
import { Track } from 'src/api/track/schemas/track.schema';

@ApiTags('ThirdParty Integration Controller, Protected By XAPI-Key')
@ApiSecurity('x-api-key')
@Controller('thirdparty/sonic-keys')
export class SonickeyThirdPartyController {
  constructor(
    private readonly sonicKeyService: SonickeyService,
    private readonly fileHandlerService: FileHandlerService,
    private readonly licensekeyService: LicensekeyService,
  ) {}

  @UseInterceptors(FileFromUrlInterceptor('mediaFile'))
  @ApiBody({
    description: 'File To Encode',
    type: EncodeFromUrlDto,
  })
  @UseGuards(ApiKeyAuthGuard, LicenseValidationGuard)
  @ApiSecurity('x-api-key')
  @Post('/encode-from-url')
  @ApiOperation({ summary: 'Encode File From URL And save to database' })
  async encodeFromUrl(
    @Body('data') sonicKeyDto: CreateSonicKeyDto,
    @UploadedFileFromUrl() file: IUploadedFile,
    @User() loggedInUser: UserDB,
    @User('sub') owner: string,
    @ValidatedLicense('key') licenseId: string,
  ) {
    const {
      destinationFolder,
      resourceOwnerObj,
    } = identifyDestinationFolderAndResourceOwnerFromUser(loggedInUser);
    const encodingStrength = sonicKeyDto.encodingStrength;
    const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(
      file,
      sonicKeyDto,
    );
    const sonickeyDoc: Partial<SonicKey> = {
      ...sonicKeyDtoWithAudioData,
      ...resourceOwnerObj,
      createdBy: loggedInUser?.sub,
    };
    return this.sonicKeyService.encodeSonicKeyFromFile({
      file,
      licenseId,
      sonickeyDoc,
      encodingStrength,
      s3destinationFolder: destinationFolder,
    });
  }

  @UseGuards(ApiKeyAuthGuard, LicenseValidationGuard)
  @Post('/create-from-binary')
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Save to database after local encode from binary.' })
  async createFormBinary(
    @Body() createSonicKeyDto: CreateSonicKeyDto,
    @User() loggedInUser: UserDB,
    @ApiKey('_id') apiKey: string,
    @ValidatedLicense('key') licenseId: string,
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
    const savedSonicKey = await this.sonicKeyService.create(sonickeyDoc);
    await this.licensekeyService
      .incrementUses(licenseId, 'encode', 1)
      .catch(async err => {
        await this.sonicKeyService.sonicKeyModel.deleteOne({
          _id: savedSonicKey.id,
        });
        throw new BadRequestException('Unable to increment the license usage!');
      });
    return savedSonicKey;
  }

  @Patch('/:sonickey')
  @UseGuards(ApiKeyAuthGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Update Sonic Keys meta data from binary including s3FileMeta',
  })
  async updateMeta(
    @Param('sonickey') sonickey: string,
    @Body() updateSonicKeyFromBinaryDto: UpdateSonicKeyFromBinaryDto,
    @User('sub') owner: string,
  ) {
    const updatedSonickey = await this.sonicKeyService.sonicKeyModel.findOneAndUpdate(
      { sonicKey: sonickey },
      updateSonicKeyFromBinaryDto,
      { new: true },
    );
    if (!updatedSonickey) {
      throw new NotFoundException(
        'Given sonickey is either not present or doest not belongs to you',
      );
    }
    return updatedSonickey;
  }
}
