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
exports.WithdrawalRequest = exports.WithdrawalStatus = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const agent_entity_1 = require("../../agent/entities/agent.entity");
var WithdrawalStatus;
(function (WithdrawalStatus) {
    WithdrawalStatus["PENDING"] = "Pending";
    WithdrawalStatus["APPROVED"] = "Approved";
    WithdrawalStatus["REJECTED"] = "Rejected";
    WithdrawalStatus["PROCESSING"] = "Processing";
    WithdrawalStatus["TRANSFERRED"] = "Transferred";
    WithdrawalStatus["FAILED"] = "Failed";
    WithdrawalStatus["REVERSED"] = "Reversed";
})(WithdrawalStatus || (exports.WithdrawalStatus = WithdrawalStatus = {}));
let WithdrawalRequest = class WithdrawalRequest {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, amount: { required: true, type: () => Number }, status: { required: true, enum: require("./withdrawal-request.entity").WithdrawalStatus }, description: { required: true, type: () => String }, accountDetails: { required: true, type: () => String }, adminNotes: { required: true, type: () => String }, agent: { required: true, type: () => require("../../agent/entities/agent.entity").Agent }, agentId: { required: true, type: () => String }, paystackReference: { required: true, type: () => String }, paystackTransferCode: { required: true, type: () => String, description: "Paystack transfer code for verification" }, amountInKobo: { required: true, type: () => Number, description: "Amount in Kobo (smallest unit) as sent to Paystack\n(Naira amount \u00D7 100)" }, retryCount: { required: true, type: () => Number, description: "Number of retry attempts for failed transfers" }, maxRetries: { required: true, type: () => Number, description: "Maximum retry attempts before marking as failed" }, lastErrorMessage: { required: true, type: () => String, description: "Last error message from Paystack or system" }, transferInitiatedAt: { required: true, type: () => Date, description: "Timestamp when transfer was initiated" }, transferCompletedAt: { required: true, type: () => Date, description: "Timestamp when transfer completed (success or failure)" }, autoProcess: { required: true, type: () => Boolean, description: "Whether automatic processing is enabled for this withdrawal" }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.WithdrawalRequest = WithdrawalRequest;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WithdrawalRequest.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], WithdrawalRequest.prototype, "amount", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: WithdrawalStatus,
        default: WithdrawalStatus.PENDING,
    }),
    __metadata("design:type", String)
], WithdrawalRequest.prototype, "status", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WithdrawalRequest.prototype, "description", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], WithdrawalRequest.prototype, "accountDetails", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WithdrawalRequest.prototype, "adminNotes", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => agent_entity_1.Agent, { onDelete: 'CASCADE' }),
    (0, database_module_1.JoinColumn)({ name: 'agentId' }),
    __metadata("design:type", agent_entity_1.Agent)
], WithdrawalRequest.prototype, "agent", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], WithdrawalRequest.prototype, "agentId", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], WithdrawalRequest.prototype, "paystackReference", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], WithdrawalRequest.prototype, "paystackTransferCode", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], WithdrawalRequest.prototype, "amountInKobo", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], WithdrawalRequest.prototype, "retryCount", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'integer', default: 3 }),
    __metadata("design:type", Number)
], WithdrawalRequest.prototype, "maxRetries", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WithdrawalRequest.prototype, "lastErrorMessage", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WithdrawalRequest.prototype, "transferInitiatedAt", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WithdrawalRequest.prototype, "transferCompletedAt", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], WithdrawalRequest.prototype, "autoProcess", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WithdrawalRequest.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WithdrawalRequest.prototype, "updatedAt", void 0);
exports.WithdrawalRequest = WithdrawalRequest = __decorate([
    (0, database_module_1.Entity)('withdrawal_requests')
], WithdrawalRequest);
//# sourceMappingURL=withdrawal-request.entity.js.map