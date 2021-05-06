"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const appRootPath = require("app-root-path");
exports.appConfig = {
    PORT: parseInt(process.env.PORT),
    MULTER_DEST: `${appRootPath.toString()}/storage/uploads`,
    CONTAINER_DEST: `${appRootPath.toString()}/storage/containers`,
    ENCODER_EXE_PATH: `${appRootPath.toString()}/bin/encode.sh`,
    DECODER_EXE_PATH: `${appRootPath.toString()}/bin/decode.sh`,
    TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS: 30,
    ENABLE_STREAMING_LISTENER: true
};
//# sourceMappingURL=app.config.js.map