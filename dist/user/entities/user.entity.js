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
exports.User = exports.UserType = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const bcrypt = require("bcryptjs");
const user_adress_entity_1 = require("./user-adress.entity");
const user_notification_setting_entity_1 = require("./user-notification-setting.entity");
var UserType;
(function (UserType) {
    UserType["CUSTOMER"] = "Customer";
})(UserType || (exports.UserType = UserType = {}));
let User = class User {
    async hashPassword() {
        if (!this.password)
            return;
        if (!this.password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, email: { required: true, type: () => String }, phoneNumber: { required: false, type: () => String }, userType: { required: true, type: () => String, enum: require("./user.entity").UserType }, name: { required: false, type: () => String }, profilePics: { required: false, type: () => String }, password: { required: false, type: () => String }, loginVerificationToken: { required: false, type: () => String }, loginVerificationTokenExpiry: { required: false, type: () => Date }, isEmailVerified: { required: true, type: () => Boolean }, loginAttempts: { required: true, type: () => Number }, lastLoginAttempt: { required: false, type: () => Date }, address: { required: false, type: () => require("./user-adress.entity").UserAddress }, notificationSettings: { required: false, type: () => require("./user-notification-setting.entity").UserNotificationSetting }, isSuspended: { required: true, type: () => Boolean }, resetToken: { required: false, type: () => String }, resetTokenExpires: { required: false, type: () => Date }, deletedAt: { required: false, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.User = User;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)({ length: 80 }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, database_module_1.Column)({ length: 80 }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, database_module_1.Column)({ length: 180 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, database_module_1.Column)({ length: 30, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: UserType,
        default: UserType.CUSTOMER,
    }),
    __metadata("design:type", String)
], User.prototype, "userType", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profilePics", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "loginVerificationToken", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "loginVerificationTokenExpiry", void 0);
__decorate([
    (0, database_module_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, database_module_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "loginAttempts", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAttempt", void 0);
__decorate([
    (0, database_module_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
__decorate([
    (0, database_module_1.OneToOne)(() => user_adress_entity_1.UserAddress, { cascade: true, eager: true }),
    (0, database_module_1.JoinColumn)(),
    __metadata("design:type", user_adress_entity_1.UserAddress)
], User.prototype, "address", void 0);
__decorate([
    (0, database_module_1.OneToOne)(() => user_notification_setting_entity_1.UserNotificationSetting, (s) => s.user, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", user_notification_setting_entity_1.UserNotificationSetting)
], User.prototype, "notificationSettings", void 0);
__decorate([
    (0, database_module_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isSuspended", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "resetToken", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "resetTokenExpires", void 0);
__decorate([
    (0, database_module_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, database_module_1.Entity)('users'),
    (0, database_module_1.Unique)(['email'])
], User);
//# sourceMappingURL=user.entity.js.map