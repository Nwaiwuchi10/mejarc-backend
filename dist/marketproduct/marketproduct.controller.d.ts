import { MarketproductService } from './marketproduct.service';
import { CreateMarketproductDto } from './dto/create-marketproduct.dto';
import { UpdateMarketproductDto } from './dto/update-marketproduct.dto';
import { RateProductDto } from './dto/rate-product.dto';
import { MarketProductFilterDto } from './dto/marketproduct-filter.dto';
export declare class MarketproductController {
    private readonly marketproductService;
    constructor(marketproductService: MarketproductService);
    create(req: any, dto: CreateMarketproductDto, files: {
        productImage?: Express.Multer.File[];
        architecturalPlan?: Express.Multer.File[];
        structuralPlan?: Express.Multer.File[];
        electricalPlan?: Express.Multer.File[];
        mechanicalPlan?: Express.Multer.File[];
    }): Promise<any>;
    findAll(filterDto: MarketProductFilterDto): Promise<{
        data: import("./entities/marketproduct.entity").MarketProduct[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAllByAgent(agentId: string, filterDto: MarketProductFilterDto): Promise<{
        data: import("./entities/marketproduct.entity").MarketProduct[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/marketproduct.entity").MarketProduct>;
    update(id: string, updateMarketproductDto: UpdateMarketproductDto, files?: {
        productImage?: Express.Multer.File[];
        architecturalPlan?: Express.Multer.File[];
        structuralPlan?: Express.Multer.File[];
        electricalPlan?: Express.Multer.File[];
        mechanicalPlan?: Express.Multer.File[];
    }): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    rate(id: string, req: any, dto: RateProductDto): Promise<import("./entities/rating.entity").Rating | null>;
}
