import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    Query,
    UseInterceptors,
    UploadedFile,
    UseGuards,
  } from '@nestjs/common';
  import { TrackService } from '../track.service';
  import { UpdateTrackDto } from '../dto/update-track.dto';
  import {
    ApiConsumes,
    ApiOperation,
    ApiBody,
    ApiQuery,
    ApiBearerAuth,
  } from '@nestjs/swagger';
  import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
  import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
  import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
  import { UploadTrackDto } from '../dto/create-track.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import * as makeDir from 'make-dir';
  import { appConfig } from 'src/config';
  import * as uniqid from 'uniqid';
  import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
  import { UserDB } from '../../user/schemas/user.db.schema';
  import { User } from '../../auth/decorators';
  import { identifyDestinationFolderAndResourceOwnerFromUser } from 'src/shared/utils';
  import { ChannelEnums } from 'src/constants/Enums';
  import { JwtAuthGuard } from '../../auth/guards';
  
  @Controller('tracks/users/:targetUser')
  export class TrackController {
    constructor(private readonly trackService: TrackService) {}
  
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
            const loggedInUser = req['user'] as UserDB;
            var filePath: string;
            if (loggedInUser.partner) {
              filePath = await makeDir(
                `${appConfig.MULTER_DEST}/partners/${loggedInUser.partner?._id}`,
              );
            } else if (loggedInUser.company) {
              filePath = await makeDir(
                `${appConfig.MULTER_DEST}/companies/${loggedInUser.company?._id}`,
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
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'File To Encode',
      type: UploadTrackDto,
    })
    @AnyApiQueryTemplate()
    @ApiOperation({ summary: 'Upload Track' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    async uploadTrack(
      @Body() uploadTrackDto: UploadTrackDto,
      @UploadedFile() file: IUploadedFile,
      @User() loggedInUser: UserDB,
    ) {
      const { mediaFile, channel } = uploadTrackDto;
      const {
        destinationFolder,
        resourceOwnerObj,
      } = identifyDestinationFolderAndResourceOwnerFromUser(loggedInUser);
      const s3FileUploadResponse = await this.trackService.s3FileUploadService.uploadFromPath(
        file.path,
        `${destinationFolder}/originalFiles`,
      );
      const extractFileMeta = await this.trackService.exractMusicMetaFromFile(
        file,
      );
      const createdTrack = await this.trackService.create({
        _id: `${Date.now()}`,
        ...resourceOwnerObj,
        channel: channel || ChannelEnums.PORTAL,
        mimeType: extractFileMeta.mimeType,
        duration: extractFileMeta.duration,
        fileSize: extractFileMeta.size,
        localFilePath: file.path,
        s3OriginalFileMeta: s3FileUploadResponse,
        fileType: 'Audio',
        encoding: extractFileMeta.encoding,
        samplingFrequency: extractFileMeta.samplingFrequency,
        originalFileName: file.originalname,
        iExtractedMetaData: extractFileMeta,
      });
      return createdTrack;
    }
  
    @ApiOperation({ summary: 'List Tracks' })
    @Get()
    @ApiQuery({
      name: 'channel',
      enum: [...Object.values(ChannelEnums), 'ALL'],
      required: false,
    })
    @AnyApiQueryTemplate({
      additionalHtmlDescription: `<div>
        To Get tracks for specific company ?company=companyId <br/>
        To Get tracks for specific partner ?partner=partnerId <br/>
        To Get plays for specific user ?owner=ownerId
      <div>`,
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    findAll(
    @Param('targetUser') targetUser: string,
      @User() loggedInUser: UserDB,
      @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
    ) {
    
      return this.trackService.findAll(queryDto);
    }
  
    @ApiOperation({
      summary: 'Get track by id',
    })
    @Get(':id')
    findById(@Param('id') id: string) {
      return this.trackService.findById(id);
    }
  
    @ApiOperation({
      summary: 'Update track by id',
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put(':id')
    update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
      return this.trackService.update(id, updateTrackDto);
    }
  
    @Get('/count')
    @ApiOperation({
      summary: 'Get count of all tracks also accept filter as query params',
    })
    async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
      return this.trackService.getCount(queryDto);
    }
  
    @Get('/estimate-count')
    @ApiOperation({
      summary: 'Get all count of all tracks',
    })
    async getEstimateCount() {
      return this.trackService.getEstimateCount();
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove track' })
    remove(@Param('id') id: string) {
      return this.trackService.removeById(id);
    }
  }
  