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
exports.AgentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agent_service_1 = require("./agent.service");
const agent_analytics_service_1 = require("./agent-analytics.service");
const create_agent_dto_1 = require("./dto/create-agent.dto");
const update_agent_dto_1 = require("./dto/update-agent.dto");
const create_agent_bio_dto_1 = require("./dto/create-agent-bio.dto");
const pagination_dto_1 = require("../utils/pagination.dto");
const user_guard_1 = require("../user/guard/user.guard");
const platform_express_1 = require("@nestjs/platform-express");
const aws_s3_config_1 = require("../utils/aws-s3.config");
const multerS3 = require("multer-s3");
let AgentController = class AgentController {
    constructor(agentService, analyticsService) {
        this.agentService = agentService;
        this.analyticsService = analyticsService;
    }
    getAnalytics(req) {
        const userId = req.userId;
        return this.analyticsService.getDashboardAnalytics(userId);
    }
    getProjectCounts(req) {
        const userId = req.userId;
        return this.analyticsService.getProjectCounts(userId);
    }
    getProjects(req) {
        const userId = req.userId;
        return this.analyticsService.getProjectsByCategory(userId);
    }
    async initializeAgent(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('userId is required');
        }
        return this.agentService.initializeAgent(userId);
    }
    async submitProfile(userId, dto, file) {
        if (!userId) {
            throw new common_1.BadRequestException('userId is required');
        }
        const parsedDto = dto ? JSON.parse(dto) : {};
        return this.agentService.submitProfile(userId, parsedDto, file);
    }
    async submitBio(agentId, bioDto) {
        if (!agentId) {
            throw new common_1.BadRequestException('agentId is required');
        }
        return this.agentService.submitBio(agentId, bioDto);
    }
    async submitKyc(agentId, dto, files) {
        if (!agentId) {
            throw new common_1.BadRequestException('agentId is required');
        }
        const parsedDto = dto ? JSON.parse(dto) : {};
        return this.agentService.submitKyc(agentId, parsedDto, files);
    }
    async getAgentByUserId(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('userId is required');
        }
        return this.agentService.getAgentByUserId(userId);
    }
    async getAgentStatus(agentId) {
        if (!agentId) {
            throw new common_1.BadRequestException('agentId is required');
        }
        return this.agentService.getAgentStatus(agentId);
    }
    async approveAgent(agentId, adminId) {
        if (!agentId || !adminId) {
            throw new common_1.BadRequestException('agentId and adminId are required');
        }
        return this.agentService.approveAgent(agentId, adminId);
    }
    async rejectAgent(agentId, adminId, reason) {
        if (!agentId || !adminId || !reason) {
            throw new common_1.BadRequestException('agentId, adminId, and reason are required');
        }
        return this.agentService.rejectAgent(agentId, adminId, reason);
    }
    findAllPros(paginationDto) {
        return this.agentService.findAllPros(paginationDto);
    }
    async getProById(id) {
        return this.agentService.findProById(id);
    }
    findAll(paginationDto) {
        return this.agentService.findAll(paginationDto);
    }
    findOne(id) {
        return this.agentService.findOne(id);
    }
    update(id, updateAgentDto) {
        return this.agentService.update(id, updateAgentDto);
    }
    remove(id) {
        return this.agentService.remove(id);
    }
    async create(createAgentDto) {
        const userId = createAgentDto.userId;
        if (!userId) {
            throw new common_1.BadRequestException('userId is required');
        }
        return this.agentService.create(userId, createAgentDto);
    }
};
exports.AgentController = AgentController;
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get agent dashboard analytics metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics statistics' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('project-counts'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get agent active and total project counts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project counts' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "getProjectCounts", null);
__decorate([
    (0, common_1.Get)('projects'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get agent projects grouped by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Projects by category' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "getProjects", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Initialize agent registration',
        description: 'Creates initial agent record for a user after signing up' }),
    (0, common_1.Post)('initialize/:userId'),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Agent initialized' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "initializeAgent", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Agent onboarding Step 1: Submit Profile',
        description: 'Submits agent personal/professional details with optional profile photo' }),
    (0, common_1.Post)(':userId/profile'),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                profilePicture: {
                    type: 'string',
                    format: 'binary',
                    description: 'Profile picture image file (max 100MB)',
                },
                dto: {
                    type: 'string',
                    description: 'JSON string of CreateAgentProfileDto',
                    example: '{"profession":"Architect","experience":5,"companyName":"Design Studio","address":{"street":"123 Main St","city":"Lagos","state":"Lagos","country":"Nigeria"}}',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile submitted successfully' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture', {
        storage: multerS3({
            s3: aws_s3_config_1.s3Client,
            bucket: aws_s3_config_1.AWS_S3_BUCKET_NAME,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                const sanitized = file.originalname
                    .replace(/\s+/g, '')
                    .replace(/[^a-zA-Z0-9.-]/g, '');
                cb(null, `agent-profile-pics/${Date.now()}-${sanitized}`);
            },
        }),
        limits: { fileSize: 100 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)('dto')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "submitProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Agent onboarding Step 2: Submit Bio & Specialization',
        description: 'Submits agent bio, headline, and specialization tags' }),
    (0, common_1.Patch)(':agentId/bio'),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'Agent ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bio updated' }),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_agent_bio_dto_1.CreateAgentBioDto]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "submitBio", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Agent onboarding Step 3: Submit KYC Documents',
        description: 'Uploads government ID and professional certificates for KYC verification' }),
    (0, common_1.Post)(':agentId/kyc'),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'Agent ID UUID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                idDocument: {
                    type: 'string',
                    format: 'binary',
                    description: 'Government ID document file',
                },
                architectCert: {
                    type: 'string',
                    format: 'binary',
                    description: 'Professional certificate document file',
                },
                dto: {
                    type: 'string',
                    description: 'JSON string of CreateAgentKycDto',
                    example: '{"idType":"NIN","idNumber":"12345678901","certNumber":"ARCH-9921"}',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KYC documents submitted' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'idDocument', maxCount: 1 },
        { name: 'architectCert', maxCount: 1 },
    ], {
        storage: multerS3({
            s3: aws_s3_config_1.s3Client,
            bucket: aws_s3_config_1.AWS_S3_BUCKET_NAME,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                const sanitized = file.originalname
                    .replace(/\s+/g, '')
                    .replace(/[^a-zA-Z0-9.-]/g, '');
                cb(null, `agent-kyc-documents/${Date.now()}-${sanitized}`);
            },
        }),
        limits: { fileSize: 100 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Body)('dto')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "submitKyc", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get agent profile by User ID' }),
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent profile details' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "getAgentByUserId", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get agent verification / registration status' }),
    (0, common_1.Get)('status/:agentId'),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'Agent ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current agent status' }),
    __param(0, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "getAgentStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Approve agent verification (Admin)' }),
    (0, common_1.Post)(':agentId/approve'),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'Agent ID UUID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: { adminId: { type: 'string', example: 'admin-uuid' } },
            required: ['adminId'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent approved' }),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Body)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "approveAgent", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reject agent verification (Admin)' }),
    (0, common_1.Post)(':agentId/reject'),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'Agent ID UUID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                adminId: { type: 'string', example: 'admin-uuid' },
                reason: { type: 'string', example: 'Document unreadable' },
            },
            required: ['adminId', 'reason'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent rejected' }),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Body)('adminId')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "rejectAgent", null);
__decorate([
    (0, common_1.Get)('pros'),
    (0, swagger_1.ApiOperation)({ summary: 'Find all verified professionals / agents' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of verified agents',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "findAllPros", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get single professional agent details for public profile' }),
    (0, common_1.Get)('pros/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Agent ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Professional profile details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "getProById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all agents (paginated)' }),
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of agents' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get agent by ID' }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Agent ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update agent details' }),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Agent ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_agent_dto_1.UpdateAgentDto]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete agent (soft delete)' }),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Agent ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent removed' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create agent (legacy endpoint)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Agent created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agent_dto_1.CreateAgentDto]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "create", null);
exports.AgentController = AgentController = __decorate([
    (0, swagger_1.ApiTags)('Agent'),
    (0, common_1.Controller)('agent'),
    __metadata("design:paramtypes", [agent_service_1.AgentService,
        agent_analytics_service_1.AgentAnalyticsService])
], AgentController);
//# sourceMappingURL=agent.controller.js.map