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
exports.ConversationMember = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const conversation_entity_1 = require("./conversation.entity");
const user_entity_1 = require("../../user/entities/user.entity");
let ConversationMember = class ConversationMember {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, conversation: { required: true, type: () => require("./conversation.entity").Conversation }, user: { required: true, type: () => require("../../user/entities/user.entity").User }, unreadCount: { required: true, type: () => Number }, joinedAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.ConversationMember = ConversationMember;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ConversationMember.prototype, "id", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => conversation_entity_1.Conversation, (c) => c.members, { onDelete: 'CASCADE' }),
    __metadata("design:type", conversation_entity_1.Conversation)
], ConversationMember.prototype, "conversation", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], ConversationMember.prototype, "user", void 0);
__decorate([
    (0, database_module_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ConversationMember.prototype, "unreadCount", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ConversationMember.prototype, "joinedAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ConversationMember.prototype, "updatedAt", void 0);
exports.ConversationMember = ConversationMember = __decorate([
    (0, database_module_1.Entity)('conversation_members'),
    (0, database_module_1.Index)(['conversation', 'user'], { unique: true })
], ConversationMember);
//# sourceMappingURL=conversation-member.entity.js.map