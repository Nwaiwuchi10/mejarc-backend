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
exports.WalletTransaction = exports.TransactionCategory = exports.TransactionType = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const wallet_entity_1 = require("./wallet.entity");
var TransactionType;
(function (TransactionType) {
    TransactionType["CREDIT"] = "Credit";
    TransactionType["DEBIT"] = "Debit";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionCategory;
(function (TransactionCategory) {
    TransactionCategory["PRODUCT_SALE"] = "Product Sale";
    TransactionCategory["CUSTOM_DESIGN"] = "Custom Design";
    TransactionCategory["WITHDRAWAL"] = "Withdrawal";
    TransactionCategory["OTHER"] = "Other";
})(TransactionCategory || (exports.TransactionCategory = TransactionCategory = {}));
let WalletTransaction = class WalletTransaction {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, type: { required: true, enum: require("./wallet-transaction.entity").TransactionType }, amount: { required: true, type: () => Number }, balanceAfter: { required: true, type: () => Number }, description: { required: true, type: () => String }, category: { required: true, enum: require("./wallet-transaction.entity").TransactionCategory }, wallet: { required: true, type: () => require("./wallet.entity").Wallet }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.WalletTransaction = WalletTransaction;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WalletTransaction.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'enum', enum: TransactionType }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "type", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], WalletTransaction.prototype, "amount", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], WalletTransaction.prototype, "balanceAfter", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "description", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: TransactionCategory,
        default: TransactionCategory.OTHER,
    }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "category", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => wallet_entity_1.Wallet, (wallet) => wallet.transactions, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", wallet_entity_1.Wallet)
], WalletTransaction.prototype, "wallet", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WalletTransaction.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WalletTransaction.prototype, "updatedAt", void 0);
exports.WalletTransaction = WalletTransaction = __decorate([
    (0, database_module_1.Entity)('wallet_transactions')
], WalletTransaction);
//# sourceMappingURL=wallet-transaction.entity.js.map