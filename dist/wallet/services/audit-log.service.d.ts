import { Repository } from 'src/database/database.module';
import { WithdrawalAuditLog, AuditAction } from '../entities/withdrawal-audit-log.entity';
export declare class AuditLogService {
    private readonly auditLogRepository;
    constructor(auditLogRepository: Repository<WithdrawalAuditLog>);
    logAction(action: AuditAction, data: {
        agentId?: string;
        withdrawalId?: string;
        adminId?: string;
        amount?: number;
        description: string;
        paystackReference?: string;
        paystackTransferCode?: string;
        ipAddress?: string;
        userAgent?: string;
        metadata?: Record<string, any>;
    }): Promise<WithdrawalAuditLog>;
    getWithdrawalAuditLogs(withdrawalId: string): Promise<WithdrawalAuditLog[]>;
    getAgentAuditLogs(agentId: string, limit?: number): Promise<WithdrawalAuditLog[]>;
    getAllAuditLogs(skip?: number, take?: number): Promise<{
        data: WithdrawalAuditLog[];
        total: number;
    }>;
    getLogsByAction(action: AuditAction, skip?: number, take?: number): Promise<WithdrawalAuditLog[]>;
    getLogsByDateRange(startDate: Date, endDate: Date, skip?: number, take?: number): Promise<{
        data: WithdrawalAuditLog[];
        total: number;
    }>;
}
