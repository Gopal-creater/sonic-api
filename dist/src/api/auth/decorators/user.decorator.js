"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@nestjs/common");
exports.User = common_1.createParamDecorator((data, ctx) => {
    var _a;
    const req = ctx.switchToHttp().getRequest();
    if (data) {
        return (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a[data];
    }
    else {
        return req === null || req === void 0 ? void 0 : req.user;
    }
});
//# sourceMappingURL=user.decorator.js.map