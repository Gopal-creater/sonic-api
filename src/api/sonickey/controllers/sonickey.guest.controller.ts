import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { JsonParsePipe } from '../../../shared/pipes/jsonparse.pipe';
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  ClassSerializerInterceptor,
  Get,
  Query,
} from '@nestjs/common';
import { SonickeyService } from '../services/sonickey.service';
import { SonicKey } from '../schemas/sonickey.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import * as makeDir from 'make-dir';
import { diskStorage } from 'multer';
import { appConfig } from '../../../config';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody
} from '@nestjs/swagger';
import * as uniqid from 'uniqid';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { PublicEncodeDto } from '../dtos/public-encode.dto';
import { PublicDecodeDto } from '../dtos/public-decode.dto';

/**
 * Prabin:
 * Our DynamoDb table has a sonickey as a hash key. So we can perform all CURD using sonickey.
 * To get all owner's sonickeys we have to create a global secondary index table.
 */


@ApiTags('Public Controller')
@Controller('sonic-keys-guest')
export class SonickeyGuestController {
  constructor(
    private readonly sonicKeyService: SonickeyService,
    private readonly fileHandlerService: FileHandlerService,
  ) {}


  @UseInterceptors(
    FileInterceptor('mediaFile', {
      // Check the mimetypes to allow for upload
      // fileFilter: (req: any, file: any, cb: any) => {
      //   const mimetype = file.mimetype as string;
      //   if (mimetype.includes('audio')) {
      //     // Allow storage of file
      //     cb(null, true);
      //   } else {
      //     // Reject file
      //     cb(new BadRequestException('Unsupported file type'), false);
      //   }
      // },
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const currentUserId = 'guest';
          const imagePath = await makeDir(
            `${appConfig.MULTER_DEST}/${currentUserId}`,
          );
          await makeDir(
            `${appConfig.MULTER_DEST}/${currentUserId}/encodedFiles`,
          );
          cb(null, imagePath);
        },
        filename: (req, file, cb) => {
          let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
          const randomName = uniqid();
          cb(null, `${randomName}-${orgName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File To Encode',
    type: PublicEncodeDto,
  })
  @Post('/encode')
  @ApiOperation({ summary: 'Encode File And save to database' })
  encode(
    @Body('sonickey', JsonParsePipe) sonicKeyDto: SonicKeyDto,
    @UploadedFile() file: IUploadedFile,
    @Req() req: any,
  ) {
    console.log('file', file);
    const owner = 'guest'
    const licenseId = "guest_license"
    return this.sonicKeyService
      .encode(file, sonicKeyDto.encodingStrength)
      .then(async data => {
        const sonicKeyDtoWithMeta = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(file,sonicKeyDto)
        const newSonicKey = new this.sonicKeyService.sonicKeyModel({
            ...sonicKeyDtoWithMeta,
              contentFilePath: data.downloadFileUrl,
              owner: owner,
              sonicKey: data.sonicKey,
              license: licenseId
          });
          return newSonicKey.save().finally(() => {
            this.fileHandlerService.deleteFileAtPath(file.path);
          });
      });
  }

  @UseInterceptors(
    FileInterceptor('mediaFile', {
      // Check the mimetypes to allow for upload
      // fileFilter: (req: any, file: any, cb: any) => {
      //   const mimetype = file.mimetype as string;
      //   if (mimetype.includes('audio')) {
      //     // Allow storage of file
      //     cb(null, true);
      //   } else {
      //     // Reject file
      //     cb(new BadRequestException('Unsupported file type'), false);
      //   }
      // },
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const currentUserId = 'guest';
          const imagePath = await makeDir(
            `${appConfig.MULTER_DEST}/${currentUserId}`,
          );
          cb(null, imagePath);
        },
        filename: (req, file, cb) => {
          let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
          const randomName = uniqid();
          cb(null, `${randomName}-${orgName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File To Decode',
    type: PublicDecodeDto,
  })
  @Post('/decode')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Decode File and retrive key information' })
  async decode(@UploadedFile() file: IUploadedFile) {
    return this.sonicKeyService
      .decodeAllKeys(file)
      .then(async ({ sonicKeys }) => {
        console.log('Detected keys from Decode', sonicKeys);
        //iterate all the sonicKeys from decode function in order to get metadata
        var sonicKeysMetadata:SonicKey[] = [];
        for await (const sonicKey of sonicKeys) {
          const metadata = await this.sonicKeyService.findBySonicKey(sonicKey);
          if (!metadata) {
            continue;
          }
          sonicKeysMetadata.push(metadata);
        }
        return sonicKeysMetadata;
      });
  }
}
