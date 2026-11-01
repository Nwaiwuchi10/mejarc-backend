import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../chat.service';
import { Message } from '../entities/message.entity';
import { Conversation } from '../entities/conversation.entity';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly chatService;
    server: Server;
    private logger;
    constructor(jwtService: JwtService, chatService: ChatService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleSendMessage(client: Socket, data: {
        conversationId: string;
        text: string;
    }): Promise<void>;
    emitNewMessage(message: Message, conversationId: string): Promise<void>;
    emitUnreadCount(userId: string): Promise<void>;
    emitNewConversation(conversation: Conversation): Promise<void>;
    handleMarkAsRead(client: Socket, data: {
        conversationId: string;
    }): Promise<void>;
    private extractToken;
    private getUserId;
}
