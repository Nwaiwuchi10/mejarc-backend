import { ServiceType, SelectionMethod, CustomDesignStatus } from '../customdesign.types';
export declare class InitializeCustomDesignDto {
    serviceType: ServiceType;
    serviceContext: string;
    selectionMethod?: SelectionMethod;
}
export declare class SaveStepDto {
    step: number;
    data: Record<string, any>;
}
export declare class SubmitCustomDesignDto {
    agentId?: string;
    serviceType: ServiceType;
    serviceContext: string;
    projectType?: string;
    scopeDeliverables?: string[];
    sizeComplexity?: string;
    style?: string;
    budget?: number;
    timeline?: string;
    additionalInformation?: string;
    attachedFiles?: string[];
    selectionMethod?: SelectionMethod;
}
export declare class UpdateCustomDesignDto {
    serviceType?: ServiceType;
    serviceContext?: string;
    projectType?: string;
    scopeDeliverables?: string[];
    sizeComplexity?: string;
    style?: string;
    budget?: number;
    timeline?: string;
    additionalInformation?: string;
    attachedFiles?: string[];
}
export declare class ListCustomDesignsQueryDto {
    serviceType?: ServiceType;
    status?: CustomDesignStatus;
    page?: number;
    limit?: number;
}
export declare class ReviewCustomDesignDto {
    notes?: string;
}
export declare class CustomDesignResponseDto {
    id: string;
    userId: string;
    user?: any;
    agentId?: string;
    agent?: any;
    serviceType: ServiceType;
    selectionMethod: SelectionMethod;
    serviceContext: string;
    projectType?: string;
    scopeDeliverables: string[];
    sizeComplexity?: string;
    style?: string;
    budget?: number;
    timeline?: string;
    additionalInformation?: string;
    attachedFiles: string[];
    currentStep: number;
    status: CustomDesignStatus;
    isSubmitted: boolean;
    submittedAt?: Date;
    estimateCost?: number;
    estimateTimeline?: string;
    estimateNotes?: string;
    payment?: any;
    createdAt: Date;
    updatedAt: Date;
}
