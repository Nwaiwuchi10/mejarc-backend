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
exports.ProjectFile = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const customdesign_entity_1 = require("./customdesign.entity");
const user_entity_1 = require("../../user/entities/user.entity");
let ProjectFile = class ProjectFile {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, customDesignId: { required: true, type: () => String }, customDesign: { required: true, type: () => require("./customdesign.entity").CustomDesign }, uploadedById: { required: true, type: () => String }, uploadedBy: { required: true, type: () => require("../../user/entities/user.entity").User }, fileName: { required: true, type: () => String }, fileUrl: { required: true, type: () => String }, fileType: { required: true, type: () => String }, isDeliverable: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date } };
    }
};
exports.ProjectFile = ProjectFile;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProjectFile.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], ProjectFile.prototype, "customDesignId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => customdesign_entity_1.CustomDesign, { onDelete: 'CASCADE' }),
    (0, database_module_1.JoinColumn)({ name: 'customDesignId' }),
    __metadata("design:type", customdesign_entity_1.CustomDesign)
], ProjectFile.prototype, "customDesign", void 0);
__decorate([
    (0, database_module_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], ProjectFile.prototype, "uploadedById", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, database_module_1.JoinColumn)({ name: 'uploadedById' }),
    __metadata("design:type", user_entity_1.User)
], ProjectFile.prototype, "uploadedBy", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ProjectFile.prototype, "fileName", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ProjectFile.prototype, "fileUrl", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProjectFile.prototype, "fileType", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ProjectFile.prototype, "isDeliverable", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProjectFile.prototype, "createdAt", void 0);
exports.ProjectFile = ProjectFile = __decorate([
    (0, database_module_1.Entity)('project_files')
], ProjectFile);
//# sourceMappingURL=project-file.entity.js.map