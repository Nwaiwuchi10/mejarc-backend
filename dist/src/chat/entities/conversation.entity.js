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
exports.Conversation = exports.ConversationType = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const conversation_member_entity_1 = require("./conversation-member.entity");
const message_entity_1 = require("./message.entity");
var ConversationType;
(function (ConversationType) {
    ConversationType["DM"] = "dm";
    ConversationType["GROUP"] = "group";
    ConversationType["CUSTOMDESIGN"] = "customdesign";
})(ConversationType || (exports.ConversationType = ConversationType = {}));
let Conversation = class Conversation {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, type: { required: true, enum: require("./conversation.entity").ConversationType }, customdesignId: { required: false, type: () => String }, name: { required: false, type: () => String }, isArchived: { required: true, type: () => Boolean }, members: { required: true, type: () => [require("./conversation-member.entity").ConversationMember] }, messages: { required: true, type: () => [require("./message.entity").Message] }, lastMessageAt: { required: false, type: () => Date }, lastMessage: { required: false, type: () => require("./message.entity").Message }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Conversation = Conversation;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Conversation.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: ConversationType,
        default: ConversationType.DM,
    }),
    __metadata("design:type", String)
], Conversation.prototype, "type", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "customdesignId", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "name", void 0);
__decorate([
    (0, database_module_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Conversation.prototype, "isArchived", void 0);
__decorate([
    (0, database_module_1.OneToMany)(() => conversation_member_entity_1.ConversationMember, (m) => m.conversation, { cascade: true }),
    __metadata("design:type", Array)
], Conversation.prototype, "members", void 0);
__decorate([
    (0, database_module_1.OneToMany)(() => message_entity_1.Message, (msg) => msg.conversation),
    __metadata("design:type", Array)
], Conversation.prototype, "messages", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Conversation.prototype, "lastMessageAt", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => message_entity_1.Message, { nullable: true, eager: true }),
    __metadata("design:type", message_entity_1.Message)
], Conversation.prototype, "lastMessage", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Conversation.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Conversation.prototype, "updatedAt", void 0);
exports.Conversation = Conversation = __decorate([
    (0, database_module_1.Entity)('conversations')
], Conversation);
//# sourceMappingURL=conversation.entity.js.map