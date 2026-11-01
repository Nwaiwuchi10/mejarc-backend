import { Repository } from 'src/database/database.module';
import { Wallet } from './entities/wallet.entity';
import { WalletTransaction, TransactionCategory } from './entities/wallet-transaction.entity';
import { WithdrawalRequest } from './entities/withdrawal-request.entity';
import { SystemSetting } from './entities/system-setting.entity';
import { Agent } from '../agent/entities/agent.entity';
import { WithdrawDto } from './dto/withdraw.dto';
import { NotificationService } from '../notification/notification.service';
import { Admin } from '../admin/entities/admin.entity';
import { WithdrawalQueueService } from './services/withdrawal-queue.service';
import { BankAccountService } from './services/bank-account.service';
export declare class WalletService {
    private readonly walletRepository;
    private readonly transactionRepository;
    private readonly withdrawalRepository;
    private readonly settingRepository;
    private readonly agentRepository;
    private readonly adminRepository;
    private readonly notificationService;
    private readonly withdrawalQueueService;
    private readonly bankAccountService;
    constructor(walletRepository: Repository<Wallet>, transactionRepository: Repository<WalletTransaction>, withdrawalRepository: Repository<WithdrawalRequest>, settingRepository: Repository<SystemSetting>, agentRepository: Repository<Agent>, adminRepository: Repository<Admin>, notificationService: NotificationService, withdrawalQueueService: WithdrawalQueueService, bankAccountService: BankAccountService);
    getOverview(userId: string): Promise<{
        balance: number;
        pendingClearance: number;
        lifetimeEarnings: number;
        transactions: WalletTransaction[];
        earningsBreakdown: {
            customDesign: number;
            productSales: number;
        };
    }>;
    getTransactions(userId: string): Promise<WalletTransaction[]>;
    getMyWithdrawals(userId: string): Promise<WithdrawalRequest[]>;
    getWithdrawalSettings(): Promise<any>;
    updateWithdrawalSettings(dto: {
        mode?: 'AUTO' | 'MANUAL';
        autoApproveThreshold?: number;
        minWithdrawalAmount?: number;
        maxWithdrawalAmount?: number;
    }): Promise<any>;
    getAllWithdrawals(): Promise<WithdrawalRequest[]>;
    withdraw(userId: string, withdrawDto: WithdrawDto): Promise<{
        message: string;
        mode: any;
        balance: number;
        withdrawalRequest: any;
    }>;
    approveWithdrawal(id: string, adminNotes?: string, adminId?: string): Promise<{
        message: string;
        processing: boolean;
        request: WithdrawalRequest;
    }>;
    rejectWithdrawal(id: string, reason: string, adminId?: string): Promise<{
        message: string;
        request: WithdrawalRequest;
    }>;
    getWithdrawalDetails(withdrawalId: string, userId: string): Promise<WithdrawalRequest>;
    getFinancialSummary(): Promise<{
        totalWithdrawals: number;
        totalAmount: number;
        byStatus: {
            pending: number;
            approved: number;
            processing: number;
            transferred: number;
            rejected: number;
            failed: number;
        };
        byStatusAmount: {
            pending: number;
            approved: number;
            processing: number;
            transferred: number;
            rejected: number;
            failed: number;
        };
    }>;
    getFinancialReports(startDate: Date, endDate: Date): Promise<{
        dateRange: {
            startDate: Date;
            endDate: Date;
        };
        totalVendors: number;
        totalWithdrawals: number;
        totalAmount: number;
        vendorSummary: {
            vendorName: string;
            vendorId: string;
            totalRequested: number;
            totalApproved: number;
            totalTransferred: number;
            totalRejected: number;
            requestCount: number;
            withdrawals: any[];
        }[];
    }>;
    creditWallet(agentId: string, amount: number, description: string, category?: TransactionCategory): Promise<{
        message: string;
        balance: any;
        transaction: any;
    }>;
}
