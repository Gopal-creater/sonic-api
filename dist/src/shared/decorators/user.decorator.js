"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@nestjs/common");
exports.User = common_1.createParamDecorator((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
        return req.user[data];
    }
    else {
        return req.user;
    }
});
//# sourceMappingURL=user.decorator.js.map