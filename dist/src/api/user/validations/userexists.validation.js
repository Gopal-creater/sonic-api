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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserExists = exports.UserExistsRule = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const user_service_1 = require("../services/user.service");
const user_db_schema_1 = require("../schemas/user.db.schema");
let UserExistsRule = class UserExistsRule {
    constructor(userService) {
        this.userService = userService;
    }
    async validate(value, args) {
        console.log('args', args);
        const user = await user_db_schema_1.RawUserModel.findOne({ _id: value });
        console.log("user", user);
        return Boolean(user);
    }
    defaultMessage(args) {
        return `User doesn't exist`;
    }
};
UserExistsRule = __decorate([
    class_validator_1.ValidatorConstraint({ name: 'UserExists', async: true }),
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserExistsRule);
exports.UserExistsRule = UserExistsRule;
function UserExists(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            name: 'UserExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: UserExistsRule,
        });
    };
}
exports.UserExists = UserExists;
//# sourceMappingURL=userexists.validation.js.map