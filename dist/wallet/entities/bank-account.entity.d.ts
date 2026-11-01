import { Agent } from '../../agent/entities/agent.entity';
export declare enum BankAccountStatus {
    PENDING = "Pending",
    VERIFIED = "Verified",
    REJECTED = "Rejected"
}
export declare class BankAccount {
    id: string;
    agentId: string;
    agent: Agent;
    accountHolderName: string;
    accountNumber: string;
    bankCode: string;
    bankName: string;
    paystackRecipientCode: string;
    status: BankAccountStatus;
    resolvedAccountName: string;
    isDefault: boolean;
    rejectionReason: string;
    rejectedAt: Date;
    verifiedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
