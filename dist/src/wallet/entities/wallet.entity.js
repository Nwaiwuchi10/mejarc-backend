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
exports.Wallet = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const agent_entity_1 = require("../../agent/entities/agent.entity");
const wallet_transaction_entity_1 = require("./wallet-transaction.entity");
let Wallet = class Wallet {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, balance: { required: true, type: () => Number }, pendingClearance: { required: true, type: () => Number }, lifetimeEarnings: { required: true, type: () => Number }, agent: { required: true, type: () => require("../../agent/entities/agent.entity").Agent }, transactions: { required: true, type: () => [require("./wallet-transaction.entity").WalletTransaction] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Wallet = Wallet;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Wallet.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], Wallet.prototype, "balance", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], Wallet.prototype, "pendingClearance", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], Wallet.prototype, "lifetimeEarnings", void 0);
__decorate([
    (0, database_module_1.OneToOne)(() => agent_entity_1.Agent, (agent) => agent.wallet, { onDelete: 'CASCADE' }),
    (0, database_module_1.JoinColumn)(),
    __metadata("design:type", agent_entity_1.Agent)
], Wallet.prototype, "agent", void 0);
__decorate([
    (0, database_module_1.OneToMany)(() => wallet_transaction_entity_1.WalletTransaction, (transaction) => transaction.wallet, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Wallet.prototype, "transactions", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Wallet.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Wallet.prototype, "updatedAt", void 0);
exports.Wallet = Wallet = __decorate([
    (0, database_module_1.Entity)('wallets')
], Wallet);
//# sourceMappingURL=wallet.entity.js.map