import { PaginationDto } from '../../utils/pagination.dto';
import { PlanType, MarketProductStatus } from '../entities/marketproduct.entity';
export declare class MarketProductFilterDto extends PaginationDto {
    planType?: PlanType;
    category?: string;
    status?: MarketProductStatus;
    buildingGuides?: string;
    numBedrooms?: string;
    numBathrooms?: string;
    numFloors?: string;
    area?: string;
    designStyle?: string;
    minPrice?: number;
    maxPrice?: number;
}
