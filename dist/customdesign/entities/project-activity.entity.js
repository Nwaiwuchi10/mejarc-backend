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
exports.ProjectActivity = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const customdesign_entity_1 = require("./customdesign.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const customdesign_types_1 = require("../customdesign.types");
let ProjectActivity = class ProjectActivity {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, customDesignId: { required: true, type: () => String }, customDesign: { required: true, type: () => require("./customdesign.entity").CustomDesign }, userId: { required: true, type: () => String }, user: { required: true, type: () => require("../../user/entities/user.entity").User }, type: { required: true, enum: require("../customdesign.types").ActivityType }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, metadata: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date } };
    }
};
exports.ProjectActivity = ProjectActivity;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProjectActivity.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], ProjectActivity.prototype, "customDesignId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => customdesign_entity_1.CustomDesign, { onDelete: 'CASCADE' }),
    (0, database_module_1.JoinColumn)({ name: 'customDesignId' }),
    __metadata("design:type", customdesign_entity_1.CustomDesign)
], ProjectActivity.prototype, "customDesign", void 0);
__decorate([
    (0, database_module_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], ProjectActivity.prototype, "userId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, database_module_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], ProjectActivity.prototype, "user", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: customdesign_types_1.ActivityType,
    }),
    __metadata("design:type", String)
], ProjectActivity.prototype, "type", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ProjectActivity.prototype, "title", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProjectActivity.prototype, "description", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ProjectActivity.prototype, "metadata", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProjectActivity.prototype, "createdAt", void 0);
exports.ProjectActivity = ProjectActivity = __decorate([
    (0, database_module_1.Entity)('project_activities')
], ProjectActivity);
//# sourceMappingURL=project-activity.entity.js.map