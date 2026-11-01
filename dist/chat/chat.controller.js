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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chat_service_1 = require("./chat.service");
const user_guard_1 = require("../user/guard/user.guard");
const pagination_dto_1 = require("../utils/pagination.dto");
const platform_express_1 = require("@nestjs/platform-express");
const aws_s3_config_1 = require("../utils/aws-s3.config");
const conversation_entity_1 = require("./entities/conversation.entity");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async getInbox(req) {
        return this.chatService.getInbox(req.userId);
    }
    async getDMInbox(req) {
        return this.chatService.getInbox(req.userId, conversation_entity_1.ConversationType.DM);
    }
    async startDM(req, recipientId) {
        return this.chatService.startDM(req.userId, recipientId);
    }
    async startCustomDesignChat(req, customdesignId) {
        return this.chatService.startCustomDesignChat(req.userId, customdesignId);
    }
    async getByCustomDesignId(customdesignId) {
        return this.chatService.getConversationByCustomDesignId(customdesignId);
    }
    async getMessages(req, conversationId, pagination) {
        return this.chatService.getMessages(conversationId, req.userId, pagination);
    }
    async markAsRead(req, conversationId) {
        return this.chatService.markAsRead(conversationId, req.userId);
    }
    async sendMessage(req, conversationId, text, files) {
        const fileUrls = files
            ? files.map((file) => file.location).filter((url) => !!url)
            : [];
        if (!text && fileUrls.length === 0) {
            throw new common_1.BadRequestException('Message must have text or attachments');
        }
        return this.chatService.sendMessage(conversationId, req.userId, text, fileUrls);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('inbox'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user chat inbox conversations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User conversations list' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getInbox", null);
__decorate([
    (0, common_1.Get)('dm-inbox'),
    (0, swagger_1.ApiOperation)({ summary: 'Get direct messages inbox' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'DM conversations list' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getDMInbox", null);
__decorate([
    (0, common_1.Post)('start-dm/:recipientId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Start or retrieve a direct 1-on-1 chat conversation with another user',
    }),
    (0, swagger_1.ApiParam)({ name: 'recipientId', description: 'Recipient user ID UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Conversation started or retrieved',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('recipientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "startDM", null);
__decorate([
    (0, common_1.Post)('start-custom-design/:customdesignId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Start or retrieve a custom design project conversation',
    }),
    (0, swagger_1.ApiParam)({ name: 'customdesignId', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Project chat started or retrieved',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('customdesignId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "startCustomDesignChat", null);
__decorate([
    (0, common_1.Get)('custom-design/:customdesignId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get conversation linked to a custom design project',
    }),
    (0, swagger_1.ApiParam)({ name: 'customdesignId', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conversation details' }),
    __param(0, (0, common_1.Param)('customdesignId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getByCustomDesignId", null);
__decorate([
    (0, common_1.Get)('messages/:conversationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated messages inside a conversation' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages list' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('read/:conversationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all messages in a conversation as read' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Marked as read' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('send/:conversationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message with optional file attachments' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation ID UUID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    example: 'Hello, here is the updated floor plan.',
                },
                files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Optional file attachments (images, documents, max 10 files)',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message sent' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, aws_s3_config_1.createS3Storage)('chat-attachments'),
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Body)('text')),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Array]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map