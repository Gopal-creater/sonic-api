import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Detection } from './schemas/detection.schema';
import { Aggregate, Model } from 'mongoose';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import {
  MongoosePaginateDetectionDto,
  MongoosePaginatePlaysByArtistDto,
  MongoosePaginatePlaysByCountryDto,
  MongoosePaginatePlaysByRadioStationDto,
  MongoosePaginatePlaysByTrackDto,
  MongoosePaginatePlaysDto,
} from './dto/mongoosepaginate-radiostationsonickey.dto';
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
import {
  TopRadioStation,
  TopRadioStationWithTopSonicKey,
  GraphData,
  PlaysGraphResponseDto,
  TopSonicKey,
  PlaysCountResponseDto,
  TopRadioStationWithPlaysDetails,
  PlaysListResponseDto,
} from './dto/general.dto';
import { appConfig } from '../../config/app.config';
import { FileHandlerService } from '../../shared/services/file-handler.service';
import * as AdmZip from 'adm-zip';
import * as utils from 'util'

@Injectable()
export class DetectionService {
  constructor(
    @InjectModel(Detection.name)
    public readonly detectionModel: Model<Detection>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly fileHandlerService: FileHandlerService,
  ) {
  }

  async getMonitorDashboardData(queryDto: ParsedQueryDto){
    const myPlaysCount = await this.countPlays(queryDto)
    const myTracksCount = await this.countPlaysByTracks(queryDto)
    const myArtistsCount = await this.countPlaysByArtists(queryDto)
    const myRadioStationCount = await this.countPlaysByRadioStations(queryDto)
    const myCountriesCount = await this.countPlaysByCountries(queryDto)
    const mostRecentPlays = await this.listPlays(queryDto,true)
    return{
      myPlaysCount,
      myTracksCount,
      myArtistsCount,
      myRadioStationCount,
      myCountriesCount,
      mostRecentPlays
    }
  }

