"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketproductController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const marketproduct_service_1 = require("./marketproduct.service");
const create_marketproduct_dto_1 = require("./dto/create-marketproduct.dto");
const update_marketproduct_dto_1 = require("./dto/update-marketproduct.dto");
const rate_product_dto_1 = require("./dto/rate-product.dto");
const agent_auth_guard_1 = require("../agent/guards/agent-auth.guard");
const user_guard_1 = require("../user/guard/user.guard");
const platform_express_1 = require("@nestjs/platform-express");
const aws_s3_config_1 = require("../utils/aws-s3.config");
const marketproduct_filter_dto_1 = require("./dto/marketproduct-filter.dto");
let MarketproductController = class MarketproductController {
    constructor(marketproductService) {
        this.marketproductService = marketproductService;
    }
    async create(req, dto, files) {
        const agentId = req.agentId;
        return this.marketproductService.create(agentId, dto, files);
    }
    findAll(filterDto) {
        return this.marketproductService.findAll(filterDto);
    }
    findAllByAgent(agentId, filterDto) {
        return this.marketproductService.findAllByAgent(agentId, filterDto);
    }
    findOne(id) {
        return this.marketproductService.findOne(id);
    }
    update(id, updateMarketproductDto, files) {
        return this.marketproductService.update(id, updateMarketproductDto, files);
    }
    remove(id) {
        return this.marketproductService.remove(id);
    }
    rate(id, req, dto) {
        const userId = req.userId;
        return this.marketproductService.rateProduct(userId, id, dto);
    }
};
exports.MarketproductController = MarketproductController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new marketplace design product listing (Agent only)',
        description: 'Uploads product metadata alongside architecture, structural, electrical, and mechanical plan files' }),
    (0, common_1.UseGuards)(agent_auth_guard_1.AgentAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Modern 4-Bedroom Duplex' },
                description: {
                    type: 'string',
                    example: 'Contemporary architectural design with complete structural calculations.',
                },
                price: { type: 'number', example: 150000 },
                category: { type: 'string', example: 'Residential' },
                subCategory: { type: 'string', example: 'Duplex' },
                productImage: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Product preview photos / 3D renders',
                },
                architecturalPlan: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Architectural blueprints / CAD / PDF files',
                },
                structuralPlan: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Structural engineering drawings',
                },
                electricalPlan: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Electrical layout plans',
                },
                mechanicalPlan: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Mechanical / plumbing plans',
                },
            },
            required: ['title', 'price'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Marketplace product listed successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Agent token required',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'productImage', maxCount: 10 },
        { name: 'architecturalPlan', maxCount: 10 },
        { name: 'structuralPlan', maxCount: 10 },
        { name: 'electricalPlan', maxCount: 10 },
        { name: 'mechanicalPlan', maxCount: 10 },
    ], {
        storage: (0, aws_s3_config_1.createS3Storage)('market-products'),
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_marketproduct_dto_1.CreateMarketproductDto, Object]),
    __metadata("design:returntype", Promise)
], MarketproductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Search and filter marketplace products',
        description: 'Retrieve marketplace products with filters for category, price range, search keywords, and pagination',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Filtered marketplace product listing',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [marketproduct_filter_dto_1.MarketProductFilterDto]),
    __metadata("design:returntype", void 0)
], MarketproductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('agent/:agentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all marketplace products published by an agent',
    }),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'Agent ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent product listing' }),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, marketproduct_filter_dto_1.MarketProductFilterDto]),
    __metadata("design:returntype", void 0)
], MarketproductController.prototype, "findAllByAgent", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get marketplace product details by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketproductController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(agent_auth_guard_1.AgentAuthGuard),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update marketplace product (Agent owner only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product ID UUID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product updated' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'productImage', maxCount: 10 },
        { name: 'architecturalPlan', maxCount: 10 },
        { name: 'structuralPlan', maxCount: 10 },
        { name: 'electricalPlan', maxCount: 10 },
        { name: 'mechanicalPlan', maxCount: 10 },
    ], {
        storage: (0, aws_s3_config_1.createS3Storage)('market-products'),
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_marketproduct_dto_1.UpdateMarketproductDto, Object]),
    __metadata("design:returntype", void 0)
], MarketproductController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(agent_auth_guard_1.AgentAuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete marketplace product (Agent owner only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketproductController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Post)(':id/rate'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Rate and review a marketplace product' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review submitted' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, rate_product_dto_1.RateProductDto]),
    __metadata("design:returntype", void 0)
], MarketproductController.prototype, "rate", null);
exports.MarketproductController = MarketproductController = __decorate([
    (0, swagger_1.ApiTags)('Marketplace Product'),
    (0, common_1.Controller)('marketproduct'),
    __metadata("design:paramtypes", [marketproduct_service_1.MarketproductService])
], MarketproductController);
//# sourceMappingURL=marketproduct.controller.js.map