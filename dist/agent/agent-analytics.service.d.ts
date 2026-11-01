import { Repository } from 'src/database/database.module';
import { Agent } from './entities/agent.entity';
import { CustomDesign } from '../customdesign/entities/customdesign.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { WalletTransaction } from '../wallet/entities/wallet-transaction.entity';
import { WithdrawalRequest } from '../wallet/entities/withdrawal-request.entity';
import { Notification } from '../notification/entities/notification.entity';
export declare class AgentAnalyticsService {
    private readonly agentRepository;
    private readonly customDesignRepository;
    private readonly walletRepository;
    private readonly transactionRepository;
    private readonly withdrawalRepository;
    private readonly notificationRepository;
    constructor(agentRepository: Repository<Agent>, customDesignRepository: Repository<CustomDesign>, walletRepository: Repository<Wallet>, transactionRepository: Repository<WalletTransaction>, withdrawalRepository: Repository<WithdrawalRequest>, notificationRepository: Repository<Notification>);
    getDashboardAnalytics(userId: string): Promise<{
        overview: {
            activeProjects: number;
            pendingTasks: number;
            totalEarnings: number;
            payoutStatus: number;
        };
        portfolioEngagement: {
            views: number;
            saves: number;
            inquiries: number;
            viewsPreviousWeek: number;
        };
        revenueChart: {
            month: string;
            revenue: number;
        }[];
        projectStatus: {
            inProgress: number;
            revisionsNeeded: number;
            completed: number;
            cancelled: number;
        };
        notifications: Notification[];
        projectEngagement: {
            totalViews: number;
            totalSaves: number;
            totalInquiries: number;
        };
    }>;
    getProjectCounts(userId: string): Promise<{
        totalNewProjects: number;
        totalInProgressProjects: number;
        totalRevisionProjects: number;
        totalCompletedProjects: number;
    }>;
    getProjectsByCategory(userId: string): Promise<{
        newProjects: CustomDesign[];
        inProgressProjects: CustomDesign[];
        revisionProjects: CustomDesign[];
        completedProjects: CustomDesign[];
    }>;
}
