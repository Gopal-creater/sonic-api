import { CreateSonicKeyDto, CreateSonicKeyFromJobDto } from '../dtos/create-sonickey.dto';
import {
  UpdateSonicKeyDto,
  UpdateSonicKeyFingerPrintMetaDataDto,
} from '../dtos/update-sonickey.dto';
import { DecodeDto } from '../dtos/decode.dto';
import {
  EncodeDto,
  EncodeFromFileDto,
  EncodeFromTrackDto,
  EncodeFromQueueDto,
  EncodeFromUrlDto,
} from '../dtos/encode.dto';
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
  MessageEvent,
  Sse,
  ClassSerializerInterceptor,
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
  ApiSecurity,
} from '@nestjs/swagger';
import { interval, Observable } from 'rxjs';
import * as uniqid from 'uniqid';
import { JwtAuthGuard } from '../../auth/guards';
import { RolesAllowed, User } from '../../auth/decorators';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { DownloadDto } from '../dtos/download.dto';
import * as appRootPath from 'app-root-path';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { Response } from 'express';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import {
  ChannelEnums,
  FingerPrintEvents,
  FingerPrintStatus,
  Roles,
} from '../../../constants/Enums';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { DetectionService } from '../../detection/detection.service';
import {
  FileFromUrlInterceptor,
  UploadedFileFromUrl,
} from '../../../shared/interceptors/FileFromUrl.interceptor';
import { FileFromTrackInterceptor,UploadedFileFromTrack,CurrentTrack } from '../../../shared/interceptors/FileFromTrack.interceptor';
import { LicenseValidationGuard } from '../../licensekey/guards/license-validation.guard';
import { ValidatedLicense } from '../../licensekey/decorators/validatedlicense.decorator';
import { ConditionalAuthGuard } from '../../auth/guards/conditional-auth.guard';
import { Detection } from 'src/api/detection/schemas/detection.schema';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { UserDB } from '../../user/schemas/user.db.schema';
import { toObjectId } from 'src/shared/utils/mongoose.utils';
import * as _ from 'lodash';
import { BulkEncodeWithQueueLicenseValidationGuard } from 'src/api/licensekey/guards/job-license-validation.guard';
import { ApiKeyAuthGuard } from 'src/api/auth/guards/apikey-auth.guard';
import { identifyDestinationFolderAndResourceOwnerFromUser } from 'src/shared/utils';
import { Track } from 'src/api/track/schemas/track.schema';
import { EncodeSecurityGuard } from '../guards/encode-security.guard';
import { UpdateSonicKeySecurityGuard } from '../guards/update-sonickey-security.guard';
import { DeleteSonicKeySecurityGuard } from '../guards/delete-sonickey-security.guard';
import { EncodeSecurityInterceptor } from '../interceptors/encode-security.interceptor';

@ApiTags('SonicKeys Controller')
@Controller('sonic-keys')
export class SonickeyController {
  constructor(
    private readonly sonicKeyService: SonickeyService,
    public readonly licensekeyService: LicensekeyService,
    private readonly fileHandlerService: FileHandlerService,
    private readonly detectionService: DetectionService,
  ) {}

  @AnyApiQueryTemplate({
    additionalHtmlDescription: `<div>
      To Get sonickeys for specific company ?company=companyId <br/>
      To Get sonickeys for specific partner ?partner=partnerId <br/>
      To Get sonickeys for specific user ?owner=ownerId
    <div>`,
  })
  @ApiQuery({
    name: 'channel',
    enum: [...Object.values(ChannelEnums), 'ALL'],
    required: false,
  })
  @Get('/')
  @RolesAllowed()
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List Sonic Keys' })
  async getAll(
    @Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto,
    @User() loggedInUser: UserDB,
  ) {
    return this.sonicKeyService.getAll(parsedQueryDto);
  }

