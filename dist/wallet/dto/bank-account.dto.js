"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetDefaultBankAccountDto = exports.GetBankAccountDto = exports.BankAccountVerifiedDto = exports.VerifyBankAccountDto = exports.RegisterBankAccountDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RegisterBankAccountDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { accountHolderName: { required: true, type: () => String, minLength: 2, maxLength: 255 }, accountNumber: { required: true, type: () => String, minLength: 10, maxLength: 10, pattern: "^\\d+$" }, bankCode: { required: true, type: () => String, minLength: 2, maxLength: 10 }, bankName: { required: true, type: () => String, minLength: 2, maxLength: 255 } };
    }
}
exports.RegisterBankAccountDto = RegisterBankAccountDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(2, 255),
    __metadata("design:type", String)
], RegisterBankAccountDto.prototype, "accountHolderName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(10, 10, { message: 'Account number must be 10 digits' }),
    (0, class_validator_1.Matches)(/^\d+$/, { message: 'Account number must contain only digits' }),
    __metadata("design:type", String)
], RegisterBankAccountDto.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(2, 10),
    __metadata("design:type", String)
], RegisterBankAccountDto.prototype, "bankCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(2, 255),
    __metadata("design:type", String)
], RegisterBankAccountDto.prototype, "bankName", void 0);
class VerifyBankAccountDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { accountNumber: { required: true, type: () => String, minLength: 10, maxLength: 10 }, bankCode: { required: true, type: () => String } };
    }
}
exports.VerifyBankAccountDto = VerifyBankAccountDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(10, 10),
    __metadata("design:type", String)
], VerifyBankAccountDto.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyBankAccountDto.prototype, "bankCode", void 0);
class BankAccountVerifiedDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, agentId: { required: true, type: () => String }, accountHolderName: { required: true, type: () => String }, accountNumber: { required: true, type: () => String }, bankCode: { required: true, type: () => String }, bankName: { required: true, type: () => String }, paystackRecipientCode: { required: true, type: () => String }, status: { required: true, type: () => String }, resolvedAccountName: { required: true, type: () => String }, isDefault: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, verifiedAt: { required: true, type: () => Date } };
    }
}
exports.BankAccountVerifiedDto = BankAccountVerifiedDto;
class GetBankAccountDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, accountHolderName: { required: true, type: () => String }, accountNumber: { required: true, type: () => String }, bankCode: { required: true, type: () => String }, bankName: { required: true, type: () => String }, status: { required: true, type: () => String }, isDefault: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date } };
    }
}
exports.GetBankAccountDto = GetBankAccountDto;
class SetDefaultBankAccountDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { bankAccountId: { required: true, type: () => String } };
    }
}
exports.SetDefaultBankAccountDto = SetDefaultBankAccountDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SetDefaultBankAccountDto.prototype, "bankAccountId", void 0);
//# sourceMappingURL=bank-account.dto.js.map