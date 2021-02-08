import { GlobalAwsService } from './global-aws.service';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
    imports: [],
    providers: [GlobalAwsService],
    exports:[GlobalAwsService]
  })
export class GlobalAwsModule {}
