import { Wallet } from './wallet.entity';
export declare enum TransactionType {
    CREDIT = "Credit",
    DEBIT = "Debit"
}
export declare enum TransactionCategory {
    PRODUCT_SALE = "Product Sale",
    CUSTOM_DESIGN = "Custom Design",
    WITHDRAWAL = "Withdrawal",
    OTHER = "Other"
}
export declare class WalletTransaction {
    id: string;
    type: TransactionType;
    amount: number;
    balanceAfter: number;
    description: string;
    category: TransactionCategory;
    wallet: Wallet;
    createdAt: Date;
    updatedAt: Date;
}
