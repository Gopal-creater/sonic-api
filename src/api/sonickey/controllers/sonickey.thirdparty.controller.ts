import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  InternalServerErrorException,
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
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LicenseValidationGuard } from '../../auth/guards/license-validation.guard';
import { User } from 'src/api/auth/decorators';
import { ValidatedLicense } from '../../auth/decorators/validatedlicense.decorator';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { ApiKeyAuthGuard } from '../../auth/guards/apikey-auth.guard';


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
  @Post('/encode-from-url')
  @ApiOperation({ summary: 'Encode File From URL And save to database' })
  encodeFromUrl(
    @Body('data') sonicKeyDto: SonicKeyDto,
    @UploadedFileFromUrl() file: IUploadedFile,
    @User('sub') owner: string,
    @ValidatedLicense('key') licenseId:string
  ) {
    var s3UploadResult: S3FileMeta;
    var sonicKey: string;
    return this.sonicKeyService
      .encodeAndUploadToS3(file, owner, sonicKeyDto.encodingStrength)
      .then(data => {
        s3UploadResult = data.s3UploadResult as S3FileMeta;
        sonicKey = data.sonicKey;
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
        const newSonicKey = new this.sonicKeyService.sonicKeyModel({
          ...sonicKeyDtoWithAudioData,
          contentFilePath: s3UploadResult.Location,
          owner: owner,
          sonicKey: sonicKey,
          channel: channel,
          downloadable: true,
          s3FileMeta: s3UploadResult,
          _id: sonicKey,
          license: licenseId,
        });
        return newSonicKey.save();
      })
      .catch(err => {
        throw new InternalServerErrorException(err);
      })
      .finally(() => {
        this.fileHandlerService.deleteFileAtPath(file.path);
      });
  }

}
