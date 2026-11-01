import { Repository } from 'src/database/database.module';
import { CustomDesign } from './entities/customdesign.entity';
import { InitializeCustomDesignDto, SaveStepDto, SubmitCustomDesignDto, UpdateCustomDesignDto, ListCustomDesignsQueryDto, CustomDesignResponseDto } from './dto/customdesign.dto';
import { ServiceType, SelectionMethod } from './customdesign.types';
import { CustomDesignPayment } from './entities/custom-design-payment.entity';
import { SetAgreedPriceDto } from './dto/set-agreed-price.dto';
import { WalletService } from '../wallet/wallet.service';
import { NotificationService } from '../notification/notification.service';
import { Admin } from '../admin/entities/admin.entity';
import { ConfigService } from '@nestjs/config';
export declare class CustomDesignService {
    private readonly repo;
    private readonly paymentRepo;
    private readonly adminRepo;
    private readonly walletService;
    private readonly notificationService;
    private readonly configService;
    private readonly PAYSTACK_INIT_URL;
    private readonly PAYSTACK_VERIFY_URL;
    constructor(repo: Repository<CustomDesign>, paymentRepo: Repository<CustomDesignPayment>, adminRepo: Repository<Admin>, walletService: WalletService, notificationService: NotificationService, configService: ConfigService);
    initialize(userId: string, dto: InitializeCustomDesignDto, agentId?: string): Promise<CustomDesignResponseDto>;
    createAndSubmit(userId: string, dto: SubmitCustomDesignDto, contextAgentId?: string, files?: Express.Multer.File[]): Promise<CustomDesignResponseDto>;
    saveStep(id: string, userId: string, dto: SaveStepDto, files?: Express.Multer.File[]): Promise<CustomDesignResponseDto>;
    update(id: string, userId: string, dto: UpdateCustomDesignDto, files?: Express.Multer.File[]): Promise<CustomDesignResponseDto>;
    submit(id: string, userId: string, dto?: Partial<SubmitCustomDesignDto>, files?: Express.Multer.File[]): Promise<CustomDesignResponseDto>;
    findById(id: string): Promise<CustomDesignResponseDto>;
    findMyDesigns(userId: string, query: ListCustomDesignsQueryDto): Promise<{
        data: CustomDesignResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByAgent(agentId: string, query: ListCustomDesignsQueryDto): Promise<{
        data: CustomDesignResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByUser(userId: string, query: ListCustomDesignsQueryDto): Promise<{
        data: CustomDesignResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    delete(id: string, userId: string): Promise<void>;
    getServiceConfig(serviceType: ServiceType): import("./customdesign.types").ServiceConfig;
    mapCategoryToServiceType(category: string): ServiceType;
    mapMethodToSelectionMethod(method: string): SelectionMethod;
    private extractS3Urls;
    validateStepData(serviceType: ServiceType, step: number, data: Record<string, any>): Promise<{
        isValid: boolean;
        errors?: string[];
    }>;
    approve(id: string, notes?: string): Promise<CustomDesignResponseDto>;
    reject(id: string, reason?: string): Promise<CustomDesignResponseDto>;
    agentApprove(id: string, userId: string, notes?: string): Promise<CustomDesignResponseDto>;
    agentReject(id: string, userId: string, reason?: string): Promise<CustomDesignResponseDto>;
    private getOwnedDesign;
    private assertEditable;
    private validateSubmissionFields;
    computeEstimate(design: Partial<CustomDesign>): {
        estimateCost: number;
        estimateTimeline: string;
    };
    private paginatedQuery;
    private toResponse;
    setAgreedPrice(id: string, userId: string, dto: SetAgreedPriceDto): Promise<{
        message: string;
        payment: CustomDesignPayment | null;
    }>;
    confirmAgreedPrice(id: string, agentUserId: string): Promise<{
        message: string;
        payment: CustomDesignPayment;
    }>;
    initializePayment(id: string, userId: string): Promise<any>;
    verifyPayment(reference: string): Promise<{
        message: string;
        payment: any;
    }>;
}
