"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const notification_entity_1 = require("./entities/notification.entity");
const user_entity_1 = require("../user/entities/user.entity");
let NotificationService = class NotificationService {
    constructor(notificationRepo, userRepo) {
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
    }
    async createNotification(userId, type, title, message, metadata, settingKey) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['notificationSettings'],
        });
        if (!user) {
            console.error(`Cannot create notification: User ${userId} not found`);
            return;
        }
        const settings = user.notificationSettings;
        if (settings && settingKey && settings[settingKey] === false) {
            return;
        }
        if (settings && !settingKey) {
            if (type === notification_entity_1.NotificationType.ADMIN && !settings.messagesAdmin)
                return;
            if (type === notification_entity_1.NotificationType.AGENT_MESSAGE && !settings.messagesAgent)
                return;
            if (type === notification_entity_1.NotificationType.ORDER && !settings.paymentOrderConfirmation)
                return;
            if ((type === notification_entity_1.NotificationType.PRODUCTPAYMENT ||
                type === notification_entity_1.NotificationType.CUSTOMDESIGNPAYMENT) &&
                !settings.paymentSuccessful)
                return;
        }
        const notification = this.notificationRepo.create({
            user,
            userId,
            type,
            title,
            message,
            metadata,
        });
        const savedNotification = await this.notificationRepo.save(notification);
        if (settings?.emailNotifications) {
        }
        if (settings?.smsNotifications && user.phoneNumber) {
        }
        return savedNotification;
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.notificationRepo.findOne({
            where: { id: notificationId, userId },
        });
        if (!notification)
            throw new common_1.NotFoundException('Notification not found or access denied');
        notification.isRead = true;
        return this.notificationRepo.save(notification);
    }
    async getUserNotifications(userId, query) {
        const { page = 1, limit = 10 } = query;
        const [data, total] = await this.notificationRepo.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async markAllAsRead(userId) {
        await this.notificationRepo.update({ userId, isRead: false }, { isRead: true });
        return { message: 'All notifications marked as read' };
    }
    async getUnreadCount(userId) {
        return this.notificationRepo.count({
            where: { userId, isRead: false },
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, database_module_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [Object, Object])
], NotificationService);
//# sourceMappingURL=notification.service.js.map