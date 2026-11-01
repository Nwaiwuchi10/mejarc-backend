import { WithdrawalRequest } from './withdrawal-request.entity';
import { Agent } from '../../agent/entities/agent.entity';
import { Admin } from '../../admin/entities/admin.entity';
export declare enum AuditAction {
    WITHDRAWAL_REQUESTED = "Withdrawal Requested",
    WITHDRAWAL_APPROVED = "Withdrawal Approved",
    WITHDRAWAL_REJECTED = "Withdrawal Rejected",
    TRANSFER_INITIATED = "Transfer Initiated",
    TRANSFER_SUCCESS = "Transfer Success",
    TRANSFER_FAILED = "Transfer Failed",
    TRANSFER_REVERSED = "Transfer Reversed",
    BANK_ACCOUNT_VERIFIED = "Bank Account Verified",
    BANK_ACCOUNT_REJECTED = "Bank Account Rejected",
    WALLET_CREDITED = "Wallet Credited",
    WALLET_DEBITED = "Wallet Debited"
}
export declare class WithdrawalAuditLog {
    id: string;
    agentId: string;
    agent: Agent;
    withdrawalId: string;
    withdrawal: WithdrawalRequest;
    adminId: string;
    admin: Admin;
    action: AuditAction;
    amount: number;
    description: string;
    paystackReference: string;
    paystackTransferCode: string;
    ipAddress: string;
    userAgent: string;
    metadata: Record<string, any>;
    createdAt: Date;
}
