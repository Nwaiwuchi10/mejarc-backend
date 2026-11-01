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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const wallet_entity_1 = require("./entities/wallet.entity");
const wallet_transaction_entity_1 = require("./entities/wallet-transaction.entity");
const withdrawal_request_entity_1 = require("./entities/withdrawal-request.entity");
const system_setting_entity_1 = require("./entities/system-setting.entity");
const agent_entity_1 = require("../agent/entities/agent.entity");
const notification_service_1 = require("../notification/notification.service");
const notification_entity_1 = require("../notification/entities/notification.entity");
const admin_entity_1 = require("../admin/entities/admin.entity");
const withdrawal_queue_service_1 = require("./services/withdrawal-queue.service");
const bank_account_service_1 = require("./services/bank-account.service");
let WalletService = class WalletService {
    constructor(walletRepository, transactionRepository, withdrawalRepository, settingRepository, agentRepository, adminRepository, notificationService, withdrawalQueueService, bankAccountService) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.withdrawalRepository = withdrawalRepository;
        this.settingRepository = settingRepository;
        this.agentRepository = agentRepository;
        this.adminRepository = adminRepository;
        this.notificationService = notificationService;
        this.withdrawalQueueService = withdrawalQueueService;
        this.bankAccountService = bankAccountService;
    }
    async getOverview(userId) {
        const agent = await this.agentRepository.findOne({
            where: { userId },
            relations: ['wallet', 'wallet.transactions'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        if (!agent.wallet) {
            return {
                balance: 0,
                pendingClearance: 0,
                lifetimeEarnings: 0,
                transactions: [],
                earningsBreakdown: { customDesign: 0, productSales: 0 },
            };
        }
        const sortedTransactions = agent.wallet.transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const earningsBreakdown = {
            customDesign: 0,
            productSales: 0,
        };
        agent.wallet.transactions.forEach((tx) => {
            if (tx.type === wallet_transaction_entity_1.TransactionType.CREDIT) {
                if (tx.category === wallet_transaction_entity_1.TransactionCategory.CUSTOM_DESIGN) {
                    earningsBreakdown.customDesign += Number(tx.amount);
                }
                else if (tx.category === wallet_transaction_entity_1.TransactionCategory.PRODUCT_SALE) {
                    earningsBreakdown.productSales += Number(tx.amount);
                }
            }
        });
        return {
            balance: agent.wallet.balance,
            pendingClearance: agent.wallet.pendingClearance,
            lifetimeEarnings: agent.wallet.lifetimeEarnings,
            transactions: sortedTransactions,
            earningsBreakdown,
        };
    }
    async getTransactions(userId) {
        const agent = await this.agentRepository.findOne({
            where: { userId },
            relations: ['wallet', 'wallet.transactions'],
        });
        if (!agent || !agent.wallet) {
            throw new common_1.NotFoundException('Agent or wallet not found');
        }
        return agent.wallet.transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async getMyWithdrawals(userId) {
        const agent = await this.agentRepository.findOne({ where: { userId } });
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        return this.withdrawalRepository.find({
            where: { agentId: agent.id },
            order: { createdAt: 'DESC' },
        });
    }
    async getWithdrawalSettings() {
        let setting = await this.settingRepository.findOne({
            where: { key: 'WITHDRAWAL_SETTINGS' },
        });
        if (!setting) {
            setting = this.settingRepository.create({
                key: 'WITHDRAWAL_SETTINGS',
                value: {
                    mode: 'AUTO',
                    autoApproveThreshold: 100000,
                    minWithdrawalAmount: 1000,
                    maxWithdrawalAmount: 5000000,
                },
                description: 'Vendor payment and withdrawal mode configuration',
            });
            await this.settingRepository.save(setting);
        }
        else if (setting.value &&
            setting.value.maxWithdrawalAmount === undefined) {
            setting.value.maxWithdrawalAmount = 5000000;
            await this.settingRepository.save(setting);
        }
        return setting.value;
    }
    async updateWithdrawalSettings(dto) {
        let setting = await this.settingRepository.findOne({
            where: { key: 'WITHDRAWAL_SETTINGS' },
        });
        const current = setting?.value || {
            mode: 'AUTO',
            autoApproveThreshold: 100000,
            minWithdrawalAmount: 1000,
            maxWithdrawalAmount: 5000000,
        };
        if (dto.mode && !['AUTO', 'MANUAL'].includes(dto.mode.toUpperCase())) {
            throw new common_1.BadRequestException('Mode must be either AUTO or MANUAL');
        }
        const updatedValue = {
            mode: dto.mode ? dto.mode.toUpperCase() : current.mode,
            autoApproveThreshold: dto.autoApproveThreshold !== undefined
                ? Number(dto.autoApproveThreshold)
                : current.autoApproveThreshold,
            minWithdrawalAmount: dto.minWithdrawalAmount !== undefined
                ? Number(dto.minWithdrawalAmount)
                : current.minWithdrawalAmount,
            maxWithdrawalAmount: dto.maxWithdrawalAmount !== undefined
                ? Number(dto.maxWithdrawalAmount)
                : current.maxWithdrawalAmount || 5000000,
            updatedAt: new Date().toISOString(),
        };
        if (!setting) {
            setting = this.settingRepository.create({
                key: 'WITHDRAWAL_SETTINGS',
                value: updatedValue,
                description: 'Vendor payment and withdrawal mode configuration',
            });
        }
        else {
            setting.value = updatedValue;
        }
        await this.settingRepository.save(setting);
        return setting.value;
    }
    async getAllWithdrawals() {
        return this.withdrawalRepository.find({
            relations: ['agent', 'agent.user'],
            order: { createdAt: 'DESC' },
        });
    }
    async withdraw(userId, withdrawDto) {
        const agent = await this.agentRepository.findOne({
            where: { userId },
            relations: ['wallet', 'user'],
        });
        if (!agent || !agent.wallet) {
            throw new common_1.NotFoundException('Agent or wallet not found');
        }
        const { amount, description, accountDetails } = withdrawDto;
        const currentBalance = Number(agent.wallet.balance);
        const withdrawalAmount = Number(amount);
        if (currentBalance < withdrawalAmount) {
            throw new common_1.BadRequestException('Insufficient cleared funds for withdrawal.');
        }
        const verifiedAccount = await this.bankAccountService.getDefaultBankAccount(agent.id);
        if (!verifiedAccount) {
            throw new common_1.BadRequestException('You must have a verified bank account to request a withdrawal.');
        }
        const actualAccountDetails = `${verifiedAccount.accountHolderName} - ${verifiedAccount.accountNumber} - ${verifiedAccount.bankName}`;
        const settings = await this.getWithdrawalSettings();
        const isAutoMode = settings.mode === 'AUTO';
        const minAmount = settings.minWithdrawalAmount || 1000;
        const maxAmount = settings.maxWithdrawalAmount || 5000000;
        if (withdrawalAmount < minAmount) {
            throw new common_1.BadRequestException(`Minimum withdrawal amount is ₦${minAmount.toLocaleString()}`);
        }
        if (withdrawalAmount > maxAmount) {
            throw new common_1.BadRequestException(`Maximum withdrawal amount per transaction is ₦${maxAmount.toLocaleString()}`);
        }
        const shouldAutoApprove = isAutoMode &&
            withdrawalAmount <= (settings.autoApproveThreshold || 100000);
        const queryRunner = this.walletRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            agent.wallet.balance = currentBalance - withdrawalAmount;
            await queryRunner.manager.save(agent.wallet);
            const status = shouldAutoApprove
                ? withdrawal_request_entity_1.WithdrawalStatus.APPROVED
                : withdrawal_request_entity_1.WithdrawalStatus.PENDING;
            const withdrawalRequest = this.withdrawalRepository.create({
                amount: withdrawalAmount,
                status: status,
                description: description ||
                    (isAutoMode ? 'Auto-Payout Withdrawal' : 'Manual Vendor Withdrawal'),
                accountDetails: actualAccountDetails,
                agent,
                autoProcess: isAutoMode,
            });
            const savedRequest = await queryRunner.manager.save(withdrawalRequest);
            const transaction = this.transactionRepository.create({
                type: wallet_transaction_entity_1.TransactionType.DEBIT,
                category: wallet_transaction_entity_1.TransactionCategory.WITHDRAWAL,
                amount: withdrawalAmount,
                balanceAfter: agent.wallet.balance,
                description: `Withdrawal Request [${settings.mode}] - ${description || 'No description'}`,
                wallet: agent.wallet,
            });
            await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();
            const admins = await this.adminRepository.find({ relations: ['user'] });
            for (const admin of admins) {
                if (admin.user) {
                    await this.notificationService.createNotification(admin.user.id, notification_entity_1.NotificationType.WITHDRAWAL, isAutoMode
                        ? 'New Auto Withdrawal Request'
                        : 'New Manual Withdrawal Request for Review', `Agent ${agent.user?.firstName || 'Unknown'} requested ₦${withdrawalAmount.toLocaleString()}. Mode: ${settings.mode}. Account: ${actualAccountDetails}`, {
                        withdrawalId: savedRequest.id,
                        amount: withdrawalAmount,
                        mode: settings.mode,
                    }, 'messagesAdmin');
                }
            }
            if (shouldAutoApprove) {
                this.withdrawalQueueService
                    .processWithdrawal({
                    withdrawalId: savedRequest.id,
                    agentId: agent.id,
                    amount: withdrawalAmount,
                })
                    .catch((err) => {
                    console.error(`Error initiating auto-withdrawal ${savedRequest.id}:`, err);
                });
            }
            return {
                message: shouldAutoApprove
                    ? 'Withdrawal processed successfully via Auto-Payout'
                    : isAutoMode
                        ? 'Withdrawal request submitted successfully for approval'
                        : 'Withdrawal request submitted for Admin review and manual processing',
                mode: settings.mode,
                balance: agent.wallet.balance,
                withdrawalRequest: savedRequest,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException('Withdrawal failed: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async approveWithdrawal(id, adminNotes, adminId) {
        const request = await this.withdrawalRepository.findOne({
            where: { id },
            relations: ['agent', 'agent.user'],
        });
        if (!request)
            throw new common_1.NotFoundException('Withdrawal request not found');
        if (request.status !== withdrawal_request_entity_1.WithdrawalStatus.PENDING) {
            throw new common_1.BadRequestException(`Request is already ${request.status}`);
        }
        if (request.autoProcess) {
            request.status = withdrawal_request_entity_1.WithdrawalStatus.APPROVED;
            request.adminNotes =
                adminNotes || 'Approved by Admin for automated processing';
            await this.withdrawalRepository.save(request);
            this.withdrawalQueueService
                .processWithdrawal({
                withdrawalId: request.id,
                agentId: request.agentId,
                amount: Number(request.amount),
            })
                .catch((err) => {
                console.error(`Error initiating auto-withdrawal ${request.id}:`, err);
            });
        }
        else {
            request.status = withdrawal_request_entity_1.WithdrawalStatus.TRANSFERRED;
            request.adminNotes = adminNotes || 'Vetted and paid manually by Admin';
            request.transferCompletedAt = new Date();
            await this.withdrawalRepository.save(request);
        }
        if (request.agent?.user) {
            const msg = request.autoProcess
                ? `Your withdrawal of ₦${Number(request.amount).toLocaleString()} has been approved and is being processed via auto-payout.`
                : `Your withdrawal of ₦${Number(request.amount).toLocaleString()} has been approved and paid to your bank account.`;
            await this.notificationService.createNotification(request.agent.user.id, notification_entity_1.NotificationType.WITHDRAWAL, 'Withdrawal Approved', msg, { withdrawalId: request.id, amount: request.amount }, 'paymentSuccessful');
        }
        return {
            message: request.autoProcess
                ? 'Withdrawal approved for automated Paystack transfer'
                : 'Manual withdrawal approved and marked as paid',
            processing: request.autoProcess,
            request,
        };
    }
    async rejectWithdrawal(id, reason, adminId) {
        const request = await this.withdrawalRepository.findOne({
            where: { id },
            relations: ['agent', 'agent.wallet', 'agent.user'],
        });
        if (!request)
            throw new common_1.NotFoundException('Withdrawal request not found');
        if (request.status !== withdrawal_request_entity_1.WithdrawalStatus.PENDING) {
            throw new common_1.BadRequestException(`Request is already ${request.status}`);
        }
        if (!request.agent.wallet) {
            throw new common_1.BadRequestException('Agent wallet not found');
        }
        const queryRunner = this.withdrawalRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const wallet = request.agent.wallet;
            wallet.balance = Number(wallet.balance) + Number(request.amount);
            await queryRunner.manager.save(wallet);
            request.status = withdrawal_request_entity_1.WithdrawalStatus.REJECTED;
            request.adminNotes = reason;
            await queryRunner.manager.save(request);
            const transaction = this.transactionRepository.create({
                type: wallet_transaction_entity_1.TransactionType.CREDIT,
                category: wallet_transaction_entity_1.TransactionCategory.OTHER,
                amount: request.amount,
                balanceAfter: wallet.balance,
                description: `Withdrawal Rejected - Reversal: ${reason}`,
                wallet: wallet,
            });
            await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();
            if (request.agent?.user) {
                await this.notificationService.createNotification(request.agent.user.id, notification_entity_1.NotificationType.WITHDRAWAL, 'Withdrawal Rejected', `Your withdrawal of ₦${request.amount} was rejected. Reason: ${reason}. Funds have been reversed.`, { withdrawalId: request.id, amount: request.amount }, 'paymentSuccessful');
            }
            return { message: 'Withdrawal rejected and funds reversed', request };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException('Rejection failed: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async getWithdrawalDetails(withdrawalId, userId) {
        const withdrawal = await this.withdrawalRepository.findOne({
            where: { id: withdrawalId },
            relations: ['agent', 'agent.user'],
        });
        if (!withdrawal) {
            throw new common_1.NotFoundException('Withdrawal not found');
        }
        if (withdrawal.agent?.user?.id !== userId) {
            throw new common_1.BadRequestException('Unauthorized access to this withdrawal');
        }
        return withdrawal;
    }
    async getFinancialSummary() {
        const withdrawals = await this.withdrawalRepository.find({
            relations: ['agent'],
        });
        const summary = {
            totalWithdrawals: withdrawals.length,
            totalAmount: 0,
            byStatus: {
                pending: 0,
                approved: 0,
                processing: 0,
                transferred: 0,
                rejected: 0,
                failed: 0,
            },
            byStatusAmount: {
                pending: 0,
                approved: 0,
                processing: 0,
                transferred: 0,
                rejected: 0,
                failed: 0,
            },
        };
        withdrawals.forEach((w) => {
            const amount = Number(w.amount);
            summary.totalAmount += amount;
            const status = w.status.toLowerCase().replace(/\s+/g, '');
            if (status in summary.byStatus) {
                summary.byStatus[status]++;
                summary.byStatusAmount[status] +=
                    amount;
            }
        });
        return summary;
    }
    async getFinancialReports(startDate, endDate) {
        const withdrawals = await this.withdrawalRepository.find({
            relations: ['agent', 'agent.user'],
            where: {
                createdAt: {
                    raw: `BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
                },
            },
            order: { createdAt: 'DESC' },
        });
        const vendorSummary = {};
        withdrawals.forEach((w) => {
            const vendorId = w.agentId;
            const vendorName = w.agent?.user?.firstName || 'Unknown';
            const amount = Number(w.amount);
            if (!vendorSummary[vendorId]) {
                vendorSummary[vendorId] = {
                    vendorName,
                    vendorId,
                    totalRequested: 0,
                    totalApproved: 0,
                    totalTransferred: 0,
                    totalRejected: 0,
                    requestCount: 0,
                    withdrawals: [],
                };
            }
            vendorSummary[vendorId].totalRequested += amount;
            vendorSummary[vendorId].requestCount++;
            if (w.status === withdrawal_request_entity_1.WithdrawalStatus.APPROVED) {
                vendorSummary[vendorId].totalApproved += amount;
            }
            else if (w.status === withdrawal_request_entity_1.WithdrawalStatus.TRANSFERRED) {
                vendorSummary[vendorId].totalTransferred += amount;
            }
            else if (w.status === withdrawal_request_entity_1.WithdrawalStatus.REJECTED) {
                vendorSummary[vendorId].totalRejected += amount;
            }
            vendorSummary[vendorId].withdrawals.push({
                id: w.id,
                amount: w.amount,
                status: w.status,
                createdAt: w.createdAt,
                paystackReference: w.paystackReference,
                paystackTransferCode: w.paystackTransferCode,
            });
        });
        return {
            dateRange: { startDate, endDate },
            totalVendors: Object.keys(vendorSummary).length,
            totalWithdrawals: withdrawals.length,
            totalAmount: withdrawals.reduce((sum, w) => sum + Number(w.amount), 0),
            vendorSummary: Object.values(vendorSummary),
        };
    }
    async creditWallet(agentId, amount, description, category = wallet_transaction_entity_1.TransactionCategory.OTHER) {
        const agent = await this.agentRepository.findOne({
            where: { id: agentId },
            relations: ['wallet', 'user'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        let wallet = agent.wallet;
        if (!wallet) {
            wallet = this.walletRepository.create({
                agent,
                balance: 0,
                pendingClearance: 0,
                lifetimeEarnings: 0,
            });
            await this.walletRepository.save(wallet);
        }
        const creditAmount = Number(amount);
        wallet.balance = Number(wallet.balance) + creditAmount;
        wallet.lifetimeEarnings = Number(wallet.lifetimeEarnings) + creditAmount;
        await this.walletRepository.save(wallet);
        const transaction = this.transactionRepository.create({
            type: wallet_transaction_entity_1.TransactionType.CREDIT,
            category,
            amount: creditAmount,
            balanceAfter: wallet.balance,
            description,
            wallet,
        });
        await this.transactionRepository.save(transaction);
        if (agent.user) {
            await this.notificationService.createNotification(agent.user.id, notification_entity_1.NotificationType.WALLET, 'Wallet Credited', `₦${creditAmount} has been credited to your wallet for: ${description}`, { amount: creditAmount }, 'paymentSuccessful');
        }
        return {
            message: 'Wallet credited successfully',
            balance: wallet.balance,
            transaction,
        };
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(1, (0, database_module_1.InjectRepository)(wallet_transaction_entity_1.WalletTransaction)),
    __param(2, (0, database_module_1.InjectRepository)(withdrawal_request_entity_1.WithdrawalRequest)),
    __param(3, (0, database_module_1.InjectRepository)(system_setting_entity_1.SystemSetting)),
    __param(4, (0, database_module_1.InjectRepository)(agent_entity_1.Agent)),
    __param(5, (0, database_module_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, notification_service_1.NotificationService,
        withdrawal_queue_service_1.WithdrawalQueueService,
        bank_account_service_1.BankAccountService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map