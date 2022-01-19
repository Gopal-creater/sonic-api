import { CreateSonicKeyFromJobDto } from '../dtos/create-sonickey.dto';
import { UpdateSonicKeyDto } from '../dtos/update-sonickey.dto';
import { DecodeDto } from '../dtos/decode.dto';
import { EncodeDto, EncodeFromUrlDto } from '../dtos/encode.dto';
import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { JsonParsePipe } from '../../../shared/pipes/jsonparse.pipe';
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
  NotFoundException,
  Query,
  UnauthorizedException,
  InternalServerErrorException,
  Version,
} from '@nestjs/common';
import { SonickeyService } from '../services/sonickey.service';
import { S3FileMeta, SonicKey } from '../schemas/sonickey.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import * as makeDir from 'make-dir';
import { diskStorage } from 'multer';
import { appConfig } from '../../../config';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiAcceptedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import * as uniqid from 'uniqid';
import { JwtAuthGuard } from '../../auth/guards';
import { User } from '../../auth/decorators';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { DownloadDto } from '../dtos/download.dto';
import * as appRootPath from 'app-root-path';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { Response } from 'express';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { ChannelEnums } from '../../../constants/Enums';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { DetectionService } from '../../detection/detection.service';
import {
  FileFromUrlInterceptor,
  UploadedFileFromUrl,
} from '../../../shared/interceptors/FileFromUrl.interceptor';
import { LicenseValidationGuard } from '../../licensekey/guards/license-validation.guard';
import { ValidatedLicense } from '../../licensekey/decorators/validatedlicense.decorator';
import { ConditionalAuthGuard } from '../../auth/guards/conditional-auth.guard';
import { Detection } from 'src/api/detection/schemas/detection.schema';

/**
 * Prabin:
 * Our DynamoDb table has a sonickey as a hash key. So we can perform all CURD using sonickey.
 * To get all owner's sonickeys we have to create a global secondary index table.
 */

@ApiTags('SonicKeys Controller')
@Controller('sonic-keys')
export class SonickeyController {
  constructor(
    private readonly sonicKeyService: SonickeyService,
    private readonly licensekeyService: LicensekeyService,
    private readonly fileHandlerService: FileHandlerService,
    private readonly detectionService: DetectionService,
  ) {}

  // @Get('/update-channel')
  // async updateChannel() {
  //  await  this.sonicKeyService.sonicKeyModel.updateMany(
  //     { owner: 'guest' },
  //     { channel: ChannelEnums.MOBILEAPP },
  //   );

  //   await  this.sonicKeyService.sonicKeyModel.updateMany(
  //     { job: {$exists:true} },
  //     { channel: ChannelEnums.PCAPP},
  //   );

  //   await  this.sonicKeyService.sonicKeyModel.updateMany(
  //     { channel: {$exists:false} },
  //     { channel: ChannelEnums.PORTAL },
  //   );

  //   await  this.sonicKeyService.sonicKeyModel.updateMany(
  //     { channel: ChannelEnums.PORTAL },
  //     { downloadable: true },
  //   );
  // }

