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
exports.PaymentStatus = exports.PaystackCallbackDto = exports.CreateOrderItemsDto = exports.BillingInfoDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BillingInfoDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: false, type: () => String }, lastName: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, phone: { required: false, type: () => String }, country: { required: false, type: () => String }, state: { required: false, type: () => String }, address: { required: false, type: () => String } };
    }
}
exports.BillingInfoDto = BillingInfoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BillingInfoDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BillingInfoDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], BillingInfoDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BillingInfoDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BillingInfoDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BillingInfoDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BillingInfoDto.prototype, "address", void 0);
class OrderItemsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { eventId: { required: true, type: () => String }, totalQuantity: { required: true, type: () => Number }, totalPrice: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], OrderItemsDto.prototype, "eventId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OrderItemsDto.prototype, "totalQuantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OrderItemsDto.prototype, "totalPrice", void 0);
class CreateOrderItemsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { orderItems: { required: true, type: () => [OrderItemsDto] }, grandTotal: { required: false, type: () => Number } };
    }
}
exports.CreateOrderItemsDto = CreateOrderItemsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateOrderItemsDto.prototype, "orderItems", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateOrderItemsDto.prototype, "grandTotal", void 0);
class PaystackCallbackDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { reference: { required: true, type: () => String } };
    }
}
exports.PaystackCallbackDto = PaystackCallbackDto;
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["paid"] = "paid";
    PaymentStatus["notPaid"] = "not paid";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
//# sourceMappingURL=paystack-payment.dto.js.map