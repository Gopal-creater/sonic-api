import { CreateSonicKeyFromJobDto } from './dtos/create-sonickey.dto';
import { UpdateSonicKeyDto } from './dtos/update-sonickey.dto';
import { DecodeDto } from './dtos/decode.dto';
import { EncodeDto } from './dtos/encode.dto';
import { SonicKeyDto } from './dtos/sonicKey.dto';
import { IUploadedFile } from './../../shared/interfaces/UploadedFile.interface';
import { KeygenService } from './../../shared/modules/keygen/keygen.service';
import { JsonParsePipe } from './../../shared/pipes/jsonparse.pipe';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
  UseGuards,
  Patch,
  Res,
} from '@nestjs/common';
import { SonickeyService } from './sonickey.service';
import { SonicKey } from '../../schemas/sonickey.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import * as makeDir from 'make-dir';
import { diskStorage } from 'multer';
import { appConfig } from '../../config';
import { LicenseValidationGuard } from '../auth/guards/license-validation.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import * as uniqid from 'uniqid';
import { JwtAuthGuard } from '../auth/guards';
import { User } from '../auth/decorators';
import { FileHandlerService } from '../../shared/services/file-handler.service';
import { DownloadDto } from './dtos/download.dto';
import * as appRootPath from 'app-root-path';

/**
 * Prabin:
 * Our DynamoDb table has a sonickey as a hash key. So we can perform all CURD using sonickey.
 * To get all owner's sonickeys we have to create a global secondary index table.
 */

@ApiTags('SonicKeys Contrller')
@Controller('sonic-keys')
export class SonickeyController {
  constructor(
    private readonly sonicKeyService: SonickeyService,
    private readonly keygenService: KeygenService,
    private readonly fileHandlerService:FileHandlerService
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All Sonic Keys' })
  async getAll() {
    return await this.sonicKeyService.getAll();
  }

  @Get('/generate-unique-sonic-key')
  @ApiOperation({ summary: 'Generate unique sonic key' })
  async generateUniqueSonicKey() {
    return await this.sonicKeyService.generateUniqueSonicKey();
  }

  // @UseGuards(JwtAuthGuard, LicenseValidationGuard)
  // @Post('/create-from-job')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Save to database after local encode from job.' })
  // async createForJob(
  //   @Body() createSonicKeyDto: CreateSonicKeyFromJobDto,
  //   @User('sub') owner: string,
  //   @Req() req: any,
  // ) {
  //   createSonicKeyDto.owner=owner
  //   return this.sonicKeyService.createFromJob(createSonicKeyDto);
  // }

  @Get('/owner/:ownerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All Sonic Keys of particular user' })
  async getOwnersKeys(@Param('ownerId') ownerId: string) {
    const keys =  await this.sonicKeyService.findByOwner(ownerId);
    console.log("keys length",keys.length);
    return keys
  }

