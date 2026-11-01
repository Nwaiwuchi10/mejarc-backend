import { Agent, AgentRegistrationStatus, AgentKycStatus } from '../entities/agent.entity';
export declare class AgentProfileResponseDto {
    id: string;
    userId: string;
    registrationStatus: AgentRegistrationStatus;
    kycStatus: AgentKycStatus;
    isApprovedByAdmin: boolean;
    approvedAt?: Date;
    rejectionReason?: string;
    yearsOfExperience?: number;
    preferredTitle?: string;
    licenseNumber?: string;
    specialization?: string[];
    portfolioLink?: string;
    profilePicture?: string;
    bio?: string;
    idType?: string;
    idNumber?: string;
    idDocument?: string;
    architectCert?: string;
    bankName?: string;
    accountNumber?: string;
    accountHolderName?: string;
    createdAt: Date;
    updatedAt: Date;
    static fromEntity(agent: Agent): AgentProfileResponseDto;
}
export declare class AgentStatusResponseDto {
    id: string;
    registrationStatus: AgentRegistrationStatus;
    kycStatus: AgentKycStatus;
    isApproved: boolean;
    approvedAt?: Date;
    rejectionReason?: string;
    static fromEntity(agent: Agent): AgentStatusResponseDto;
}
