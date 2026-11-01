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
exports.Agent = exports.AgentRegistrationStatus = exports.AgentKycStatus = void 0;
const openapi = require("@nestjs/swagger");
const user_entity_1 = require("../../user/entities/user.entity");
const database_module_1 = require("../../database/database.module");
const agent_profile_entity_1 = require("./agent-profile.entity");
const agent_bio_entity_1 = require("./agent-bio.entity");
const agent_kyc_entity_1 = require("./agent-kyc.entity");
const wallet_entity_1 = require("../../wallet/entities/wallet.entity");
var AgentKycStatus;
(function (AgentKycStatus) {
    AgentKycStatus["PENDING"] = "PENDING";
    AgentKycStatus["VERIFIED"] = "VERIFIED";
    AgentKycStatus["REJECTED"] = "REJECTED";
})(AgentKycStatus || (exports.AgentKycStatus = AgentKycStatus = {}));
var AgentRegistrationStatus;
(function (AgentRegistrationStatus) {
    AgentRegistrationStatus["PROFILE_PENDING"] = "profile_pending";
    AgentRegistrationStatus["BIO_PENDING"] = "bio_pending";
    AgentRegistrationStatus["KYC_PENDING"] = "kyc_pending";
    AgentRegistrationStatus["AWAITING_APPROVAL"] = "awaiting_approval";
    AgentRegistrationStatus["APPROVED"] = "approved";
    AgentRegistrationStatus["REJECTED"] = "rejected";
})(AgentRegistrationStatus || (exports.AgentRegistrationStatus = AgentRegistrationStatus = {}));
let Agent = class Agent {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, user: { required: true, type: () => require("../../user/entities/user.entity").User }, userId: { required: true, type: () => String }, profile: { required: false, type: () => require("./agent-profile.entity").AgentProfile }, bioRecord: { required: false, type: () => require("./agent-bio.entity").AgentBio }, kycRecords: { required: false, type: () => [require("./agent-kyc.entity").AgentKyc] }, wallet: { required: false, type: () => require("../../wallet/entities/wallet.entity").Wallet }, vendorId: { required: false, type: () => String }, businessName: { required: false, type: () => String }, pendingProfileChange: { required: false, type: () => Object }, kycDocuments: { required: false, type: () => [({ key: { required: true, type: () => String }, url: { required: true, type: () => String }, name: { required: false, type: () => String } })] }, registrationStatus: { required: true, enum: require("./agent.entity").AgentRegistrationStatus }, kycStatus: { required: true, enum: require("./agent.entity").AgentKycStatus }, isApprovedByAdmin: { required: true, type: () => Boolean }, approvedAt: { required: false, type: () => Date }, rejectionReason: { required: false, type: () => String }, deletedAt: { required: false, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Agent = Agent;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Agent.prototype, "id", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => user_entity_1.User, { nullable: false }),
    (0, database_module_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Agent.prototype, "user", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], Agent.prototype, "userId", void 0);
__decorate([
    (0, database_module_1.OneToOne)(() => agent_profile_entity_1.AgentProfile, (p) => p.agent, { cascade: true, eager: true }),
    __metadata("design:type", agent_profile_entity_1.AgentProfile)
], Agent.prototype, "profile", void 0);
__decorate([
    (0, database_module_1.OneToOne)(() => agent_bio_entity_1.AgentBio, (b) => b.agent, { cascade: true, eager: true }),
    (0, database_module_1.JoinColumn)(),
    __metadata("design:type", agent_bio_entity_1.AgentBio)
], Agent.prototype, "bioRecord", void 0);
__decorate([
    (0, database_module_1.OneToMany)(() => agent_kyc_entity_1.AgentKyc, (k) => k.agent, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], Agent.prototype, "kycRecords", void 0);
__decorate([
    (0, database_module_1.OneToOne)(() => wallet_entity_1.Wallet, (wallet) => wallet.agent, { cascade: true }),
    __metadata("design:type", wallet_entity_1.Wallet)
], Agent.prototype, "wallet", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Agent.prototype, "vendorId", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Agent.prototype, "businessName", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Agent.prototype, "pendingProfileChange", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Array)
], Agent.prototype, "kycDocuments", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: AgentRegistrationStatus,
        default: AgentRegistrationStatus.PROFILE_PENDING,
    }),
    __metadata("design:type", String)
], Agent.prototype, "registrationStatus", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: AgentKycStatus,
        default: AgentKycStatus.PENDING,
    }),
    __metadata("design:type", String)
], Agent.prototype, "kycStatus", void 0);
__decorate([
    (0, database_module_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Agent.prototype, "isApprovedByAdmin", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Agent.prototype, "approvedAt", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Agent.prototype, "rejectionReason", void 0);
__decorate([
    (0, database_module_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", Date)
], Agent.prototype, "deletedAt", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Agent.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Agent.prototype, "updatedAt", void 0);
exports.Agent = Agent = __decorate([
    (0, database_module_1.Entity)('agents')
], Agent);
//# sourceMappingURL=agent.entity.js.map