  async getPlaysDashboardData(filter: Record<any, any>) {
    const playsCount = await this.getTotalPlaysCount({ filter: filter });
    const radioStationsCount = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
          channel: ChannelEnums.STREAMREADER,
        },
      },
      {
        $group: {
          _id: '$radioStation',
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: null },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: '' },
        },
      },
    ]);
    const countriesCount = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
          channel: ChannelEnums.STREAMREADER,
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $group: {
          _id: '$radioStation.country',
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: null },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: '' },
        },
      },
    ]);

    return {
      playsCount: playsCount?.playsCount || 0,
      radioStationsCount: radioStationsCount.length,
      countriesCount: countriesCount.length,
    };
  }

  async getPlaysDashboardGraphData(filter: Record<any, any>) {
    const playsCountryWise = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $group: {
          _id: '$radioStation.country',
          total: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: null },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: '' },
        },
      },
    ]);

    const playsStationWise = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $group: {
          _id: '$radioStation.name',
          total: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: null },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: '' },
        },
      },
    ]);

    const playsSongWise = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $group: {
          _id: '$sonicKey.contentName',
          total: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: null },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: '' },
        },
      },
    ]);

    const playsArtistWise = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $group: {
          _id: '$sonicKey.contentOwner',
          total: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: null },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: '' },
        },
      },
    ]);

    return {
      playsCountryWise,
      playsSongWise,
      playsStationWise,
      playsArtistWise,
    } as PlaysGraphResponseDto;
  }

  async removeEntriesFromArBaTestRadio(){
    // const radioName="ArBa-Test-Radio";
    const radioStationId="618bb1f83ac8d27c53b10d66"
      return this.detectionModel.deleteMany({
        radioStation:radioStationId
      })
  }

  async exportDashboardPlaysView(
    queryDto: ParsedQueryDto,
    format: string,
  ):Promise<string> {
    return new Promise(async (resolve,reject)=>{
      const playsLists = (await this.listPlays(
        queryDto,
        true,
      )) as PlaysListResponseDto[];
      const topRadioStationsWithPlaysCount = await this.findTopRadioStationsWithPlaysCountForOwner(
        queryDto.limit,
        queryDto,
      );
      const chartsData = await this.getPlaysDashboardGraphData(queryDto.filter);
      var playsListInJsonFormat = [];
      var topRadioStationsWithPlaysCountInJsonFormat = [];
      var chartsDataInJsonFormat = [];
      for await (const plays of playsLists) {
        var playsExcelData = {
          SonicKey: plays?.sonicKey?._id,
          'Radio Station': plays?.radioStation?.name || "--",
          Date: moment(plays?.detectedAt || plays?.createdAt)
            .utc()
            .format('DD/MM/YYYY'),
          Time: moment(plays?.detectedAt || plays?.createdAt)
            .utc()
            .format('HH:mm'),
          Duration: moment
            .utc((plays?.detectedDuration || plays?.sonicKey?.contentDuration) * 1000)
            .format('HH:mm:ss'),
          'Track File Name': plays?.sonicKey?.originalFileName || "--",
          Artist: plays?.sonicKey?.contentOwner || "--",
          Country: plays?.radioStation?.country || "--",
          ISRC: plays?.sonicKey?.isrcCode || "--",
          ISWC: plays?.sonicKey?.iswcCode || "--",
          "Tune Code": plays?.sonicKey?.tuneCode || "--",
          "Quality Grade": plays?.sonicKey?.contentQuality || "--",
          Desciption: plays?.sonicKey?.contentDescription || "--",
          Distributor: plays?.sonicKey?.distributor || "--",
          Version: plays?.sonicKey?.version || "--",
          Label: plays?.sonicKey?.label || "--",
          "Additional Metadata": plays?.sonicKey?.additionalMetadata?.['message'] || "--",
        };
        playsListInJsonFormat.push(playsExcelData);
      }
      if (playsListInJsonFormat.length <= 0) {
        playsListInJsonFormat.push({
          SonicKey: '',
          'Radio Station': '',
          Date: '',
          Time: '',
          Duration: '',
          'Track File Name': '',
          Artist: '',
          Country: '',
          ISRC: '',
          ISWC: '',
          "Tune Code": '',
          "Quality Grade": '',
          Desciption: '',
          Distributor: '',
          Version: '',
          Label: '',
          "Additional Metadata": '',
        });
      }
  
      for await (const topRadioStation of topRadioStationsWithPlaysCount) {
        var topRadioStationExcelData = {
          'Radio Station': topRadioStation?.radioStation?.name,
          Country: topRadioStation?.radioStation?.country,
          Plays: topRadioStation?.playsCount.playsCount,
          'Unique Track Played': topRadioStation?.playsCount.uniquePlaysCount,
        };
        topRadioStationsWithPlaysCountInJsonFormat.push(topRadioStationExcelData);
      }
  
      if (topRadioStationsWithPlaysCountInJsonFormat.length <= 0) {
        topRadioStationsWithPlaysCountInJsonFormat.push({
          'Radio Station': '',
          Country: '',
          Plays: '',
          'Unique Track Played': '',
        });
      }

      const destination = await makeDir(appConfig.MULTER_EXPORT_DEST);
      var finalFilePath:string=`${destination}/plays_view_${Date.now()}.zip`

      var zip = new AdmZip();
      try {
        const file = xlsx.utils.book_new()
        const wsPlaysListInJsonFormat = xlsx.utils.json_to_sheet(
          playsListInJsonFormat,
        );
        const wsTopRadioStationsWithPlaysCountInJsonFormat = xlsx.utils.json_to_sheet(
          topRadioStationsWithPlaysCountInJsonFormat,
        );
        xlsx.utils.book_append_sheet(file, wsPlaysListInJsonFormat, 'Plays');
        xlsx.utils.book_append_sheet(
          file,
          wsTopRadioStationsWithPlaysCountInJsonFormat,
          'Radio Plays',
        );
        if (format == 'xlsx') {
          const nonChartsFilePath = `${destination}/${`plays_view_${Date.now()}`}.xlsx`;
          const chartsFilePath = `${destination}/${`charts_${Date.now()}`}.xlsx`;
          xlsx.writeFile(file, nonChartsFilePath);
          await this.addChartsToExcel(chartsFilePath, chartsData);
          zip.addLocalFile(nonChartsFilePath,'','Plays.xlsx');
          zip.addLocalFile(chartsFilePath,'','Radio Plays.xlsx');
          zip.writeZip(finalFilePath,(err=>{
            this.fileHandlerService.deleteFileAtPath(nonChartsFilePath);
            this.fileHandlerService.deleteFileAtPath(chartsFilePath);
            if(err){
              reject(err)
            }
            resolve(finalFilePath)
          }));
        } else if (format == 'csv') {
          const playsCsvPath = `${destination}/${`plays_view_${Date.now()}`}.csv`;
          const topStationsCsvPath = `${destination}/${`topStations_${Date.now()}`}.csv`;
          xlsx.writeFile(file, playsCsvPath,{bookType:'csv',sheet:"Plays"});
          xlsx.writeFile(file, topStationsCsvPath,{bookType:'csv',sheet:"Radio Plays"});
          zip.addLocalFile(playsCsvPath,'','Plays.csv');
          zip.addLocalFile(topStationsCsvPath,'','Radio Plays.csv');
          zip.writeZip(finalFilePath,(err=>{
            this.fileHandlerService.deleteFileAtPath(playsCsvPath);
            this.fileHandlerService.deleteFileAtPath(topStationsCsvPath);
            if(err){
              reject(err)
            }
            resolve(finalFilePath)
          }));
        }
      } catch (error) {
        reject(error);
      }
    })
    
  }

  async addChartsToExcel(
    filePath: string,
    chartsData: PlaysGraphResponseDto,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let xlsxChart = new XLSXChart();

      let opts = {
        charts: [
          {
            chart: 'column',
            titles: ['Plays-Country-Wise'],
            fields: chartsData.playsCountryWise.map(item => item._id),
            data: {
              'Plays-Country-Wise': chartsData.playsCountryWise.reduce(
                (obj, item) => Object.assign(obj, { [item._id]: item.total }),
                {},
              ),
            },
            chartTitle: 'Plays-Country-Wise',
          },
          {
            chart: 'column',
            titles: ['Plays-Song-Wise'],
            fields: chartsData.playsSongWise.map(item => item._id),
            data: {
              'Plays-Song-Wise': chartsData.playsSongWise.reduce(
                (obj, item) => Object.assign(obj, { [item._id]: item.total }),
                {},
              ),
            },
            chartTitle: 'Plays-Song-Wise',
          },
          {
            chart: 'column',
            titles: ['Plays-Station-Wise'],
            fields: chartsData.playsStationWise.map(item => item._id),
            data: {
              'Plays-Station-Wise': chartsData.playsStationWise.reduce(
                (obj, item) => Object.assign(obj, { [item._id]: item.total }),
                {},
              ),
            },
            chartTitle: 'Plays-Station-Wise',
          },
          {
            chart: 'column',
            titles: ['Plays-Artist-Wise'],
            fields: chartsData.playsArtistWise.map(item => item._id),
            data: {
              'Plays-Artist-Wise': chartsData.playsArtistWise.reduce(
                (obj, item) => Object.assign(obj, { [item._id]: item.total }),
                {},
              ),
            },
            chartTitle: 'Plays-Artist-Wise',
          },
        ],
      };

      xlsxChart.generate(opts, function(err, data) {
        if (err) {
          reject(err);
        }
        fs.writeFileSync(filePath, data);
        resolve(filePath);
      });
    });
  }

  async exportHistoryOfSonicKeyPlays(
    queryDto: ParsedQueryDto,
    format: string,
  ):Promise<string> {
    return new Promise(async (resolve,reject)=>{
      const playsLists = (await this.listPlays(
        queryDto,
        true,
      )) as PlaysListResponseDto[];
      const topRadioStationsWithPlaysCount = await this.findTopRadioStationsWithPlaysCountForOwner(
        queryDto.limit,
        queryDto,
      );
      var playsListInJsonFormat = [];
      var topRadioStationsWithPlaysCountInJsonFormat = [];
      for await (const plays of playsLists) {
        var playsExcelData = {
          SonicKey: plays?.sonicKey?._id,
          'Radio Station': plays?.radioStation?.name || "--",
          Date: moment(plays?.detectedAt || plays?.createdAt)
            .utc()
            .format('DD/MM/YYYY'),
          Time: moment(plays?.detectedAt || plays?.createdAt)
            .utc()
            .format('HH:mm'),
          Duration: moment
            .utc((plays?.detectedDuration || plays?.sonicKey?.contentDuration) * 1000)
            .format('HH:mm:ss'),
          'Track File Name': plays?.sonicKey?.originalFileName || "--",
          Artist: plays?.sonicKey?.contentOwner,
          Country: plays?.radioStation?.country,
          ISRC: plays?.sonicKey?.isrcCode || "--",
          ISWC: plays?.sonicKey?.iswcCode || "--",
          "Tune Code": plays?.sonicKey?.tuneCode || "--",
          "Quality Grade": plays?.sonicKey?.contentQuality || "--",
          Desciption: plays?.sonicKey?.contentDescription || "--",
          Distributor: plays?.sonicKey?.distributor || "--",
          Version: plays?.sonicKey?.version || "--",
          Label: plays?.sonicKey?.label || "--",
          "Additional Metadata": plays?.sonicKey?.additionalMetadata?.['message'] || "--",
        };
        playsListInJsonFormat.push(playsExcelData);
      }
      if (playsListInJsonFormat.length <= 0) {
        playsListInJsonFormat.push({
          SonicKey: '',
          'Radio Station': '',
          Date: '',
          Time: '',
          Duration: '',
          'Track File Name': '',
          Artist: '',
          Country: '',
          ISRC: '',
          ISWC: '',
          "Tune Code": '',
          "Quality Grade": '',
          Desciption: '',
          Distributor: '',
          Version: '',
          Label: '',
          "Additional Metadata": '',
        });
      }
  
      for await (const topRadioStation of topRadioStationsWithPlaysCount) {
        var topRadioStationExcelData = {
          'Radio Station': topRadioStation?.radioStation?.name,
          Country: topRadioStation?.radioStation?.country,
          Plays: topRadioStation?.playsCount.playsCount,
          'Unique Track Played': topRadioStation?.playsCount.uniquePlaysCount,
        };
        topRadioStationsWithPlaysCountInJsonFormat.push(topRadioStationExcelData);
      }
  
      if (topRadioStationsWithPlaysCountInJsonFormat.length <= 0) {
        topRadioStationsWithPlaysCountInJsonFormat.push({
          'Radio Station': '',
          Country: '',
          Plays: '',
          'Unique Track Played': '',
        });
      }
  
      const destination = await makeDir(appConfig.MULTER_EXPORT_DEST);
      var finalFilePath:string=''
      var zip = new AdmZip();
      try {
        const file = xlsx.utils.book_new()
        const wsPlaysListInJsonFormat = xlsx.utils.json_to_sheet(
          playsListInJsonFormat,
        );
        const wsTopRadioStationsWithPlaysCountInJsonFormat = xlsx.utils.json_to_sheet(
          topRadioStationsWithPlaysCountInJsonFormat,
        );
        xlsx.utils.book_append_sheet(file, wsPlaysListInJsonFormat, 'SonicKey Plays');
        xlsx.utils.book_append_sheet(
          file,
          wsTopRadioStationsWithPlaysCountInJsonFormat,
          'SonicKey Plays on Radio',
        );
        if(format=="xlsx"){
          const excelFilePath =`${destination}/${`history_of_sonickey${Date.now()}`}.xlsx`;
          xlsx.writeFile(file, excelFilePath);
          finalFilePath=excelFilePath
          resolve(excelFilePath)
        }else if (format == 'csv') {
          const historyOfSonicKeyCsvPath = `${destination}/${`history_of_sonickey${Date.now()}`}.csv`;
          const topStationsCsvPath = `${destination}/${`topStations_${Date.now()}`}.csv`;
          xlsx.writeFile(file, historyOfSonicKeyCsvPath,{bookType:'csv',sheet:"SonicKey Plays"});
          xlsx.writeFile(file, topStationsCsvPath,{bookType:'csv',sheet:"SonicKey Plays on Radio"});
          zip.addLocalFile(historyOfSonicKeyCsvPath,'','SonicKey Plays.csv');
          zip.addLocalFile(topStationsCsvPath,'','SonicKey Plays on Radio.csv');
          const zipFilePath =`${destination}/${`history_of_sonickey${Date.now()}`}.zip`;
          finalFilePath=zipFilePath
          zip.writeZip(zipFilePath,(err=>{
            this.fileHandlerService.deleteFileAtPath(historyOfSonicKeyCsvPath);
            this.fileHandlerService.deleteFileAtPath(topStationsCsvPath);
            if(err){
              reject(err)
            }
            resolve(zipFilePath)
          }));
        }
      } catch (error) {
        return reject(error);
      }
    })
   
  }

  async countPlays(
    queryDto: ParsedQueryDto
  ):Promise<number> {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          detectedAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
      {
        $count:"count"
      }
    ];
    const aggregate = await this.detectionModel.aggregate(aggregateArray);
    return aggregate[0]?.count || 0
  }
  async countPlaysByArtists(
    queryDto: ParsedQueryDto,
  ):Promise<number> {
    const {
      limit,
      skip,
      sort={playsCount:-1},
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          detectedAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
      {
        $group:{
          _id:{
            artist:'$sonicKey.contentOwner'
          },
          plays:{
            $sum:1
          },
          sonicKeys: {
            $addToSet: '$sonicKey.sonicKey',
          },
          radioStations: {
            $addToSet: '$radioStation._id',
          },
          countries: {
            $addToSet: '$radioStation.country',
          },
        }
      },
      {
        $match: {
          '_id.artist': { $exists: true, $ne: null },
        },
      },
      {
        $count:"count"
      }
    ];
    const aggregate = await this.detectionModel.aggregate(aggregateArray);
    return aggregate[0]?.count || 0
  }
  async countPlaysByCountries(
    queryDto: ParsedQueryDto,
  ):Promise<number>{
    const {
      limit,
      skip,
      sort={playsCount:-1},
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          detectedAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
      {
        $group:{
          _id:{
            country:'$radioStation.country'
          },
          plays:{
            $sum:1
          },
          sonicKeys: {
            $addToSet: '$sonicKey.sonicKey',
          },
          radioStations: {
            $addToSet: '$radioStation._id',
          },
          artists: {
            $addToSet: '$sonicKey.contentOwner',
          },
        }
      },
      {
        $match: {
          '_id.country': { $exists: true, $ne: null },
        },
      },
      {
        $count:"count"
      }
    ];
    const aggregate = await this.detectionModel.aggregate(aggregateArray);
    return aggregate[0]?.count || 0
  }
  async countPlaysByTracks(
    queryDto: ParsedQueryDto,
  ):Promise<number>{
    const {
      limit,
      skip,
      sort={playsCount:-1},
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          detectedAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
      {
        $group:{
          _id:{
            trackName:'$sonicKey.contentName'
          },
          plays:{
            $sum:1
          },
          sonicKeys: {
            $addToSet: '$sonicKey.sonicKey',
          },
          radioStations: {
            $addToSet: '$radioStation._id',
          },
          countries: {
            $addToSet: '$radioStation.country',
          },
        }
      },
      {
        $match: {
          '_id.trackName': { $exists: true, $ne: null },
        },
      },
      {
        $count:"count"
      }
    ];
    const aggregate = await this.detectionModel.aggregate(aggregateArray);
    return aggregate[0]?.count || 0
  }
  async countPlaysByRadioStations(
    queryDto: ParsedQueryDto,
  ):Promise<number>{
    const {
      limit,
      skip,
      sort={playsCount:-1},
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          detectedAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
      {
        $group:{
          _id:{
            radioStation:'$radioStation._id'
          },
          plays:{
            $sum:1
          },
          sonicKeys: {
            $addToSet: '$sonicKey.sonicKey',
          },
          artists: {
            $addToSet: '$sonicKey.contentOwner',
          },
          countries: {
            $addToSet: '$radioStation.country',
          },
        }
      },
      {
        $match: {
          '_id.radioStation': { $exists: true, $ne: null },
        },
      },
      {
        $count:"count"
      }
    ];
    const aggregate = await this.detectionModel.aggregate(aggregateArray);
    return aggregate[0]?.count || 0
  }

  async exportPlays(
    queryDto: ParsedQueryDto,
    format: string,
  ) {
    const playsLists = (await this.listPlays(queryDto)) as MongoosePaginatePlaysDto
    var playsListInJsonFormat = [];
    for await (const plays of playsLists?.docs||[]) {
      var playsExcelData = {
        Artist: plays?.sonicKey?.contentOwner || "--",
        Title: plays?.sonicKey?.contentName || "--",
        'Radio Station': plays?.radioStation?.name || "--",
        Date: moment(plays?.detectedAt || plays?.createdAt)
          .utc()
          .format('DD/MM/YYYY'),
        Time: moment(plays?.detectedAt || plays?.createdAt)
          .utc()
          .format('HH:mm'),
        Duration: moment
          .utc((plays?.detectedDuration || plays?.sonicKey?.contentDuration) * 1000)
          .format('HH:mm:ss'),
        
        Country: plays?.radioStation?.country || "--",
        SonicKey: plays?.sonicKey?._id,
        ISRC: plays?.sonicKey?.isrcCode || "--",
        ISWC: plays?.sonicKey?.iswcCode || "--",
        "Tune Code": plays?.sonicKey?.tuneCode || "--",
        "Quality Grade": plays?.sonicKey?.contentQuality || "--",
        Desciption: plays?.sonicKey?.contentDescription || "--",
        Distributor: plays?.sonicKey?.distributor || "--",
        Version: plays?.sonicKey?.version || "--",
        Label: plays?.sonicKey?.label || "--",
        "Additional Metadata": plays?.sonicKey?.additionalMetadata?.['message'] || "--",
      };
      playsListInJsonFormat.push(playsExcelData);
    }
    if (playsListInJsonFormat.length <= 0) {
      playsListInJsonFormat.push({
        Artist: '',
        Title: '',
        'Radio Station': '',
        Date: '',
        Time: '',
        Duration: '',
        Country: '',
        SonicKey: '',
        ISRC: '',
        ISWC: '',
        "Tune Code": '',
        "Quality Grade": '',
        Desciption: '',
        Distributor: '',
        Version: '',
        Label: '',
        "Additional Metadata": '',
      });
    }
    const destination = await makeDir(appConfig.MULTER_EXPORT_DEST);
    var tobeStorePath:string ='' 
    const file = xlsx.utils.book_new()
    const wsPlaysListInJsonFormat = xlsx.utils.json_to_sheet(
      playsListInJsonFormat,
    );
    xlsx.utils.book_append_sheet(file, wsPlaysListInJsonFormat, 'My Plays');
    if (format == 'xlsx') {
      tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_My_Plays`}.xlsx`;
      xlsx.writeFile(file, tobeStorePath);
    }else if(format=='csv'){
      tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_My_Plays`}.csv`;
      xlsx.writeFile(file, tobeStorePath,{bookType:'csv',sheet:"My Plays"});
    }
    return tobeStorePath
  }
  async exportPlaysByArtists(
    queryDto: ParsedQueryDto,
    format:string
  ){
    const playsListsByArtists = (await this.listPlaysByArtists(queryDto))
    var jsonFormat = [];
    for await (const data of playsListsByArtists?.docs||[]) {
      var excelData = {
        Artist: data?.artist|| "--",
        Plays: data?.playsCount || 0,
        Tracks: data?.uniquePlaysCount || 0,
        'Radio Station': data?.radioStationCount || 0,
        Country: data?.countriesCount || 0
      };
      jsonFormat.push(excelData);
    }
    if (jsonFormat.length <= 0) {
      jsonFormat.push({
        Artist: '',
        Plays: '',
        Tracks: '',
        'Radio Station': '',
        Country: ''
      });
    }
    const destination = await makeDir(appConfig.MULTER_EXPORT_DEST);
    var tobeStorePath:string ='' 
    const file = xlsx.utils.book_new()
    const jsonToWorkSheet = xlsx.utils.json_to_sheet(
      jsonFormat,
    );
    xlsx.utils.book_append_sheet(file, jsonToWorkSheet, 'Artists');
    if (format == 'xlsx') {
      tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Artists`}.xlsx`;
      xlsx.writeFile(file, tobeStorePath);
    }else if(format=='csv'){
      tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Artists`}.csv`;
      xlsx.writeFile(file, tobeStorePath,{bookType:'csv',sheet:"Artists"});
    }
    return tobeStorePath
  }
  async exportPlaysByCountries(
    queryDto: ParsedQueryDto,
    format:string
  ){
    const playsListsByCountries = (await this.listPlaysByCountries(queryDto))
    var jsonFormat = [];
    for await (const data of playsListsByCountries?.docs||[]) {
      var excelData = {
        Country: data?.country || "--",
        Plays: data?.playsCount || 0,
        Tracks: data?.uniquePlaysCount || 0,
        Artist: data?.artistsCount|| 0,
        'Radio Station': data?.radioStationCount || 0,
      };
      jsonFormat.push(excelData);
    }
    if (jsonFormat.length <= 0) {
      jsonFormat.push({
        Country: '',
        Plays: '',
        Tracks: '',
        Artist: '',
        'Radio Station': '',
       
      });
    }
    const destination = await makeDir(appConfig.MULTER_EXPORT_DEST);
    var tobeStorePath:string ='' 
    const file = xlsx.utils.book_new()
    const jsonToWorkSheet = xlsx.utils.json_to_sheet(
      jsonFormat,
    );
    xlsx.utils.book_append_sheet(file, jsonToWorkSheet, 'Countries');
    if (format == 'xlsx') {
      tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Countries`}.xlsx`;
      xlsx.writeFile(file, tobeStorePath);
    }else if(format=='csv'){
      tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Countries`}.csv`;
      xlsx.writeFile(file, tobeStorePath,{bookType:'csv',sheet:"Countries"});
    }
    return tobeStorePath
  }
  async exportPlaysByTracks(
    queryDto: ParsedQueryDto,
    format:string
  ){
    const playsListsByTracks = (await this.listPlaysByTracks(queryDto))
    var jsonFormat = [];
    for await (const data of playsListsByTracks?.docs||[]) {
      var excelData = {
        'Track Name': data?.trackName || "--",
        Plays: data?.playsCount || 0,
        Tracks: data?.uniquePlaysCount || 0,
        'Radio Station': data?.radioStationCount || 0,
        Country: data?.countriesCount|| 0,
      };
      jsonFormat.push(excelData);
    }
    if (jsonFormat.length <= 0) {
      jsonFormat.push({
        'Track Name': '',
        Plays: '',
        Tracks: '',
        'Radio Station': '',
        Country:''
       
      });
    }
    const destination = await makeDir(appConfig.MULTER_EXPORT_DEST);
    var tobeStorePath:string ='' 
    const file = xlsx.utils.book_new()
    const jsonToWorkSheet = xlsx.utils.json_to_sheet(
      jsonFormat,
    );
    xlsx.utils.book_append_sheet(file, jsonToWorkSheet, 'My_Tracks');
    if (format == 'xlsx') {
      tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_My_Tracks`}.xlsx`;
      xlsx.writeFile(file, tobeStorePath);
    }else if(format=='csv'){
      tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_My_Tracks`}.csv`;
      xlsx.writeFile(file, tobeStorePath,{bookType:'csv',sheet:"My_Tracks"});
    }
    return tobeStorePath
  }
  async exportPlaysByRadioStations(
    queryDto: ParsedQueryDto,
    format:string
  ){
    const playsListsByRadioStations = (await this.listPlaysByRadioStations(queryDto))
    var jsonFormat = [];
    for await (const data of playsListsByRadioStations?.docs||[]) {
      var excelData = {
        'Radio Station': data?.radioStation?.name || "--",
        Country: data?.countriesCount|| 0,
        Plays: data?.playsCount || 0,
        Tracks: data?.uniquePlaysCount || 0,
        Artist: data?.artistsCount|| 0,
      };
      jsonFormat.push(excelData);
    }
    if (jsonFormat.length <= 0) {
      jsonFormat.push({
        'Radio Station': '',
        Country:'',
        Plays: '',
        Tracks: '',
        'Artist': ''
       
      });
    }
    const destination = await makeDir(appConfig.MULTER_EXPORT_DEST);
    var tobeStorePath:string ='' 
    const file = xlsx.utils.book_new()
    const jsonToWorkSheet = xlsx.utils.json_to_sheet(
      jsonFormat,
    );
    xlsx.utils.book_append_sheet(file, jsonToWorkSheet, 'Radio_Stations');
    if (format == 'xlsx') {
      tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Radio_Stations`}.xlsx`;
      xlsx.writeFile(file, tobeStorePath);
    }else if(format=='csv'){
      tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Radio_Stations`}.csv`;
      xlsx.writeFile(file, tobeStorePath,{bookType:'csv',sheet:"Radio_Stations"});
    }
    return tobeStorePath
  }

  async listPlays(
    queryDto: ParsedQueryDto,
    recentPlays: boolean = false,
  ): Promise<MongoosePaginatePlaysDto | PlaysListResponseDto[]> {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          detectedAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },

      {
        $lookup: {
          //populate sonickey's owner from its relational table
          from: 'User',
          localField: 'sonicKey.owner',
          foreignField: '_id',
          as: 'sonicKey.owner',
        },
      },
      { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
      {
        $lookup: {
          //populate sonickey's company from its relational table
          from: 'Company',
          localField: 'sonicKey.company',
          foreignField: '_id',
          as: 'sonicKey.company',
        },
      },
      { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
    ];
    if (recentPlays) {
      aggregateArray.push({
        $limit: limit||10,
      });
      if (select) {
        aggregateArray.push({
          $project: select,
        });
      }
      return this.detectionModel.aggregate(aggregateArray);
    }
    const aggregate = this.detectionModel.aggregate(aggregateArray);
    return this.detectionModel['aggregatePaginate'](aggregate, paginateOptions);
  }

  async listPlaysByArtists(
    queryDto: ParsedQueryDto,
  ): Promise<MongoosePaginatePlaysByArtistDto> {
    const {
      limit,
      skip,
      sort={playsCount:-1},
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          detectedAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $lookup: {
          //populate sonickey's owner from its relational table
          from: 'User',
          localField: 'sonicKey.owner',
          foreignField: '_id',
          as: 'sonicKey.owner',
        },
      },
      { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
      {
        $lookup: {
          //populate sonickey's company from its relational table
          from: 'Company',
          localField: 'sonicKey.company',
          foreignField: '_id',
          as: 'sonicKey.company',
        },
      },
      { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
      {
        $group:{
          _id:{
            artist:'$sonicKey.contentOwner'
          },
          plays:{
            $sum:1
          },
          sonicKeys: {
            $addToSet: '$sonicKey.sonicKey',
          },
          radioStations: {
            $addToSet: '$radioStation._id',
          },
          countries: {
            $addToSet: '$radioStation.country',
          },
        }
      },
      {
        $match: {
          '_id.artist': { $exists: true, $ne: null },
        },
      },
      {
        $project: {
          _id: 0,
          artist:'$_id.artist',
          playsCount: '$plays',
          uniquePlaysCount: { $size: '$sonicKeys' },
          radioStationCount: { $size: '$radioStations' },
          countriesCount: { $size: '$countries' }
        },
      },
    ];
    const aggregate = this.detectionModel.aggregate(aggregateArray);
    return this.detectionModel['aggregatePaginate'](aggregate, paginateOptions);
  }
  async listPlaysByCountries(
    queryDto: ParsedQueryDto,
  ): Promise<MongoosePaginatePlaysByCountryDto> {
    const {
      limit,
      skip,
      sort={playsCount:-1},
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          detectedAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $lookup: {
          //populate sonickey's owner from its relational table
          from: 'User',
          localField: 'sonicKey.owner',
          foreignField: '_id',
          as: 'sonicKey.owner',
        },
      },
      { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
      {
        $lookup: {
          //populate sonickey's company from its relational table
          from: 'Company',
          localField: 'sonicKey.company',
          foreignField: '_id',
          as: 'sonicKey.company',
        },
      },
      { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
      {
        $group:{
          _id:{
            country:'$radioStation.country'
          },
          plays:{
            $sum:1
          },
          sonicKeys: {
            $addToSet: '$sonicKey.sonicKey',
          },
          radioStations: {
            $addToSet: '$radioStation._id',
          },
          artists: {
            $addToSet: '$sonicKey.contentOwner',
          },
        }
      },
      {
        $match: {
          '_id.country': { $exists: true, $ne: null },
        },
      },
      {
        $project: {
          _id: 0,
          country:'$_id.country',
          playsCount: '$plays',
          uniquePlaysCount: { $size: '$sonicKeys' },
          radioStationCount: { $size: '$radioStations' },
          artistsCount: { $size: '$artists' }
        },
      },
    ];
    const aggregate = this.detectionModel.aggregate(aggregateArray);
    return this.detectionModel['aggregatePaginate'](aggregate, paginateOptions);
  }
  async listPlaysByTracks(
    queryDto: ParsedQueryDto,
  ): Promise<MongoosePaginatePlaysByTrackDto> {
    const {
      limit,
      skip,
      sort={playsCount:-1},
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          detectedAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $lookup: {
          //populate sonickey's owner from its relational table
          from: 'User',
          localField: 'sonicKey.owner',
          foreignField: '_id',
          as: 'sonicKey.owner',
        },
      },
      { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
      {
        $lookup: {
          //populate sonickey's company from its relational table
          from: 'Company',
          localField: 'sonicKey.company',
          foreignField: '_id',
          as: 'sonicKey.company',
        },
      },
      { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
      {
        $group:{
          _id:{
            trackName:'$sonicKey.contentName'
          },
          plays:{
            $sum:1
          },
          sonicKeys: {
            $addToSet: '$sonicKey.sonicKey',
          },
          radioStations: {
            $addToSet: '$radioStation._id',
          },
          countries: {
            $addToSet: '$radioStation.country',
          },
        }
      },
      {
        $match: {
          '_id.trackName': { $exists: true, $ne: null },
        },
      },
      {
        $project: {
          _id: 0,
          trackName:'$_id.trackName',
          playsCount: '$plays',
          uniquePlaysCount: { $size: '$sonicKeys' },
          radioStationCount: { $size: '$radioStations' },
          countriesCount: { $size: '$countries' }
        },
      }
    ];
    const aggregate = this.detectionModel.aggregate(aggregateArray);
    return this.detectionModel['aggregatePaginate'](aggregate, paginateOptions);
  }
  async listPlaysByRadioStations(
    queryDto: ParsedQueryDto,
  ): Promise<MongoosePaginatePlaysByRadioStationDto> {
    const {
      limit,
      skip,
      sort={playsCount:-1},
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          detectedAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $lookup: {
          //populate sonickey's owner from its relational table
          from: 'User',
          localField: 'sonicKey.owner',
          foreignField: '_id',
          as: 'sonicKey.owner',
        },
      },
      { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
      {
        $lookup: {
          //populate sonickey's company from its relational table
          from: 'Company',
          localField: 'sonicKey.company',
          foreignField: '_id',
          as: 'sonicKey.company',
        },
      },
      { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
      {
        $group:{
          _id:{
            radioStation:'$radioStation._id'
          },
          plays:{
            $sum:1
          },
          sonicKeys: {
            $addToSet: '$sonicKey.sonicKey',
          },
          artists: {
            $addToSet: '$sonicKey.contentOwner',
          },
          countries: {
            $addToSet: '$radioStation.country',
          },
        }
      },
      {
        $match: {
          '_id.radioStation': { $exists: true, $ne: null },
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: '_id.radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      {
        $project: {
          _id: 0,
          radioStation: { $first: '$radioStation' },
          playsCount: '$plays',
          uniquePlaysCount: { $size: '$sonicKeys' },
          artistsCount: { $size: '$artists' },
          countriesCount: { $size: '$countries' }
        },
      },
    ];
    const aggregate = this.detectionModel.aggregate(aggregateArray);
    return this.detectionModel['aggregatePaginate'](aggregate, paginateOptions);
  }

  async findAll(
    queryDto: ParsedQueryDto,
    aggregateQuery?: boolean,
  ): Promise<MongoosePaginateDetectionDto> {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      aggregateSearch,
      includeGroupData,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;

    const aggregate = this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      { $group: { _id: '$sonicKey', totalHits: { $sum: 1 } } }, //group by radioStation to get duplicates counts
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'SonicKey',
          localField: '_id',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      {
        $project: {
          sonicKey: { $first: '$sonicKey' },
          totalHits: 1,
          otherField: 1,
        }, //lookup will return array so always tale first index elememt
      },
      { $sort: { totalHits: -1 } }, //sort in decending order
    ]);

    if (aggregateQuery) {
      return this.detectionModel['aggregatePaginate'](
        aggregate,
        paginateOptions,
      );
    } else {
      return this.detectionModel['paginate'](filter, paginateOptions);
    }
  }

  async getSonicKeysDetails(
    queryDto: ParsedQueryDto,
    aggregateQuery?: boolean,
  ): Promise<MongoosePaginateDetectionDto> {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      aggregateSearch,
      includeGroupData,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;

    const aggregate = this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      { $group: { _id: '$sonicKey', totalHits: { $sum: 1 } } }, //group by radioStation to get duplicates counts
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'SonicKey',
          localField: '_id',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      {
        $project: {
          sonicKey: { $first: '$sonicKey' },
          totalHits: 1,
          otherField: 1,
        }, //lookup will return array so always tale first index elememt
      },
      { $sort: { totalHits: -1 } }, //sort in decending order
    ]);

    if (aggregateQuery) {
      return this.detectionModel['aggregatePaginate'](
        aggregate,
        paginateOptions,
      );
    } else {
      return this.detectionModel['paginate'](filter, paginateOptions);
    }
  }

  async getTotalHitsCount(queryDto: ParsedQueryDto) {
    const { filter } = queryDto;
    return this.detectionModel
      .find(filter || {})
      .countDocuments()
      .exec();
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter } = queryDto;
    return this.detectionModel
      .find(filter || {})
      .count()
  }

  async getEstimateCount() {
    return this.detectionModel.estimatedDocumentCount()
  }

  /*
   * @param queryDto
   * @returns
   */
  async getTotalPlaysCount(
    queryDto: ParsedQueryDto,
  ): Promise<PlaysCountResponseDto> {
    const { filter } = queryDto;
    const playsCountDetails = await this.detectionModel.aggregate([
      {
        $match: { ...filter },
      },
      {
        $group: {
          _id: {
            sonicKey: '$sonicKey',
          },
          plays: {
            $sum: 1,
          },
          sonicKeys: {
            $addToSet: '$sonicKey',
          },
        },
      },
      {
        $group: {
          _id: null,
          playsCount: {
            $sum: '$plays',
          },
          uniquePlaysCount: {
            $sum: {
              $size: '$sonicKeys',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          playsCount: 1,
          uniquePlaysCount: 1,
        },
      },
    ]);
    return playsCountDetails[0];
  }

  async findTopRadioStationsWithPlaysCountForOwner(
    topLimit: number,
    queryDto: ParsedQueryDto,
  ): Promise<TopRadioStationWithPlaysDetails[]> {
    const {filter,relationalFilter}=queryDto;
    return this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
          channel: ChannelEnums.STREAMREADER,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $lookup: {
          //populate sonickey's owner from its relational table
          from: 'User',
          localField: 'sonicKey.owner',
          foreignField: '_id',
          as: 'sonicKey.owner',
        },
      },
      { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
      {
        $lookup: {
          //populate sonickey's company from its relational table
          from: 'Company',
          localField: 'sonicKey.company',
          foreignField: '_id',
          as: 'sonicKey.company',
        },
      },
      { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
      {
        $group: {
          _id: {
            radioStation: '$radioStation._id',
          },
          plays: {
            $sum: 1,
          },
          sonicKeys: {
            $addToSet: '$sonicKey.sonicKey',
          },
        },
      },
      {$match: {plays: {$gt: 0}}},
      {
        $sort: {
          plays: -1,
        },
      },
      { $limit: topLimit },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: '_id.radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      {
        $project: {
          _id: 0,
          radioStation: { $first: '$radioStation' },
          playsCount: {
            playsCount: '$plays',
            uniquePlaysCount: { $size: '$sonicKeys' },
          },
        },
      },
    ]);
  }

  // perfect example==> https://stackoverflow.com/questions/22932364/mongodb-group-values-by-multiple-fields
  async findTopRadioStationsWithSonicKeysForOwner(
    ownerId: string,
    topLimit: number,
    filter: object = {},
  ) {
    const topStations = await this.findTopRadioStations(
      { ...filter, owner: ownerId },
      topLimit,
    );
    var topStationsWithTopKeys = [];
    for await (const station of topStations) {
      const sonicKeys = await this.findTopSonicKeysForRadioStation(
        station._id,
        topLimit,
        filter,
      );
      station['sonicKeys'] = sonicKeys;
      topStationsWithTopKeys.push(station);
    }
    return topStationsWithTopKeys as TopRadioStationWithTopSonicKey[];
  }

  async findTopRadioStations(filter: object, topLimit: number) {
    filter['channel'] = ChannelEnums.STREAMREADER;
    const topRadioStations: TopRadioStation[] = await this.detectionModel.aggregate(
      [
        {
          $match: filter,
        },
        { $group: { _id: '$radioStation', totalKeysDetected: { $sum: 1 } } }, //group by radioStation to get duplicates counts
        { $sort: { totalKeysDetected: -1 } }, //sort in decending order
        { $limit: topLimit }, //get the top number of results only
        {
          $lookup: {
            //populate radioStation from its relational table
            from: 'RadioStation',
            localField: '_id',
            foreignField: '_id',
            as: 'radioStation',
          },
        },
        //lookup will return array so always tale first index elememt
        {
          $project: {
            radioStation: { $first: '$radioStation' },
            totalKeysDetected: 1,
            otherField: 1,
          },
        },
      ],
    );
    return topRadioStations;
  }

  async findTopSonicKeysForRadioStation(
    radioStationId: string,
    topLimit: number,
    filter: object = {},
  ) {
    const stationId = toObjectId(radioStationId);
    const topSonicKeys: TopSonicKey[] = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
          radioStation: stationId,
        },
      },
      { $group: { _id: '$sonicKey', totalHits: { $sum: 1 } } }, //group by radioStation to get duplicates counts
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'SonicKey',
          localField: '_id',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      {
        $project: {
          sonicKey: { $first: '$sonicKey' },
          totalHits: 1,
          otherField: 1,
        }, //lookup will return array so always tale first index elememt
      },
      { $sort: { totalHits: -1 } }, //sort in decending order
      { $limit: topLimit }, //get the top number of results only
    ]);
    return topSonicKeys;
  }

  async findGraphOfSonicKeysForRadioStationInSpecificTime(
    radioStationId: string,
    groupByTime: groupByTime,
    filter: object = {},
  ) {
    const stationId = toObjectId(radioStationId);
    var group_id = {};
    if (groupByTime == 'year') {
      group_id['year'] = { $year: '$detectedAt' };
    } else if (groupByTime == 'month') {
      group_id['month'] = { $month: '$detectedAt' };
    } else if (groupByTime == 'dayOfMonth') {
      group_id['dayOfMonth'] = { $dayOfMonth: '$detectedAt' };
    } else {
      group_id['dayOfMonth'] = { $dayOfMonth: '$detectedAt' };
    }
    const graphData: {
      _id: any;
      year: number;
      month: number;
      day: number;
      hits: number;
    }[] = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
          radioStation: stationId,
        },
      },
      {
        $group: {
          _id: group_id,
          detectedAt: { $first: '$detectedAt' },
          hits: { $sum: 1 },
        },
      }, //group by radioStation to get duplicates counts
      {
        $project: {
          _id: 1,
          // year: "$_id.year",
          // month:"$_id.month",
          // dayOfMonth: "$_id.dayOfMonth",
          // monthName: {
          //   $arrayElemAt: [
          //     ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          //     "$_id.month"
          //   ]
          // },
          year: { $year: '$detectedAt' },
          month: { $month: '$detectedAt' },
          day: { $dayOfMonth: '$detectedAt' },
          hits: 1,
        },
      },
    ]);
    return graphData;
  }
}
