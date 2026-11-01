import { IKycProvider } from './kyc.provider';
export declare class UverifyKycProvider implements IKycProvider {
    private baseUrl;
    private apiKey;
    private apiSecret;
    constructor();
    verifyDocuments(documents: {
        key: string;
        url: string;
        name?: string;
    }[]): Promise<{
        success: boolean;
        providerId: any;
        notes: string;
    } | {
        success: boolean;
        notes: any;
        providerId?: undefined;
    }>;
}
