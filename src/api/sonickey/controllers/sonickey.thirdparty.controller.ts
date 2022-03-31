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
import { FileFromUrlInterceptor, UploadedFileFromUrl } from '../../../shared/interceptors/FileFromUrl.interceptor';
import { EncodeFromUrlDto } from '../dtos/encode.dto';
import { UseGuards, BadRequestException, Param, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from 'src/api/auth/decorators';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { CreateSonicKeyFromBinaryDto } from '../dtos/create-sonickey.dto';
import { ApiKeyAuthGuard } from '../../auth/guards/apikey-auth.guard';
import { LicenseValidationGuard } from '../../licensekey/guards/license-validation.guard';
import { ValidatedLicense } from '../../licensekey/decorators/validatedlicense.decorator';
import { ApiKey } from '../../api-key/decorators/apikey.decorator';
import { UpdateSonicKeyFromBinaryDto } from '../dtos/update-sonickey.dto';


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
  encodeFromUrl(
    @Body('data') sonicKeyDto: SonicKeyDto,
    @UploadedFileFromUrl() file: IUploadedFile,
    @User('sub') owner: string,
    @ValidatedLicense('key') licenseId:string
  ) {
    var s3UploadResult: S3FileMeta;
    var s3OriginalFileUploadResult:S3FileMeta;
    var sonicKey: string;
    var fingerPrintMetaData:any
    return this.sonicKeyService
      .encodeAndUploadToS3(file, owner, sonicKeyDto.encodingStrength)
      .then(data => {
        s3UploadResult = data.s3UploadResult;
        s3OriginalFileUploadResult = data.s3OriginalFileUploadResult
        sonicKey = data.sonicKey;
        fingerPrintMetaData=data.fingerPrintMetaData
        console.log('Increment Usages upon successfull encode');
        return this.licensekeyService.incrementUses(licenseId, 'encode', 1);
      })
      .then(async result => {
        console.log('Going to save key in db.');
        const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(
          file,
          sonicKeyDto,
        );

        const channel = ChannelEnums.THIRDPARTY;
        const newSonicKey = {
          ...sonicKeyDtoWithAudioData,
          contentFilePath: s3UploadResult.Location,
          originalFileName:file?.originalname,
          owner: owner,
          sonicKey: sonicKey,
          channel: channel,
          downloadable: true,
          s3FileMeta: s3UploadResult,
          s3OriginalFileMeta:s3OriginalFileUploadResult,
          fingerPrintMetaData:fingerPrintMetaData,
          _id: sonicKey,
          license: licenseId,
        };
        return this.sonicKeyService.saveSonicKeyForUser(owner,newSonicKey)
      })
      .catch(err => {
        throw new InternalServerErrorException(err);
      })
      .finally(() => {
        this.fileHandlerService.deleteFileAtPath(file.path);
      });
  }

  @UseGuards(ApiKeyAuthGuard, LicenseValidationGuard)
  @Post('/create-from-binary')
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Save to database after local encode from binary.' })
  async createFormBinary(
    @Body() createSonicKeyDto: CreateSonicKeyFromBinaryDto,
    @User('sub') customer: string,
    @ApiKey('_id') apiKey: string,
    @ValidatedLicense('key') licenseKey: string
  ) {
    const channel = ChannelEnums.BINARY
    const newSonicKey = {
      ...createSonicKeyDto,
      owner:customer,
      apiKey:apiKey,
      channel:channel,
      license: licenseKey,
      _id:createSonicKeyDto.sonicKey
    };
    const savedSonicKey = await this.sonicKeyService.createFromBinaryForUser(customer,newSonicKey);
     await this.licensekeyService.incrementUses(licenseKey,"encode", 1)
     .catch(async err=>{
      await this.sonicKeyService.sonicKeyModel.deleteOne({_id:savedSonicKey.id})
      throw new BadRequestException(
        'Unable to increment the license usage!',
      );
     })
    return savedSonicKey
  }

  @Patch('/:sonickey')
  @UseGuards(ApiKeyAuthGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Update Sonic Keys meta data from binary including s3FileMeta' })
  async updateMeta(
    @Param('sonickey') sonickey: string,
    @Body() updateSonicKeyFromBinaryDto: UpdateSonicKeyFromBinaryDto,
    @User('sub') owner: string,
  ) {
    const updatedSonickey = await this.sonicKeyService.sonicKeyModel.findOneAndUpdate(
      { sonicKey: sonickey, owner: owner },
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
