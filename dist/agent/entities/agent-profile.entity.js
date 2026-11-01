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
exports.AgentProfile = exports.TITLES_REQUIRING_LICENSE = exports.ProfessionalTitle = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const agent_entity_1 = require("./agent.entity");
var ProfessionalTitle;
(function (ProfessionalTitle) {
    ProfessionalTitle["ARCHITECT"] = "Architect";
    ProfessionalTitle["STRUCTURAL_ENGINEER"] = "Structural Engineer";
    ProfessionalTitle["MEP_ENGINEER"] = "MEP Engineer";
    ProfessionalTitle["ARCHITECTURAL_DESIGNER"] = "Architectural Designer";
    ProfessionalTitle["BIM_MODELLER"] = "BIM Modeller";
    ProfessionalTitle["LANDSCAPE_ARCHITECT"] = "Landscape Architect";
    ProfessionalTitle["PRODUCT_DESIGNER"] = "Product Designer";
})(ProfessionalTitle || (exports.ProfessionalTitle = ProfessionalTitle = {}));
exports.TITLES_REQUIRING_LICENSE = [
    ProfessionalTitle.ARCHITECT,
    ProfessionalTitle.STRUCTURAL_ENGINEER,
];
let AgentProfile = class AgentProfile {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, agent: { required: true, type: () => require("./agent.entity").Agent }, agentId: { required: true, type: () => String }, yearsOfExperience: { required: false, type: () => Number }, preferredTitle: { required: false, enum: require("./agent-profile.entity").ProfessionalTitle }, licenseNumber: { required: false, type: () => String }, specialization: { required: false, type: () => [String] }, portfolioLink: { required: false, type: () => String }, profilePicture: { required: false, type: () => String }, location: { required: false, type: () => String }, responseTime: { required: false, type: () => String }, completedProjectsCount: { required: true, type: () => Number }, phoneNumber: { required: false, type: () => String }, viewsCount: { required: true, type: () => Number }, savesCount: { required: true, type: () => Number }, inquiriesCount: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.AgentProfile = AgentProfile;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AgentProfile.prototype, "id", void 0);
__decorate([
    (0, database_module_1.OneToOne)(() => agent_entity_1.Agent, (agent) => agent.profile, {
        nullable: false,
        onDelete: 'CASCADE',
    }),
    (0, database_module_1.JoinColumn)({ name: 'agentId' }),
    __metadata("design:type", agent_entity_1.Agent)
], AgentProfile.prototype, "agent", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], AgentProfile.prototype, "agentId", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AgentProfile.prototype, "yearsOfExperience", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: ProfessionalTitle,
        nullable: true,
    }),
    __metadata("design:type", String)
], AgentProfile.prototype, "preferredTitle", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentProfile.prototype, "licenseNumber", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], AgentProfile.prototype, "specialization", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentProfile.prototype, "portfolioLink", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentProfile.prototype, "profilePicture", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentProfile.prototype, "location", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentProfile.prototype, "responseTime", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AgentProfile.prototype, "completedProjectsCount", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentProfile.prototype, "phoneNumber", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AgentProfile.prototype, "viewsCount", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AgentProfile.prototype, "savesCount", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AgentProfile.prototype, "inquiriesCount", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AgentProfile.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AgentProfile.prototype, "updatedAt", void 0);
exports.AgentProfile = AgentProfile = __decorate([
    (0, database_module_1.Entity)('agent_profiles')
], AgentProfile);
//# sourceMappingURL=agent-profile.entity.js.map