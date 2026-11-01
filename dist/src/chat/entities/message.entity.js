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
exports.Message = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const conversation_entity_1 = require("./conversation.entity");
const user_entity_1 = require("../../user/entities/user.entity");
let Message = class Message {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, conversation: { required: true, type: () => require("./conversation.entity").Conversation }, author: { required: true, type: () => require("../../user/entities/user.entity").User }, text: { required: true, type: () => String }, attachments: { required: true, type: () => [String] }, isRead: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Message = Message;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Message.prototype, "id", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => conversation_entity_1.Conversation, (c) => c.messages, { onDelete: 'CASCADE' }),
    __metadata("design:type", conversation_entity_1.Conversation)
], Message.prototype, "conversation", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], Message.prototype, "author", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Message.prototype, "text", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Message.prototype, "attachments", void 0);
__decorate([
    (0, database_module_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Message.prototype, "isRead", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Message.prototype, "updatedAt", void 0);
exports.Message = Message = __decorate([
    (0, database_module_1.Entity)('chat_messages'),
    (0, database_module_1.Index)(['conversation', 'createdAt'])
], Message);
//# sourceMappingURL=message.entity.js.map