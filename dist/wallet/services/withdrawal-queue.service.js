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
var WithdrawalQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalQueueService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const withdrawal_request_entity_1 = require("../entities/withdrawal-request.entity");
const paystack_service_1 = require("./paystack.service");
const bank_account_service_1 = require("./bank-account.service");
const audit_log_service_1 = require("./audit-log.service");
const notification_service_1 = require("../../notification/notification.service");
const withdrawal_audit_log_entity_1 = require("../entities/withdrawal-audit-log.entity");
const notification_entity_1 = require("../../notification/entities/notification.entity");
const agent_entity_1 = require("../../agent/entities/agent.entity");
let WithdrawalQueueService = WithdrawalQueueService_1 = class WithdrawalQueueService {
    constructor(withdrawalRepository, agentRepository, paystackService, bankAccountService, auditLogService, notificationService) {
        this.withdrawalRepository = withdrawalRepository;
        this.agentRepository = agentRepository;
        this.paystackService = paystackService;
        this.bankAccountService = bankAccountService;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(WithdrawalQueueService_1.name);
    }
    async processWithdrawal(job) {
        const withdrawal = await this.withdrawalRepository.findOne({
            where: { id: job.withdrawalId },
            relations: ['agent', 'agent.user', 'agent.wallet'],
        });
        if (!withdrawal) {
            throw new common_1.BadRequestException(`Withdrawal ${job.withdrawalId} not found`);
        }
        try {
            if (withdrawal.status !== withdrawal_request_entity_1.WithdrawalStatus.APPROVED) {
                throw new common_1.BadRequestException(`Withdrawal status is ${withdrawal.status}, cannot process`);
            }
            const recipientCode = await this.bankAccountService.getRecipientCode(withdrawal.agentId);
            const amountInKobo = this.paystackService.convertToKobo(Number(withdrawal.amount));
            withdrawal.status = withdrawal_request_entity_1.WithdrawalStatus.PROCESSING;
            withdrawal.transferInitiatedAt = new Date();
            withdrawal.amountInKobo = amountInKobo;
            await this.withdrawalRepository.save(withdrawal);
            await this.auditLogService.logAction(withdrawal_audit_log_entity_1.AuditAction.TRANSFER_INITIATED, {
                withdrawalId: withdrawal.id,
                agentId: withdrawal.agentId,
                amount: withdrawal.amount,
                description: `Paystack transfer initiated for ₦${withdrawal.amount}`,
                metadata: {
                    amountInKobo,
                    recipientCode,
                },
            });
            let transferResult;
            try {
                transferResult = await this.paystackService.initiateTransfer(recipientCode, amountInKobo, `Vendor Withdrawal - ${withdrawal.id}`);
            }
            catch (paystackError) {
                return this.handleTransferFailure(withdrawal, paystackError.message);
            }
            withdrawal.paystackReference = transferResult.reference;
            withdrawal.paystackTransferCode = transferResult.transferCode;
            await this.withdrawalRepository.save(withdrawal);
            this.logger.log(`Withdrawal ${withdrawal.id} transfer initiated: ${transferResult.reference}`);
            if (withdrawal.agent?.user) {
                await this.notificationService.createNotification(withdrawal.agent.user.id, notification_entity_1.NotificationType.WITHDRAWAL, 'Withdrawal Processing', `Your withdrawal of ₦${withdrawal.amount} is being processed. Reference: ${transferResult.reference}`, {
                    withdrawalId: withdrawal.id,
                    amount: withdrawal.amount,
                    reference: transferResult.reference,
                }, 'paymentPending');
            }
            return {
                success: true,
                message: 'Withdrawal transfer initiated successfully',
                data: {
                    withdrawalId: withdrawal.id,
                    reference: transferResult.reference,
                    transferCode: transferResult.transferCode,
                },
            };
        }
        catch (error) {
            this.logger.error(`Error processing withdrawal ${job.withdrawalId}: ${error.message}`, error.stack);
            return this.handleTransferFailure(withdrawal, error.message || 'Unknown error occurred');
        }
    }
    async handleTransferFailure(withdrawal, errorMessage) {
        withdrawal.lastErrorMessage = errorMessage;
        withdrawal.retryCount += 1;
        if (withdrawal.retryCount >= withdrawal.maxRetries) {
            withdrawal.status = withdrawal_request_entity_1.WithdrawalStatus.FAILED;
            withdrawal.transferCompletedAt = new Date();
            await this.withdrawalRepository.save(withdrawal);
            await this.refundWithdrawal(withdrawal);
            await this.auditLogService.logAction(withdrawal_audit_log_entity_1.AuditAction.TRANSFER_FAILED, {
                withdrawalId: withdrawal.id,
                agentId: withdrawal.agentId,
                amount: withdrawal.amount,
                description: `Transfer failed after ${withdrawal.retryCount} attempts: ${errorMessage}`,
            });
            if (withdrawal.agent?.user) {
                await this.notificationService.createNotification(withdrawal.agent.user.id, notification_entity_1.NotificationType.WITHDRAWAL, 'Withdrawal Failed', `Your withdrawal of ₦${withdrawal.amount} failed. Funds have been refunded. Error: ${errorMessage}`, { withdrawalId: withdrawal.id, amount: withdrawal.amount }, 'paymentFailed');
            }
            return {
                success: false,
                message: `Transfer failed after ${withdrawal.retryCount} attempts: ${errorMessage}`,
            };
        }
        else {
            withdrawal.status = withdrawal_request_entity_1.WithdrawalStatus.APPROVED;
            await this.withdrawalRepository.save(withdrawal);
            await this.auditLogService.logAction(withdrawal_audit_log_entity_1.AuditAction.TRANSFER_FAILED, {
                withdrawalId: withdrawal.id,
                agentId: withdrawal.agentId,
                amount: withdrawal.amount,
                description: `Transfer attempt ${withdrawal.retryCount} failed. Will retry. Error: ${errorMessage}`,
            });
            return {
                success: false,
                message: `Transfer attempt ${withdrawal.retryCount} failed. Will retry later: ${errorMessage}`,
            };
        }
    }
    async refundWithdrawal(withdrawal) {
        const agent = await this.agentRepository.findOne({
            where: { id: withdrawal.agentId },
            relations: ['wallet'],
        });
        if (!agent?.wallet) {
            this.logger.error(`Cannot refund - agent or wallet not found for ${withdrawal.agentId}`);
            return;
        }
        const refundAmount = Number(withdrawal.amount);
        agent.wallet.balance = Number(agent.wallet.balance) + refundAmount;
        await this.agentRepository.manager.save(agent.wallet);
        this.logger.log(`Refunded ₦${refundAmount} to agent ${withdrawal.agentId} wallet`);
    }
    async handlePaystackWebhookCallback(webhookData) {
        const { event, data } = webhookData;
        if (!event?.startsWith('transfer')) {
            return;
        }
        const transferCode = data?.transfer_code;
        const reference = data?.reference;
        if (!transferCode && !reference) {
            this.logger.warn('Webhook received without transfer code or reference');
            return;
        }
        const withdrawal = await this.withdrawalRepository.findOne({
            where: { paystackTransferCode: transferCode },
            relations: ['agent', 'agent.user', 'agent.wallet'],
        });
        if (!withdrawal) {
            this.logger.warn(`Withdrawal not found for transfer code: ${transferCode}`);
            return;
        }
        if (event === 'transfer.success') {
            await this.handleTransferSuccess(withdrawal);
        }
        else if (event === 'transfer.failed') {
            await this.handleTransferFailed(withdrawal, data?.reason);
        }
        else if (event === 'transfer.reversed') {
            await this.handleTransferReversed(withdrawal);
        }
    }
    async handleTransferSuccess(withdrawal) {
        withdrawal.status = withdrawal_request_entity_1.WithdrawalStatus.TRANSFERRED;
        withdrawal.transferCompletedAt = new Date();
        await this.withdrawalRepository.save(withdrawal);
        await this.auditLogService.logAction(withdrawal_audit_log_entity_1.AuditAction.TRANSFER_SUCCESS, {
            withdrawalId: withdrawal.id,
            agentId: withdrawal.agentId,
            amount: withdrawal.amount,
            paystackTransferCode: withdrawal.paystackTransferCode,
            paystackReference: withdrawal.paystackReference,
            description: `Transfer successful: ₦${withdrawal.amount} transferred to vendor account`,
        });
        if (withdrawal.agent?.user) {
            await this.notificationService.createNotification(withdrawal.agent.user.id, notification_entity_1.NotificationType.WITHDRAWAL, 'Withdrawal Successful', `Your withdrawal of ₦${withdrawal.amount} has been successfully transferred to your account.`, { withdrawalId: withdrawal.id, amount: withdrawal.amount }, 'paymentSuccessful');
        }
        this.logger.log(`Withdrawal ${withdrawal.id} completed successfully`);
    }
    async handleTransferFailed(withdrawal, reason) {
        withdrawal.status = withdrawal_request_entity_1.WithdrawalStatus.FAILED;
        withdrawal.transferCompletedAt = new Date();
        withdrawal.lastErrorMessage = reason || 'Transfer failed';
        await this.withdrawalRepository.save(withdrawal);
        await this.refundWithdrawal(withdrawal);
        await this.auditLogService.logAction(withdrawal_audit_log_entity_1.AuditAction.TRANSFER_FAILED, {
            withdrawalId: withdrawal.id,
            agentId: withdrawal.agentId,
            amount: withdrawal.amount,
            paystackTransferCode: withdrawal.paystackTransferCode,
            description: `Transfer failed via webhook: ${reason}. Funds refunded.`,
        });
        if (withdrawal.agent?.user) {
            await this.notificationService.createNotification(withdrawal.agent.user.id, notification_entity_1.NotificationType.WITHDRAWAL, 'Withdrawal Failed', `Your withdrawal of ₦${withdrawal.amount} failed. Funds have been refunded. Reason: ${reason}`, { withdrawalId: withdrawal.id, amount: withdrawal.amount }, 'paymentFailed');
        }
        this.logger.warn(`Withdrawal ${withdrawal.id} failed: ${reason}`);
    }
    async handleTransferReversed(withdrawal) {
        withdrawal.status = withdrawal_request_entity_1.WithdrawalStatus.REVERSED;
        withdrawal.transferCompletedAt = new Date();
        await this.withdrawalRepository.save(withdrawal);
        await this.refundWithdrawal(withdrawal);
        await this.auditLogService.logAction(withdrawal_audit_log_entity_1.AuditAction.TRANSFER_REVERSED, {
            withdrawalId: withdrawal.id,
            agentId: withdrawal.agentId,
            amount: withdrawal.amount,
            paystackTransferCode: withdrawal.paystackTransferCode,
            description: `Transfer reversed. Funds refunded to wallet.`,
        });
        if (withdrawal.agent?.user) {
            await this.notificationService.createNotification(withdrawal.agent.user.id, notification_entity_1.NotificationType.WITHDRAWAL, 'Withdrawal Reversed', `Your withdrawal of ₦${withdrawal.amount} was reversed by the bank. Funds have been refunded to your wallet.`, { withdrawalId: withdrawal.id, amount: withdrawal.amount }, 'paymentReversed');
        }
        this.logger.log(`Withdrawal ${withdrawal.id} reversed`);
    }
    async retryFailedWithdrawals() {
        const failedWithdrawals = await this.withdrawalRepository.find({
            where: { status: withdrawal_request_entity_1.WithdrawalStatus.APPROVED, autoProcess: true },
            relations: ['agent'],
        });
        let successful = 0;
        let failed = 0;
        for (const withdrawal of failedWithdrawals) {
            try {
                const result = await this.processWithdrawal({
                    withdrawalId: withdrawal.id,
                    agentId: withdrawal.agentId,
                    amount: Number(withdrawal.amount),
                });
                if (result.success) {
                    successful++;
                }
                else {
                    failed++;
                }
            }
            catch (error) {
                this.logger.error(`Failed to retry withdrawal ${withdrawal.id}:`, error.message);
                failed++;
            }
        }
        this.logger.log(`Retry job completed: ${successful} successful, ${failed} failed out of ${failedWithdrawals.length}`);
        return {
            processed: failedWithdrawals.length,
            successful,
            failed,
        };
    }
};
exports.WithdrawalQueueService = WithdrawalQueueService;
exports.WithdrawalQueueService = WithdrawalQueueService = WithdrawalQueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(withdrawal_request_entity_1.WithdrawalRequest)),
    __param(1, (0, database_module_1.InjectRepository)(agent_entity_1.Agent)),
    __metadata("design:paramtypes", [Object, Object, paystack_service_1.PaystackService,
        bank_account_service_1.BankAccountService,
        audit_log_service_1.AuditLogService,
        notification_service_1.NotificationService])
], WithdrawalQueueService);
//# sourceMappingURL=withdrawal-queue.service.js.map