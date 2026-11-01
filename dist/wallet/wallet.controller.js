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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const wallet_service_1 = require("./wallet.service");
const withdraw_dto_1 = require("./dto/withdraw.dto");
const user_guard_1 = require("../user/guard/user.guard");
const admin_auth_guard_1 = require("../admin/guards/admin-auth.guard");
const bank_account_service_1 = require("./services/bank-account.service");
const paystack_service_1 = require("./services/paystack.service");
const withdrawal_queue_service_1 = require("./services/withdrawal-queue.service");
const audit_log_service_1 = require("./services/audit-log.service");
const bank_account_dto_1 = require("./dto/bank-account.dto");
let WalletController = class WalletController {
    constructor(walletService, bankAccountService, paystackService, withdrawalQueueService, auditLogService) {
        this.walletService = walletService;
        this.bankAccountService = bankAccountService;
        this.paystackService = paystackService;
        this.withdrawalQueueService = withdrawalQueueService;
        this.auditLogService = auditLogService;
    }
    async registerBankAccount(req, registerDto) {
        const userId = req.userId;
        return this.bankAccountService.registerBankAccountByUserId(userId, registerDto);
    }
    async verifyBankAccount(req, bankAccountId, verifyDto) {
        const userId = req.userId;
        return this.bankAccountService.verifyBankAccountByUserId(userId, bankAccountId, verifyDto);
    }
    async getBankAccounts(req) {
        const userId = req.userId;
        return this.bankAccountService.getBankAccountsByUserId(userId);
    }
    async setDefaultBankAccount(req, bankAccountId) {
        const userId = req.userId;
        return this.bankAccountService.setDefaultBankAccountByUserId(userId, bankAccountId);
    }
    async deleteBankAccount(req, bankAccountId) {
        const userId = req.userId;
        await this.bankAccountService.deleteBankAccountByUserId(userId, bankAccountId);
        return { message: 'Bank account deleted successfully' };
    }
    async getBanks() {
        return this.paystackService.getBankList();
    }
    async getWithdrawalRules() {
        return this.walletService.getWithdrawalSettings();
    }
    getOverview(userId) {
        return this.walletService.getOverview(userId);
    }
    withdraw(req, withdrawDto) {
        const userId = req.userId;
        return this.walletService.withdraw(userId, withdrawDto);
    }
    getTransactions(req) {
        const userId = req.userId;
        return this.walletService.getTransactions(userId);
    }
    getMyWithdrawals(req) {
        const userId = req.userId;
        return this.walletService.getMyWithdrawals(userId);
    }
    async getWithdrawalDetails(req, withdrawalId) {
        return this.walletService.getWithdrawalDetails(withdrawalId, req.userId);
    }
    getWithdrawalSettings() {
        return this.walletService.getWithdrawalSettings();
    }
    updateWithdrawalSettings(dto) {
        return this.walletService.updateWithdrawalSettings(dto);
    }
    getAllWithdrawals() {
        return this.walletService.getAllWithdrawals();
    }
    approveWithdrawal(req, id, adminNotes) {
        return this.walletService.approveWithdrawal(id, adminNotes, req.adminId);
    }
    rejectWithdrawal(req, id, reason) {
        return this.walletService.rejectWithdrawal(id, reason, req.adminId);
    }
    async getWithdrawalAuditLogs(withdrawalId) {
        return this.auditLogService.getWithdrawalAuditLogs(withdrawalId);
    }
    async getAllAuditLogs(req) {
        const skip = parseInt(req.query.skip) || 0;
        const take = parseInt(req.query.take) || 50;
        return this.auditLogService.getAllAuditLogs(skip, take);
    }
    async getAuditLogsByAction(req, action) {
        const skip = parseInt(req.query.skip) || 0;
        const take = parseInt(req.query.take) || 50;
        return this.auditLogService.getLogsByAction(action, skip, take);
    }
    async getFinancialSummary() {
        return this.walletService.getFinancialSummary();
    }
    async getFinancialReports(req) {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            throw new common_1.BadRequestException('startDate and endDate are required query parameters');
        }
        return this.walletService.getFinancialReports(new Date(startDate), new Date(endDate));
    }
    async handlePaystackWebhook(req, signature) {
        const rawBody = JSON.stringify(req.body);
        if (!signature) {
            throw new common_1.BadRequestException('Missing Paystack signature');
        }
        const isValid = this.paystackService.verifyWebhookSignature(rawBody, signature);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid Paystack signature');
        }
        await this.withdrawalQueueService.handlePaystackWebhookCallback(req.body);
        return { status: 'ok' };
    }
    async retryFailedWithdrawals() {
        return this.withdrawalQueueService.retryFailedWithdrawals();
    }
    async retrySingleWithdrawal(id) {
        return this.withdrawalQueueService.processWithdrawal({
            withdrawalId: id,
            retry: true,
        });
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Post)('bank-account/register'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new bank account for vendor / agent' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bank account registered' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bank_account_dto_1.RegisterBankAccountDto]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "registerBankAccount", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Post)('bank-account/verify/:bankAccountId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify bank account details via Paystack' }),
    (0, swagger_1.ApiParam)({ name: 'bankAccountId', description: 'Bank Account ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bank account verified' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bankAccountId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, bank_account_dto_1.VerifyBankAccountDto]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "verifyBankAccount", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Get)('bank-account'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all saved bank accounts for the user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of bank accounts' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getBankAccounts", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Patch)('bank-account/default/:bankAccountId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Set default bank account for payouts' }),
    (0, swagger_1.ApiParam)({ name: 'bankAccountId', description: 'Bank Account ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Default bank account updated' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bankAccountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "setDefaultBankAccount", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Delete)('bank-account/:bankAccountId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a registered bank account' }),
    (0, swagger_1.ApiParam)({ name: 'bankAccountId', description: 'Bank Account ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bank account deleted' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bankAccountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "deleteBankAccount", null);
__decorate([
    (0, common_1.Get)('banks'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get list of supported banks from Paystack (Public)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bank list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getBanks", null);
__decorate([
    (0, common_1.Get)('rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public withdrawal limits and rules' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal rules' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getWithdrawalRules", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Get)('overview/:userId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get wallet balances, escrow balance, and pending payouts',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wallet overview' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getOverview", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Post)('withdraw'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a funds withdrawal from wallet' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Withdrawal initiated' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, withdraw_dto_1.WithdrawDto]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "withdraw", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Get)('transactions'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction history of user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction history' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Get)('withdrawals'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get withdrawal history of user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal history' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getMyWithdrawals", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Get)('withdrawals/:withdrawalId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific withdrawal details' }),
    (0, swagger_1.ApiParam)({ name: 'withdrawalId', description: 'Withdrawal ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal details' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('withdrawalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getWithdrawalDetails", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('admin/withdrawal-settings'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin withdrawal settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getWithdrawalSettings", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('admin/withdrawal-settings'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update admin withdrawal settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings updated' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "updateWithdrawalSettings", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('admin/withdrawals'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all withdrawals for admin review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All withdrawals' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getAllWithdrawals", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Post)('admin/withdrawals/:id/approve'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin approve withdrawal' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Withdrawal ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal approved' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('adminNotes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "approveWithdrawal", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Post)('admin/withdrawals/:id/reject'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin reject withdrawal' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Withdrawal ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal rejected' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "rejectWithdrawal", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('admin/withdrawals/:withdrawalId/audit-logs'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs for a specific withdrawal' }),
    (0, swagger_1.ApiParam)({ name: 'withdrawalId', description: 'Withdrawal ID UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit logs' }),
    __param(0, (0, common_1.Param)('withdrawalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getWithdrawalAuditLogs", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('admin/audit-logs'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated audit logs for financial reporting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit logs' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getAllAuditLogs", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('admin/audit-logs/action/:action'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs filtered by action' }),
    (0, swagger_1.ApiParam)({ name: 'action', description: 'Action type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Action audit logs' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getAuditLogsByAction", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('admin/financials/withdrawal-summary'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get financial withdrawal summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal summary' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getFinancialSummary", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('admin/financials/reports'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get financial reports by date range' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', example: '2024-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', example: '2024-12-31' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Financial report' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getFinancialReports", null);
__decorate([
    (0, common_1.Post)('webhook/paystack'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Paystack transfer webhook callback' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-paystack-signature',
        description: 'Paystack HMAC signature',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('x-paystack-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "handlePaystackWebhook", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Post)('admin/withdrawals/retry'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Manual retry for all failed withdrawals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retried failed withdrawals' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "retryFailedWithdrawals", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Post)('admin/withdrawals/retry/:id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Retry a specific failed withdrawal' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Withdrawal UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawal retry initiated' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "retrySingleWithdrawal", null);
exports.WalletController = WalletController = __decorate([
    (0, swagger_1.ApiTags)('Wallet'),
    (0, common_1.Controller)('wallet'),
    __metadata("design:paramtypes", [wallet_service_1.WalletService,
        bank_account_service_1.BankAccountService,
        paystack_service_1.PaystackService,
        withdrawal_queue_service_1.WithdrawalQueueService,
        audit_log_service_1.AuditLogService])
], WalletController);
//# sourceMappingURL=wallet.controller.js.map