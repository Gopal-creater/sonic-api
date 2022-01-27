"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionFileFilter = void 0;
const versionFileFilter = (req, file, callback) => {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
        return callback(new Error('Image Files not allowed'), false);
    }
    callback(null, true);
};
exports.versionFileFilter = versionFileFilter;
//# sourceMappingURL=version-file-filter.js.map