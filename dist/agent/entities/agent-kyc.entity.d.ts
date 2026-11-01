import { Agent } from './agent.entity';
export declare enum KycRecordStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED"
}
export declare class AgentKyc {
    id: string;
    agent: Agent;
    agentId: string;
    idType?: string;
    idNumber?: string;
    idDocument?: string;
    architectCert?: string;
    bankName?: string;
    accountNumber?: string;
    accountHolderName?: string;
    documents?: {
        key: string;
        url: string;
        name?: string;
    }[];
    status: KycRecordStatus;
    createdAt: Date;
    updatedAt: Date;
}
