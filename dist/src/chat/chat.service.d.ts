import { Repository } from 'src/database/database.module';
import { Conversation, ConversationType } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { ConversationMember } from './entities/conversation-member.entity';
import { User } from '../user/entities/user.entity';
import { PaginationDto } from '../utils/pagination.dto';
import { ChatGateway } from './gateway/chat.gateway';
import { NotificationService } from '../notification/notification.service';
import { Admin } from '../admin/entities/admin.entity';
import { Agent } from '../agent/entities/agent.entity';
import { CustomDesign } from '../customdesign/entities/customdesign.entity';
import { CustomDesignWorkspaceService } from '../customdesign/customdesign-workspace.service';
export declare class ChatService {
    private readonly conversationRepo;
    private readonly messageRepo;
    private readonly memberRepo;
    private readonly userRepo;
    private readonly adminRepo;
    private readonly agentRepo;
    private readonly customDesignRepo;
    private readonly chatGateway;
    private readonly notificationService;
    private readonly workspaceService;
    constructor(conversationRepo: Repository<Conversation>, messageRepo: Repository<Message>, memberRepo: Repository<ConversationMember>, userRepo: Repository<User>, adminRepo: Repository<Admin>, agentRepo: Repository<Agent>, customDesignRepo: Repository<CustomDesign>, chatGateway: ChatGateway, notificationService: NotificationService, workspaceService: CustomDesignWorkspaceService);
    startDM(user1Id: string, user2Id: string): Promise<Conversation>;
    startCustomDesignChat(userId: string, customdesignId: string): Promise<Conversation>;
    getConversationByCustomDesignId(customdesignId: string): Promise<Conversation>;
    sendMessage(conversationId: string, authorId: string, text?: string, attachments?: string[]): Promise<Message>;
    getInbox(userId: string, type?: ConversationType): Promise<{
        id: string;
        type: ConversationType;
        lastMessage: Message | undefined;
        lastMessageAt: Date | undefined;
        unreadCount: number;
        otherParticipant: {
            id: string;
            firstName: string;
            lastName: string;
            profilePics: string | undefined;
        } | null;
    }[]>;
    getMessages(conversationId: string, userId: string, pagination: PaginationDto): Promise<{
        data: Message[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    markAsRead(conversationId: string, userId: string): Promise<{
        success: boolean;
    }>;
    getConversationDetails(id: string): Promise<Conversation>;
}
