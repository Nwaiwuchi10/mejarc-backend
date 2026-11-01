import { ChatService } from './chat.service';
import { PaginationDto } from '../utils/pagination.dto';
import { ConversationType } from './entities/conversation.entity';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getInbox(req: any): Promise<{
        id: string;
        type: ConversationType;
        lastMessage: import("./entities/message.entity").Message | undefined;
        lastMessageAt: Date | undefined;
        unreadCount: number;
        otherParticipant: {
            id: string;
            firstName: string;
            lastName: string;
            profilePics: string | undefined;
        } | null;
    }[]>;
    getDMInbox(req: any): Promise<{
        id: string;
        type: ConversationType;
        lastMessage: import("./entities/message.entity").Message | undefined;
        lastMessageAt: Date | undefined;
        unreadCount: number;
        otherParticipant: {
            id: string;
            firstName: string;
            lastName: string;
            profilePics: string | undefined;
        } | null;
    }[]>;
    startDM(req: any, recipientId: string): Promise<import("./entities/conversation.entity").Conversation>;
    startCustomDesignChat(req: any, customdesignId: string): Promise<import("./entities/conversation.entity").Conversation>;
    getByCustomDesignId(customdesignId: string): Promise<import("./entities/conversation.entity").Conversation>;
    getMessages(req: any, conversationId: string, pagination: PaginationDto): Promise<{
        data: import("./entities/message.entity").Message[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    markAsRead(req: any, conversationId: string): Promise<{
        success: boolean;
    }>;
    sendMessage(req: any, conversationId: string, text: string, files: Express.Multer.File[]): Promise<import("./entities/message.entity").Message>;
}
