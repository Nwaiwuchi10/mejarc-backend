import { ProfessionalTitle } from '../entities/agent-profile.entity';
export declare class CreateAgentProfileDto {
    yearsOfExperience: number;
    preferredTitle: ProfessionalTitle;
    licenseNumber?: string;
    specialization: string[];
    portfolioLink?: string;
    profilePicture?: string;
    phoneNumber?: string;
    location?: string;
    responseTime?: string;
    completedProjectsCount?: number;
}