  @Get('/jobs/:jobId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All Sonic Keys of particular job' })
  async getKeysByJob(@Param('jobId') jobId: string) {
    return await this.sonicKeyService.findByJob(jobId);
  }

  // @Get('/search')
  // @ApiOperation({ summary: 'Search on sonicKey' })
  // async search() {
  //   return this.sonicKeyService.search();
  // }

  @Get('/:sonickey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single SonicKey' })
  async getOne(@Param('sonickey') sonickey: string) {
    return this.sonicKeyService.findBySonicKeyOrFail(sonickey);
  }

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
          const currentUserId = req['user']['sub'];
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
    type: EncodeDto,
  })
  @UseGuards(JwtAuthGuard, LicenseValidationGuard)
  @Post('/encode')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encode File And save to database' })
  encode(
    @Body('data', JsonParsePipe) sonicKeyDto: SonicKeyDto,
    @UploadedFile() file: IUploadedFile,
    @User('sub') owner: string,
    @Req() req: any,
  ) {
    console.log("file",file);
    
    const licenseId = req?.validLicense?.id as string;
    var downloadFileUrl: string;
    var outFilePath: string;
    var sonicKey: string;
    return this.sonicKeyService
      .encode(file, sonicKeyDto.encodingStrength)
      .then(data => {
        downloadFileUrl = data.downloadFileUrl;
        outFilePath = data.outFilePath;
        sonicKey = data.sonicKey;
        console.log('Increment Usages upon successfull encode');
        return this.keygenService.incrementUsage(licenseId, 1);
      })
      .then(async keygenResult => {
        if (keygenResult['errors']) {
          throw new BadRequestException(
            'Unable to increment the license usage!',
          );
        }
        console.log('Going to save key in db.');
        const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(
          file,
          sonicKeyDto,
        );

        
        const dataToSave = new SonicKey(Object.assign(sonicKeyDtoWithAudioData,{
          contentFilePath:downloadFileUrl,
          owner: owner,
          sonicKey: sonicKey,
          licenseId: licenseId, //modified
        }))
        return this.sonicKeyService.sonicKeyRepository
          .put(dataToSave)
          .finally(() => {
            this.fileHandlerService.deleteFileAtPath(file.path);
          });
      });
  }

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
          const currentUserId = req['user']['sub'];
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
    type: DecodeDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/decode')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Decode File and retrive key information' })
  async decode(@UploadedFile() file: IUploadedFile) {
    return this.sonicKeyService.decodeAllKeys(file).then(async({ sonicKeys }) => {
      console.log("Detected keys from Decode", sonicKeys);
      //iterate all the sonicKeys from decode function in order to get metadata
      var sonicKeysMetadata = [];
      for await (const sonicKey of sonicKeys) {
        const metadata = await this.sonicKeyService.findBySonicKey(sonicKey);
        if(!metadata){
          continue;
        }
        sonicKeysMetadata.push(metadata);
      }
      return sonicKeysMetadata;
    });
  }

  @Patch('/:sonickey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Sonic Keys meta data' })
  async updateMeta(
    @Param('sonickey') sonickey: string,
    @Body() updateSonicKeyDto: UpdateSonicKeyDto,
  ) {
    const oldKey = await this.sonicKeyService.findBySonicKeyOrFail(sonickey);
    const dataToUpdate = new SonicKey(Object.assign(oldKey, updateSonicKeyDto));
    return this.sonicKeyService.sonicKeyRepository.update(dataToUpdate);
  }

  @Delete('/:sonickey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Sonic Key data' })
  async delete(@Param('sonickey') sonickey: string) {
    const found = await this.sonicKeyService.findBySonicKeyOrFail(sonickey);
    return this.sonicKeyService.sonicKeyRepository.delete(found);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/download-file')
  @ApiOperation({ summary: 'Secure Download of a file' })
  async downloadFile(@Body() data: DownloadDto, @User('sub') userId: string, @Res() response): Promise<any> {
    try {
      /* Checks for authenticated user in order to download the file */
      var checkForAuth = false;
      console.log('url',data.fileURL);
      console.log('uid',userId)
      if(data.fileURL.includes(userId)){
        console.log('Inside if')
        checkForAuth = true;
      }
      if (checkForAuth == false) {
        throw new BadRequestException('You are not authenticated to download the file.');
      }

      /*TODO : Check to accept only audio and video file content types*/
      if (!(data.contentType.includes('audio') || data.contentType.includes('video'))) {
        throw new BadRequestException('Only audio and video files are supported');
      }

      /*TODO : Convert into a readable stream by passing the file path. The readable stream will return the file using pipe method*/
      const filePath = `${appRootPath.toString()}/` + data.fileURL;
      console.log('file-path:', filePath);
      const fileStream = await this.fileHandlerService.downloadFileFromPath(filePath);

      response.set({
        'Content-Type': data.contentType,
      });

      /*TODO: Return the file and close the stream*/
      return fileStream.pipe(response).on('close', function (err) {
        console.log('Stream has been destroyed and file has been closed');
      });

    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('/new/create-table')
  @ApiOperation({ summary: 'Create Sonic Key table in Dynamo DB' })
  async createTable() {
    return await this.sonicKeyService.sonicKeyRepository
      .ensureTableExistsAndCreate()
      .then(() => 'Created New Table');
  }
}
