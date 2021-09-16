"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatedLicense = void 0;
const common_1 = require("@nestjs/common");
exports.ValidatedLicense = common_1.createParamDecorator((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
        return req.validLicense[data];
    }
    else {
        return req.validLicense;
    }
});
//# sourceMappingURL=validatedlicense.decorator.js.map