import { User } from './user.entity';
export declare class UserNotificationSetting {
    id: string;
    messagesAdmin: boolean;
    messagesAgent: boolean;
    projectFileUploaded: boolean;
    projectStatusChanged: boolean;
    projectRevisionUpdates: boolean;
    paymentSuccessful: boolean;
    paymentOrderConfirmation: boolean;
    paymentPending: boolean;
    paymentFailed: boolean;
    paymentReversed: boolean;
    reviewReminder: boolean;
    reviewResponse: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    user: User;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
