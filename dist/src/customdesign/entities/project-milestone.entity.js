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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectMilestone = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const customdesign_entity_1 = require("./customdesign.entity");
const customdesign_types_1 = require("../customdesign.types");
let ProjectMilestone = class ProjectMilestone {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, customDesignId: { required: true, type: () => String }, customDesign: { required: true, type: () => require("./customdesign.entity").CustomDesign }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, duration: { required: true, type: () => String }, dueDate: { required: true, type: () => Date }, status: { required: true, enum: require("../customdesign.types").MilestoneStatus }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.ProjectMilestone = ProjectMilestone;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProjectMilestone.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], ProjectMilestone.prototype, "customDesignId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => customdesign_entity_1.CustomDesign, { onDelete: 'CASCADE' }),
    (0, database_module_1.JoinColumn)({ name: 'customDesignId' }),
    __metadata("design:type", customdesign_entity_1.CustomDesign)
], ProjectMilestone.prototype, "customDesign", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ProjectMilestone.prototype, "title", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProjectMilestone.prototype, "description", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProjectMilestone.prototype, "duration", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ProjectMilestone.prototype, "dueDate", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: customdesign_types_1.MilestoneStatus,
        default: customdesign_types_1.MilestoneStatus.PENDING,
    }),
    __metadata("design:type", String)
], ProjectMilestone.prototype, "status", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProjectMilestone.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProjectMilestone.prototype, "updatedAt", void 0);
exports.ProjectMilestone = ProjectMilestone = __decorate([
    (0, database_module_1.Entity)('project_milestones')
], ProjectMilestone);
//# sourceMappingURL=project-milestone.entity.js.map