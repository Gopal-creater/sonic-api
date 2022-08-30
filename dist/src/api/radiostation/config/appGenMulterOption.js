"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appGenMulterOptions = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const makeDir = require("make-dir");
const config_1 = require("../../../config");
exports.appGenMulterOptions = {
    fileFilter: (req, file, cb) => {
        var _a, _b;
        if ((_b = (_a = file === null || file === void 0 ? void 0 : file.originalname) === null || _a === void 0 ? void 0 : _a.match) === null || _b === void 0 ? void 0 : _b.call(_a, /\.(xlsx|xlsb|xls|xlsm)$/)) {
            cb(null, true);
        }
        else {
            cb(new common_1.BadRequestException('Unsupported file type, only support excel for now'), false);
        }
    },
    storage: (0, multer_1.diskStorage)({
        destination: async (req, file, cb) => {
            const filePath = await makeDir(`${config_1.appConfig.MULTER_IMPORT_DEST}`);
            cb(null, filePath);
        },
        filename: (req, file, cb) => {
            let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
            cb(null, `${Date.now()}_${orgName}`);
        },
    }),
};
//# sourceMappingURL=appGenMulterOption.js.map