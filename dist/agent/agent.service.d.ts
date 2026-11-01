import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { CreateAgentProfileDto } from './dto/create-agent-profile.dto';
import { CreateAgentBioDto } from './dto/create-agent-bio.dto';
import { CreateAgentKycDto } from './dto/create-agent-kyc.dto';
import { ProOverviewDto } from './dto/pro-overview.dto';
import { MarketProduct } from '../marketproduct/entities/marketproduct.entity';
import { Repository } from 'src/database/database.module';
import { Agent, AgentKycStatus, AgentRegistrationStatus } from './entities/agent.entity';
import { AgentProfile } from './entities/agent-profile.entity';
import { AgentBio } from './entities/agent-bio.entity';
import { AgentKyc } from './entities/agent-kyc.entity';
import { User } from '../user/entities/user.entity';
import { Admin } from '../admin/entities/admin.entity';
import { UverifyKycProvider } from './provider/uverify.provider';
import { AgentMailService } from './service/mail.service';
import { PaginationDto } from '../utils/pagination.dto';
import { NotificationService } from '../notification/notification.service';
export declare class AgentService {
    private agentRepo;
    private profileRepo;
    private bioRepo;
    private kycRepo;
    private userRepo;
    private adminRepo;
    private productRepo;
    private readonly kycProvider;
    private readonly mailService;
    private readonly notificationService;
    private readonly logger;
    constructor(agentRepo: Repository<Agent>, profileRepo: Repository<AgentProfile>, bioRepo: Repository<AgentBio>, kycRepo: Repository<AgentKyc>, userRepo: Repository<User>, adminRepo: Repository<Admin>, productRepo: Repository<MarketProduct>, kycProvider: UverifyKycProvider, mailService: AgentMailService, notificationService: NotificationService);
    initializeAgent(userId: string): Promise<any>;
    submitProfile(userId: string, profileDto: CreateAgentProfileDto, file?: Express.Multer.File): Promise<Agent | null>;
    submitBio(agentId: string, bioDto: CreateAgentBioDto): Promise<Agent | null>;
    submitKyc(agentId: string, kycDto: CreateAgentKycDto, files?: {
        idDocument?: Express.Multer.File[];
        architectCert?: Express.Multer.File[];
    }): Promise<Agent>;
    approveAgent(agentId: string, adminId: string): Promise<any>;
    rejectAgent(agentId: string, adminId: string, reason: string): Promise<any>;
    getAgentByUserId(userId: string): Promise<Agent>;
    getAgentStatus(agentId: string): Promise<{
        id: string;
        registrationStatus: AgentRegistrationStatus;
        kycStatus: AgentKycStatus;
        isApproved: boolean;
        approvedAt: Date | undefined;
        rejectionReason: string | undefined;
    }>;
    create(userId: string, dto: CreateAgentDto): Promise<any>;
    findAllPros(paginationDto: PaginationDto): Promise<{
        data: ProOverviewDto[];
        meta: any;
    }>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: Agent[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Agent | null>;
    update(id: string, dto: UpdateAgentDto): Promise<any>;
    remove(id: string): Promise<any>;
    addKycDocument(id: string, doc: {
        key: string;
        url: string;
        name?: string;
    }): Promise<any>;
    setKycStatus(id: string, status: AgentKycStatus): Promise<any>;
    findProById(id: string): Promise<ProOverviewDto>;
    private mapToProOverview;
}
