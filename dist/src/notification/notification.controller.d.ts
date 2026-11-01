import { NotificationService } from './notification.service';
import { PaginationDto } from '../utils/pagination.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getUserNotifications(req: any, query: PaginationDto): Promise<{
        data: import("./entities/notification.entity").Notification[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUnreadCount(req: any): Promise<number>;
    markAllAsRead(req: any): Promise<{
        message: string;
    }>;
    markAsRead(req: any, id: string): Promise<any>;
}
