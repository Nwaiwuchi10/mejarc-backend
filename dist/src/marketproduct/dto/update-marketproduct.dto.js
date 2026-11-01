"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketproductDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_marketproduct_dto_1 = require("./create-marketproduct.dto");
class UpdateMarketproductDto extends (0, swagger_1.PartialType)(create_marketproduct_dto_1.CreateMarketproductDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMarketproductDto = UpdateMarketproductDto;
//# sourceMappingURL=update-marketproduct.dto.js.map