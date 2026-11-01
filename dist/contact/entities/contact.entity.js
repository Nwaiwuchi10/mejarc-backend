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
exports.ContactInquiry = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
let ContactInquiry = class ContactInquiry {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, phone: { required: true, type: () => String }, subject: { required: false, type: () => String }, message: { required: true, type: () => String }, images: { required: false, type: () => [String] }, createdAt: { required: true, type: () => Date } };
    }
};
exports.ContactInquiry = ContactInquiry;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ContactInquiry.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)(),
    __metadata("design:type", String)
], ContactInquiry.prototype, "name", void 0);
__decorate([
    (0, database_module_1.Column)(),
    __metadata("design:type", String)
], ContactInquiry.prototype, "email", void 0);
__decorate([
    (0, database_module_1.Column)(),
    __metadata("design:type", String)
], ContactInquiry.prototype, "phone", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ContactInquiry.prototype, "subject", void 0);
__decorate([
    (0, database_module_1.Column)('text'),
    __metadata("design:type", String)
], ContactInquiry.prototype, "message", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], ContactInquiry.prototype, "images", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ContactInquiry.prototype, "createdAt", void 0);
exports.ContactInquiry = ContactInquiry = __decorate([
    (0, database_module_1.Entity)('contact_inquiry')
], ContactInquiry);
//# sourceMappingURL=contact.entity.js.map