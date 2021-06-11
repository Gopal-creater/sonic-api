"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObjectId = exports.isObjectId = void 0;
const mongoose_1 = require("mongoose");
exports.isObjectId = (id) => mongoose_1.Types.ObjectId.isValid(id);
exports.toObjectId = (id) => mongoose_1.Types.ObjectId(id);
//# sourceMappingURL=mongoose.utils.js.map