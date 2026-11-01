import { Conversation } from './conversation.entity';
import { User } from '../../user/entities/user.entity';
export declare class ConversationMember {
    id: string;
    conversation: Conversation;
    user: User;
    unreadCount: number;
    joinedAt: Date;
    updatedAt: Date;
}
