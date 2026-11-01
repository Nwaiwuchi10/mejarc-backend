import { ConversationMember } from './conversation-member.entity';
import { Message } from './message.entity';
export declare enum ConversationType {
    DM = "dm",
    GROUP = "group",
    CUSTOMDESIGN = "customdesign"
}
export declare class Conversation {
    id: string;
    type: ConversationType;
    customdesignId?: string;
    name?: string;
    isArchived: boolean;
    members: ConversationMember[];
    messages: Message[];
    lastMessageAt?: Date;
    lastMessage?: Message;
    createdAt: Date;
    updatedAt: Date;
}