  @Post('/encode-bulk/companies/:companyId/clients/:clientId')
  @UseGuards(ApiKeyAuthGuard, BulkEncodeWithQueueLicenseValidationGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary:
      'API for companies to import their media to sonic on behalf of their user',
  })

  async encodeToSonicFromPath(
    @Param('companyId') company: string,
    @Param('clientId') client: string,
    @User('sub') owner: string,
    @ValidatedLicense('key') license: string,
    @Body() encodeFromQueueDto: EncodeFromQueueDto,
  ) {
    if (client !== owner) {
      throw new BadRequestException("client not matched with apikey's owner");
    }
    owner = owner;
    company = company;
    license = license;
    return this.sonicKeyService.encodeBulkWithQueue(
      owner,
      company,
      license,
      encodeFromQueueDto,
    );
  }

  @Get('/encode-bulk/companies/:companyId/get-job-status/:jobId')
  @UseGuards(ApiKeyAuthGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Get Job Status From Queue' })
  async getJobStatusFromQueue(
    @Param('companyId') companyId: string,
    @Param('jobId') jobId: string,
  ) {
    const job = await this.sonicKeyService.getJobStatus(jobId);
    if (!job) {
      throw new NotFoundException('Job doesnot exists or already completed');
    }
    if (job.failedReason) {
      return {
        completed: false,
        error: true,
        failedReason: job.failedReason,
        stacktrace: job.stacktrace,
        job: job,
      };
    }
    if (job.finishedOn) {
      return {
        completed: true,
        job: job,
      };
    } else {
      return {
        completed: false,
        job: job,
      };
    }
  }

  @Get('/generate-unique-sonic-key')
  @ApiOperation({ summary: 'Generate unique sonic key' })
  generateUniqueSonicKey() {
    return this.sonicKeyService.generateUniqueSonicKey();
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

  @RolesAllowed(Roles.ADMIN)
  @Get('/list-sonickeys')
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'List Sonic Keys' })
  async listSonickeys(
    @Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto,
  ) {
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
    const key = await  this.sonicKeyService.findOne({sonickey:sonickey});
    if(!key){
      return new NotFoundException()
    }
    return key
  }

  @UseInterceptors(
    FileInterceptor('mediaFile', {
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
  async encode(
    @Body('data', JsonParsePipe) sonicKeyDto: SonicKeyDto,
    @UploadedFile() file: IUploadedFile,
    @User('sub') owner: string,
    @Req() req: any,
  ) {
    // if(!sonicKeyDto.contentOwner) throw new BadRequestException("contentOwner is required")
    const licenseId = req?.validLicense?.key as string;
    var s3UploadResult: S3FileMeta;
    var s3OriginalFileUploadResult: S3FileMeta;
    var sonicKey: string;
    var fingerPrintMetaData: any;
    var fingerPrintErrorData: any;
    var fingerPrintStatus: string;
    return this.sonicKeyService
      .encodeAndUploadToS3(file, owner, sonicKeyDto.encodingStrength)
      .then(data => {
        s3UploadResult = data.s3UploadResult;
        s3OriginalFileUploadResult = data.s3OriginalFileUploadResult;
        sonicKey = data.sonicKey;
        fingerPrintMetaData = data.fingerPrintMetaData;
        fingerPrintStatus = data.fingerPrintStatus;
        fingerPrintErrorData = data.fingerPrintErrorData;
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
          s3OriginalFileMeta: s3OriginalFileUploadResult,
          fingerPrintMetaData: fingerPrintMetaData,
          fingerPrintErrorData: fingerPrintErrorData,
          fingerPrintStatus: fingerPrintStatus,
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
          const loggedInUser = req['user'] as UserDB;
          var filePath: string;
          if (loggedInUser.partner) {
            filePath = await makeDir(
              `${appConfig.MULTER_DEST}/partners/${loggedInUser.partner?.id}`,
            );
          } else if (loggedInUser.company) {
            filePath = await makeDir(
              `${appConfig.MULTER_DEST}/companies/${loggedInUser.company?.id}`,
            );
          } else {
            filePath = await makeDir(
              `${appConfig.MULTER_DEST}/${loggedInUser?.sub}`,
            );
          }
          cb(null, filePath);
        },
        filename: (req, file, cb) => {
          let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
          const randomName = uniqid();
          cb(null, `${randomName}-${orgName}`);
        },
      }),
    }),
    EncodeSecurityInterceptor
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File To Encode',
    type: EncodeFromFileDto,
  })
  @RolesAllowed()
  @UseGuards(JwtAuthGuard,RoleBasedGuard,LicenseValidationGuard)
  @Post('/encode-from-file')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encode File And save to database & into track table' })
  async encodeByFile(
    @Body('data',JsonParsePipe) sonicKeyDto: CreateSonicKeyDto,
    @UploadedFile() file: IUploadedFile,
    @User() loggedInUser: UserDB,
    @User('sub') owner: string,
    @ValidatedLicense('key') licenseId: string,
  ) {
    console.log("sonicKeyDto",sonicKeyDto)
    const {
      destinationFolder,
      resourceOwnerObj,
    } = identifyDestinationFolderAndResourceOwnerFromUser(loggedInUser);
    const encodingStrength = sonicKeyDto.encodingStrength
    const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(
      file,
      sonicKeyDto,
    );
    const sonickeyDoc:Partial<SonicKey>={
      ...sonicKeyDtoWithAudioData,
      ...resourceOwnerObj,
      createdBy:loggedInUser?.sub
    }
    return this.sonicKeyService.encodeSonicKeyFromFile({
      file,
      licenseId,
      sonickeyDoc,
      encodingStrength,
      s3destinationFolder:destinationFolder
    })
  }

  @UseInterceptors(FileFromTrackInterceptor('track'))
  @ApiBody({
    description: 'File To Encode',
    type: EncodeFromTrackDto,
  })
  @RolesAllowed()
  @UseGuards(JwtAuthGuard,RoleBasedGuard, LicenseValidationGuard,EncodeSecurityGuard)
  @Post('/encode-from-track')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encode File And save to database & into track table' })
  async encodeByTrack(
    @Body('data') sonicKeyDto: CreateSonicKeyDto,
    @CurrentTrack() track: Track,
    @UploadedFileFromTrack() file: IUploadedFile,
    @User() loggedInUser: UserDB,
    @ValidatedLicense('key') licenseId: string,
  ) {
    const {
      destinationFolder,
      resourceOwnerObj,
    } = identifyDestinationFolderAndResourceOwnerFromUser(loggedInUser);

    sonicKeyDto.contentFileType=sonicKeyDto.contentFileType||track.mimeType
    sonicKeyDto.contentOwner=sonicKeyDto.contentOwner||track.artist
    sonicKeyDto.contentName=sonicKeyDto.contentName||track.title
    sonicKeyDto.contentDuration=sonicKeyDto.contentDuration||track.duration
    sonicKeyDto.contentSize=sonicKeyDto.contentSize||track.fileSize
    sonicKeyDto.contentType=sonicKeyDto.contentType||track.fileType
    sonicKeyDto.contentEncoding=sonicKeyDto.contentEncoding||track.encoding
    sonicKeyDto.contentSamplingFrequency=sonicKeyDto.contentSamplingFrequency||track.samplingFrequency
    sonicKeyDto.originalFileName=sonicKeyDto.originalFileName||track.originalFileName
    const encodingStrength = sonicKeyDto.encodingStrength
    const sonickeyDoc:Partial<SonicKey>={
      ...sonicKeyDto,
      ...resourceOwnerObj,
      createdBy:loggedInUser?.sub
    }
    return this.sonicKeyService.encodeSonicKeyFromTrack({
      trackId:track?.id,
      file,
      licenseId,
      sonickeyDoc,
      encodingStrength,
      s3destinationFolder:destinationFolder
    })
  }

  @UseInterceptors(FileFromUrlInterceptor('mediaFile'))
  @ApiBody({
    description: 'File To Encode',
    type: EncodeFromUrlDto,
  })
  @RolesAllowed()
  @UseGuards(ConditionalAuthGuard,RoleBasedGuard, LicenseValidationGuard,EncodeSecurityGuard)
  @Post('/encode-from-url')
  @ApiBearerAuth()
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
    const encodingStrength = sonicKeyDto.encodingStrength
    const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(
      file,
      sonicKeyDto,
    );
    const sonickeyDoc:Partial<SonicKey>={
      ...sonicKeyDtoWithAudioData,
      ...resourceOwnerObj,
      createdBy:loggedInUser?.sub
    }
    return this.sonicKeyService.encodeSonicKeyFromFile({
      file,
      licenseId,
      sonickeyDoc,
      encodingStrength,
      s3destinationFolder:destinationFolder
    })
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
  @RolesAllowed()
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
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
  @RolesAllowed()
  @UseGuards(JwtAuthGuard,RoleBasedGuard,UpdateSonicKeySecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Sonic Keys meta data' })
  async updateMeta(
    @Param('sonickey') sonickey: string,
    @Body() updateSonicKeyDto: UpdateSonicKeyDto,
    @User() loggedInUser: UserDB,
  ) {
    const key = await this.sonicKeyService.findOne({sonicKey:sonickey});
    if(!key){
      return new NotFoundException()
    }
    return this.sonicKeyService.update(key._id, {
      ...updateSonicKeyDto,
      updatedBy: loggedInUser.sub,
    });
  }

  @Patch('/fingerprint-events/:sonicKey/success')
  @ApiOperation({
    summary:
      'Call this endpoint on fingerprint success, only from fingerprint server',
  })
  async onFingerPrintSuccess(
    @Param('sonicKey') sonicKey: string,
    @Body()
    updateSonicKeyFingerPrintMetaDataDto: UpdateSonicKeyFingerPrintMetaDataDto,
  ) {
    const { fingerPrintMetaData } = updateSonicKeyFingerPrintMetaDataDto;
    const updatedSonickey = await this.sonicKeyService.sonicKeyModel.findOneAndUpdate(
      { sonicKey: sonicKey },
      {
        fingerPrintMetaData: fingerPrintMetaData,
        fingerPrintStatus: FingerPrintStatus.SUCCESS,
      },
      { new: true },
    );
    if (!updatedSonickey) {
      throw new NotFoundException('Given sonickey is not found');
    }
    return updatedSonickey;
  }

  @Patch('/fingerprint-events/:sonicKey/failed')
  @ApiOperation({
    summary:
      'Call this endpoint on fingerprint failed, only from fingerprint server',
  })
  async onFingerPrintFailed(
    @Param('sonicKey') sonicKey: string,
    @Body()
    updateSonicKeyFingerPrintMetaDataDto: UpdateSonicKeyFingerPrintMetaDataDto,
  ) {
    const { fingerPrintMetaData } = updateSonicKeyFingerPrintMetaDataDto;
    const updatedSonickey = await this.sonicKeyService.sonicKeyModel.findOneAndUpdate(
      { sonicKey: sonicKey },
      {
        fingerPrintErrorData: fingerPrintMetaData,
        fingerPrintStatus: FingerPrintStatus.FAILED,
      },
      { new: true },
    );
    if (!updatedSonickey) {
      throw new NotFoundException('Given sonickey is not found');
    }
    return updatedSonickey;
  }

  @Delete('/:sonickey')
  @UseGuards(JwtAuthGuard,DeleteSonicKeySecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Sonic Key data' })
  async delete(
    @Param('sonickey') sonickey: string,
    @User('sub') owner: string,
  ) {
    const key = await this.sonicKeyService.findOne({sonicKey:sonickey});
    if(!key){
      return new NotFoundException()
    }
   return this.sonicKeyService.sonicKeyModel.findByIdAndRemove(key._id);
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
