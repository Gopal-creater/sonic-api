"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = config_1.registerAs('test', () => ({
    uri: process.env.MONGODB_URI,
    port: process.env.PORT || 5432
}));
//# sourceMappingURL=test.config.js.map