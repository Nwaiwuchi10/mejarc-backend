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
exports.AgentKyc = exports.KycRecordStatus = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const agent_entity_1 = require("./agent.entity");
var KycRecordStatus;
(function (KycRecordStatus) {
    KycRecordStatus["PENDING"] = "PENDING";
    KycRecordStatus["VERIFIED"] = "VERIFIED";
    KycRecordStatus["REJECTED"] = "REJECTED";
})(KycRecordStatus || (exports.KycRecordStatus = KycRecordStatus = {}));
let AgentKyc = class AgentKyc {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, agent: { required: true, type: () => require("./agent.entity").Agent }, agentId: { required: true, type: () => String }, idType: { required: false, type: () => String }, idNumber: { required: false, type: () => String }, idDocument: { required: false, type: () => String }, architectCert: { required: false, type: () => String }, bankName: { required: false, type: () => String }, accountNumber: { required: false, type: () => String }, accountHolderName: { required: false, type: () => String }, documents: { required: false, type: () => [({ key: { required: true, type: () => String }, url: { required: true, type: () => String }, name: { required: false, type: () => String } })] }, status: { required: true, enum: require("./agent-kyc.entity").KycRecordStatus }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.AgentKyc = AgentKyc;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AgentKyc.prototype, "id", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => agent_entity_1.Agent, (agent) => agent.kycRecords, {
        nullable: false,
        onDelete: 'CASCADE',
    }),
    (0, database_module_1.JoinColumn)({ name: 'agentId' }),
    __metadata("design:type", agent_entity_1.Agent)
], AgentKyc.prototype, "agent", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], AgentKyc.prototype, "agentId", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentKyc.prototype, "idType", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentKyc.prototype, "idNumber", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentKyc.prototype, "idDocument", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentKyc.prototype, "architectCert", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentKyc.prototype, "bankName", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentKyc.prototype, "accountNumber", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AgentKyc.prototype, "accountHolderName", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Array)
], AgentKyc.prototype, "documents", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: KycRecordStatus,
        default: KycRecordStatus.PENDING,
    }),
    __metadata("design:type", String)
], AgentKyc.prototype, "status", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AgentKyc.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AgentKyc.prototype, "updatedAt", void 0);
exports.AgentKyc = AgentKyc = __decorate([
    (0, database_module_1.Entity)('agent_kyc')
], AgentKyc);
//# sourceMappingURL=agent-kyc.entity.js.map