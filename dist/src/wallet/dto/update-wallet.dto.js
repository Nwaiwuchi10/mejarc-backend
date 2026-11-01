"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWalletDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_wallet_dto_1 = require("./create-wallet.dto");
class UpdateWalletDto extends (0, swagger_1.PartialType)(create_wallet_dto_1.CreateWalletDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateWalletDto = UpdateWalletDto;
//# sourceMappingURL=update-wallet.dto.js.map