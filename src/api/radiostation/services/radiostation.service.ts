import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { MonitorGroup, RadioStation } from '../schemas/radiostation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import {
  STOP_LISTENING_STREAM,
  START_LISTENING_STREAM,
} from '../listeners/constants';
import { MongoosePaginateRadioStationDto } from '../dto/mongoosepaginate-radiostation.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import * as fs from 'fs';
import * as xlsx from 'xlsx';
import * as _ from 'lodash';
import * as appRootPath from 'app-root-path';
import { MonitorGroupsEnum } from 'src/constants/Enums';
import * as makeDir from 'make-dir';
import { appConfig } from '../../../config/app.config';

@Injectable()
export class RadiostationService {
  constructor(
    @InjectModel(RadioStation.name)
    public readonly radioStationModel: Model<RadioStation>,
    public readonly sonickeyService: SonickeyService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  create(
    createRadiostationDto: CreateRadiostationDto,
    additionalAttribute?: Object,
  ) {
    const newRadioStation = new this.radioStationModel({
      ...createRadiostationDto,
      ...additionalAttribute,
    });
    return newRadioStation.save();
  }

  async stopListeningStream(id: string) {
    const radioStation = await this.radioStationModel.findById(id);
    if (!radioStation) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Item not found',
      });
    }
    if (!radioStation.isStreamStarted) {
      return radioStation;
    }

    this.eventEmitter.emit(STOP_LISTENING_STREAM, radioStation);
    //Do Stop Listening Stuff
    return this.radioStationModel.findOneAndUpdate(
      { _id: id },
      {
        stopAt: new Date(),
        isStreamStarted: false,
      },
      { new: true },
    );
  }

  async startListeningStream(id: string) {
    const radioStation = await this.radioStationModel.findById(id);
    if (!radioStation) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Item not found',
      });
    }
    if (radioStation.isStreamStarted) {
      return radioStation;
    }
    //https://nodejs.org/api/worker_threads.html
    //Do Start Listening Stuff
    this.eventEmitter.emit(START_LISTENING_STREAM, radioStation);
    return this.radioStationModel.findOneAndUpdate(
      { _id: id },
      {
        startedAt: new Date(),
        isStreamStarted: true,
        error: null,
        isError: false,
      },
      { new: true },
    );
  }

  async findAll(
    queryDto: ParsedQueryDto,
  ): Promise<MongoosePaginateRadioStationDto> {
    const { limit, skip, sort, page, filter, select, populate } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    return this.radioStationModel['paginate'](filter, paginateOptions);

    // return this.radioStationModel
    //   .find(query || {})
    //   .skip(_offset)
    //   .limit(_limit)
    //   .sort(sort)
    //   .exec();
  }

  async findByIdOrFail(id: string) {
    const radioStation = await this.radioStationModel.findById(id);
    if (!radioStation) {
      throw new NotFoundException();
    }
    return radioStation;
  }

  async removeById(id: string) {
    const radioStation = await this.radioStationModel.findById(id);
    if (!radioStation) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Item not found',
      });
    }
    return this.radioStationModel.findByIdAndRemove(id);
  }

  async bulkRemove(ids: [string]) {
    const promises = ids.map(id =>
      this.removeById(id).catch(err => ({ promiseError: err, data: id })),
    );
    return Promise.all(promises).then(values => {
      const failedData = values.filter(item => item['promiseError']) as {
        promiseError: any;
        data: string;
      }[];
      const passedData = values.filter(
        item => !item['promiseError'],
      ) as RadioStation[];
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }

  async bulkStartListeningStream(ids: [string]) {
    const promises = ids.map(id =>
      this.startListeningStream(id).catch(err => ({
        promiseError: err,
        data: id,
      })),
    );
    return Promise.all(promises).then(values => {
      const failedData = values.filter(item => item['promiseError']) as {
        promiseError: any;
        data: string;
      }[];
      const passedData = values.filter(
        item => !item['promiseError'],
      ) as RadioStation[];
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }

  async bulkStopListeningStream(ids: [string]) {
    const promises = ids.map(id =>
      this.stopListeningStream(id).catch(err => ({
        promiseError: err,
        data: id,
      })),
    );
    return Promise.all(promises).then(values => {
      const failedData = values.filter(item => item['promiseError']) as {
        promiseError: any;
        data: string;
      }[];
      const passedData = values.filter(
        item => !item['promiseError'],
      ) as RadioStation[];
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }

  async exportToJson(queryDto?:ParsedQueryDto,destination?: string, fileName?: string) {
    var obj = {
      stations: [],
    };

    const results = await this.findAll(queryDto)
    const stations = results.docs
    stations.forEach((station, index) => {
      station.toObject();
      const newObj = {
        sn: index + 1,
        ...station.toObject(),
      };
      obj.stations.push(newObj);
    });
    var json = JSON.stringify(obj);
    destination = await makeDir(destination||appConfig.MULTER_EXPORT_DEST);
    const filePath = `${destination}/${fileName||`radiostations_${Date.now()}`}_${results.limit}By${results.totalDocs}.json`
    fs.writeFileSync(filePath, json, 'utf8');
    return filePath;
  }

  async exportToExcel(queryDto:ParsedQueryDto,destination?: string, fileName?: string,stationsToMakeExcel = null) {
    var results:MongoosePaginateRadioStationDto
    var stations:[any]
    if(stationsToMakeExcel){
      stations=stationsToMakeExcel
    }else{
      results = await this.findAll(queryDto)
      stations = results.docs
    }
    var stationsInJosnFormat = [];
    for await (const station of stations) {
      const toJsonData = station.toJSON();
      toJsonData['monitorGroups'] = toJsonData?.monitorGroups
        ?.map(gr => gr.name)
        ?.join?.(',')
        ?.toString?.();
      stationsInJosnFormat.push(toJsonData);
    }
    destination = await makeDir(destination||appConfig.MULTER_EXPORT_DEST);
    const filePath = `${destination}/${fileName||`radiostations_${Date.now()}`}_${results?.limit}By${results?.totalDocs}.xlsx`
    const fd = fs.openSync(filePath, 'w');
    const file = xlsx.readFile(filePath);
    const ws = xlsx.utils.json_to_sheet(stationsInJosnFormat);
    xlsx.utils.book_append_sheet(file, ws);
    xlsx.writeFile(file, filePath);
    return filePath;
  }

  async importFromExcel(pathToExcel: string) {
    const stationsFromExcel = xlsx.readFile(pathToExcel);
    const sheetsNames = stationsFromExcel.SheetNames;
    var completedDetails = {
      completedCount: 0,
      duplicatesCount: 0,
      alreadyPresentsInDb: [],
      newEntries: [],
    };
    var duplicatesByStreamingUrl = [];
    // var duplicatesByName=[]
    var excelData = [];

    for await (const sheetName of sheetsNames) {
      console.log('sheetName', sheetName);
      const sheetToJson: any[] = xlsx.utils.sheet_to_json(
        stationsFromExcel.Sheets[sheetName],
      );
      excelData = sheetToJson;

      const resByStreamingUrl = {};
      // const resByName = {};
      for await (const obj of sheetToJson) {
        const key = `${obj['streamingUrl']}`;
        if (!resByStreamingUrl[key]) {
          resByStreamingUrl[key] = { ...obj, count: 0 };
        }
        resByStreamingUrl[key].count += 1;
      }
      // for await (const obj of sheetToJson) {
      //   const key = `${obj['name']}`;
      //    if (!resByName[key]) {
      //       resByName[key] = { ...obj, count: 0 };
      //    };
      //    resByName[key].count += 1
      // }
      var resByStreamingUrlArr = Object.values(resByStreamingUrl);
      // var resByNameArr=Object.values(resByName)
      duplicatesByStreamingUrl = resByStreamingUrlArr.filter(
        item => item['count'] > 1,
      );
      // duplicatesByName= resByNameArr.filter(item=>item['count']>1)

      // break;
      for await (const stationRow of sheetToJson) {
        // const radioStation = await this.radioStationModel.findOne({
        //   $or: [
        //     { name: stationRow['name'] },
        //     { streamingUrl: stationRow['streamingUrl'] },
        //   ],
        // });
        const radioStation = await this.radioStationModel.findOne({
          streamingUrl: stationRow['streamingUrl'],
        });
        if (!radioStation) {
          var formatedMonitorsGroups = [];
          if (stationRow.monitorGroups) {
            if (stationRow.monitorGroups.includes(',')) {
              formatedMonitorsGroups = stationRow.monitorGroups
                .split(',')
                .map(groupName => {
                  const monitorGroup = new MonitorGroup();
                  monitorGroup.name = groupName;
                  return monitorGroup;
                });
            } else {
              const newMonitorGroup = new MonitorGroup();
              newMonitorGroup.name = stationRow.monitorGroups;
              if (stationRow.monitorGroup)
                formatedMonitorsGroups = [newMonitorGroup];
            }
          }
          console.log('formatedMonitorsGroups', formatedMonitorsGroups);
          const uniqueFormatedMonitorsGroups = _.uniqBy(
            formatedMonitorsGroups,
            'name',
          );
          console.log(
            'uniqueFormatedMonitorsGroups',
            uniqueFormatedMonitorsGroups,
          );
          const newRadio = {
            name: stationRow['name'],
            country: stationRow['country'],
            streamingUrl: stationRow['streamingUrl'],
            adminEmail: stationRow['adminEmail'],
            website: stationRow['website'],
            monitorGroups: formatedMonitorsGroups,
          };
          const newRadioStation = await this.radioStationModel.create(newRadio);
          await newRadioStation
            .save()
            .then(saved => {
              completedDetails.completedCount =
                completedDetails.completedCount + 1;
              completedDetails.newEntries.push(saved);
            })
            .catch(err => console.log(err));
        } else {
          console.log('Already Present Radio', radioStation.name);
          completedDetails.duplicatesCount += 1;
          completedDetails.alreadyPresentsInDb.push(radioStation);
        }
      }
      //Break the loop, we only want first sheet here.
      break;
    }
    return {
      message: 'Done',
      totalExcelData: excelData.length,
      completedDetails: completedDetails,
      duplicatesByStreamingUrlLength_InExcel: duplicatesByStreamingUrl.length,
      duplicatesByStreamingUrl_InExcel: duplicatesByStreamingUrl,
    };
  }

  async addMonitorGroupsFromExcel() {
    const europestationsAIM = xlsx.readFile(
      `${appRootPath.toString()}/sample_test/Europe 500 Stations_Working_list_AIM.xlsx`,
    );
    const radiodancestationsAFEM = xlsx.readFile(
      `${appRootPath.toString()}/sample_test/Radio - Dance. Multi Territory_AFEM.xlsx`,
    );
    const sheetsNameAIM = europestationsAIM.SheetNames;
    const sheetsNameAFEM = radiodancestationsAFEM.SheetNames;
    for await (const sheetNameAIM of sheetsNameAIM) {
      console.log('sheetNameAIM', sheetNameAIM);
      const aimJson = xlsx.utils.sheet_to_json(
        europestationsAIM.Sheets[sheetNameAIM],
      );
      console.log(aimJson);
      for await (const data of aimJson) {
        const monitorGroup = new MonitorGroup();
        monitorGroup.name = MonitorGroupsEnum.AIM;
        const radioStation = await this.radioStationModel.findOne({
          $or: [
            { name: { $regex: new RegExp(data['Station Name'], 'i') } },
            { website: data['Website'] },
          ],
        });
        if (radioStation) {
          radioStation.monitorGroups.push(monitorGroup);
          radioStation.monitorGroups = _.uniqBy(
            radioStation.monitorGroups,
            'name',
          );
          await radioStation.save().catch(err => console.log(err));
        }
      }
    }
    for await (const sheetNameAFEM of sheetsNameAFEM) {
      const afemJson = xlsx.utils.sheet_to_json(
        radiodancestationsAFEM.Sheets[sheetNameAFEM],
      );
      console.log(afemJson);
      for await (const data of afemJson) {
        const monitorGroup = new MonitorGroup();
        monitorGroup.name = MonitorGroupsEnum.AFEM;
        const radioStation = await this.radioStationModel.findOne({
          $or: [
            { name: { $regex: new RegExp(data['Station Name'], 'i') } },
            { website: data['Website'] },
          ],
        });
        if (radioStation) {
          radioStation.monitorGroups.push(monitorGroup);
          radioStation.monitorGroups = _.uniqBy(
            radioStation.monitorGroups,
            'name',
          );
          await radioStation.save().catch(err => console.log(err));
        }
      }
    }

    const undonRadios = await this.radioStationModel.find({
      monitorGroups: null,
    });
    await this.exportToExcel({filter:{},limit:1000},null,null,undonRadios);
    return 'Done';
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    // if (includeGroupData && filter.owner) {
    //   //If includeGroupData, try to fetch all data belongs to the user's groups and use the OR condition to fetch data
    //   const usergroups = await this.userService.adminListGroupsForUser(
    //     filter.owner,
    //   );
    //   if (usergroups.groupNames.length > 0) {
    //     filter['$or'] = [
    //       { groups: { $all: usergroups.groupNames } },
    //       { owner: filter.owner },
    //     ];
    //     delete filter.owner;
    //   }
    // }
    return this.radioStationModel
      .find(filter || {})
      .countDocuments()
      .exec();
  }

  async updateFromJson() {
    // const stationsArr = stationslist.stations;
    // for await (const station of stationsArr) {
    //   await this.radioStationModel.updateOne(
    //     { _id: station.id },
    //     { country: station.country},
    //   );
    // }
    await this.radioStationModel.updateMany({}, { $unset: { owner: '' } });
    return 'Done';
  }
}
