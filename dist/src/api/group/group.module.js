"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupModule = void 0;
const common_1 = require("@nestjs/common");
const group_service_1 = require("./group.service");
const group_controller_1 = require("./group.controller");
const mongoose_1 = require("@nestjs/mongoose");
const group_schema_1 = require("./schemas/group.schema");
const user_module_1 = require("../user/user.module");
let GroupModule = class GroupModule {
    constructor(groupService) {
        this.groupService = groupService;
    }
    onModuleInit() {
        this.groupService.createDefaultGroups();
    }
};
GroupModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: group_schema_1.GroupSchemaName, schema: group_schema_1.GroupSchema }]),
            common_1.forwardRef(() => user_module_1.UserModule),
        ],
        controllers: [group_controller_1.GroupController],
        providers: [group_service_1.GroupService],
        exports: [group_service_1.GroupService],
    }),
    __metadata("design:paramtypes", [group_service_1.GroupService])
], GroupModule);
exports.GroupModule = GroupModule;
//# sourceMappingURL=group.module.js.map