import { VUploadedFile } from '../../shared/interfaces/VersionUploadFile.interface';
import { FileHandlerService } from '../../shared/services/file-handler.service';
import { FileOperationService } from '../../shared/services/file-operation.service';
import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AppVersion } from './schemas/appversions.schema';
import * as upath from 'upath';
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
    
    file.path = upath.toUnix(file.path); //Convert windows path to unix path
    file.destination = upath.toUnix(file.destination);
    const inFilePath = file.path;
    
        return this.s3FileUploadService.uploadFromPath(
          inFilePath,
          `versions`,
          s3Acl,
        )
      .then(s3UploadResult => {
        return {
          downloadFileUrl: s3UploadResult.Location,
          s3UploadResult: s3UploadResult
        };
      })
      .finally(() => {
        this.fileHandlerService.deleteFileAtPath(inFilePath); //delete in callig side
      });
  }
  async saveVersion(version: Record<any,any>) {
    var newVersion = new this.versionModel({
      ...version
    });
    return newVersion.save();
  }

  async findOne(id:string) {
    return this.versionModel.findOne({_id:id});
  }

  async getAllVersions() {
    return this.versionModel.find();
  }

  async downloadLatest(platform:string){
    const response = await this.versionModel.findOne({latest: true, platform:platform})
    return this.getFile(response.s3FileMeta.key)

  }

  
  
  async makeLatest(id: string) {
  var res =   await this.versionModel.findOne({'latest':true})
  if(res){
    return this.versionModel.findByIdAndUpdate(res._id, {latest: false})
    .then(result => {
      return this.versionModel.findByIdAndUpdate(id, {latest: true}, {new : true})
      .then(updateRes => {
        return updateRes;
      })
    })
  }else{
    return this.versionModel.findByIdAndUpdate(id, {latest: true}, {new : true})
      .then(updateRes => {
        return updateRes;
      })
  }

  }
  async getFile(key:string){
    return  this.s3FileUploadService.getFile(key)
  }

  async deleteFile(key:string){
    return  this.s3FileUploadService.deleteFile(key)
  }
}
