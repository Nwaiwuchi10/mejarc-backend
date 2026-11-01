import { ProductCategory, PlanType, FileTypeOption } from '../entities/marketproduct.entity';
export declare class CreateMarketproductDto {
    title: string;
    category: ProductCategory;
    planType: PlanType;
    numBedrooms?: string;
    numBathrooms?: string;
    numFloors?: string;
    area?: string;
    price: number;
    description: string;
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
}
