import { CustomDesignService } from './customdesign.service';
import { InitializeCustomDesignDto, SaveStepDto, SubmitCustomDesignDto, UpdateCustomDesignDto, ListCustomDesignsQueryDto, CustomDesignResponseDto, ReviewCustomDesignDto } from './dto/customdesign.dto';
import { SetAgreedPriceDto } from './dto/set-agreed-price.dto';
export declare class CustomDesignController {
    private readonly service;
    constructor(service: CustomDesignService);
    initialize(req: any, dto: InitializeCustomDesignDto): Promise<CustomDesignResponseDto>;
    createAndSubmit(req: any, dto: SubmitCustomDesignDto, files?: Express.Multer.File[]): Promise<CustomDesignResponseDto>;
    getMyDesigns(req: any, query: ListCustomDesignsQueryDto): Promise<{
        data: CustomDesignResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    getServiceConfig(serviceType: string): import("./customdesign.types").ServiceConfig;
    getByUser(userId: string, query: ListCustomDesignsQueryDto): Promise<{
        data: CustomDesignResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    getByAgent(agentId: string, query: ListCustomDesignsQueryDto): Promise<{
        data: CustomDesignResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    getById(id: string): Promise<CustomDesignResponseDto>;
    saveStep(req: any, id: string, dto: SaveStepDto, files?: Express.Multer.File[]): Promise<CustomDesignResponseDto>;
    submit(req: any, id: string, dto?: Partial<SubmitCustomDesignDto>, files?: Express.Multer.File[]): Promise<CustomDesignResponseDto>;
    validateStep(id: string, body: {
        step: number;
        data: Record<string, any>;
    }): Promise<{
        isValid: boolean;
        errors?: string[];
    }>;
    update(req: any, id: string, dto: UpdateCustomDesignDto, files?: Express.Multer.File[]): Promise<CustomDesignResponseDto>;
    delete(req: any, id: string): Promise<void>;
    approve(id: string, dto?: ReviewCustomDesignDto): Promise<CustomDesignResponseDto>;
    reject(id: string, dto?: ReviewCustomDesignDto): Promise<CustomDesignResponseDto>;
    agentApprove(req: any, id: string, dto?: ReviewCustomDesignDto): Promise<CustomDesignResponseDto>;
    agentReject(req: any, id: string, dto?: ReviewCustomDesignDto): Promise<CustomDesignResponseDto>;
    setAgreedPrice(req: any, id: string, dto: SetAgreedPriceDto): Promise<{
        message: string;
        payment: import("./entities/custom-design-payment.entity").CustomDesignPayment | null;
    }>;
    confirmAgreedPrice(req: any, id: string): Promise<{
        message: string;
        payment: import("./entities/custom-design-payment.entity").CustomDesignPayment;
    }>;
    initializePayment(req: any, id: string): Promise<any>;
    verifyPayment(reference: string): Promise<{
        message: string;
        payment: any;
    }>;
}
