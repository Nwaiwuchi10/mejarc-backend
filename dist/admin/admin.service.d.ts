import { Repository } from 'src/database/database.module';
import { JwtService } from '@nestjs/jwt';
import { WalletService } from '../wallet/wallet.service';
import { Admin } from './entities/admin.entity';
import { User } from '../user/entities/user.entity';
import { UserAddress } from '../user/entities/user-adress.entity';
import { Agent, AgentRegistrationStatus, AgentKycStatus } from '../agent/entities/agent.entity';
import { AgentService } from '../agent/agent.service';
import { AgentMailService } from '../agent/service/mail.service';
import { MailService } from '../user/service/mail.service';
import { PaginationDto } from '../utils/pagination.dto';
import { Order } from '../order/entities/order.entity';
import { MarketProduct, MarketProductStatus } from '../marketproduct/entities/marketproduct.entity';
import { Conversation } from '../chat/entities/conversation.entity';
import { Message } from '../chat/entities/message.entity';
export declare class AdminService {
    private adminRepo;
    private userRepo;
    private agentRepo;
    private orderRepo;
    private marketProductRepo;
    private conversationRepo;
    private messageRepo;
    private readonly agentService;
    private readonly agentMailService;
    private readonly userMailService;
    private readonly jwtService;
    private readonly walletService;
    private readonly logger;
    constructor(adminRepo: Repository<Admin>, userRepo: Repository<User>, agentRepo: Repository<Agent>, orderRepo: Repository<Order>, marketProductRepo: Repository<MarketProduct>, conversationRepo: Repository<Conversation>, messageRepo: Repository<Message>, agentService: AgentService, agentMailService: AgentMailService, userMailService: MailService, jwtService: JwtService, walletService: WalletService);
    makeAdmin(userId: string, role?: string): Promise<{
        success: boolean;
        message: string;
        admin: any;
    }>;
    bootstrapFirstAdmin(email: string): Promise<{
        success: boolean;
        message: string;
        admin: any;
    }>;
    adminLogin(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        email: string;
        expiresIn: string;
    }>;
    verifyAdminLogin(email: string, token: string): Promise<{
        success: boolean;
        message: string;
        adminToken: string;
        admin: {
            adminId: string;
            adminRole: string | undefined;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber?: string;
            userType: import("../user/entities/user.entity").UserType;
            name?: string;
            profilePics?: string;
            loginVerificationToken?: string;
            loginVerificationTokenExpiry?: Date;
            isEmailVerified: boolean;
            loginAttempts: number;
            lastLoginAttempt?: Date;
            address?: UserAddress;
            notificationSettings?: import("../user/entities/user-notification-setting.entity").UserNotificationSetting;
            isSuspended: boolean;
            resetToken?: string;
            resetTokenExpires?: Date;
            deletedAt?: Date;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getAllAgents(paginationDto: PaginationDto): Promise<{
        data: {
            id: string;
            userId: string;
            registrationStatus: AgentRegistrationStatus;
            kycStatus: AgentKycStatus;
            isApprovedByAdmin: boolean;
            approvedAt: Date | undefined;
            rejectionReason: string | undefined;
            createdAt: Date;
            user: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
                phoneNumber: string | undefined;
            } | null;
            profile: {
                preferredTitle: import("../agent/entities/agent-profile.entity").ProfessionalTitle | undefined;
                licenseNumber: string | undefined;
                yearsOfExperience: number | undefined;
                specialization: string[] | undefined;
                portfolioLink: string | undefined;
                profilePicture: string | undefined;
            } | null;
            latestKyc: {
                id: string;
                status: import("../agent/entities/agent-kyc.entity").KycRecordStatus;
                idType: string | undefined;
                idNumber: string | undefined;
                bankName: string | undefined;
                accountNumber: string | undefined;
                accountHolderName: string | undefined;
                submittedAt: Date;
            } | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAgentApplications(query: any): Promise<{
        data: {
            id: any;
            vendorId: any;
            name: any;
            email: any;
            businessName: any;
            pendingProfileChange: any;
            businessType: any;
            status: string;
            createdAt: any;
            updatedAt: any;
        }[];
        meta: {
            total: number;
            page: any;
            limit: any;
            totalPages: number;
        };
    }>;
    getAgentDetail(agentId: string): Promise<{
        id: string;
        vendorId: string;
        userId: string;
        registrationStatus: AgentRegistrationStatus;
        kycStatus: AgentKycStatus;
        isApprovedByAdmin: boolean;
        approvedAt: Date | undefined;
        rejectionReason: string | undefined;
        businessName: string | undefined;
        pendingProfileChange: any;
        createdAt: Date;
        updatedAt: Date;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string | undefined;
            profilePics: string | undefined;
        } | null;
        profile: import("../agent/entities/agent-profile.entity").AgentProfile | null;
        bio: string | null;
        kycRecords: {
            id: string;
            status: import("../agent/entities/agent-kyc.entity").KycRecordStatus;
            idType: string | undefined;
            idNumber: string | undefined;
            idDocument: string | undefined;
            architectCert: string | undefined;
            bankName: string | undefined;
            accountNumber: string | undefined;
            accountHolderName: string | undefined;
            documents: {
                key: string;
                url: string;
                name?: string;
            }[] | undefined;
            submittedAt: Date;
            updatedAt: Date;
        }[];
    }>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: Admin[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Admin | null>;
    create(admin: Partial<Admin>): Promise<any>;
    approveAgent(agentId: string): Promise<{
        success: boolean;
    }>;
    approveVendorProfileChange(agentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    rejectVendorProfileChange(agentId: string, reason?: string): Promise<{
        success: boolean;
        message: string;
        reason: string | undefined;
    }>;
    rejectAgent(agentId: string, reason?: string): Promise<{
        success: boolean;
    }>;
    private validateUUID;
    private formatAgentSummary;
    private formatAgentDetail;
    getAdminUsers(query: any): Promise<{
        data: {
            id: any;
            name: string;
            email: any;
            role: string;
            userType: string;
            phoneNumber: any;
            status: string;
            verification: string;
            lastLogin: any;
            profilePics: any;
            createdAt: any;
        }[];
        meta: {
            total: number;
            page: any;
            limit: any;
            totalPages: number;
        };
    }>;
    getAdminUserDetail(userId: string): Promise<any>;
    suspendUser(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    activateUser(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getCommunicationStats(): Promise<{
        total: number;
        active: number;
        archived: number;
        unreadMessages: number;
    }>;
    getConversations(query: any): Promise<{
        data: {
            id: any;
            name: any;
            author: string | null;
            type: any;
            isArchived: any;
            lastMessage: any;
            lastMessageAt: any;
            memberCount: any;
            unreadCount: any;
            members: any;
        }[];
        meta: {
            total: number;
            page: any;
            limit: any;
            totalPages: number;
        };
    }>;
    getConversationDetail(conversationId: string): Promise<Conversation>;
    escalateConversation(conversationId: string, reason: string): Promise<{
        success: boolean;
        message: string;
        conversationId: string;
        reason: string;
    }>;
    getAdminMessages(query: any): Promise<{
        data: {
            id: any;
            name: any;
            author: string | null;
            type: any;
            isArchived: any;
            lastMessage: any;
            lastMessageAt: any;
            memberCount: any;
            unreadCount: any;
            members: any;
        }[];
        meta: {
            total: number;
            page: any;
            limit: any;
            totalPages: number;
        };
    }>;
    getConversationMessages(conversationId: string): Promise<{
        conversation: Conversation;
        messages: Message[];
    }>;
    adminSendMessage(conversationId: string, adminId: string, text: string, attachments?: string[]): Promise<any>;
    getFinancialStats(): Promise<{
        totalRevenue: number;
        customerPayments: number;
        pendingPayouts: number;
        completedPayouts: number;
        platformCommission: number;
        totalOrders: number;
        refundsIssued: number;
    }>;
    getCustomerTransactions(query: any): Promise<{
        data: {
            id: string;
            orderId: string;
            productId: string;
            transactionId: any;
            vendorName: string;
            customer: string;
            amount: number;
            method: any;
            status: string;
            date: Date;
            project: string;
            category: string;
        }[];
        meta: {
            total: number;
            page: any;
            limit: any;
            totalPages: number;
        };
    }>;
    getAgentPayouts(query: any): Promise<{
        data: {
            id: any;
            agent: string;
            avatar: any;
            project: any;
            amount: number;
            status: any;
            accountDetails: any;
            autoProcess: any;
            adminNotes: any;
            paystackReference: any;
            date: any;
        }[];
        meta: {
            total: number;
            page: any;
            limit: any;
            totalPages: number;
        };
    }>;
    getDisputes(query: any): Promise<{
        data: never[];
        meta: {
            total: number;
            page: number;
            limit: number;
            note: string;
        };
    }>;
    getRefunds(query: any): Promise<{
        data: never[];
        meta: {
            total: number;
            page: number;
            limit: number;
            note: string;
        };
    }>;
    releasePayout(payoutId: string, notes?: string): Promise<{
        success: boolean;
        message: string;
        notes: string | undefined;
    }>;
    resolveDispute(disputeId: string, resolution: string, refundTo?: string): Promise<{
        success: boolean;
        message: string;
        resolution: string;
        refundTo: string | undefined;
    }>;
    approveRefund(refundId: string, notes?: string): Promise<{
        success: boolean;
        message: string;
        notes: string | undefined;
    }>;
    getMarketplaceStats(): Promise<{
        total: number;
        approved: number;
        pending: number;
        rejected: number;
    }>;
    getMarketplaceListings(query: any): Promise<{
        data: {
            id: string;
            productId: string;
            title: string;
            category: import("../marketproduct/entities/marketproduct.entity").ProductCategory;
            planType: import("../marketproduct/entities/marketproduct.entity").PlanType;
            price: number;
            status: MarketProductStatus;
            agent: string;
            vendorId: string;
            vendorName: string;
            agentId: string;
            agentAvatar: string | null;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: any;
            limit: any;
            totalPages: number;
        };
    }>;
    getMarketplaceListing(listingId: string): Promise<MarketProduct>;
    approveMarketplaceListing(listingId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    rejectMarketplaceListing(listingId: string, reason?: string): Promise<{
        success: boolean;
        message: string;
        reason: string | undefined;
    }>;
    requestMarketplaceChange(listingId: string, feedback: string): Promise<{
        success: boolean;
        message: string;
        feedback: string;
    }>;
    getProjectStats(): Promise<{
        totalProjects: number;
        ongoing: number;
        completed: number;
        disputed: number;
        cancelled: number;
    }>;
    getCustomerProjects(query: any): Promise<{
        data: {
            projectId: string;
            orderId: string;
            customerName: string;
            planType: string;
            purchaseType: string;
            budget: number;
            status: string;
            startDate: Date;
            deadline: null;
            agentAssigned: null;
        }[];
        meta: {
            total: number;
            page: any;
            limit: any;
            totalPages: number;
        };
    }>;
    getAgentPerformance(query: any): Promise<{
        data: {
            id: string;
            vendorId: string;
            name: string;
            businessName: string;
            handled: number;
            completed: number;
            ongoing: number;
            cancelled: number;
            disputed: number;
            earnings: string;
            rawEarnings: number;
            totalPayout: string;
            rawTotalPayout: number;
            balanceOwed: string;
            rating: string;
        }[];
        meta: {
            total: number;
        };
    }>;
    getCustomProjectSubmissions(query: any): Promise<{
        data: {
            submissionId: string;
            productId: string;
            agentName: string;
            projectTitle: string;
            planType: import("../marketproduct/entities/marketproduct.entity").PlanType;
            projectValue: number;
            submissionDate: Date;
            status: string;
        }[];
        meta: {
            total: number;
        };
    }>;
    getProjectDetail(projectId: string): Promise<Order>;
    assignAgentToProject(projectId: string, agentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    approveCustomProject(submissionId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    rejectCustomProject(submissionId: string, reason?: string): Promise<{
        success: boolean;
        message: string;
        reason: string | undefined;
    }>;
    getReportsSummary(): Promise<{
        totalRevenue: number;
        customerPayments: number;
        agentPayouts: number;
        platformCommission: number;
        totalUsers: number;
        totalAgents: number;
        totalProducts: number;
        totalOrders: number;
    }>;
    getSystemHealth(): Promise<{
        status: string;
        apiStatus: string;
        uptime: string;
        uptimePercentage: string;
        uptimeSeconds: number;
        database: {
            status: string;
            connected: boolean;
            latencyMs: number;
            latency: string;
            type: string;
        };
        dbLoad: string;
        errors: string;
        healthScore: number;
        system: {
            nodeVersion: string;
            platform: NodeJS.Platform;
            memory: {
                heapUsedMB: number;
                heapTotalMB: number;
                rssMB: number;
            };
        };
        timestamp: string;
    }>;
    getProjectPerformance(): Promise<{
        total: number;
        completed: number;
        inProgress: number;
        disputed: number;
        cancelled: number;
        completionRate: number;
        totalOrders: number;
        completedOrders: number;
        inProgressOrders: number;
        totalAgents: number;
        approvedAgents: number;
        agentApprovalRate: number;
        totalProducts: number;
        approvedProducts: number;
        productApprovalRate: number;
        totalUsers: number;
        verifiedUsers: number;
        userVerificationRate: number;
    }>;
    getRevenueChart(): Promise<{
        data: {
            month: string;
            revenue: number;
            orderCount: number;
        }[];
    }>;
    getTopAgents(): Promise<{
        data: {
            id: string;
            name: string;
            email: string | null;
            avatar: string | null;
            rating: number;
            projectsCompleted: number;
            earnings: number;
            completionRate: string;
        }[];
    }>;
    getCustomerActivity(): Promise<{
        data: {
            id: string;
            userId: string;
            customer: string;
            email: string;
            action: string;
            status: string;
            amount: number;
            date: Date;
        }[];
    }>;
    private rolesStore;
    getRolesStats(): Promise<{
        totalRoles: number;
        activeStaff: number;
        departmentsCovered: number;
        customRolesCreated: number;
    }>;
    getAllRoles(): Promise<{
        data: any[];
        total: number;
    }>;
    createRole(dto: any): Promise<{
        success: boolean;
        role: any;
    }>;
    updateRole(roleId: string, dto: any): Promise<{
        success: boolean;
        role: any;
    }>;
    deleteRole(roleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getStaffList(): Promise<{
        data: {
            id: string;
            userId: string;
            name: string;
            email: string;
            role: string;
            isActive: boolean;
            createdAt: Date;
        }[];
        total: number;
    }>;
    assignRoleToStaff(userId: string, roleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getPermissionMatrix(): Promise<{
        permissions: string[];
        roles: string[];
        matrix: Record<string, number[]>;
    }>;
    getAdminProfile(adminId: string): Promise<any>;
    updateAdminProfile(adminId: string, dto: any): Promise<{
        success: boolean;
        message: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string | undefined;
            profilePics: string | undefined;
            address: UserAddress | undefined;
        };
    }>;
    changeAdminPassword(adminId: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
