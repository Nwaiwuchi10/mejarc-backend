import { WalletService } from './wallet.service';
import { WithdrawDto } from './dto/withdraw.dto';
import { BankAccountService } from './services/bank-account.service';
import { PaystackService } from './services/paystack.service';
import { WithdrawalQueueService } from './services/withdrawal-queue.service';
import { AuditLogService } from './services/audit-log.service';
import { RegisterBankAccountDto, VerifyBankAccountDto } from './dto/bank-account.dto';
export declare class WalletController {
    private readonly walletService;
    private readonly bankAccountService;
    private readonly paystackService;
    private readonly withdrawalQueueService;
    private readonly auditLogService;
    constructor(walletService: WalletService, bankAccountService: BankAccountService, paystackService: PaystackService, withdrawalQueueService: WithdrawalQueueService, auditLogService: AuditLogService);
    registerBankAccount(req: any, registerDto: RegisterBankAccountDto): Promise<import("./entities/bank-account.entity").BankAccount>;
    verifyBankAccount(req: any, bankAccountId: string, verifyDto: VerifyBankAccountDto): Promise<import("./entities/bank-account.entity").BankAccount>;
    getBankAccounts(req: any): Promise<import("./entities/bank-account.entity").BankAccount[]>;
    setDefaultBankAccount(req: any, bankAccountId: string): Promise<import("./entities/bank-account.entity").BankAccount>;
    deleteBankAccount(req: any, bankAccountId: string): Promise<{
        message: string;
    }>;
    getBanks(): Promise<{
        code: string;
        name: string;
        longname: string;
    }[]>;
    getWithdrawalRules(): Promise<any>;
    getOverview(userId: string): Promise<{
        balance: number;
        pendingClearance: number;
        lifetimeEarnings: number;
        transactions: import("./entities/wallet-transaction.entity").WalletTransaction[];
        earningsBreakdown: {
            customDesign: number;
            productSales: number;
        };
    }>;
    withdraw(req: any, withdrawDto: WithdrawDto): Promise<{
        message: string;
        mode: any;
        balance: number;
        withdrawalRequest: any;
    }>;
    getTransactions(req: any): Promise<import("./entities/wallet-transaction.entity").WalletTransaction[]>;
    getMyWithdrawals(req: any): Promise<import("./entities/withdrawal-request.entity").WithdrawalRequest[]>;
    getWithdrawalDetails(req: any, withdrawalId: string): Promise<import("./entities/withdrawal-request.entity").WithdrawalRequest>;
    getWithdrawalSettings(): Promise<any>;
    updateWithdrawalSettings(dto: {
        mode?: 'AUTO' | 'MANUAL';
        autoApproveThreshold?: number;
        minWithdrawalAmount?: number;
    }): Promise<any>;
    getAllWithdrawals(): Promise<import("./entities/withdrawal-request.entity").WithdrawalRequest[]>;
    approveWithdrawal(req: any, id: string, adminNotes?: string): Promise<{
        message: string;
        processing: boolean;
        request: import("./entities/withdrawal-request.entity").WithdrawalRequest;
    }>;
    rejectWithdrawal(req: any, id: string, reason: string): Promise<{
        message: string;
        request: import("./entities/withdrawal-request.entity").WithdrawalRequest;
    }>;
    getWithdrawalAuditLogs(withdrawalId: string): Promise<import("./entities/withdrawal-audit-log.entity").WithdrawalAuditLog[]>;
    getAllAuditLogs(req: any): Promise<{
        data: import("./entities/withdrawal-audit-log.entity").WithdrawalAuditLog[];
        total: number;
    }>;
    getAuditLogsByAction(req: any, action: string): Promise<import("./entities/withdrawal-audit-log.entity").WithdrawalAuditLog[]>;
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
    getFinancialReports(req: any): Promise<{
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
    handlePaystackWebhook(req: any, signature: string): Promise<{
        status: string;
    }>;
    retryFailedWithdrawals(): Promise<{
        processed: number;
        successful: number;
        failed: number;
    }>;
    retrySingleWithdrawal(id: string): Promise<{
        success: boolean;
        message: string;
        data?: any;
    }>;
}
