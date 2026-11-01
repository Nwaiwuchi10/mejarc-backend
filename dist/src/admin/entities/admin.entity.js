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
exports.Admin = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const user_entity_1 = require("../../user/entities/user.entity");
let Admin = class Admin {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, user: { required: true, type: () => require("../../user/entities/user.entity").User }, userId: { required: true, type: () => String }, role: { required: false, type: () => String }, isActive: { required: true, type: () => Boolean }, isAdmin: { required: true, type: () => Boolean }, deletedAt: { required: false, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Admin = Admin;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Admin.prototype, "id", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => user_entity_1.User, { nullable: false }),
    (0, database_module_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Admin.prototype, "user", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], Admin.prototype, "userId", void 0);
__decorate([
    (0, database_module_1.Column)({ length: 80, nullable: true }),
    __metadata("design:type", String)
], Admin.prototype, "role", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Admin.prototype, "isActive", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Admin.prototype, "isAdmin", void 0);
__decorate([
    (0, database_module_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", Date)
], Admin.prototype, "deletedAt", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Admin.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Admin.prototype, "updatedAt", void 0);
exports.Admin = Admin = __decorate([
    (0, database_module_1.Entity)('admins')
], Admin);
//# sourceMappingURL=admin.entity.js.map