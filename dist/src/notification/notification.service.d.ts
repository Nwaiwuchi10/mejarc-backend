import { Repository } from 'src/database/database.module';
import { Notification, NotificationType } from './entities/notification.entity';
import { User } from '../user/entities/user.entity';
import { UserNotificationSetting } from '../user/entities/user-notification-setting.entity';
import { PaginationDto } from '../utils/pagination.dto';
export declare class NotificationService {
    private readonly notificationRepo;
    private readonly userRepo;
    constructor(notificationRepo: Repository<Notification>, userRepo: Repository<User>);
    createNotification(userId: string, type: NotificationType, title: string, message: string, metadata?: any, settingKey?: keyof UserNotificationSetting): Promise<any>;
    markAsRead(notificationId: string, userId: string): Promise<any>;
    getUserNotifications(userId: string, query: PaginationDto): Promise<{
        data: Notification[];
        total: number;
        page: number;
        limit: number;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    getUnreadCount(userId: string): Promise<number>;
}
