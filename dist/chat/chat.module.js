"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
const conversation_member_entity_1 = require("./entities/conversation-member.entity");
const chat_service_1 = require("./chat.service");
const user_entity_1 = require("../user/entities/user.entity");
const chat_controller_1 = require("./chat.controller");
const chat_gateway_1 = require("./gateway/chat.gateway");
const notification_module_1 = require("../notification/notification.module");
const agent_entity_1 = require("../agent/entities/agent.entity");
const customdesign_entity_1 = require("../customdesign/entities/customdesign.entity");
const customdesign_module_1 = require("../customdesign/customdesign.module");
const admin_entity_1 = require("../admin/entities/admin.entity");
const common_2 = require("@nestjs/common");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.TypeOrmModule.forFeature([
                conversation_entity_1.Conversation,
                message_entity_1.Message,
                conversation_member_entity_1.ConversationMember,
                user_entity_1.User,
                admin_entity_1.Admin,
                agent_entity_1.Agent,
                customdesign_entity_1.CustomDesign,
            ]),
            notification_module_1.NotificationModule,
            (0, common_2.forwardRef)(() => customdesign_module_1.CustomDesignModule),
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [chat_service_1.ChatService, chat_gateway_1.ChatGateway],
        exports: [chat_service_1.ChatService],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map