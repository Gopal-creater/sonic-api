"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesAllowed = void 0;
const common_1 = require("@nestjs/common");
exports.RolesAllowed = (...roles) => common_1.SetMetadata('roles', roles);
//# sourceMappingURL=roles.decorator.js.map