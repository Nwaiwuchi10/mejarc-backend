"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentStatusResponseDto = exports.AgentProfileResponseDto = void 0;
const openapi = require("@nestjs/swagger");
class AgentProfileResponseDto {
    static fromEntity(agent) {
        const profile = agent.profile;
        const bio = agent.bioRecord;
        const latestKyc = (agent.kycRecords || [])
            .slice()
            .sort((a, b) => {
            const ta = a.createdAt?.getTime() || 0;
            const tb = b.createdAt?.getTime() || 0;
            return ta - tb;
        })
            .pop();
        return {
            id: agent.id,
            userId: agent.userId,
            registrationStatus: agent.registrationStatus,
            kycStatus: agent.kycStatus,
            isApprovedByAdmin: agent.isApprovedByAdmin,
            approvedAt: agent.approvedAt,
            rejectionReason: agent.rejectionReason,
            yearsOfExperience: profile?.yearsOfExperience,
            preferredTitle: profile?.preferredTitle,
            licenseNumber: profile?.licenseNumber,
            specialization: profile?.specialization,
            portfolioLink: profile?.portfolioLink,
            profilePicture: profile?.profilePicture,
            bio: bio?.bio,
            idType: latestKyc?.idType,
            idNumber: latestKyc?.idNumber,
            idDocument: latestKyc?.idDocument,
            architectCert: latestKyc?.architectCert,
            bankName: latestKyc?.bankName,
            accountNumber: latestKyc?.accountNumber,
            accountHolderName: latestKyc?.accountHolderName,
            createdAt: agent.createdAt,
            updatedAt: agent.updatedAt,
        };
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId: { required: true, type: () => String }, registrationStatus: { required: true, enum: require("../entities/agent.entity").AgentRegistrationStatus }, kycStatus: { required: true, enum: require("../entities/agent.entity").AgentKycStatus }, isApprovedByAdmin: { required: true, type: () => Boolean }, approvedAt: { required: false, type: () => Date }, rejectionReason: { required: false, type: () => String }, yearsOfExperience: { required: false, type: () => Number }, preferredTitle: { required: false, type: () => String }, licenseNumber: { required: false, type: () => String }, specialization: { required: false, type: () => [String] }, portfolioLink: { required: false, type: () => String }, profilePicture: { required: false, type: () => String }, bio: { required: false, type: () => String }, idType: { required: false, type: () => String }, idNumber: { required: false, type: () => String }, idDocument: { required: false, type: () => String }, architectCert: { required: false, type: () => String }, bankName: { required: false, type: () => String }, accountNumber: { required: false, type: () => String }, accountHolderName: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.AgentProfileResponseDto = AgentProfileResponseDto;
class AgentStatusResponseDto {
    static fromEntity(agent) {
        return {
            id: agent.id,
            registrationStatus: agent.registrationStatus,
            kycStatus: agent.kycStatus,
            isApproved: agent.isApprovedByAdmin,
            approvedAt: agent.approvedAt,
            rejectionReason: agent.rejectionReason,
        };
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, registrationStatus: { required: true, enum: require("../entities/agent.entity").AgentRegistrationStatus }, kycStatus: { required: true, enum: require("../entities/agent.entity").AgentKycStatus }, isApproved: { required: true, type: () => Boolean }, approvedAt: { required: false, type: () => Date }, rejectionReason: { required: false, type: () => String } };
    }
}
exports.AgentStatusResponseDto = AgentStatusResponseDto;
//# sourceMappingURL=agent-profile-response.dto.js.map