import { User } from 'src/user/entities/user.entity';
import { AgentProfile } from './agent-profile.entity';
import { AgentBio } from './agent-bio.entity';
import { AgentKyc } from './agent-kyc.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
export declare enum AgentKycStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED"
}
export declare enum AgentRegistrationStatus {
    PROFILE_PENDING = "profile_pending",
    BIO_PENDING = "bio_pending",
    KYC_PENDING = "kyc_pending",
    AWAITING_APPROVAL = "awaiting_approval",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class Agent {
    id: string;
    user: User;
    userId: string;
    profile?: AgentProfile;
    bioRecord?: AgentBio;
    kycRecords?: AgentKyc[];
    wallet?: Wallet;
    vendorId?: string;
    businessName?: string;
    pendingProfileChange?: any;
    kycDocuments?: {
        key: string;
        url: string;
        name?: string;
    }[];
    registrationStatus: AgentRegistrationStatus;
    kycStatus: AgentKycStatus;
    isApprovedByAdmin: boolean;
    approvedAt?: Date;
    rejectionReason?: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
