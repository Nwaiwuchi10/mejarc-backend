export declare class PaystackService {
    private client;
    private apiKey;
    private baseUrl;
    constructor();
    verifyBankAccount(accountNumber: string, bankCode: string): Promise<{
        accountName: string;
    }>;
    createTransferRecipient(recipientData: {
        name: string;
        accountNumber: string;
        bankCode: string;
        type?: string;
        currency?: string;
    }): Promise<{
        recipientCode: string;
    }>;
    initiateTransfer(recipientCode: string, amountInKobo: number, reason?: string): Promise<{
        reference: string;
        transferCode: string;
        amount: number;
        status: string;
    }>;
    verifyWebhookSignature(payload: string, signature: string): boolean;
    parseWebhookEvent(event: any): {
        eventType: string;
        transferReference: string;
        transferCode: string;
        amount: number;
        status: string;
        recipientCode: string;
        reason: string;
        createdAt: string;
    };
    convertToKobo(amountInNaira: number): number;
    convertToNaira(amountInKobo: number): number;
    getTransferDetails(transferCode: string): Promise<{
        reference: string;
        amount: number;
        status: string;
        reason: string;
    }>;
    getBankList(): Promise<Array<{
        code: string;
        name: string;
        longname: string;
    }>>;
}
