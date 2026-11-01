import { User } from '../../user/entities/user.entity';
export declare class Admin {
    id: string;
    user: User;
    userId: string;
    role?: string;
    isActive: boolean;
    isAdmin: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
