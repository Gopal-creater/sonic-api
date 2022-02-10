import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Detection } from './schemas/detection.schema';
import { Aggregate, Model } from 'mongoose';
import { ChannelEnums } from 'src/constants/Enums';
import { UserService } from '../user/services/user.service';
import { FileHandlerService } from '../../shared/services/file-handler.service';

@Injectable()
export class ThirdPartyDetectionService {
  constructor(
    @InjectModel(Detection.name)
    public readonly detectionModel: Model<Detection>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly fileHandlerService: FileHandlerService,
  ) {
  }
  async createDetectionFromLamda(sonickey: string, radiostation: string) {
    
  }
  
}
