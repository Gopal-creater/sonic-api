"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHONE_NUMBER_REGULAR_EXPRESSION = exports.COGNITO_PASSWORD_REGULAR_EXPRESSION = void 0;
exports.COGNITO_PASSWORD_REGULAR_EXPRESSION = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-\"!@#%&\/,><\':;|_~`])\S{8,99}$/;
exports.PHONE_NUMBER_REGULAR_EXPRESSION = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
//# sourceMappingURL=index.js.map