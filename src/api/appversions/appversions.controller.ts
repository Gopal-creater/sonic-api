
import { VUploadedFile } from '../../shared/interfaces/VersionUploadFile.interface';
import { UploadAppVersionDto } from './dto/upload-app-version.dto';
import { Version } from './dto/version.dto';
import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  InternalServerErrorException,
  Param,
  Query,
} from '@nestjs/common';
import { AppVersionService } from './appversions.service';
import { AppVersion, S3FileMeta } from './schemas/appversions.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import * as makeDir from 'make-dir';
import { diskStorage } from 'multer';
import { appConfig } from '../../config';
import { RolesAllowed } from '../auth/decorators/roles.decorator';
import { Roles } from 'src/constants/Enums';
import { RoleBasedGuard } from '../auth/guards/role-based.guard';
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
import { JsonParsePipe } from '../../shared/pipes/jsonparse.pipe';
import { get } from 'lodash';


@ApiTags('AppVersion Controller')
@Controller('appVersion')
export class AppVersionController {
  constructor(
    private readonly appVersionService: AppVersionService,
  ) {}

  @UseInterceptors(
    FileInterceptor('mediaFile', {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const filePath = await makeDir(
            `${appConfig.MULTER_DEST}/versions`,
          );
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
    description: 'File To Upload',
    type: UploadAppVersionDto,
  })
  @RolesAllowed(Roles.ADMIN)
 @UseGuards(JwtAuthGuard, RoleBasedGuard) 
  @Post('/apiVersion/upload')
 @ApiBearerAuth()
  @ApiOperation({ summary: 'upload  version File And save to database' })
  uploadVersion(
   @Body('data', JsonParsePipe) versionDto: Version,
    @UploadedFile() file: VUploadedFile,
    @Req() req: any,
  ) {
    var s3UploadResult: S3FileMeta;
    return this.appVersionService
      .uploadVersionToS3(file)
      .then(async data => {
        s3UploadResult = data.s3UploadResult as S3FileMeta;
        const newVersion = {
        versionCode: versionDto.versionCode,
        releaseNote: versionDto.releaseNote,
        latest: versionDto.latest,
        s3FileMeta: s3UploadResult,
        platform: versionDto.platform
        };
        return this.appVersionService.saveVersion(newVersion)
        
      })
      .catch(err => {
        throw new InternalServerErrorException(err);
      })
      .finally(() => {
      });
  }

  @Get('/:id')
  getVersionById(@Param('id') id:string){
    return this.appVersionService.findOne(id)
  }

  @Get()
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  getAllVersions(){
    return this.appVersionService.getAllVersions()

  }

  @Get('/downloadFile')
  downloadVersionFileFromS3(@Query('key') key: string){
    return this.appVersionService.getFile(key)
    //versions/1he4rteemkyjxzah0-1he4rteemkyjxzagk-zapsplat_bells_church_bell_ring_12_ext_med_close_43634.mp3
  }

  @Get('/downloadFile/latest/:platform')
  downloadLatest(@Param('platform') platform:string){
    return this.appVersionService.downloadLatest(platform)
  }

  @Post('/markLatest/:id')
   makeLatest(@Param('id') id: string){
     return this.appVersionService.makeLatest(id)
   }

  @Delete()
  deleteFile(@Query('key') key: string){
    return  this.appVersionService.deleteFile(key)
  }

}
