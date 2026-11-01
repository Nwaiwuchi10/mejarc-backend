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
exports.BankAccount = exports.BankAccountStatus = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const agent_entity_1 = require("../../agent/entities/agent.entity");
var BankAccountStatus;
(function (BankAccountStatus) {
    BankAccountStatus["PENDING"] = "Pending";
    BankAccountStatus["VERIFIED"] = "Verified";
    BankAccountStatus["REJECTED"] = "Rejected";
})(BankAccountStatus || (exports.BankAccountStatus = BankAccountStatus = {}));
let BankAccount = class BankAccount {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, agentId: { required: true, type: () => String }, agent: { required: true, type: () => require("../../agent/entities/agent.entity").Agent }, accountHolderName: { required: true, type: () => String }, accountNumber: { required: true, type: () => String }, bankCode: { required: true, type: () => String }, bankName: { required: true, type: () => String }, paystackRecipientCode: { required: true, type: () => String, description: "Paystack recipient code for automated transfers\nGenerated after bank account verification" }, status: { required: true, description: "Account verification status", enum: require("./bank-account.entity").BankAccountStatus }, resolvedAccountName: { required: true, type: () => String, description: "Resolved account name from Paystack verification\nHelps confirm account validity" }, isDefault: { required: true, type: () => Boolean, description: "Whether this is the primary bank account for withdrawals" }, rejectionReason: { required: true, type: () => String, description: "Verification rejection reason (if rejected)" }, rejectedAt: { required: true, type: () => Date, description: "Verification rejection date" }, verifiedAt: { required: true, type: () => Date, description: "Verification verified date" }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.BankAccount = BankAccount;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BankAccount.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], BankAccount.prototype, "agentId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => agent_entity_1.Agent, { onDelete: 'CASCADE', eager: false }),
    (0, database_module_1.JoinColumn)({ name: 'agentId' }),
    __metadata("design:type", agent_entity_1.Agent)
], BankAccount.prototype, "agent", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], BankAccount.prototype, "accountHolderName", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], BankAccount.prototype, "accountNumber", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], BankAccount.prototype, "bankCode", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], BankAccount.prototype, "bankName", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "paystackRecipientCode", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: BankAccountStatus,
        default: BankAccountStatus.PENDING,
    }),
    __metadata("design:type", String)
], BankAccount.prototype, "status", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "resolvedAccountName", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], BankAccount.prototype, "isDefault", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BankAccount.prototype, "rejectionReason", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], BankAccount.prototype, "rejectedAt", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], BankAccount.prototype, "verifiedAt", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BankAccount.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BankAccount.prototype, "updatedAt", void 0);
exports.BankAccount = BankAccount = __decorate([
    (0, database_module_1.Entity)('bank_accounts'),
    (0, database_module_1.Index)(['agentId', 'isDefault']),
    (0, database_module_1.Index)(['status'])
], BankAccount);
//# sourceMappingURL=bank-account.entity.js.map