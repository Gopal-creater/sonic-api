import { VUploadedFile } from '../../shared/interfaces/VersionUploadFile.interface';
import { FileHandlerService } from '../../shared/services/file-handler.service';
import { FileOperationService } from '../../shared/services/file-operation.service';
import { UpdateAppVersionDto } from './dto/update-app-versions.dto';
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AppVersion } from './schemas/appversions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3FileUploadService } from '../s3fileupload/s3fileupload.service';
import { S3ACL } from '../../constants/Enums';


@Injectable()
export class AppVersionService {
  constructor(
    @InjectModel(AppVersion.name) public versionModel: Model<AppVersion>,
    private readonly fileOperationService: FileOperationService,
    private readonly fileHandlerService: FileHandlerService,
    private readonly s3FileUploadService: S3FileUploadService,
  ) {}

  async uploadVersionToS3(
    file: VUploadedFile,
    s3Acl?: S3ACL,
  ) {
   return this.s3FileUploadService.upload(file, `versions`, s3Acl)  
      .then(s3UploadResult => {
        return {
          downloadFileUrl: s3UploadResult.Location,
          s3UploadResult: s3UploadResult
        };
      }).catch(err => {
        throw new InternalServerErrorException(err);
      })  
  }
  async saveVersion(version: Record<any,any>) {
    const newVersion = new this.versionModel(version);
    const res = await newVersion.save();
    return res;
  }

  async findOne(id:string) {
    return this.versionModel.findOne({_id:id});
  }

  async getAllVersions() {
    return this.versionModel.find();
  }

  async downloadFromVersionCode(versionCode:string, platform:string, res:any){
    return this.versionModel.findOne({versionCode:versionCode, platform:platform})
    .then(VersionFromCode => {
      if(!VersionFromCode)
      throw new NotFoundException("verson with this version code not found.")
      return this.s3FileUploadService.downloadFile(VersionFromCode.s3FileMeta.Key, res)
    }).catch(err => {
      console.log(err)
      throw new InternalServerErrorException(err);
      
    })
  }

  async downloadLatest(platform:string, res:any){
    return this.versionModel.findOne({latest: true, platform:platform})
    .then(latestVersion => {
      return this.s3FileUploadService.downloadFile(latestVersion.s3FileMeta.Key, res)
    })
  }

  async downloadFromVersionId(id:string, res:any){
    return this.versionModel.findOne({_id:id})
    .then(latestVersion => {
      console.log("-------------------------", latestVersion)
      return this.s3FileUploadService.downloadFile(latestVersion.s3FileMeta.Key, res)
    })
  }

  

  async makeLatest(id: string, platform: string) {
  let dbResponse = await this.versionModel.findOne({latest:true, platform:platform})  
  if(dbResponse){
    return this.versionModel.findByIdAndUpdate(id, {latest: true}, {new : true})
    .then(async result => {
      return this.versionModel.findByIdAndUpdate(dbResponse._id, {latest: false})
    .then(updateRes => {
        return result;
      }).catch(err => {
        throw new InternalServerErrorException(err);
      })  
    })
  }else{
    return this.versionModel.findByIdAndUpdate(id, {latest: true}, {new : true})
      .then(updateRes => {
        return updateRes;
      }).catch(err => {
        throw new InternalServerErrorException(err);
      })  
  }

  }

  async update(id: string, platform: string, updateAppVersionDto:UpdateAppVersionDto) {
    if(updateAppVersionDto.latest){
    let dbResponse = await this.versionModel.findOne({latest:true, platform:platform})
      
    if(dbResponse){
      return this.versionModel.findByIdAndUpdate(id, {latest: true}, {new : true})
      .then(async result => {
        return this.versionModel.findByIdAndUpdate(dbResponse._id, {latest: false})
      .then(async updateRes => {
        const finalVersion = await this.versionModel.findOneAndUpdate(
          { _id: id },
          { ...updateAppVersionDto },
          { new: true },
        );
        if (!finalVersion) {
          throw new NotFoundException();
        }
          return finalVersion;
        }).catch(err => {
          throw new InternalServerErrorException(err);
        })  
      })
    }else{
      return this.versionModel.findByIdAndUpdate(id, {latest: true}, {new : true})
        .then(updateRes => {
          return updateRes;
        }).catch(err => {
          throw new InternalServerErrorException(err);
        })  
    }
  }
  
    }
  async getFile(key:string, res: any){
    console.log("in the service")
    return  this.s3FileUploadService.downloadFile(key, res)
  }

  async deleteRecordWithFile(id:string){
    let keyToDeleteFromS3:string;
     return this.findOne(id)
    .then(async toDeleteRecord => {
      if(!toDeleteRecord)
      throw new NotFoundException("Record not found associated with the passed Id.");
      keyToDeleteFromS3 = toDeleteRecord.s3FileMeta.Key
      return this.s3FileUploadService.deleteFile(keyToDeleteFromS3)
      .then (async deleteRecord => {
        await this.versionModel.deleteOne({_id: id})
        return ({"message": "record successfully deleted fom db as well as s3."})
      })
    }).catch(err => {
      throw new InternalServerErrorException(err);
    })  
  }
}
