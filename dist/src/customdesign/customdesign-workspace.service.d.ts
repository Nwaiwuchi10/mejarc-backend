import { Repository } from 'src/database/database.module';
import { CustomDesign } from './entities/customdesign.entity';
import { ProjectMilestone } from './entities/project-milestone.entity';
import { ProjectActivity } from './entities/project-activity.entity';
import { ProjectFile } from './entities/project-file.entity';
import { Agent } from '../agent/entities/agent.entity';
import { Admin } from '../admin/entities/admin.entity';
import { ActivityType } from './customdesign.types';
import { NotificationService } from '../notification/notification.service';
export declare class CustomDesignWorkspaceService {
    private readonly designRepo;
    private readonly milestoneRepo;
    private readonly activityRepo;
    private readonly fileRepo;
    private readonly agentRepo;
    private readonly adminRepo;
    private readonly notificationService;
    constructor(designRepo: Repository<CustomDesign>, milestoneRepo: Repository<ProjectMilestone>, activityRepo: Repository<ProjectActivity>, fileRepo: Repository<ProjectFile>, agentRepo: Repository<Agent>, adminRepo: Repository<Admin>, notificationService: NotificationService);
    getWorkspace(userId: string, designId: string): Promise<{
        projectBrief: CustomDesign;
        milestones: ProjectMilestone[];
        filesDeliverables: ProjectFile[];
        activityLog: ProjectActivity[];
    }>;
    addMilestone(userId: string, designId: string, data: any): Promise<any>;
    updateMilestone(userId: string, milestoneId: string, data: any): Promise<any>;
    uploadFile(userId: string, designId: string, fileData: {
        fileName: string;
        fileUrl: string;
        fileType?: string;
        isDeliverable?: boolean;
    }): Promise<any>;
    logActivity(designId: string, userId: string, type: ActivityType, title: string, description?: string, metadata?: any): Promise<any>;
    validateAccessAndGetDesign(userId: string, designId: string, requiresWrite?: boolean): Promise<CustomDesign>;
}
