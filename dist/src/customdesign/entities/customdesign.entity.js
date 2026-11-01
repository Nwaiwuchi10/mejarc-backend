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
exports.CustomDesign = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const user_entity_1 = require("../../user/entities/user.entity");
const agent_entity_1 = require("../../agent/entities/agent.entity");
const custom_design_payment_entity_1 = require("./custom-design-payment.entity");
const customdesign_types_1 = require("../customdesign.types");
const database_module_2 = require("../../database/database.module");
let CustomDesign = class CustomDesign {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId: { required: true, type: () => String }, user: { required: true, type: () => require("../../user/entities/user.entity").User }, agentId: { required: false, type: () => String }, agent: { required: false, type: () => require("../../agent/entities/agent.entity").Agent }, serviceType: { required: true, enum: require("../customdesign.types").ServiceType }, serviceContext: { required: true, type: () => String }, projectType: { required: false, type: () => String }, scopeDeliverables: { required: false, type: () => [String] }, sizeComplexity: { required: false, type: () => String }, style: { required: false, type: () => String }, budget: { required: false, type: () => Number }, timeline: { required: false, type: () => String }, additionalInformation: { required: false, type: () => String }, attachedFiles: { required: false, type: () => [String] }, selectionMethod: { required: true, enum: require("../customdesign.types").SelectionMethod }, currentStep: { required: true, type: () => Number, description: "Tracks the furthest step reached (1\u20136)." }, status: { required: true, enum: require("../customdesign.types").CustomDesignStatus }, estimateCost: { required: false, type: () => Number }, estimateTimeline: { required: false, type: () => String }, estimateNotes: { required: false, type: () => String }, isSubmitted: { required: true, type: () => Boolean }, submittedAt: { required: false, type: () => Date }, reviewNotes: { required: false, type: () => String }, reviewedAt: { required: false, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, payment: { required: true, type: () => require("./custom-design-payment.entity").CustomDesignPayment } };
    }
};
exports.CustomDesign = CustomDesign;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CustomDesign.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], CustomDesign.prototype, "userId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, database_module_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], CustomDesign.prototype, "user", void 0);
__decorate([
    (0, database_module_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], CustomDesign.prototype, "agentId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => agent_entity_1.Agent, { onDelete: 'SET NULL', nullable: true }),
    (0, database_module_1.JoinColumn)({ name: 'agentId' }),
    __metadata("design:type", agent_entity_1.Agent)
], CustomDesign.prototype, "agent", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'enum', enum: customdesign_types_1.ServiceType }),
    __metadata("design:type", String)
], CustomDesign.prototype, "serviceType", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CustomDesign.prototype, "serviceContext", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CustomDesign.prototype, "projectType", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], CustomDesign.prototype, "scopeDeliverables", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CustomDesign.prototype, "sizeComplexity", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CustomDesign.prototype, "style", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], CustomDesign.prototype, "budget", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CustomDesign.prototype, "timeline", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CustomDesign.prototype, "additionalInformation", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], CustomDesign.prototype, "attachedFiles", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: customdesign_types_1.SelectionMethod,
        default: customdesign_types_1.SelectionMethod.MANUAL,
    }),
    __metadata("design:type", String)
], CustomDesign.prototype, "selectionMethod", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], CustomDesign.prototype, "currentStep", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: customdesign_types_1.CustomDesignStatus,
        default: customdesign_types_1.CustomDesignStatus.IN_PROGRESS,
    }),
    __metadata("design:type", String)
], CustomDesign.prototype, "status", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], CustomDesign.prototype, "estimateCost", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CustomDesign.prototype, "estimateTimeline", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], CustomDesign.prototype, "estimateNotes", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CustomDesign.prototype, "isSubmitted", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CustomDesign.prototype, "submittedAt", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], CustomDesign.prototype, "reviewNotes", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CustomDesign.prototype, "reviewedAt", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CustomDesign.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CustomDesign.prototype, "updatedAt", void 0);
__decorate([
    (0, database_module_2.OneToOne)(() => custom_design_payment_entity_1.CustomDesignPayment, (payment) => payment.customDesign),
    __metadata("design:type", custom_design_payment_entity_1.CustomDesignPayment)
], CustomDesign.prototype, "payment", void 0);
exports.CustomDesign = CustomDesign = __decorate([
    (0, database_module_1.Entity)('custom_designs')
], CustomDesign);
//# sourceMappingURL=customdesign.entity.js.map