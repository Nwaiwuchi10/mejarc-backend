import { CustomDesign } from './customdesign.entity';
import { User } from '../../user/entities/user.entity';
import { ActivityType } from '../customdesign.types';
export declare class ProjectActivity {
    id: string;
    customDesignId: string;
    customDesign: CustomDesign;
    userId: string;
    user: User;
    type: ActivityType;
    title: string;
    description: string;
    metadata: any;
    createdAt: Date;
}
