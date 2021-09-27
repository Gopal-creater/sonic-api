"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKey = void 0;
const common_1 = require("@nestjs/common");
exports.ApiKey = common_1.createParamDecorator((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
        return req.apikey[data];
    }
    else {
        return req.apikey;
    }
});
//# sourceMappingURL=apikey.decorator.js.map