import {
  CreateSonicKeyDto,
  CreateSonicKeyFromJobDto,
} from '../dtos/create-sonickey.dto';
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
import { nanoid } from 'nanoid';
import * as uniqid from 'uniqid';
import { JwtAuthGuard } from '../../auth/guards';
import { RolesAllowed, User } from '../../auth/decorators';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { DownloadDto } from '../dtos/download.dto';
import * as appRootPath from 'app-root-path';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import {
  ChannelEnums,
  FingerPrintStatus,
  Roles,
} from '../../../constants/Enums';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { DetectionService } from '../../detection/detection.service';
import {
  FileFromUrlInterceptor,
  UploadedFileFromUrl,
} from '../../../shared/interceptors/FileFromUrl.interceptor';
import {
  FileFromTrackInterceptor,
  UploadedFileFromTrack,
  CurrentTrack,
} from '../../../shared/interceptors/FileFromTrack.interceptor';
import { LicenseValidationGuard } from '../../licensekey/guards/license-validation.guard';
import { ValidatedLicense } from '../../licensekey/decorators/validatedlicense.decorator';
import { ConditionalAuthGuard } from '../../auth/guards/conditional-auth.guard';
import { Detection } from 'src/api/detection/schemas/detection.schema';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { UserDB } from '../../user/schemas/user.db.schema';
import * as _ from 'lodash';
import { BulkEncodeWithQueueLicenseValidationGuard } from 'src/api/licensekey/guards/job-license-validation.guard';
import { ApiKeyAuthGuard } from 'src/api/auth/guards/apikey-auth.guard';
import { extractFileName, identifyDestinationFolderAndResourceOwnerFromUser } from 'src/shared/utils';
import { Track } from 'src/api/track/schemas/track.schema';
import { EncodeSecurityGuard } from '../guards/encode-security.guard';
import { UpdateSonicKeySecurityGuard } from '../guards/update-sonickey-security.guard';
import { DeleteSonicKeySecurityGuard } from '../guards/delete-sonickey-security.guard';
import { EncodeSecurityInterceptor } from '../interceptors/encode-security.interceptor';
import { ApiKey } from 'src/api/api-key/decorators/apikey.decorator';
import { S3FileUploadService } from '../../s3fileupload/s3fileupload.service';
import { EncodeAgainJobDataI } from '../processors/sonickey.processor';
import { Response } from 'express';

