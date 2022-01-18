import { Module, forwardRef, OnModuleInit } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchemaName, GroupSchema } from './schemas/group.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GroupSchemaName, schema: GroupSchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule implements OnModuleInit {
  constructor(private readonly groupService: GroupService) {}
  onModuleInit() {
    this.groupService.createDefaultGroups();
  }
}
