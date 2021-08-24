"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObjectId = exports.isObjectId = void 0;
const mongoose_1 = require("mongoose");
const isObjectId = (id) => mongoose_1.Types.ObjectId.isValid(id);
exports.isObjectId = isObjectId;
const toObjectId = (id) => mongoose_1.Types.ObjectId(id);
exports.toObjectId = toObjectId;
//# sourceMappingURL=mongoose.utils.js.map