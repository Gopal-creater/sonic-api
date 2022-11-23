"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompanyDto = void 0;
const openapi = require("@nestjs/swagger");
const create_company_dto_1 = require("./create-company.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateCompanyDto extends swagger_1.PartialType(create_company_dto_1.CreateCompanyDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateCompanyDto = UpdateCompanyDto;
//# sourceMappingURL=update-company.dto.js.map