import { CustomDesign } from './customdesign.entity';
import { MilestoneStatus } from '../customdesign.types';
export declare class ProjectMilestone {
    id: string;
    customDesignId: string;
    customDesign: CustomDesign;
    title: string;
    description: string;
    duration: string;
    dueDate: Date;
    status: MilestoneStatus;
    createdAt: Date;
    updatedAt: Date;
}
