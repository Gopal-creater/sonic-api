import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, Model } from 'mongoose';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';

import { ChannelEnums } from 'src/constants/Enums';
import { toObjectId } from 'src/shared/utils/mongoose.utils';
import { groupByTime } from 'src/shared/types';
import { UserService } from '../user/services/user.service';
import * as makeDir from 'make-dir';
import * as appRootPath from 'app-root-path';
import * as fs from 'fs';
import * as xlsx from 'xlsx';
import * as XLSXChart from 'xlsx-chart';
import * as moment from 'moment';
import { appConfig } from '../../config/app.config';
import { FileHandlerService } from '../../shared/services/file-handler.service';
import * as AdmZip from 'adm-zip';
import * as utils from 'util';
import { CompanyService } from '../company/company.service';
import { DetectionService } from '../detection/detection.service';
import { SonickeyService } from '../sonickey/services/sonickey.service';

@Injectable()
export class ReportService {
    constructor(
        private readonly userService: UserService,
        private readonly fileHandlerService: FileHandlerService,
        private readonly companyService: CompanyService,
        private readonly detectionService: DetectionService,
        private readonly sonickeyService: SonickeyService,

      ) {}
}
