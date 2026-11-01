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
exports.WithdrawalAuditLog = exports.AuditAction = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const withdrawal_request_entity_1 = require("./withdrawal-request.entity");
const agent_entity_1 = require("../../agent/entities/agent.entity");
const admin_entity_1 = require("../../admin/entities/admin.entity");
var AuditAction;
(function (AuditAction) {
    AuditAction["WITHDRAWAL_REQUESTED"] = "Withdrawal Requested";
    AuditAction["WITHDRAWAL_APPROVED"] = "Withdrawal Approved";
    AuditAction["WITHDRAWAL_REJECTED"] = "Withdrawal Rejected";
    AuditAction["TRANSFER_INITIATED"] = "Transfer Initiated";
    AuditAction["TRANSFER_SUCCESS"] = "Transfer Success";
    AuditAction["TRANSFER_FAILED"] = "Transfer Failed";
    AuditAction["TRANSFER_REVERSED"] = "Transfer Reversed";
    AuditAction["BANK_ACCOUNT_VERIFIED"] = "Bank Account Verified";
    AuditAction["BANK_ACCOUNT_REJECTED"] = "Bank Account Rejected";
    AuditAction["WALLET_CREDITED"] = "Wallet Credited";
    AuditAction["WALLET_DEBITED"] = "Wallet Debited";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
let WithdrawalAuditLog = class WithdrawalAuditLog {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, agentId: { required: true, type: () => String }, agent: { required: true, type: () => require("../../agent/entities/agent.entity").Agent }, withdrawalId: { required: true, type: () => String }, withdrawal: { required: true, type: () => require("./withdrawal-request.entity").WithdrawalRequest }, adminId: { required: true, type: () => String }, admin: { required: true, type: () => require("../../admin/entities/admin.entity").Admin }, action: { required: true, enum: require("./withdrawal-audit-log.entity").AuditAction }, amount: { required: true, type: () => Number }, description: { required: true, type: () => String }, paystackReference: { required: true, type: () => String, description: "Paystack reference for transfers" }, paystackTransferCode: { required: true, type: () => String, description: "Paystack transfer code" }, ipAddress: { required: true, type: () => String, description: "IP address of the user performing action (if applicable)" }, userAgent: { required: true, type: () => String, description: "User agent / device information" }, metadata: { required: true, type: "object", additionalProperties: true, description: "Additional metadata in JSON format" }, createdAt: { required: true, type: () => Date } };
    }
};
exports.WithdrawalAuditLog = WithdrawalAuditLog;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WithdrawalAuditLog.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], WithdrawalAuditLog.prototype, "agentId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => agent_entity_1.Agent, { onDelete: 'SET NULL', eager: false }),
    (0, database_module_1.JoinColumn)({ name: 'agentId' }),
    __metadata("design:type", agent_entity_1.Agent)
], WithdrawalAuditLog.prototype, "agent", void 0);
__decorate([
    (0, database_module_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], WithdrawalAuditLog.prototype, "withdrawalId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => withdrawal_request_entity_1.WithdrawalRequest, { onDelete: 'SET NULL', eager: false }),
    (0, database_module_1.JoinColumn)({ name: 'withdrawalId' }),
    __metadata("design:type", withdrawal_request_entity_1.WithdrawalRequest)
], WithdrawalAuditLog.prototype, "withdrawal", void 0);
__decorate([
    (0, database_module_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], WithdrawalAuditLog.prototype, "adminId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => admin_entity_1.Admin, { onDelete: 'SET NULL', eager: false }),
    (0, database_module_1.JoinColumn)({ name: 'adminId' }),
    __metadata("design:type", admin_entity_1.Admin)
], WithdrawalAuditLog.prototype, "admin", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: AuditAction,
    }),
    __metadata("design:type", String)
], WithdrawalAuditLog.prototype, "action", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], WithdrawalAuditLog.prototype, "amount", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], WithdrawalAuditLog.prototype, "description", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], WithdrawalAuditLog.prototype, "paystackReference", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], WithdrawalAuditLog.prototype, "paystackTransferCode", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", String)
], WithdrawalAuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WithdrawalAuditLog.prototype, "userAgent", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], WithdrawalAuditLog.prototype, "metadata", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WithdrawalAuditLog.prototype, "createdAt", void 0);
exports.WithdrawalAuditLog = WithdrawalAuditLog = __decorate([
    (0, database_module_1.Entity)('withdrawal_audit_logs'),
    (0, database_module_1.Index)(['agentId', 'createdAt']),
    (0, database_module_1.Index)(['withdrawalId']),
    (0, database_module_1.Index)(['action'])
], WithdrawalAuditLog);
//# sourceMappingURL=withdrawal-audit-log.entity.js.map