@ApiTags('SonicKeys Controller')
@Controller('sonic-keys')
export class SonickeyController {
  constructor(
    private readonly sonicKeyService: SonickeyService,
    public readonly licensekeyService: LicensekeyService,
    private readonly fileHandlerService: FileHandlerService,
    private readonly detectionService: DetectionService,
    private readonly s3FileUploadService: S3FileUploadService,
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
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List Sonic Keys' })
  async getAll(
    @Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto,
    @User() loggedInUser: UserDB,
  ) {
    return this.sonicKeyService.getAll(parsedQueryDto);
  }

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
  @ApiParam({ name: 'format', enum: ['xlsx', 'csv'] })
  @Get('/export-sonickeys/:format')
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export Sonic Keys' })
  async exportSonicKeys(
    @Res() res: Response,
    @Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto,
    @Param('format') format: string,
    @User() loggedInUser: UserDB,
  ) {
    if (!['xlsx', 'csv'].includes(format))
      throw new BadRequestException('Unsupported format');
    parsedQueryDto.limit =
      parsedQueryDto?.limit <= 2000 ? parsedQueryDto?.limit : 2000;
      if(parsedQueryDto.filter?.channel=="ALL"){
        delete parsedQueryDto.filter?.channel
      }
    const exportedFilePath =await this.sonicKeyService.exportSonicKeys(parsedQueryDto,format);
    const fileName = extractFileName(exportedFilePath);
    res.download(
      exportedFilePath,
      `${fileName.split('_nameseperator_')[1]}`,
      err => {
        if (err) {
          this.fileHandlerService.deleteFileAtPath(exportedFilePath);
          res.send(err);
        }
        this.fileHandlerService.deleteFileAtPath(exportedFilePath);
      },
    );
  }

  @Get('/get-download-url-by-metadata')
  @UseGuards(ConditionalAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiQuery({
    name: 'query',
    type: 'object',
    required: false,
  })
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'get download url by metadata' })
  async getDownloadUrlByMetadata(
    @Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto,
    @User() loggedInUser: UserDB,
  ) {
    const {
      resourceOwnerObj,
    } = identifyDestinationFolderAndResourceOwnerFromUser(loggedInUser);
    console.log("resourceOwnerObj",resourceOwnerObj)
    parsedQueryDto.filter = { ...parsedQueryDto.filter, ...resourceOwnerObj };
    console.log("parsedQueryDto.filter",parsedQueryDto.filter)
    parsedQueryDto.sort = {
      //Fetch the latest entry
      createdAt: -1,
    };
    const sonicKey = await this.sonicKeyService.findOneAggregate(
      parsedQueryDto,
    );
    if (!sonicKey) {
      throw new NotFoundException('Sonickey not found');
    }
    const downloadSignedUrl = await this.s3FileUploadService.getSignedUrl(
      sonicKey.s3FileMeta.Key,
      60*10,
      sonicKey?.originalFileName || sonicKey?.contentFileName
    );

    //Add Next Encode On Queue for next download
    const encodeAgainForNextDownloadJobData: EncodeAgainJobDataI = {
      trackId: sonicKey?.track?._id,
      user: loggedInUser,
      sonicKeyDto: {},
      metaData: {
        purpose: 'Encode again for next download job',
      },
    };
    await this.sonicKeyService.sonicKeyQueue.add(
      'encode_again',
      encodeAgainForNextDownloadJobData,
      { jobId: nanoid(15) },
    );
    return {
      sonicKey: sonicKey?._id,
      downloadUrl: downloadSignedUrl
    };
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

  @UseGuards(ConditionalAuthGuard, LicenseValidationGuard)
  @Post('/create-from-outside')
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: '[NEW]: Save to database after local encode. ',
  })
  async create(
    @Body() createSonicKeyDto: CreateSonicKeyDto,
    @User() loggedInUser: UserDB,
    @ApiKey('_id') apiKey: string,
    @ValidatedLicense('key') licenseId: string,
  ) {
    const {
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
      contentFilePath,
    } = createSonicKeyDto;
    if (!sonicKey) {
      throw new BadRequestException('SonicKey is required');
    }
    if (!channel) {
      throw new BadRequestException('Channel is required');
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
      duration: contentDuration,
      fileSize: contentSize,
      encoding: contentEncoding,
      localFilePath: contentFilePath,
      samplingFrequency: contentSamplingFrequency,
      trackMetaData: createSonicKeyDto,
      ...resourceOwnerObj,
      createdBy: loggedInUser?.sub,
    };
    var track = await this.sonicKeyService.trackService.findOne({
      mimeType: contentFileType,
      fileSize: contentSize,
      duration: contentDuration,
    });
    if (!track) {
      track = await this.sonicKeyService.trackService.create(newTrack);
    }
    const sonickeyDoc: Partial<SonicKey> = {
      ...createSonicKeyDto,
      ...resourceOwnerObj,
      _id: createSonicKeyDto.sonicKey,
      apiKey: apiKey,
      license: licenseId,
      createdBy: loggedInUser?.sub,
      track: track?._id,
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

  @UseGuards(JwtAuthGuard, LicenseValidationGuard)
  @Post('/create-from-job')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Save to database after local encode from job desktop app.',
  })
  async createForJob(
    @Body() createSonicKeyDto: CreateSonicKeyFromJobDto,
    @User() loggedInUser: UserDB,
  ) {
    const {
      resourceOwnerObj,
    } = identifyDestinationFolderAndResourceOwnerFromUser(loggedInUser);
    const sonickeyDoc: Partial<SonicKey> = {
      ...createSonicKeyDto,
      ...resourceOwnerObj,
      _id: createSonicKeyDto.sonicKey,
      createdBy: loggedInUser?.sub,
    };
    return this.sonicKeyService.create(sonickeyDoc);
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
  @UseGuards(ConditionalAuthGuard)
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Get Single SonicKey' })
  async getOne(@Param('sonickey') sonickey: string) {
    const key = await this.sonicKeyService.findOne({ sonickey: sonickey });
    if (!key) {
      return new NotFoundException();
    }
    return key;
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
    EncodeSecurityInterceptor,
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File To Encode',
    type: EncodeDto,
  })
  @RolesAllowed()
  @UseGuards(ConditionalAuthGuard, RoleBasedGuard, LicenseValidationGuard)
  @Post('/encode')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encode File And save to database' })
  async encode(
    @Body('data', JsonParsePipe) sonicKeyDto: SonicKeyDto,
    @UploadedFile() file: IUploadedFile,
    @User() loggedInUser: UserDB,
    @ValidatedLicense('key') licenseId: string,
  ) {
    // if(!sonicKeyDto.contentOwner) throw new BadRequestException("contentOwner is required")
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
    EncodeSecurityInterceptor,
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File To Encode',
    type: EncodeFromFileDto,
  })
  @RolesAllowed()
  @UseGuards(ConditionalAuthGuard, RoleBasedGuard, LicenseValidationGuard)
  @Post('/encode-from-file')
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Encode File And save to database & into track table',
  })
  async encodeByFile(
    @Body('data', JsonParsePipe) sonicKeyDto: CreateSonicKeyDto,
    @UploadedFile() file: IUploadedFile,
    @User() loggedInUser: UserDB,
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

  @UseInterceptors(FileFromTrackInterceptor('track'))
  @ApiBody({
    description: 'File To Encode',
    type: EncodeFromTrackDto,
  })
  @RolesAllowed()
  @UseGuards(
    ConditionalAuthGuard,
    RoleBasedGuard,
    LicenseValidationGuard,
    EncodeSecurityGuard,
  )
  @Post('/encode-from-track')
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @ApiOperation({
    summary: 'Encode File And save to database & into track table',
  })
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

    sonicKeyDto.contentFileType = sonicKeyDto.contentFileType || track.mimeType;
    sonicKeyDto.contentOwner = sonicKeyDto.contentOwner || track.artist;
    sonicKeyDto.contentName = sonicKeyDto.contentName || track.title;
    sonicKeyDto.contentDuration = sonicKeyDto.contentDuration || track.duration;
    sonicKeyDto.contentSize = sonicKeyDto.contentSize || track.fileSize;
    sonicKeyDto.contentType = sonicKeyDto.contentType || track.fileType;
    sonicKeyDto.contentEncoding = sonicKeyDto.contentEncoding || track.encoding;
    sonicKeyDto.contentSamplingFrequency =
      sonicKeyDto.contentSamplingFrequency || track.samplingFrequency;
    sonicKeyDto.originalFileName =
      sonicKeyDto.originalFileName || track.originalFileName;
    const encodingStrength = sonicKeyDto.encodingStrength;
    const sonickeyDoc: Partial<SonicKey> = {
      ...sonicKeyDto,
      ...resourceOwnerObj,
      createdBy: loggedInUser?.sub,
    };
    return this.sonicKeyService.encodeSonicKeyFromTrack({
      trackId: track?.id,
      file,
      licenseId,
      sonickeyDoc,
      encodingStrength,
      s3destinationFolder: destinationFolder,
    });
  }

  @UseInterceptors(FileFromUrlInterceptor('mediaFile'))
  @ApiBody({
    description: 'File To Encode',
    type: EncodeFromUrlDto,
  })
  @RolesAllowed()
  @UseGuards(
    ConditionalAuthGuard,
    RoleBasedGuard,
    LicenseValidationGuard,
    EncodeSecurityGuard,
  )
  @Post('/encode-from-url')
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
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
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
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
              company: validSonicKey.company,
              partner: validSonicKey.partner,
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
              company: validSonicKey.company,
              partner: validSonicKey.partner,
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
  @ApiOperation({ summary: '[NEW]: Decode File and retrive key information' })
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
              company: validSonicKey.company,
              partner: validSonicKey.partner,
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
              company: validSonicKey.company,
              partner: validSonicKey.partner,
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
  @UseGuards(JwtAuthGuard, RoleBasedGuard, UpdateSonicKeySecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Sonic Keys meta data' })
  async updateMeta(
    @Param('sonickey') sonickey: string,
    @Body() updateSonicKeyDto: UpdateSonicKeyDto,
    @User() loggedInUser: UserDB,
  ) {
    const key = await this.sonicKeyService.findOne({ sonicKey: sonickey });
    if (!key) {
      return new NotFoundException();
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
  @UseGuards(JwtAuthGuard, DeleteSonicKeySecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Sonic Key data' })
  async delete(
    @Param('sonickey') sonickey: string,
    @User('sub') owner: string,
  ) {
    const key = await this.sonicKeyService.findOne({ sonicKey: sonickey });
    if (!key) {
      return new NotFoundException();
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
