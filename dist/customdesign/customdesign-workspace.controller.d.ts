import { CustomDesignWorkspaceService } from './customdesign-workspace.service';
export declare class CustomDesignWorkspaceController {
    private readonly workspaceService;
    constructor(workspaceService: CustomDesignWorkspaceService);
    getWorkspace(req: any, id: string): Promise<{
        projectBrief: import(".").CustomDesign;
        milestones: import("./entities/project-milestone.entity").ProjectMilestone[];
        filesDeliverables: import("./entities/project-file.entity").ProjectFile[];
        activityLog: import("./entities/project-activity.entity").ProjectActivity[];
    }>;
    addMilestone(req: any, id: string, data: any): Promise<any>;
    updateMilestone(req: any, mId: string, data: any): Promise<any>;
    uploadFile(req: any, id: string, file: Express.Multer.File, isDeliverable: string): Promise<any>;
    getActivities(req: any, id: string, type?: string): Promise<import("./entities/project-activity.entity").ProjectActivity[]>;
}
