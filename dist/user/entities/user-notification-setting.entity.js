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
exports.UserNotificationSetting = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const user_entity_1 = require("./user.entity");
let UserNotificationSetting = class UserNotificationSetting {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, messagesAdmin: { required: true, type: () => Boolean }, messagesAgent: { required: true, type: () => Boolean }, projectFileUploaded: { required: true, type: () => Boolean }, projectStatusChanged: { required: true, type: () => Boolean }, projectRevisionUpdates: { required: true, type: () => Boolean }, paymentSuccessful: { required: true, type: () => Boolean }, paymentOrderConfirmation: { required: true, type: () => Boolean }, paymentPending: { required: true, type: () => Boolean }, paymentFailed: { required: true, type: () => Boolean }, paymentReversed: { required: true, type: () => Boolean }, reviewReminder: { required: true, type: () => Boolean }, reviewResponse: { required: true, type: () => Boolean }, emailNotifications: { required: true, type: () => Boolean }, smsNotifications: { required: true, type: () => Boolean }, user: { required: true, type: () => require("./user.entity").User }, userId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.UserNotificationSetting = UserNotificationSetting;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserNotificationSetting.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "messagesAdmin", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "messagesAgent", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "projectFileUploaded", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "projectStatusChanged", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "projectRevisionUpdates", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "paymentSuccessful", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "paymentOrderConfirmation", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "paymentPending", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "paymentFailed", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "paymentReversed", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "reviewReminder", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "reviewResponse", void 0);
__decorate([
    (0, database_module_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "emailNotifications", void 0);
__decorate([
    (0, database_module_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserNotificationSetting.prototype, "smsNotifications", void 0);
__decorate([
    (0, database_module_1.OneToOne)(() => user_entity_1.User, (user) => user.notificationSettings, {
        onDelete: 'CASCADE',
    }),
    (0, database_module_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], UserNotificationSetting.prototype, "user", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], UserNotificationSetting.prototype, "userId", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserNotificationSetting.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserNotificationSetting.prototype, "updatedAt", void 0);
exports.UserNotificationSetting = UserNotificationSetting = __decorate([
    (0, database_module_1.Entity)('user_notification_settings')
], UserNotificationSetting);
//# sourceMappingURL=user-notification-setting.entity.js.map