import { Agent } from '../../agent/entities/agent.entity';
import { Rating } from './rating.entity';
export declare enum ProductCategory {
    BUILDING_PLAN = "Building Plan",
    INTERIOR_DESIGN = "Product Design",
    LANDSCAPE_DESIGN = "Building Guide"
}
export declare enum PlanType {
    RESIDENTIAL = "Residential",
    COMMERCIAL = "Commercial",
    INDUSTRIAL = "Industrial"
}
export declare enum FileTypeOption {
    PDF_ONLY = "PDF only",
    CAD_PDF = "CAD + PDF",
    THREE_D_CAD_PDF = "3D Model + CAD + PDF"
}
export declare enum MarketProductStatus {
    PENDING_REVIEW = "pending_review",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class MarketProduct {
    id: string;
    productId: string;
    title: string;
    category: ProductCategory;
    planType: PlanType;
    numBedrooms?: string;
    numBathrooms?: string;
    numFloors?: string;
    price: number;
    description: string;
    area?: string;
    designStyle?: string;
    fileType: FileTypeOption;
    drawingSet?: string[];
    addOns?: string[];
    productImage?: string[];
    architecturalPlan?: string[];
    structuralPlan?: string[];
    electricalPlan?: string[];
    mechanicalPlan?: string[];
    architecturalPlanFileType?: string;
    structuralPlanFileType?: string;
    electricalPlanFileType?: string;
    mechanicalPlanFileType?: string;
    status: MarketProductStatus;
    ratings: Rating[];
    averageRating: number;
    ratingCount: number;
    agent: Agent;
    agentId: string;
    createdAt: Date;
    updatedAt: Date;
}
