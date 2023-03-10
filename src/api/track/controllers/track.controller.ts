import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  NotFoundException,
  Version,
} from '@nestjs/common';
import { TrackService } from '../track.service';
import { UpdateTrackDto } from '../dto/update-track.dto';
import {
  ApiConsumes,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
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
import { RolesAllowed, User } from '../../auth/decorators';
import { extractFileName, identifyDestinationFolderAndResourceOwnerFromUser } from 'src/shared/utils';
import { ChannelEnums, SystemRoles } from 'src/constants/Enums';
import { JwtAuthGuard } from '../../auth/guards';
import { Response } from 'express';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { UpdateTrackSecurityGuard } from '../guards/update-track-security.guard';
import { DeleteTrackSecurityGuard } from '../guards/delete-track-security.guard';
import { FailedAlwaysGuard } from '../../auth/guards/failedAlways.guard';
import { UploadTrackSecurityGuard } from '../guards/upload-track-security.guard';
import { FileHandlerService } from 'src/shared/services/file-handler.service';

@ApiTags("Track Controller (D & M May 2022)")
@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService,    private readonly fileHandlerService: FileHandlerService,) {}

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
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File To Encode',
    type: UploadTrackDto,
  })
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Upload Track' })
  @RolesAllowed()
  @UseGuards(JwtAuthGuard,RoleBasedGuard,UploadTrackSecurityGuard)
  @ApiBearerAuth()
  @Post('/upload')
  async uploadTrack(
    @Body() uploadTrackDto: UploadTrackDto,
    @UploadedFile() file: IUploadedFile,
    @User() loggedInUser: UserDB,
  ) {
    const {
      destinationFolder,
      resourceOwnerObj,
    } = identifyDestinationFolderAndResourceOwnerFromUser(loggedInUser);
    const doc = {
      ...uploadTrackDto,
      ...resourceOwnerObj,
      fileType: 'Audio',
      createdBy: loggedInUser?.sub,
    }
    return this.trackService.uploadAndCreate(file,doc,destinationFolder)
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
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
    @User() loggedInUser: UserDB,
  ) {
    return this.trackService.findAll(queryDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all tracks also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.trackService.getCount(queryDto);
  }

  @Get('/estimate-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all tracks',
  })
  async getEstimateCount() {
    return this.trackService.getEstimateCount();
  }

  @ApiOperation({ summary: 'List Tracks' })
  @Get('/export/:format')
  @ApiParam({ name: 'format', enum: ['xlsx', 'csv'] })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({
    name: 'channel',
    enum: [...Object.values(ChannelEnums)],
    required: false,
  })
  @AnyApiQueryTemplate()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async exportTracks(
    @Res() res: Response,
    @Param('format') format: string,
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
    @User() loggedInUser: UserDB,
  ) {
    queryDto.limit = queryDto?.limit <= 2000 ? queryDto?.limit : 2000;
    const filePath = await this.trackService.exportTracks(
      queryDto,
      format,
    );
    const fileName = extractFileName(filePath);
    res.download(
      filePath,
      `tracks_${format}.${fileName.split('.')[1]}`,
      err => {
        if (err) {
          this.fileHandlerService.deleteFileAtPath(filePath);
          res.send(err);
        }
        this.fileHandlerService.deleteFileAtPath(filePath);
      },
    );
  }


  @ApiOperation({
    summary: 'Get track by id',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findById(@Param('id') id: string) {
    const track = await this.trackService.findById(id);
    if(!track){
      return new NotFoundException()
    }
    return track
  }

  @ApiOperation({
    summary: 'Update track by id',
  })
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard, UpdateTrackSecurityGuard)
  @ApiBearerAuth()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @User() loggedInUser: UserDB,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    const track = await this.trackService.findById(id);
    if(!track){
      return new NotFoundException()
    }
    return this.trackService.update(id, {
      ...updateTrackDto,
      updatedBy: loggedInUser.sub,
    });
  }



  @Delete(':id')
  @RolesAllowed()
  @UseGuards(FailedAlwaysGuard,JwtAuthGuard,RoleBasedGuard,DeleteTrackSecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove track' })
  async remove(@Param('id') id: string) {
    const track = await this.trackService.findById(id);
    if(!track){
      return new NotFoundException()
    }
    return this.trackService.removeById(id);
  }
}
