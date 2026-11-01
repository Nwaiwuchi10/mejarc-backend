import { UserAddress } from './user-adress.entity';
import { UserNotificationSetting } from './user-notification-setting.entity';
export declare enum UserType {
    CUSTOMER = "Customer"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    userType: UserType;
    name?: string;
    profilePics?: string;
    password?: string;
    loginVerificationToken?: string;
    loginVerificationTokenExpiry?: Date;
    isEmailVerified: boolean;
    loginAttempts: number;
    lastLoginAttempt?: Date;
    hashPassword(): Promise<void>;
    address?: UserAddress;
    notificationSettings?: UserNotificationSetting;
    isSuspended: boolean;
    resetToken?: string;
    resetTokenExpires?: Date;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
