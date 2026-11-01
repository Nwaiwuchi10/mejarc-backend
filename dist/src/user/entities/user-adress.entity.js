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
exports.UserAddress = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
let UserAddress = class UserAddress {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, street: { required: false, type: () => String }, city: { required: false, type: () => String }, zipcode: { required: false, type: () => String }, state: { required: false, type: () => String }, county: { required: false, type: () => String }, country: { required: false, type: () => String } };
    }
};
exports.UserAddress = UserAddress;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserAddress.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserAddress.prototype, "street", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserAddress.prototype, "city", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserAddress.prototype, "zipcode", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserAddress.prototype, "state", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserAddress.prototype, "county", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserAddress.prototype, "country", void 0);
exports.UserAddress = UserAddress = __decorate([
    (0, database_module_1.Entity)('user_addresses')
], UserAddress);
//# sourceMappingURL=user-adress.entity.js.map