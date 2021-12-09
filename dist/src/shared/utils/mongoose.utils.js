"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObjectId = exports.isObjectId = void 0;
const mongoose_1 = require("mongoose");
const isObjectId = (id) => {
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    return checkForHexRegExp.test(id);
};
exports.isObjectId = isObjectId;
const toObjectId = (id) => mongoose_1.Types.ObjectId(id);
exports.toObjectId = toObjectId;
//# sourceMappingURL=mongoose.utils.js.map