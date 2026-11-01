import { User } from 'src/user/entities/user.entity';
export declare enum NotificationType {
    PRODUCT = "product",
    ORDER = "order",
    WALLET = "wallet",
    WITHDRAWAL = "withdrawal",
    ADMIN = "admin",
    AGENT_MESSAGE = "agent_message",
    CUSTOMDESIGN = "customdesign",
    PRODUCTPAYMENT = "productpayment",
    CUSTOMDESIGNPAYMENT = "customdesignpayment",
    KYC = "kyc"
}
export declare class Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    user: User;
    userId: string;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
}
