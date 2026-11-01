import { CustomDesign } from './customdesign.entity';
import { User } from '../../user/entities/user.entity';
export declare class ProjectFile {
    id: string;
    customDesignId: string;
    customDesign: CustomDesign;
    uploadedById: string;
    uploadedBy: User;
    fileName: string;
    fileUrl: string;
    fileType: string;
    isDeliverable: boolean;
    createdAt: Date;
}
