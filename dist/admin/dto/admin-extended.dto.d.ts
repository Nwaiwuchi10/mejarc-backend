export declare class AdminPaginatedQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
    tab?: string;
    userType?: string;
    isApproved?: any;
    role?: string;
}
export declare class UpdateUserStatusDto {
    reason?: string;
}
export declare class AdminSendMessageDto {
    text: string;
    attachments?: string[];
}
export declare class AdminEscalateConversationDto {
    reason: string;
}
export declare class ResolveDisputeDto {
    resolution: string;
    refundTo?: 'customer' | 'agent';
}
export declare class ApproveRefundDto {
    notes?: string;
}
export declare class ReleasePayoutDto {
    notes?: string;
}
export declare class AdminMarketActionDto {
    reason?: string;
}
export declare class AdminRequestChangeDto {
    feedback: string;
}
export declare class AssignAgentDto {
    agentId: string;
}
export declare class AdminProjectActionDto {
    reason?: string;
}
export declare class CreateRoleDto {
    name: string;
    department: string;
    permissions?: string;
}
export declare class UpdateRoleDto {
    name?: string;
    department?: string;
    permissions?: string;
}
export declare class AssignRoleDto {
    roleId: string;
    department?: string;
}
export declare class UpdateAdminProfileDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    profilePics?: string;
}
export declare class ChangeAdminPasswordDto {
    currentPassword: string;
    newPassword: string;
}
