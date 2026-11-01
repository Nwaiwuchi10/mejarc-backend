import { Repository } from 'src/database/database.module';
import { CreateMarketproductDto } from './dto/create-marketproduct.dto';
import { UpdateMarketproductDto } from './dto/update-marketproduct.dto';
import { MarketProduct } from './entities/marketproduct.entity';
import { Rating } from './entities/rating.entity';
import { Agent } from '../agent/entities/agent.entity';
import { RateProductDto } from './dto/rate-product.dto';
import { MarketProductMailService } from './service/mail.service';
import { MarketProductFilterDto } from './dto/marketproduct-filter.dto';
import { NotificationService } from '../notification/notification.service';
export declare class MarketproductService {
    private readonly productRepo;
    private readonly agentRepo;
    private readonly ratingRepo;
    private readonly mailService;
    private readonly notificationService;
    constructor(productRepo: Repository<MarketProduct>, agentRepo: Repository<Agent>, ratingRepo: Repository<Rating>, mailService: MarketProductMailService, notificationService: NotificationService);
    create(agentId: string, dto: CreateMarketproductDto, files?: {
        productImage?: Express.Multer.File[];
        architecturalPlan?: Express.Multer.File[];
        structuralPlan?: Express.Multer.File[];
        electricalPlan?: Express.Multer.File[];
        mechanicalPlan?: Express.Multer.File[];
    }): Promise<any>;
    findAll(filterDto: MarketProductFilterDto): Promise<{
        data: MarketProduct[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAllByAgent(agentId: string, filterDto: MarketProductFilterDto): Promise<{
        data: MarketProduct[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<MarketProduct>;
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
    rateProduct(userId: string, productId: string, dto: RateProductDto): Promise<Rating | null>;
}
