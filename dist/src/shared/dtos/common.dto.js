"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileUpload = void 0;
const openapi = require("@nestjs/swagger");
class S3FileUpload {
    static _OPENAPI_METADATA_FACTORY() {
        return { Bucket: { required: true, type: () => String }, Location: { required: true, type: () => String }, Key: { required: true, type: () => String }, ETag: { required: true, type: () => String } };
    }
}
exports.S3FileUpload = S3FileUpload;
//# sourceMappingURL=common.dto.js.map