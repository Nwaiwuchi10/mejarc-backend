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
exports.CustomDesignWorkspaceController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customdesign_workspace_service_1 = require("./customdesign-workspace.service");
const user_guard_1 = require("../user/guard/user.guard");
const platform_express_1 = require("@nestjs/platform-express");
const aws_s3_config_1 = require("../utils/aws-s3.config");
let CustomDesignWorkspaceController = class CustomDesignWorkspaceController {
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
    }
    async getWorkspace(req, id) {
        return this.workspaceService.getWorkspace(req.userId, id);
    }
    async addMilestone(req, id, data) {
        return this.workspaceService.addMilestone(req.userId, id, data);
    }
    async updateMilestone(req, mId, data) {
        return this.workspaceService.updateMilestone(req.userId, mId, data);
    }
    async uploadFile(req, id, file, isDeliverable) {
        const fileUrl = file.location;
        return this.workspaceService.uploadFile(req.userId, id, {
            fileName: file.originalname,
            fileUrl,
            fileType: file.mimetype.split('/')[1]?.toUpperCase(),
            isDeliverable: isDeliverable === 'true',
        });
    }
    async getActivities(req, id, type) {
        await this.workspaceService.validateAccessAndGetDesign(req.userId, id);
        return this.workspaceService.getWorkspace(req.userId, id).then((w) => {
            if (!type || type === 'all')
                return w.activityLog;
            return w.activityLog.filter((a) => a.type === type);
        });
    }
};
exports.CustomDesignWorkspaceController = CustomDesignWorkspaceController;
__decorate([
    (0, common_1.Get)(':id/workspace'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get workspace overview, milestones, files, and activity logs',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace data' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomDesignWorkspaceController.prototype, "getWorkspace", null);
__decorate([
    (0, common_1.Post)(':id/milestones'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a milestone for the custom design project' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Schematic Design & Floor Plans' },
                description: {
                    type: 'string',
                    example: 'Initial architectural drawings and layouts',
                },
                dueDate: { type: 'string', format: 'date-time' },
                amount: { type: 'number', example: 50000 },
            },
            required: ['title'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Milestone created' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CustomDesignWorkspaceController.prototype, "addMilestone", null);
__decorate([
    (0, common_1.Patch)('milestones/:mId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update milestone status / progress' }),
    (0, swagger_1.ApiParam)({ name: 'mId', description: 'Milestone UUID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                status: { type: 'string', example: 'COMPLETED' },
                progress: { type: 'number', example: 100 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Milestone updated' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('mId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CustomDesignWorkspaceController.prototype, "updateMilestone", null);
__decorate([
    (0, common_1.Post)(':id/files'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload a deliverable or project attachment to workspace',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Project deliverable or CAD/PDF file',
                },
                isDeliverable: {
                    type: 'string',
                    example: 'true',
                    description: 'Boolean flag string indicating if file is a final deliverable',
                },
            },
            required: ['file'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'File uploaded' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, aws_s3_config_1.createS3Storage)('project-deliverables'),
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)('isDeliverable')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, String]),
    __metadata("design:returntype", Promise)
], CustomDesignWorkspaceController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(':id/activities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get activity logs for the project workspace' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Custom Design ID UUID' }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        description: 'Filter activity type (or "all")',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace activity logs' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CustomDesignWorkspaceController.prototype, "getActivities", null);
exports.CustomDesignWorkspaceController = CustomDesignWorkspaceController = __decorate([
    (0, swagger_1.ApiTags)('Custom Design Workspace'),
    (0, common_1.Controller)('custom-design'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [customdesign_workspace_service_1.CustomDesignWorkspaceService])
], CustomDesignWorkspaceController);
//# sourceMappingURL=customdesign-workspace.controller.js.map