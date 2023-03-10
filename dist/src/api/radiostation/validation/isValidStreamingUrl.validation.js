"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidStreamingURL = exports.IsValidStreamingURLConstraint = void 0;
const class_validator_1 = require("class-validator");
const countries = require("../../../constants/countries.json");
let IsValidStreamingURLConstraint = class IsValidStreamingURLConstraint {
    validate(incommingCountry, args) {
        const foundCountry = countries.find(country => country.name == incommingCountry);
        if (!foundCountry) {
            return false;
        }
        return true;
    }
    defaultMessage(args) {
        return `Country ${args.value} is not a valid formated country`;
    }
};
IsValidStreamingURLConstraint = __decorate([
    class_validator_1.ValidatorConstraint({ async: true })
], IsValidStreamingURLConstraint);
exports.IsValidStreamingURLConstraint = IsValidStreamingURLConstraint;
function IsValidStreamingURL(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidStreamingURLConstraint,
        });
    };
}
exports.IsValidStreamingURL = IsValidStreamingURL;
//# sourceMappingURL=isValidStreamingUrl.validation.js.map