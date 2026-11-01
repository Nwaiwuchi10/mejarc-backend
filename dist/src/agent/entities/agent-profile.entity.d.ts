import { Agent } from './agent.entity';
export declare enum ProfessionalTitle {
    ARCHITECT = "Architect",
    STRUCTURAL_ENGINEER = "Structural Engineer",
    MEP_ENGINEER = "MEP Engineer",
    ARCHITECTURAL_DESIGNER = "Architectural Designer",
    BIM_MODELLER = "BIM Modeller",
    LANDSCAPE_ARCHITECT = "Landscape Architect",
    PRODUCT_DESIGNER = "Product Designer"
}
export declare const TITLES_REQUIRING_LICENSE: ProfessionalTitle[];
export declare class AgentProfile {
    id: string;
    agent: Agent;
    agentId: string;
    yearsOfExperience?: number;
    preferredTitle?: ProfessionalTitle;
    licenseNumber?: string;
    specialization?: string[];
    portfolioLink?: string;
    profilePicture?: string;
    location?: string;
    responseTime?: string;
    completedProjectsCount: number;
    phoneNumber?: string;
    viewsCount: number;
    savesCount: number;
    inquiriesCount: number;
    createdAt: Date;
    updatedAt: Date;
}
