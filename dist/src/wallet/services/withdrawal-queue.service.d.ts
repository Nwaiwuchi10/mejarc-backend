import { Repository } from 'src/database/database.module';
import { WithdrawalRequest } from '../entities/withdrawal-request.entity';
import { PaystackService } from './paystack.service';
import { BankAccountService } from './bank-account.service';
import { AuditLogService } from './audit-log.service';
import { NotificationService } from '../../notification/notification.service';
import { Agent } from '../../agent/entities/agent.entity';
interface WithdrawalJob {
    withdrawalId: string;
    agentId: string;
    amount: number;
}
export declare class WithdrawalQueueService {
    private readonly withdrawalRepository;
    private readonly agentRepository;
    private readonly paystackService;
    private readonly bankAccountService;
    private readonly auditLogService;
    private readonly notificationService;
    private readonly logger;
    constructor(withdrawalRepository: Repository<WithdrawalRequest>, agentRepository: Repository<Agent>, paystackService: PaystackService, bankAccountService: BankAccountService, auditLogService: AuditLogService, notificationService: NotificationService);
    processWithdrawal(job: WithdrawalJob): Promise<{
        success: boolean;
        message: string;
        data?: any;
    }>;
    private handleTransferFailure;
    private refundWithdrawal;
    handlePaystackWebhookCallback(webhookData: {
        event: string;
        data: any;
    }): Promise<void>;
    private handleTransferSuccess;
    private handleTransferFailed;
    private handleTransferReversed;
    retryFailedWithdrawals(): Promise<{
        processed: number;
        successful: number;
        failed: number;
    }>;
}
export {};
