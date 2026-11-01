import { Conversation } from './conversation.entity';
import { User } from '../../user/entities/user.entity';
export declare class Message {
    id: string;
    conversation: Conversation;
    author: User;
    text: string;
    attachments: string[];
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
