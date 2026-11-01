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
exports.CustomDesignWorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const customdesign_entity_1 = require("./entities/customdesign.entity");
const project_milestone_entity_1 = require("./entities/project-milestone.entity");
const project_activity_entity_1 = require("./entities/project-activity.entity");
const project_file_entity_1 = require("./entities/project-file.entity");
const agent_entity_1 = require("../agent/entities/agent.entity");
const admin_entity_1 = require("../admin/entities/admin.entity");
const customdesign_types_1 = require("./customdesign.types");
const notification_service_1 = require("../notification/notification.service");
let CustomDesignWorkspaceService = class CustomDesignWorkspaceService {
    constructor(designRepo, milestoneRepo, activityRepo, fileRepo, agentRepo, adminRepo, notificationService) {
        this.designRepo = designRepo;
        this.milestoneRepo = milestoneRepo;
        this.activityRepo = activityRepo;
        this.fileRepo = fileRepo;
        this.agentRepo = agentRepo;
        this.adminRepo = adminRepo;
        this.notificationService = notificationService;
    }
    async getWorkspace(userId, designId) {
        const design = await this.validateAccessAndGetDesign(userId, designId);
        const [milestones, files, activities] = await Promise.all([
            this.milestoneRepo.find({
                where: { customDesignId: designId },
                order: { dueDate: 'ASC' },
            }),
            this.fileRepo.find({
                where: { customDesignId: designId },
                order: { createdAt: 'DESC' },
            }),
            this.activityRepo.find({
                where: { customDesignId: designId },
                order: { createdAt: 'DESC' },
            }),
        ]);
        return {
            projectBrief: design,
            milestones,
            filesDeliverables: files,
            activityLog: activities,
        };
    }
    async addMilestone(userId, designId, data) {
        const design = await this.validateAccessAndGetDesign(userId, designId, true);
        const milestone = this.milestoneRepo.create({
            customDesignId: designId,
            title: data.title,
            description: data.description,
            duration: data.duration,
            dueDate: data.dueDate,
            status: data.status || customdesign_types_1.MilestoneStatus.PENDING,
        });
        const saved = await this.milestoneRepo.save(milestone);
        await this.logActivity(designId, userId, customdesign_types_1.ActivityType.MILESTONE, `New milestone created: ${saved.title}`, saved.description);
        return saved;
    }
    async updateMilestone(userId, milestoneId, data) {
        const milestone = await this.milestoneRepo.findOne({
            where: { id: milestoneId },
        });
        if (!milestone)
            throw new common_1.NotFoundException('Milestone not found');
        const design = await this.validateAccessAndGetDesign(userId, milestone.customDesignId, true);
        Object.assign(milestone, data);
        const saved = await this.milestoneRepo.save(milestone);
        if (data.status) {
            await this.logActivity(design.id, userId, data.status === customdesign_types_1.MilestoneStatus.COMPLETED
                ? customdesign_types_1.ActivityType.COMPLETED
                : customdesign_types_1.ActivityType.MILESTONE, `Milestone "${saved.title}" updated to ${saved.status}`);
        }
        return saved;
    }
    async uploadFile(userId, designId, fileData) {
        const design = await this.validateAccessAndGetDesign(userId, designId);
        const file = this.fileRepo.create({
            customDesignId: designId,
            uploadedById: userId,
            fileName: fileData.fileName,
            fileUrl: fileData.fileUrl,
            fileType: fileData.fileType,
            isDeliverable: fileData.isDeliverable ?? false,
        });
        const saved = await this.fileRepo.save(file);
        await this.logActivity(designId, userId, customdesign_types_1.ActivityType.UPLOAD, `File uploaded: ${saved.fileName}`, saved.fileUrl, { fileId: saved.id });
        return saved;
    }
    async logActivity(designId, userId, type, title, description, metadata) {
        const activity = this.activityRepo.create({
            customDesignId: designId,
            userId,
            type,
            title,
            description,
            metadata,
        });
        return this.activityRepo.save(activity);
    }
    async validateAccessAndGetDesign(userId, designId, requiresWrite = false) {
        const design = await this.designRepo.findOne({
            where: { id: designId },
            relations: ['user', 'agent', 'agent.user'],
        });
        if (!design)
            throw new common_1.NotFoundException('Project not found');
        const admin = await this.adminRepo.findOne({ where: { userId } });
        if (admin)
            return design;
        if (design.userId === userId) {
            if (requiresWrite)
                throw new common_1.ForbiddenException('Only agents or admins can modify project progress');
            return design;
        }
        const agent = await this.agentRepo.findOne({ where: { userId } });
        if (agent && design.agentId === agent.id) {
            const allowedStatuses = [
                customdesign_types_1.CustomDesignStatus.APPROVED,
                customdesign_types_1.CustomDesignStatus.COMPLETED,
                customdesign_types_1.CustomDesignStatus.REVISION,
            ];
            if (!allowedStatuses.includes(design.status)) {
                throw new common_1.ForbiddenException('Access denied. You must accept the project first.');
            }
            return design;
        }
        throw new common_1.ForbiddenException('You do not have permission to access this workspace');
    }
};
exports.CustomDesignWorkspaceService = CustomDesignWorkspaceService;
exports.CustomDesignWorkspaceService = CustomDesignWorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(customdesign_entity_1.CustomDesign)),
    __param(1, (0, database_module_1.InjectRepository)(project_milestone_entity_1.ProjectMilestone)),
    __param(2, (0, database_module_1.InjectRepository)(project_activity_entity_1.ProjectActivity)),
    __param(3, (0, database_module_1.InjectRepository)(project_file_entity_1.ProjectFile)),
    __param(4, (0, database_module_1.InjectRepository)(agent_entity_1.Agent)),
    __param(5, (0, database_module_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, notification_service_1.NotificationService])
], CustomDesignWorkspaceService);
//# sourceMappingURL=customdesign-workspace.service.js.map