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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const chat_service_1 = require("../chat.service");
const common_1 = require("@nestjs/common");
let ChatGateway = class ChatGateway {
    constructor(jwtService, chatService) {
        this.jwtService = jwtService;
        this.chatService = chatService;
        this.logger = new common_1.Logger('ChatGateway');
    }
    async handleConnection(client) {
        try {
            const token = this.extractToken(client);
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload.userId;
            if (!userId) {
                client.disconnect();
                return;
            }
            client.join(`user:${userId}`);
            this.logger.log(`User connected: ${userId} (Socket: ${client.id})`);
            const inbox = await this.chatService.getInbox(userId);
            const totalUnread = inbox.reduce((sum, item) => sum + item.unreadCount, 0);
            client.emit('chat:unreadCount', { total: totalUnread });
        }
        catch (e) {
            this.logger.error(`Connection error: ${e.message}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleSendMessage(client, data) {
        const userId = this.getUserId(client);
        if (!userId)
            return;
        try {
            await this.chatService.sendMessage(data.conversationId, userId, data.text);
        }
        catch (e) {
            client.emit('error', { message: e.message });
        }
    }
    async emitNewMessage(message, conversationId) {
        const conversation = await this.chatService.getConversationDetails(conversationId);
        const payload = {
            id: message.id,
            conversationId: conversationId,
            authorId: message.author.id,
            text: message.text,
            attachments: message.attachments,
            createdAt: message.createdAt,
        };
        for (const member of conversation.members) {
            this.server.to(`user:${member.user.id}`).emit('message:new', payload);
            if (member.user.id !== message.author.id) {
                await this.emitUnreadCount(member.user.id);
            }
        }
    }
    async emitUnreadCount(userId) {
        const inbox = await this.chatService.getInbox(userId);
        const totalUnread = inbox.reduce((sum, item) => sum + item.unreadCount, 0);
        this.server.to(`user:${userId}`).emit('chat:unreadCount', {
            total: totalUnread,
        });
    }
    async emitNewConversation(conversation) {
        for (const member of conversation.members) {
            this.server.to(`user:${member.user.id}`).emit('conversation:new', {
                id: conversation.id,
                type: conversation.type,
                members: conversation.members.map((m) => ({
                    userId: m.user.id,
                    firstName: m.user.firstName,
                    lastName: m.user.lastName,
                    profilePics: m.user.profilePics,
                })),
                createdAt: conversation.createdAt,
            });
        }
    }
    async handleMarkAsRead(client, data) {
        const userId = this.getUserId(client);
        if (!userId)
            return;
        try {
            await this.chatService.markAsRead(data.conversationId, userId);
            const inbox = await this.chatService.getInbox(userId);
            const totalUnread = inbox.reduce((sum, item) => sum + item.unreadCount, 0);
            client.emit('chat:unreadCount', { total: totalUnread });
        }
        catch (e) {
            this.logger.error(`Mark as read error: ${e.message}`);
        }
    }
    extractToken(client) {
        const auth = client.handshake.auth?.token || client.handshake.headers?.authorization;
        if (!auth)
            return undefined;
        return auth.startsWith('Bearer ') ? auth.split(' ')[1] : auth;
    }
    getUserId(client) {
        try {
            const token = this.extractToken(client);
            if (!token)
                return undefined;
            const payload = this.jwtService.verify(token);
            return payload.userId;
        }
        catch {
            return undefined;
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:send'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:markAsRead'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkAsRead", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_service_1.ChatService))),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map