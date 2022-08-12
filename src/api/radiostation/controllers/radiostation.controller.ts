import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  UseGuards,
  NotFoundException,
  BadRequestException,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { RadiostationService } from '../services/radiostation.service';
import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { UpdateRadiostationDto } from '../dto/update-radiostation.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as makeDir from 'make-dir';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BulkRadiostationDto } from '../dto/bulk-radiostation.dto';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { User } from '../../auth/decorators/user.decorator';
import { forEach, subtract } from 'lodash';
import * as fs from 'fs';
import * as upath from 'upath';
import * as appRootPath from 'app-root-path';
import { FileInterceptor } from '@nestjs/platform-express';
import { appConfig } from '../../../config/app.config';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { RolesAllowed } from 'src/api/auth/decorators';
import { Roles } from 'src/constants/Enums';
import { RoleBasedGuard } from 'src/api/auth/guards';
import { ConditionalAuthGuard } from '../../auth/guards/conditional-auth.guard';
      
@ApiTags('Radio Station Controller')
@Controller('radiostations')
export class RadiostationController {
  constructor(private readonly radiostationService: RadiostationService) {}

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'format', enum: ['JSON', 'EXCEL'] })
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Export Radio Stations' })
  @Get('/export/:format')
  async export(
    @Res() res: Response,
    @Param('format') format: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    var filePath: string = '';
    switch (format) {
      case 'JSON':
        filePath = await this.radiostationService.exportToJson(queryDto);
        break;

      case 'EXCEL':
        filePath = await this.radiostationService.exportToExcel(queryDto);
        break;

      default:
        filePath = await this.radiostationService.exportToExcel(queryDto);
        break;
    }

    res.download(filePath, err => {
      if (err) {
        fs.unlinkSync(filePath);
        res.send(err);
      }
      fs.unlinkSync(filePath);
    });
  }

  @UseInterceptors(
    FileInterceptor('importFile', {
      // Check the mimetypes to allow for upload
      fileFilter: (req: any, file: any, cb: any) => {
        if (file?.originalname?.match?.(/\.(xlsx|xlsb|xls|xlsm)$/)) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new BadRequestException(
              'Unsupported file type, only support excel for now',
            ),
            false,
          );
        }
      },
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const filePath = await makeDir(`${appConfig.MULTER_IMPORT_DEST}`);
          cb(null, filePath);
        },
        filename: (req, file, cb) => {
          let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
          cb(null, `${Date.now()}_${orgName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Import Radio Stations From Excel' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        importFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @Post('/import-from-excel')
  async importFromExcel(@UploadedFile() file: IUploadedFile) {
    const excelPath = upath.toUnix(file.path);
    return this.radiostationService.importFromExcel(excelPath).finally(() => {
      fs.unlinkSync(excelPath);

    });
  }



  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @AnyApiQueryTemplate()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all radiostations also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.radiostationService.getCount(queryDto);
  }

  @Get('/estimate-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all radiostations',
  })
  async getEstimateCount() {
    return this.radiostationService.getEstimateCount();
  }

  @Post()
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Radio Station' })
  async create(
    @User('sub') createdBy: string,
    @Body() createRadiostationDto: CreateRadiostationDto,
  ) {
    const isPresent = await this.radiostationService.radioStationModel.findOne({
      streamingUrl: createRadiostationDto.streamingUrl,
    });
    if (isPresent) {
      throw new BadRequestException('Duplicate stramingURL');
    }
    return this.radiostationService.create(createRadiostationDto, {
      createdBy: createdBy,
    });
  }

  /**
   * We can add or query filter as follows
   * http://[::1]:8000/radiostations/owners/5728f50d-146b-47d2-aa7b-a50bc37d641d?filter={ "$or": [ { "name": { "$regex": "Sonic", "$options": "i" } }, { "streamingUrl": { "$regex": "Sonic", "$options": "i" } } ] }
   */

  @Get()
  @UseGuards(ConditionalAuthGuard)
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All Radio Stations' })
  findAll(@Query(new ParseQueryValue()) queryDto?: ParsedQueryDto) {
    return this.radiostationService.findAll(queryDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single Radio Station' })
  async findOne(@Param('id') id: string) {
    const radioStation = await this.radiostationService.radioStationModel.findById(
      id,
    );
    if (!radioStation) {
      throw new NotFoundException();
    }
    return radioStation;
  }

  @Put(':id/stop-listening-stream')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'stop listening stream' })
  stopListeningStream(@Param('id') id: string) {
    return this.radiostationService.stopListeningStream(id).catch(err => {
      if (err.status == 404) {
        throw new NotFoundException();
      }
      throw err;
    });
  }

  @Put(':id/start-listening-stream')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'start listening stream' })
  startListeningStream(@Param('id') id: string) {
    return this.radiostationService.startListeningStream(id).catch(err => {
      if (err.status == 404) {
        throw new NotFoundException();
      }
      throw err;
    });
  }

  @Put('start-listening-stream/bulk')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'stop listening stream' })
  bulkStartListeningStream(@Body() bulkDto: BulkRadiostationDto) {
    return this.radiostationService.bulkStartListeningStream(bulkDto.ids);
  }

  @Put('stop-listening-stream/bulk')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'stop listening stream' })
  bulkStopListeningStream(@Body() bulkDto: BulkRadiostationDto) {
    return this.radiostationService.bulkStopListeningStream(bulkDto.ids);
  }

  @Put(':id')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Single Radio Station' })
  async update(
    @Param('id') id: string,
    @User('sub') updatedBy: string,
    @Body() updateRadiostationDto: UpdateRadiostationDto,
  ) {
    const updatedRadioStation = await this.radiostationService.radioStationModel.findOneAndUpdate(
      { _id: id },
      { ...updateRadiostationDto, updatedBy: updatedBy },
      { new: true },
    );
    if (!updatedRadioStation) {
      throw new NotFoundException();
    }
    return updatedRadioStation;
  }

  @Delete('delete/bulk')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Radio Station in bulk' })
  removeBulk(@Body() bulkDto: BulkRadiostationDto) {
    return this.radiostationService.bulkRemove(bulkDto.ids);
  }

  @Delete(':id')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Radio Station' })
  remove(@Param('id') id: string) {
    return this.radiostationService.removeById(id).catch(err => {
      if (err.status == 404) {
        throw new NotFoundException();
      }
      throw err;
    });
  }

  //Bulk import from excel file
  @ApiOperation({ summary: 'Import list of radio stations from excel file' })
  @UseInterceptors(
    FileInterceptor('importFile', {
      // Check the mimetypes to allow for upload
      fileFilter: (req: any, file: any, cb: any) => {
        if (file?.originalname?.match?.(/\.(xlsx|xlsb|xls|xlsm)$/)) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new BadRequestException(
              'Unsupported file type, only support excel for now',
            ),
            false,
          );
        }
      },
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const filePath = await makeDir(`${appConfig.MULTER_IMPORT_DEST}`);
          cb(null, filePath);
        },
        filename: (req, file, cb) => {
          let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
          cb(null, `${Date.now()}_${orgName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        importFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @Post("/import-from-appgen-excel")
  async uploadExcel (@UploadedFile( ) file: Express.Multer.File){
    console.log("file",file)
  }
}
