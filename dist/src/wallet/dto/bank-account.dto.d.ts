export declare class RegisterBankAccountDto {
    accountHolderName: string;
    accountNumber: string;
    bankCode: string;
    bankName: string;
}
export declare class VerifyBankAccountDto {
    accountNumber: string;
    bankCode: string;
}
export declare class BankAccountVerifiedDto {
    id: string;
    agentId: string;
    accountHolderName: string;
    accountNumber: string;
    bankCode: string;
    bankName: string;
    paystackRecipientCode: string;
    status: 'Verified';
    resolvedAccountName: string;
    isDefault: boolean;
    createdAt: Date;
    verifiedAt: Date;
}
export declare class GetBankAccountDto {
    id: string;
    accountHolderName: string;
    accountNumber: string;
    bankCode: string;
    bankName: string;
    status: string;
    isDefault: boolean;
    createdAt: Date;
}
export declare class SetDefaultBankAccountDto {
    bankAccountId: string;
}
