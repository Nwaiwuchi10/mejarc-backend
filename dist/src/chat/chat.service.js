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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
const conversation_member_entity_1 = require("./entities/conversation-member.entity");
const user_entity_1 = require("../user/entities/user.entity");
const chat_gateway_1 = require("./gateway/chat.gateway");
const notification_service_1 = require("../notification/notification.service");
const admin_entity_1 = require("../admin/entities/admin.entity");
const agent_entity_1 = require("../agent/entities/agent.entity");
const notification_entity_1 = require("../notification/entities/notification.entity");
const customdesign_entity_1 = require("../customdesign/entities/customdesign.entity");
const customdesign_workspace_service_1 = require("../customdesign/customdesign-workspace.service");
const customdesign_types_1 = require("../customdesign/customdesign.types");
let ChatService = class ChatService {
    constructor(conversationRepo, messageRepo, memberRepo, userRepo, adminRepo, agentRepo, customDesignRepo, chatGateway, notificationService, workspaceService) {
        this.conversationRepo = conversationRepo;
        this.messageRepo = messageRepo;
        this.memberRepo = memberRepo;
        this.userRepo = userRepo;
        this.adminRepo = adminRepo;
        this.agentRepo = agentRepo;
        this.customDesignRepo = customDesignRepo;
        this.chatGateway = chatGateway;
        this.notificationService = notificationService;
        this.workspaceService = workspaceService;
    }
    async startDM(user1Id, user2Id) {
        if (user1Id === user2Id) {
            throw new common_1.BadRequestException('Cannot start a chat with yourself');
        }
        const recipient = await this.userRepo.findOne({ where: { id: user2Id } });
        if (!recipient) {
            throw new common_1.NotFoundException(`User with ID ${user2Id} not found`);
        }
        const conversations = await this.conversationRepo.find({
            where: { type: conversation_entity_1.ConversationType.DM },
            relations: ['members'],
        });
        const existing = conversations.find((c) => {
            const uids = (c.members || []).map((m) => m.userId || m.user?.id);
            return uids.includes(user1Id) && uids.includes(user2Id);
        });
        if (existing) {
            return this.getConversationDetails(existing.id);
        }
        const conversation = this.conversationRepo.create({
            type: conversation_entity_1.ConversationType.DM,
        });
        const savedConversation = await this.conversationRepo.save(conversation);
        const member1 = this.memberRepo.create({
            conversation: savedConversation,
            user: { id: user1Id },
        });
        const member2 = this.memberRepo.create({
            conversation: savedConversation,
            user: { id: user2Id },
        });
        await this.memberRepo.save([member1, member2]);
        const conversationDetails = await this.getConversationDetails(savedConversation.id);
        this.chatGateway.emitNewConversation(conversationDetails);
        return conversationDetails;
    }
    async startCustomDesignChat(userId, customdesignId) {
        const existing = await this.conversationRepo.findOne({
            where: {
                type: conversation_entity_1.ConversationType.CUSTOMDESIGN,
                customdesignId: customdesignId,
            },
        });
        if (existing) {
            return this.getConversationDetails(existing.id);
        }
        const customDesign = await this.customDesignRepo.findOne({
            where: { id: customdesignId },
        });
        if (!customDesign) {
            throw new common_1.NotFoundException(`Custom design with ID ${customdesignId} not found`);
        }
        const isAdmin = await this.adminRepo.findOne({ where: { userId } });
        const isOwner = customDesign.userId === userId;
        const isAgent = customDesign.agentId &&
            (await this.agentRepo.findOne({
                where: { id: customDesign.agentId, userId },
            }));
        if (!isAdmin && !isOwner && !isAgent) {
            throw new common_1.BadRequestException('You do not have permission to access this chat');
        }
        const conversation = this.conversationRepo.create({
            type: conversation_entity_1.ConversationType.CUSTOMDESIGN,
            customdesignId: customdesignId,
        });
        const savedConversation = await this.conversationRepo.save(conversation);
        const members = [];
        members.push(this.memberRepo.create({
            conversation: savedConversation,
            user: { id: customDesign.userId },
        }));
        if (customDesign.agentId) {
            const agent = await this.agentRepo.findOne({
                where: { id: customDesign.agentId },
            });
            if (agent && agent.userId) {
                members.push(this.memberRepo.create({
                    conversation: savedConversation,
                    user: { id: agent.userId },
                }));
            }
        }
        await this.memberRepo.save(members);
        const conversationDetails = await this.getConversationDetails(savedConversation.id);
        this.chatGateway.emitNewConversation(conversationDetails);
        return conversationDetails;
    }
    async getConversationByCustomDesignId(customdesignId) {
        const conversation = await this.conversationRepo.findOne({
            where: {
                type: conversation_entity_1.ConversationType.CUSTOMDESIGN,
                customdesignId: customdesignId,
            },
            relations: ['members', 'members.user', 'lastMessage'],
        });
        if (!conversation) {
            throw new common_1.NotFoundException(`No conversation found for custom design ID ${customdesignId}`);
        }
        return conversation;
    }
    async sendMessage(conversationId, authorId, text = '', attachments = []) {
        const conversation = await this.conversationRepo.findOne({
            where: { id: conversationId },
            relations: ['members', 'members.user'],
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const isMember = conversation.members.some((m) => m.user.id === authorId);
        if (!isMember) {
            throw new common_1.BadRequestException('User is not a member of this conversation');
        }
        const message = this.messageRepo.create({
            conversation,
            author: { id: authorId },
            text,
            attachments,
        });
        const savedMessage = await this.messageRepo.save(message);
        conversation.lastMessage = savedMessage;
        conversation.lastMessageAt = savedMessage.createdAt;
        await this.conversationRepo.save(conversation);
        const membersToUpdate = await this.memberRepo.find({
            where: { conversationId },
        });
        for (const mem of membersToUpdate) {
            const memUid = mem.userId || (mem.user ? mem.user.id : null);
            if (memUid !== authorId) {
                mem.unreadCount = (mem.unreadCount || 0) + 1;
                await this.memberRepo.save(mem);
            }
        }
        this.chatGateway.emitNewMessage(savedMessage, conversationId);
        const authorAdmin = await this.adminRepo.findOne({
            where: { userId: authorId },
        });
        const authorAgent = await this.agentRepo.findOne({
            where: { userId: authorId },
        });
        if (authorAdmin || authorAgent) {
            const otherMembers = conversation.members.filter((m) => m.user?.id !== authorId);
            for (const member of otherMembers) {
                if (!member.user)
                    continue;
                await this.notificationService.createNotification(member.user.id, (authorAdmin
                    ? notification_entity_1.NotificationType.ADMIN
                    : notification_entity_1.NotificationType.AGENT_MESSAGE), `New Message from ${authorAdmin ? 'Admin' : 'Agent'}`, (text || '').substring(0, 100) +
                    ((text || '').length > 100 ? '...' : ''), { conversationId, messageId: savedMessage.id }, (authorAdmin
                    ? 'messagesAdmin'
                    : 'messagesAgent'));
            }
        }
        if (conversation.type === conversation_entity_1.ConversationType.CUSTOMDESIGN &&
            conversation.customdesignId) {
            const authorType = authorAdmin
                ? 'Admin'
                : authorAgent
                    ? 'Agent'
                    : 'Client';
            await this.workspaceService.logActivity(conversation.customdesignId, authorId, customdesign_types_1.ActivityType.MESSAGE, `${authorType} sent a message`, `Message sent in project discussion.`);
        }
        return savedMessage;
    }
    async getInbox(userId, type) {
        const where = { user: { id: userId } };
        if (type) {
            where.conversation = { type };
        }
        const memberships = await this.memberRepo.find({
            where,
            relations: [
                'conversation',
                'conversation.lastMessage',
                'conversation.members',
                'conversation.members.user',
            ],
            order: { updatedAt: 'DESC' },
        });
        return memberships.map((m) => {
            const conv = m.conversation;
            const otherParticipant = conv.members.find((member) => member.user.id !== userId)?.user;
            return {
                id: conv.id,
                type: conv.type,
                lastMessage: conv.lastMessage,
                lastMessageAt: conv.lastMessageAt,
                unreadCount: m.unreadCount,
                otherParticipant: otherParticipant
                    ? {
                        id: otherParticipant.id,
                        firstName: otherParticipant.firstName,
                        lastName: otherParticipant.lastName,
                        profilePics: otherParticipant.profilePics,
                    }
                    : null,
            };
        });
    }
    async getMessages(conversationId, userId, pagination) {
        const { page = 1, limit = 20 } = pagination;
        const skip = (page - 1) * limit;
        const member = await this.memberRepo.findOne({
            where: { conversation: { id: conversationId }, user: { id: userId } },
        });
        if (!member) {
            throw new common_1.BadRequestException('User is not a member of this conversation');
        }
        const [data, total] = await this.messageRepo.findAndCount({
            where: { conversation: { id: conversationId } },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: skip,
            relations: ['author'],
        });
        return {
            data: data.reverse(),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async markAsRead(conversationId, userId) {
        await this.memberRepo.update({ conversation: { id: conversationId }, user: { id: userId } }, { unreadCount: 0 });
        this.chatGateway.emitUnreadCount(userId);
        return { success: true };
    }
    async getConversationDetails(id) {
        const conv = await this.conversationRepo.findOne({
            where: { id },
            relations: ['members', 'members.user', 'lastMessage'],
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        return conv;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, database_module_1.InjectRepository)(message_entity_1.Message)),
    __param(2, (0, database_module_1.InjectRepository)(conversation_member_entity_1.ConversationMember)),
    __param(3, (0, database_module_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, database_module_1.InjectRepository)(admin_entity_1.Admin)),
    __param(5, (0, database_module_1.InjectRepository)(agent_entity_1.Agent)),
    __param(6, (0, database_module_1.InjectRepository)(customdesign_entity_1.CustomDesign)),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_gateway_1.ChatGateway))),
    __param(9, (0, common_1.Inject)((0, common_1.forwardRef)(() => customdesign_workspace_service_1.CustomDesignWorkspaceService))),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, chat_gateway_1.ChatGateway,
        notification_service_1.NotificationService,
        customdesign_workspace_service_1.CustomDesignWorkspaceService])
], ChatService);
//# sourceMappingURL=chat.service.js.map