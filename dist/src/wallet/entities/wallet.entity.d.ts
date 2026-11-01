import { Agent } from '../../agent/entities/agent.entity';
import { WalletTransaction } from './wallet-transaction.entity';
export declare class Wallet {
    id: string;
    balance: number;
    pendingClearance: number;
    lifetimeEarnings: number;
    agent: Agent;
    transactions: WalletTransaction[];
    createdAt: Date;
    updatedAt: Date;
}
