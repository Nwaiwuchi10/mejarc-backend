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
exports.CustomDesignController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const customdesign_service_1 = require("./customdesign.service");
const customdesign_dto_1 = require("./dto/customdesign.dto");
const customdesign_types_1 = require("./customdesign.types");
const user_guard_1 = require("../user/guard/user.guard");
const aws_s3_config_1 = require("../utils/aws-s3.config");
const set_agreed_price_dto_1 = require("./dto/set-agreed-price.dto");
let CustomDesignController = class CustomDesignController {
    constructor(service) {
        this.service = service;
    }
    async initialize(req, dto) {
        const userId = req.userId;
        const agentId = req.agentId ?? undefined;
        return this.service.initialize(userId, dto, agentId);
    }
    async createAndSubmit(req, dto, files) {
        const userId = req.userId;
        const agentId = req.agentId ?? undefined;
        return this.service.createAndSubmit(userId, dto, agentId, files);
    }
    async getMyDesigns(req, query) {
        const userId = req.userId;
        return this.service.findMyDesigns(userId, query);
    }
    getServiceConfig(serviceType) {
        const valid = Object.values(customdesign_types_1.ServiceType).includes(serviceType);
        if (!valid)
            throw new common_1.BadRequestException(`Invalid service type: "${serviceType}"`);
        return this.service.getServiceConfig(serviceType);
    }
    async getByUser(userId, query) {
        return this.service.findByUser(userId, query);
    }
    async getByAgent(agentId, query) {
        return this.service.findByAgent(agentId, query);
    }
    async getById(id) {
        return this.service.findById(id);
    }
    async saveStep(req, id, dto, files) {
        const userId = req.userId;
        return this.service.saveStep(id, userId, dto, files);
    }
    async submit(req, id, dto, files) {
        const userId = req.userId;
        return this.service.submit(id, userId, dto, files);
    }
    async validateStep(id, body) {
        const design = await this.service.findById(id);
        return this.service.validateStepData(design.serviceType, body.step, body.data);
    }
    async update(req, id, dto, files) {
        const userId = req.userId;
        return this.service.update(id, userId, dto, files);
    }
    async delete(req, id) {
        const userId = req.userId;
        return this.service.delete(id, userId);
    }
    async approve(id, dto) {
        return this.service.approve(id, dto?.notes);
    }
    async reject(id, dto) {
        return this.service.reject(id, dto?.notes);
    }
    async agentApprove(req, id, dto) {
        const userId = req.userId;
        return this.service.agentApprove(id, userId, dto?.notes);
    }
    async agentReject(req, id, dto) {
        const userId = req.userId;
        return this.service.agentReject(id, userId, dto?.notes);
    }
    async setAgreedPrice(req, id, dto) {
        const userId = req.userId;
        return this.service.setAgreedPrice(id, userId, dto);
    }
    async confirmAgreedPrice(req, id) {
        const userId = req.userId;
        return this.service.confirmAgreedPrice(id, userId);
    }
    async initializePayment(req, id) {
        const userId = req.userId;
        return this.service.initializePayment(id, userId);
    }
    async verifyPayment(reference) {
        return this.service.verifyPayment(reference);
    }
};
exports.CustomDesignController = CustomDesignController;
__decorate([
    (0, common_1.Post)('initialize'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Step 1: Initialize a new custom design wizard session',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Custom design session initialized',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customdesign_dto_1.InitializeCustomDesignDto]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "initialize", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'One-shot submission: Complete wizard and submit custom design project',
        description: 'Uploads all wizard steps and optional reference files at once',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Custom design project submitted' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, aws_s3_config_1.createS3Storage)('custom-designs'),
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customdesign_dto_1.SubmitCustomDesignDto, Array]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "createAndSubmit", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user custom design projects' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of user custom designs' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customdesign_dto_1.ListCustomDesignsQueryDto]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "getMyDesigns", null);
__decorate([
    (0, common_1.Get)('config/:serviceType'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get dynamic wizard configuration for a service type (Public)',
        description: 'Returns available options, building contexts, scopes, and validation rules for the given service type',
    }),
    (0, swagger_1.ApiParam)({
        name: 'serviceType',
        description: 'Service type enum e.g. Architectural, Structural, MEP, Interior',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service configuration returned' }),
    __param(0, (0, common_1.Param)('serviceType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomDesignController.prototype, "getServiceConfig", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get custom designs by user ID (Admin/Staff)' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom design list' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customdesign_dto_1.ListCustomDesignsQueryDto]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "getByUser", null);
__decorate([
    (0, common_1.Get)('agent/:agentId'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get custom designs assigned to an agent' }),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'Agent ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom design list' }),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customdesign_dto_1.ListCustomDesignsQueryDto]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "getByAgent", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get custom design project details by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom design project details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id/step'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Save progress for a specific wizard step' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Step data saved' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, aws_s3_config_1.createS3Storage)('custom-designs'),
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, customdesign_dto_1.SaveStepDto, Array]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "saveStep", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Finalize and submit a saved draft project' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Draft submitted successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, aws_s3_config_1.createS3Storage)('custom-designs'),
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Array]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/validate-step'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Validate single step payload against service rules',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Step validation status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "validateStep", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update custom design draft' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom design updated' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, aws_s3_config_1.createS3Storage)('custom-designs'),
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, customdesign_dto_1.UpdateCustomDesignDto, Array]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete custom design project' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Custom design deleted' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin approve custom design proposal' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Approved' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customdesign_dto_1.ReviewCustomDesignDto]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin reject custom design proposal' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rejected' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customdesign_dto_1.ReviewCustomDesignDto]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/agent-approve'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Agent accept assigned custom design project' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent accepted' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, customdesign_dto_1.ReviewCustomDesignDto]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "agentApprove", null);
__decorate([
    (0, common_1.Post)(':id/agent-reject'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Agent decline assigned custom design project' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent declined' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, customdesign_dto_1.ReviewCustomDesignDto]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "agentReject", null);
__decorate([
    (0, common_1.Post)(':id/agreed-price'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Set agreed price for custom design' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agreed price proposed' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, set_agreed_price_dto_1.SetAgreedPriceDto]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "setAgreedPrice", null);
__decorate([
    (0, common_1.Post)(':id/confirm-price'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Customer confirms the agreed price' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agreed price confirmed' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "confirmAgreedPrice", null);
__decorate([
    (0, common_1.Post)(':id/initialize-payment'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Initialize Paystack payment for custom design agreed price',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Payment initialized with reference',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "initializePayment", null);
__decorate([
    (0, common_1.Get)('verify-payment'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify custom design payment reference' }),
    (0, swagger_1.ApiQuery)({ name: 'reference', description: 'Paystack payment reference' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment verified' }),
    __param(0, (0, common_1.Query)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomDesignController.prototype, "verifyPayment", null);
exports.CustomDesignController = CustomDesignController = __decorate([
    (0, swagger_1.ApiTags)('Custom Design'),
    (0, common_1.Controller)('custom-design'),
    __metadata("design:paramtypes", [customdesign_service_1.CustomDesignService])
], CustomDesignController);
//# sourceMappingURL=customdesign.controller.js.map