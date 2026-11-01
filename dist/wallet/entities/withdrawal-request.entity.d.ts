import { Agent } from '../../agent/entities/agent.entity';
export declare enum WithdrawalStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected",
    PROCESSING = "Processing",
    TRANSFERRED = "Transferred",
    FAILED = "Failed",
    REVERSED = "Reversed"
}
export declare class WithdrawalRequest {
    id: string;
    amount: number;
    status: WithdrawalStatus;
    description: string;
    accountDetails: string;
    adminNotes: string;
    agent: Agent;
    agentId: string;
    paystackReference: string;
    paystackTransferCode: string;
    amountInKobo: number;
    retryCount: number;
    maxRetries: number;
    lastErrorMessage: string;
    transferInitiatedAt: Date;
    transferCompletedAt: Date;
    autoProcess: boolean;
    createdAt: Date;
    updatedAt: Date;
}