  @AnyApiQueryTemplate()
  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'includeGroupData', type: Boolean, required: false })
  @ApiOperation({ summary: 'Get All Sonic Keys' })
  async getAll(@Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto) {
    return this.sonicKeyService.getAll(parsedQueryDto);
  }

  @Get('/generate-unique-sonic-key')
  @ApiOperation({ summary: 'Generate unique sonic key' })
  generateUniqueSonicKey() {
    return this.sonicKeyService.generateUniqueSonicKey();
  }

  @Get('/file-download-test')
  @ApiOperation({ summary: 'Generate unique sonic key' })
  async fileDownloadTest() {
    return this.sonicKeyService.testDownloadFile();
  }

  @UseGuards(JwtAuthGuard, LicenseValidationGuard)
  @Post('/create-from-job')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save to database after local encode from job.' })
  async createForJob(
    @Body() createSonicKeyDto: CreateSonicKeyFromJobDto,
    @User('sub') owner: string,
    @Req() req: any,
  ) {
    createSonicKeyDto.owner = owner;
    return this.sonicKeyService.createFromJob(createSonicKeyDto);
  }

  @Get('/owners/:ownerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'includeGroupData', type: Boolean, required: false })
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All Sonic Keys of particular user' })
  async getOwnersKeys(
    @Param('ownerId') ownerId: string,
    @Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto,
  ) {
    parsedQueryDto.filter['owner'] = ownerId;
    return this.sonicKeyService.getAll(parsedQueryDto);
  }

  @Get('/jobs/:jobId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All Sonic Keys of particular job' })
  async getKeysByJob(
    @Param('jobId') jobId: string,
    @Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto,
  ) {
    parsedQueryDto.filter['job'] = jobId;
    return this.sonicKeyService.getAll(parsedQueryDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @AnyApiQueryTemplate()
  @ApiQuery({ name: 'includeGroupData', type: Boolean, required: false })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all sonickeys also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.sonicKeyService.getCount(queryDto);
  }

  @Get('/estimate-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all sonickeys',
  })
  async getEstimateCount() {
    return this.sonicKeyService.getEstimateCount();
  }

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
          const currentUserId = req['user']?.['sub'];
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
    // if(!sonicKeyDto.contentOwner) throw new BadRequestException("contentOwner is required")
    const licenseId = req?.validLicense?.key as string;
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
        // const userRoles = await
        const channel = ChannelEnums.PORTAL;
        const newSonicKey = {
          ...sonicKeyDtoWithAudioData,
          contentFilePath: s3UploadResult.Location,
          originalFileName: file?.originalname,
          owner: owner,
          sonicKey: sonicKey,
          channel: channel,
          downloadable: true,
          s3FileMeta: s3UploadResult,
          _id: sonicKey,
          license: licenseId,
        };
        return this.sonicKeyService.saveSonicKeyForUser(owner, newSonicKey);
      })
      .catch(err => {
        throw new InternalServerErrorException(err);
      })
      .finally(() => {
        this.fileHandlerService.deleteFileAtPath(file.path);
      });
  }

  @UseInterceptors(FileFromUrlInterceptor('mediaFile'))
  @ApiBody({
    description: 'File To Encode',
    type: EncodeFromUrlDto,
  })
  @UseGuards(ConditionalAuthGuard, LicenseValidationGuard)
  @Post('/encode-from-url')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encode File From URL And save to database' })
  encodeFromUrl(
    @Body('data') sonicKeyDto: SonicKeyDto,
    @UploadedFileFromUrl() file: IUploadedFile,
    @User('sub') owner: string,
    @ValidatedLicense('key') licenseId: string,
  ) {
    // if(!sonicKeyDto.contentOwner) throw new BadRequestException("contentOwner is required")
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

        const channel = ChannelEnums.PORTAL;
        const newSonicKey = {
          ...sonicKeyDtoWithAudioData,
          contentFilePath: s3UploadResult.Location,
          originalFileName: file?.originalname,
          owner: owner,
          sonicKey: sonicKey,
          channel: channel,
          downloadable: true,
          s3FileMeta: s3UploadResult,
          _id: sonicKey,
          license: licenseId,
        };
        return this.sonicKeyService.saveSonicKeyForUser(owner, newSonicKey);
      })
      .catch(err => {
        throw new InternalServerErrorException(err);
      })
      .finally(() => {
        this.fileHandlerService.deleteFileAtPath(file.path);
      });
  }

  @UseInterceptors(
    FileInterceptor('mediaFile', {
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
    return this.sonicKeyService
      .decodeAllKeys(file)
      .then(async ({ sonicKeys }) => {
        console.log('Detected keys from Decode', sonicKeys);
        //iterate all the sonicKeys from decode function in order to get metadata
        var sonicKeysMetadata: SonicKey[] = [];
        for await (const sonicKey of sonicKeys) {
          const validSonicKey = await this.sonicKeyService.findBySonicKey(
            sonicKey.sonicKey,
          );
          if (!validSonicKey) {
            continue;
          }
          const newDetection = await this.detectionService.detectionModel.create(
            {
              sonicKey: sonicKey.sonicKey,
              owner: validSonicKey.owner,
              sonicKeyOwnerId: validSonicKey.owner,
              sonicKeyOwnerName: validSonicKey.contentOwner,
              channel: ChannelEnums.PORTAL,
              detectedTimestamps: sonicKey.timestamps,
              detectedAt: new Date(),
            },
          );
          await newDetection.save();
          sonicKeysMetadata.push(validSonicKey);
        }
        return sonicKeysMetadata;
      })
      .catch(err => {
        this.fileHandlerService.deleteFileAtPath(file.path);
        throw new BadRequestException(err);
      });
  }

  @UseInterceptors(
    FileInterceptor('mediaFile', {
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
  @Version('2')
  @UseGuards(JwtAuthGuard)
  @Post('/decode')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Decode File and retrive key information' })
  async decodeV2(@UploadedFile() file: IUploadedFile) {
    return this.sonicKeyService
      .decodeAllKeys(file)
      .then(async ({ sonicKeys }) => {
        console.log('Detected keys from Decode', sonicKeys);
        //iterate all the sonicKeys from decode function in order to get metadata
        var sonicKeysMetadata: Detection[] = [];
        for await (const sonicKey of sonicKeys) {
          const validSonicKey = await this.sonicKeyService.findBySonicKey(
            sonicKey.sonicKey,
          );
          if (!validSonicKey) {
            continue;
          }
          const newDetection = await this.detectionService.detectionModel.create(
            {
              sonicKey: sonicKey.sonicKey,
              owner: validSonicKey.owner,
              sonicKeyOwnerId: validSonicKey.owner,
              sonicKeyOwnerName: validSonicKey.contentOwner,
              channel: ChannelEnums.PORTAL,
              detectedTimestamps: sonicKey.timestamps,
              detectedAt: new Date(),
            },
          );
          const savedDetection = await newDetection.save();
          savedDetection.sonicKey = validSonicKey;
          sonicKeysMetadata.push(savedDetection);
        }
        return sonicKeysMetadata;
      })
      .catch(err => {
        this.fileHandlerService.deleteFileAtPath(file.path);
        throw new BadRequestException(err);
      });
  }

  @UseInterceptors(
    FileInterceptor('mediaFile', {
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
  @Post(':channel/decode')
  @ApiParam({ name: 'channel', enum: [...Object.values(ChannelEnums)] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Decode File and retrive key information' })
  async decodeFromChannel(
    @UploadedFile() file: IUploadedFile,
    @Param('channel') channel: string,
  ) {
    return this.sonicKeyService
      .decodeAllKeys(file)
      .then(async ({ sonicKeys }) => {
        console.log('Detected keys from Decode', sonicKeys);
        //iterate all the sonicKeys from decode function in order to get metadata
        var sonicKeysMetadata: SonicKey[] = [];
        for await (const sonicKey of sonicKeys) {
          const validSonicKey = await this.sonicKeyService.findBySonicKey(
            sonicKey.sonicKey,
          );
          if (!validSonicKey) {
            continue;
          }
          const newDetection = await this.detectionService.detectionModel.create(
            {
              sonicKey: sonicKey,
              owner: validSonicKey.owner,
              sonicKeyOwnerId: validSonicKey.owner,
              sonicKeyOwnerName: validSonicKey.contentOwner,
              channel: channel,
              detectedAt: new Date(),
              detectedTimestamps: sonicKey.timestamps,
            },
          );
          await newDetection.save();
          sonicKeysMetadata.push(validSonicKey);
        }
        return sonicKeysMetadata;
      })
      .catch(err => {
        this.fileHandlerService.deleteFileAtPath(file.path);
        throw new BadRequestException(err);
      });
  }

  @UseInterceptors(
    FileInterceptor('mediaFile', {
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
  @Version('2')
  @UseGuards(JwtAuthGuard)
  @Post(':channel/decode')
  @ApiParam({ name: 'channel', enum: [...Object.values(ChannelEnums)] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Decode File and retrive key information' })
  async decodeFromChannelV2(
    @UploadedFile() file: IUploadedFile,
    @Param('channel') channel: string,
  ) {
    return this.sonicKeyService
      .decodeAllKeys(file)
      .then(async ({ sonicKeys }) => {
        console.log('Detected keys from Decode', sonicKeys);
        //iterate all the sonicKeys from decode function in order to get metadata
        var sonicKeysMetadata: Detection[] = [];
        for await (const sonicKey of sonicKeys) {
          const validSonicKey = await this.sonicKeyService.findBySonicKey(
            sonicKey.sonicKey,
          );
          if (!validSonicKey) {
            continue;
          }
          const newDetection = await this.detectionService.detectionModel.create(
            {
              sonicKey: sonicKey,
              owner: validSonicKey.owner,
              sonicKeyOwnerId: validSonicKey.owner,
              sonicKeyOwnerName: validSonicKey.contentOwner,
              channel: channel,
              detectedAt: new Date(),
              detectedTimestamps: sonicKey.timestamps,
            },
          );
          const savedDetection = await newDetection.save();
          savedDetection.sonicKey = validSonicKey;
          sonicKeysMetadata.push(savedDetection);
        }
        return sonicKeysMetadata;
      })
      .catch(err => {
        this.fileHandlerService.deleteFileAtPath(file.path);
        throw new BadRequestException(err);
      });
  }

  @Patch('/:sonickey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Sonic Keys meta data' })
  async updateMeta(
    @Param('sonickey') sonickey: string,
    @Body() updateSonicKeyDto: UpdateSonicKeyDto,
    @User('sub') owner: string,
  ) {
    const updatedSonickey = await this.sonicKeyService.sonicKeyModel.findOneAndUpdate(
      { sonicKey: sonickey, owner: owner },
      updateSonicKeyDto,
      { new: true },
    );
    if (!updatedSonickey) {
      throw new NotFoundException(
        'Given sonickey is either not present or doest not belongs to you',
      );
    }
    return updatedSonickey;
  }

  @Delete('/:sonickey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Sonic Key data' })
  async delete(
    @Param('sonickey') sonickey: string,
    @User('sub') owner: string,
  ) {
    const deletedSonickey = await this.sonicKeyService.sonicKeyModel.deleteOne({
      sonicKey: sonickey,
      owner: owner,
    });
    if (!deletedSonickey) {
      throw new NotFoundException(
        'Given sonickey is either not present or doest not belongs to you',
      );
    }
    return deletedSonickey;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/download-file')
  @ApiOperation({ summary: 'Secure Download of a file' })
  async downloadFile(
    @Body() downloadDto: DownloadDto,
    @User('sub') userId: string,
    @Res() response: Response,
  ) {
    /* Checks for authenticated user in order to download the file */
    if (!downloadDto?.fileURL?.includes(userId)) {
      throw new UnauthorizedException('You are not the owner of this file');
    }

    const filePath = `${appRootPath.toString()}/` + downloadDto.fileURL;
    console.log('file-path:', filePath);
    const isFileExist = await this.fileHandlerService.fileExistsAtPath(
      filePath,
    );
    if (!isFileExist) {
      throw new BadRequestException('Sorry, file not found');
    }
    return response.sendFile(filePath, err => {
      if (err) {
        console.log(err);
        return response.status(400).json({ message: 'Error sending file.' });
      }
    });
  }
}
