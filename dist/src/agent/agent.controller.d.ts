import { AgentService } from './agent.service';
import { AgentAnalyticsService } from './agent-analytics.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { CreateAgentBioDto } from './dto/create-agent-bio.dto';
import { PaginationDto } from '../utils/pagination.dto';
export declare class AgentController {
    private readonly agentService;
    private readonly analyticsService;
    constructor(agentService: AgentService, analyticsService: AgentAnalyticsService);
    getAnalytics(req: any): Promise<{
        overview: {
            activeProjects: number;
            pendingTasks: number;
            totalEarnings: number;
            payoutStatus: number;
        };
        portfolioEngagement: {
            views: number;
            saves: number;
            inquiries: number;
            viewsPreviousWeek: number;
        };
        revenueChart: {
            month: string;
            revenue: number;
        }[];
        projectStatus: {
            inProgress: number;
            revisionsNeeded: number;
            completed: number;
            cancelled: number;
        };
        notifications: import("../notification/entities/notification.entity").Notification[];
        projectEngagement: {
            totalViews: number;
            totalSaves: number;
            totalInquiries: number;
        };
    }>;
    getProjectCounts(req: any): Promise<{
        totalNewProjects: number;
        totalInProgressProjects: number;
        totalRevisionProjects: number;
        totalCompletedProjects: number;
    }>;
    getProjects(req: any): Promise<{
        newProjects: import("../customdesign").CustomDesign[];
        inProgressProjects: import("../customdesign").CustomDesign[];
        revisionProjects: import("../customdesign").CustomDesign[];
        completedProjects: import("../customdesign").CustomDesign[];
    }>;
    initializeAgent(userId: string): Promise<any>;
    submitProfile(userId: string, dto: string, file?: Express.Multer.File): Promise<import("./entities/agent.entity").Agent | null>;
    submitBio(agentId: string, bioDto: CreateAgentBioDto): Promise<import("./entities/agent.entity").Agent | null>;
    submitKyc(agentId: string, dto: string, files?: {
        idDocument?: Express.Multer.File[];
        architectCert?: Express.Multer.File[];
    }): Promise<import("./entities/agent.entity").Agent>;
    getAgentByUserId(userId: string): Promise<import("./entities/agent.entity").Agent>;
    getAgentStatus(agentId: string): Promise<{
        id: string;
        registrationStatus: import("./entities/agent.entity").AgentRegistrationStatus;
        kycStatus: import("./entities/agent.entity").AgentKycStatus;
        isApproved: boolean;
        approvedAt: Date | undefined;
        rejectionReason: string | undefined;
    }>;
    approveAgent(agentId: string, adminId: string): Promise<any>;
    rejectAgent(agentId: string, adminId: string, reason: string): Promise<any>;
    findAllPros(paginationDto: PaginationDto): Promise<{
        data: import("./dto/pro-overview.dto").ProOverviewDto[];
        meta: any;
    }>;
    getProById(id: string): Promise<import("./dto/pro-overview.dto").ProOverviewDto>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: import("./entities/agent.entity").Agent[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/agent.entity").Agent | null>;
    update(id: string, updateAgentDto: UpdateAgentDto): Promise<any>;
    remove(id: string): Promise<any>;
    create(createAgentDto: CreateAgentDto): Promise<any>;
}
