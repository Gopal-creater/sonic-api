import { SonicKeyDto } from '../../sonickey/dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { SonickeyService } from '../../sonickey/sonickey.service';
import { SonicKey } from '../../../schemas/sonickey.schema';
import { ExtDecodeDto } from './dtos/extdecode.dto';
import { ExtEncodeDto } from './dtos/extencode.dto';
import { JsonParsePipe } from '../../../shared/pipes/jsonparse.pipe';
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ClassSerializerInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { ExternalSonickeyService } from './externalsonickey.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as makeDir from 'make-dir';
import { diskStorage } from 'multer';
import {appConfig} from '../../../config';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as uniqid from 'uniqid';
import { log } from 'console';


@ApiTags(
  'External SonicKeys Controller (Public for now, But in future will be protected by API KEY)',
)
@Controller('external/sonickeys')
export class ExternalSonickeyController {
  constructor(
    private readonly externalSonicKeyService: ExternalSonickeyService,
    private readonly sonickeyService: SonickeyService,
  ) {}

  // @UseInterceptors(
  //   FileInterceptor('mediaFile', {
  //     // Check the mimetypes to allow for upload
  //     fileFilter: (req: any, file: any, cb: any) => {
  //       const mimetype = file.mimetype as string;
  //       if (mimetype.includes('audio')) {
  //         // Allow storage of file
  //         cb(null, true);
  //       } else {
  //         // Reject file
  //         cb(new BadRequestException('Unsupported file type'), false);
  //       }
  //     },
  //     storage: diskStorage({
  //       destination: async (req, file, cb) => {
  //         const currentUserId = 'fromExternal'; //This is a directory which will be used by external application for encode file
  //         const imagePath = await makeDir(
  //           `${appConfig.MULTER_DEST}/${currentUserId}`,
  //         );
  //         await makeDir(`${appConfig.MULTER_DEST}/${currentUserId}/encodedFiles`);
  //         cb(null, imagePath);
  //       },
  //       filename: (req, file, cb) => {
  //         const uniqueId = uniqid();
  //         let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
  //         //Replcae all non characters and digits with _
  //         cb(null, `${uniqueId}-${orgName}`);
  //       },
  //     }),
  //   }),
  // )
  // @Post('/encode')
  // @ApiConsumes('multipart/form-data')
  // @ApiOperation({ summary: 'Encode File' })
  // @ApiBody({
  //   description: 'File To Encode',
  //   type: ExtEncodeDto,
  // })
  // encode(
  //   @Body('data', JsonParsePipe) sonicKeyDto:SonicKeyDto ,
  //   @UploadedFile() file: IUploadedFile,
  // ) {
  //   var downloadFileUrl: string;
  //   var outFilePath: string;
  //   var sonicKey: string;
  //   return this.sonickeyService
  //     .encode(file, sonicKeyDto.encodingStrength)
  //     .then(async data => {
  //       downloadFileUrl = data.downloadFileUrl;
  //       outFilePath = data.outFilePath;
  //       sonicKey = data.sonicKey;
  //       console.log('Going to save key in db.');
  //       const sonicKeyDtoWithAudioData = await this.sonickeyService.autoPopulateSonicContentWithMusicMetaForFile(
  //         file,
  //         sonicKeyDto,
  //       );
  //       const dataToSave = Object.assign(sonicKeyDtoWithAudioData,new SonicKey({
  //         owner: 'rmTestUser',
  //         sonicKey: sonicKey,
  //       })) as SonicKey;
  //       return this.sonickeyService.sonicKeyRepository
  //         .put(dataToSave)
  //     })
  // }

  //Decode Section
  @UseInterceptors(
    FileInterceptor('mediaFile', {
        // Check the mimetypes to allow for upload
        fileFilter: (req: any, file: any, cb: any) => {
          const mimetype = file.mimetype as string;
          if (mimetype.includes('audio')) {
            // Allow storage of file
            cb(null, true);
          } else {
            // Reject file
            cb(new BadRequestException('Unsupported file type'), false);
          }
        },
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const currentUserId = 'fromExternal'; //This is a directory which will be used by external application for decode file
          const imagePath = await makeDir(
            `${appConfig.MULTER_DEST}/${currentUserId}`,
          );
          cb(null, imagePath);
        },
        filename: (req, file, cb) => {
          const uniqueId = uniqid();
          let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
          cb(null, `${uniqueId}-${orgName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File To Decode',
    type: ExtDecodeDto,
  })
  @Post('/decode')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Decode File' })
  async decode(@UploadedFile() file: IUploadedFile) {
    return this.sonickeyService.decodeAllKeys(file).then(async({ sonicKeys }) => {
      console.log("Detected keys from Decode", sonicKeys);
      //iterate all the sonicKeys from decode function in order to get metadata
      var sonicKeysMetadata:SonicKey[] = [];
      for await (const sonicKey of sonicKeys) {
        const metadata = await this.sonickeyService.findBySonicKey(sonicKey);
       console.log("metadata",metadata);
       
        if(!metadata){
          continue;
        }
        sonicKeysMetadata.push(metadata);
      }
      return sonicKeysMetadata;
    });
  }
}
