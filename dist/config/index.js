"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appRootPath = require("app-root-path");
exports.default = {
    TOKEN: {
        JWT_SECRET_KEY: 'myjwtkeysercret',
        JWT_EXPIRE_TIME: '2d',
        REFRESH_TOKEN_EXPIRE_TIME_INDAYS: 1000 * 60 * 60 * 24 * 30
    },
    TEMP_TOKEN: {
        TEMP_JWT_SECRET_KEY: 'myjwttempsecret',
        TEMP_TOKEN_EXPIRE_TIME: '3m'
    },
    MULTER_DEST: `${appRootPath.toString()}/storage/uploads`,
    CONTAINER_DEST: `${appRootPath.toString()}/storage/containers`,
    ENCODER_EXE_PATH: `${appRootPath.toString()}/bin/encode.sh`,
    DECODER_EXE_PATH: `${appRootPath.toString()}/bin/decode.sh`
};
//# sourceMappingURL=index.js.map