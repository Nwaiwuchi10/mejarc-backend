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
exports.AgentAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const database_module_2 = require("../database/database.module");
const agent_entity_1 = require("./entities/agent.entity");
const customdesign_entity_1 = require("../customdesign/entities/customdesign.entity");
const customdesign_types_1 = require("../customdesign/customdesign.types");
const wallet_entity_1 = require("../wallet/entities/wallet.entity");
const wallet_transaction_entity_1 = require("../wallet/entities/wallet-transaction.entity");
const withdrawal_request_entity_1 = require("../wallet/entities/withdrawal-request.entity");
const notification_entity_1 = require("../notification/entities/notification.entity");
let AgentAnalyticsService = class AgentAnalyticsService {
    constructor(agentRepository, customDesignRepository, walletRepository, transactionRepository, withdrawalRepository, notificationRepository) {
        this.agentRepository = agentRepository;
        this.customDesignRepository = customDesignRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.withdrawalRepository = withdrawalRepository;
        this.notificationRepository = notificationRepository;
    }
    async getDashboardAnalytics(userId) {
        const agent = await this.agentRepository.findOne({
            where: { userId },
            relations: ['profile', 'wallet'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const agentId = agent.id;
        const allProjects = await this.customDesignRepository.find({
            where: { agentId },
        });
        const activeProjects = allProjects.filter((p) => [customdesign_types_1.CustomDesignStatus.UNDER_REVIEW, customdesign_types_1.CustomDesignStatus.APPROVED].includes(p.status)).length;
        const pendingTasks = allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.SUBMITTED).length;
        const projectStatusDistribution = {
            inProgress: allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.APPROVED).length,
            revisionsNeeded: allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.UNDER_REVIEW).length,
            completed: allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.COMPLETED).length,
            cancelled: allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.REJECTED).length,
        };
        const earnings = agent.wallet ? Number(agent.wallet.lifetimeEarnings) : 0;
        const approvedWithdrawals = await this.withdrawalRepository.find({
            where: { agentId, status: withdrawal_request_entity_1.WithdrawalStatus.APPROVED },
        });
        const totalPayout = approvedWithdrawals.reduce((sum, req) => sum + Number(req.amount), 0);
        const engagement = {
            views: agent.profile?.viewsCount || 0,
            saves: agent.profile?.savesCount || 0,
            inquiries: agent.profile?.inquiriesCount || 0,
            viewsPreviousWeek: Math.floor((agent.profile?.viewsCount || 0) * 0.8),
        };
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const credits = await this.transactionRepository.find({
            where: {
                wallet: { agent: { id: agentId } },
                type: wallet_transaction_entity_1.TransactionType.CREDIT,
                createdAt: (0, database_module_2.Between)(sixMonthsAgo, now),
            },
        });
        const monthlyRevenue = Array.from({ length: 6 })
            .map((_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            const total = credits
                .filter((c) => c.createdAt.getMonth() === date.getMonth() &&
                c.createdAt.getFullYear() === date.getFullYear())
                .reduce((sum, c) => sum + Number(c.amount), 0);
            return { month: monthName, revenue: total };
        })
            .reverse();
        const notifications = await this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 5,
        });
        return {
            overview: {
                activeProjects,
                pendingTasks,
                totalEarnings: earnings,
                payoutStatus: totalPayout,
            },
            portfolioEngagement: engagement,
            revenueChart: monthlyRevenue,
            projectStatus: projectStatusDistribution,
            notifications,
            projectEngagement: {
                totalViews: engagement.views,
                totalSaves: engagement.saves,
                totalInquiries: engagement.inquiries,
            },
        };
    }
    async getProjectCounts(userId) {
        const agent = await this.agentRepository.findOne({
            where: { userId },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const agentId = agent.id;
        const allProjects = await this.customDesignRepository.find({
            where: { agentId },
        });
        return {
            totalNewProjects: allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.SUBMITTED).length,
            totalInProgressProjects: allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.APPROVED).length,
            totalRevisionProjects: allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.REVISION).length,
            totalCompletedProjects: allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.COMPLETED).length,
        };
    }
    async getProjectsByCategory(userId) {
        const agent = await this.agentRepository.findOne({
            where: { userId },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const agentId = agent.id;
        const allProjects = await this.customDesignRepository.find({
            where: { agentId },
            relations: ['user', 'agent', 'agent.user', 'payment'],
            order: { createdAt: 'DESC' },
        });
        return {
            newProjects: allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.SUBMITTED),
            inProgressProjects: allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.APPROVED),
            revisionProjects: allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.REVISION),
            completedProjects: allProjects.filter((p) => p.status === customdesign_types_1.CustomDesignStatus.COMPLETED),
        };
    }
};
exports.AgentAnalyticsService = AgentAnalyticsService;
exports.AgentAnalyticsService = AgentAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(agent_entity_1.Agent)),
    __param(1, (0, database_module_1.InjectRepository)(customdesign_entity_1.CustomDesign)),
    __param(2, (0, database_module_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(3, (0, database_module_1.InjectRepository)(wallet_transaction_entity_1.WalletTransaction)),
    __param(4, (0, database_module_1.InjectRepository)(withdrawal_request_entity_1.WithdrawalRequest)),
    __param(5, (0, database_module_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], AgentAnalyticsService);
//# sourceMappingURL=agent-analytics.service.js.map