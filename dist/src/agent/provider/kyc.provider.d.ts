export interface IKycProvider {
    verifyDocuments(documents: {
        key: string;
        url: string;
        name?: string;
    }[]): Promise<{
        success: boolean;
        providerId?: string;
        notes?: string;
    }>;
}
export declare class DummyKycProvider implements IKycProvider {
    verifyDocuments(): Promise<{
        success: boolean;
        providerId: string;
        notes: string;
    }>;
}
