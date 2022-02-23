
import { VUploadedFile } from '../../shared/interfaces/VersionUploadFile.interface';
import { UploadAppVersionDto } from './dto/upload-app-version.dto';
import { UpdateAppVersionDto } from './dto/update-app-versions.dto';
import { Version } from './dto/version.dto';
import {BadRequestException } from '@nestjs/common';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';
import {
  Controller,
  Post,
  Put,
  Res,
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
  NotFoundException,
  BadGatewayException,
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
import { ParseQueryValue } from '../../shared/pipes/parseQueryValue.pipe';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { JsonParsePipe } from '../../shared/pipes/jsonparse.pipe';
import { versionFileFilter } from 'src/shared/filters/version-file-filter';

@ApiTags('AppVersion Controller')
@Controller('app-version')
export class AppVersionController {
  constructor(
    private readonly appVersionService: AppVersionService,
  ) {}

  @UseInterceptors(
    FileInterceptor('mediaFile', {
      fileFilter: versionFileFilter,
    }
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File To Upload',
    type: UploadAppVersionDto,
  })
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard) 
  @Post('/upload')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'upload  version File And save to database' })
  uploadVersion(
   @Body('data', JsonParsePipe) versionDto: Version,
    @UploadedFile() file: VUploadedFile,
    @Req() req: any,
  ) {
    var s3UploadResult: S3FileMeta;
    return this.appVersionService.VersionAndPlatformCheck(versionDto).then(dbResult =>{
      if(dbResult){
        throw new BadRequestException("VersionCode with this platform already exists.")
      }
      return this.appVersionService
      .uploadVersionToS3(file)
      .then(data => {
        s3UploadResult = data.s3UploadResult as S3FileMeta;
        const newVersion = {
        versionCode: versionDto.versionCode,
        releaseNote: versionDto.releaseNote,
        platform: versionDto.platform,
        contentVersionFilePath:s3UploadResult.Location,
        originalVersionFileName: file?.originalname,
        s3FileMeta: s3UploadResult
        };
        return this.appVersionService.saveVersion(newVersion)
      })
      .then(saveResult => {
        if(versionDto.latest){
          return this.appVersionService.makeLatest(saveResult._id, saveResult.platform)
        }else{
          return saveResult;
        }
      })
    }).catch(err => {
        throw new InternalServerErrorException(err);
      })
  }

  @Get('/download-file-from-version-code')
  downloadFromVersionCode(@Query('versioncode') versionCode:string, @Query('platform') platform:string,  @Res() res:any){
    return this.appVersionService.downloadFromVersionCode(versionCode, platform, res)
  }

  @Get('/download-file/latest/:platform')
  downloadLatest(@Param('platform') platform:string, @Res() res:any){
    return this.appVersionService.downloadLatest(platform, res)
  }

  @Get('/download-file')
  downloadFromVersionId(@Query('id') id:string, @Res() res:any){
    return this.appVersionService.downloadFromVersionId(id, res)
  }

  @Get('/:id')
  getVersionById(@Param('id') id:string){
    return this.appVersionService.findOne(id)
  }

  @Get()
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  getAllVersions(@Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto){
    return this.appVersionService.getAllVersions(parsedQueryDto)

  }

  @Put('/mark-latest/:id')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
   makeLatest(@Param('id') id: string){
     return this.appVersionService.findOne(id)
     .then(responseObj => {
       if(!responseObj){
         throw new NotFoundException("Record not found with the given ID.")
       }else{
         return this.appVersionService.makeLatest(id, responseObj.platform)
       }
     })
   }

   @Put('/:id')
   @RolesAllowed(Roles.ADMIN)
   @UseGuards(JwtAuthGuard, RoleBasedGuard)
   @ApiBearerAuth()
    async update(
      @Param('id') id: string,
      @Body() updateAppVersionDto: UpdateAppVersionDto,
      ){
      return this.appVersionService.findOne(id)
      .then(async responseObj => {
        if(!responseObj){
          throw new NotFoundException("Record not found with the given ID.")
        }else{
          return this.appVersionService.update(id, responseObj.platform, updateAppVersionDto)        
        }
      })
    }

  @Delete('/:id')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  deleteFile(@Param('id') id: string){
    return  this.appVersionService.deleteRecordWithFile(id)
  }

}
