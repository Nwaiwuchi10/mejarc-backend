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
exports.BankAccountService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const bank_account_entity_1 = require("../entities/bank-account.entity");
const agent_entity_1 = require("../../agent/entities/agent.entity");
const paystack_service_1 = require("./paystack.service");
let BankAccountService = class BankAccountService {
    constructor(bankAccountRepository, agentRepository, paystackService) {
        this.bankAccountRepository = bankAccountRepository;
        this.agentRepository = agentRepository;
        this.paystackService = paystackService;
    }
    async getAgentIdByUserId(userId) {
        const agent = await this.agentRepository.findOne({
            where: { userId },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent profile not found for this user');
        }
        return agent.id;
    }
    async registerBankAccount(agentId, registerDto) {
        const agent = await this.agentRepository.findOne({
            where: { id: agentId },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const existingAccount = await this.bankAccountRepository.findOne({
            where: {
                agentId,
                accountNumber: registerDto.accountNumber,
                bankCode: registerDto.bankCode,
            },
        });
        if (existingAccount &&
            existingAccount.status === bank_account_entity_1.BankAccountStatus.VERIFIED) {
            throw new common_1.ConflictException('This bank account is already verified for your account');
        }
        const bankAccount = this.bankAccountRepository.create({
            agentId,
            accountHolderName: registerDto.accountHolderName.trim(),
            accountNumber: registerDto.accountNumber.trim(),
            bankCode: registerDto.bankCode.trim(),
            bankName: registerDto.bankName.trim(),
            status: bank_account_entity_1.BankAccountStatus.PENDING,
            isDefault: true,
        });
        try {
            return await this.bankAccountRepository.save(bankAccount);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to register bank account');
        }
    }
    async verifyBankAccount(agentId, bankAccountId, verifyDto) {
        const bankAccount = await this.bankAccountRepository.findOne({
            where: { id: bankAccountId, agentId },
        });
        if (!bankAccount) {
            throw new common_1.NotFoundException('Bank account not found');
        }
        if (bankAccount.status === bank_account_entity_1.BankAccountStatus.VERIFIED) {
            throw new common_1.ConflictException('This bank account is already verified');
        }
        try {
            const verificationResult = await this.paystackService.verifyBankAccount(verifyDto.accountNumber, verifyDto.bankCode);
            const recipientResult = await this.paystackService.createTransferRecipient({
                name: bankAccount.accountHolderName,
                accountNumber: verifyDto.accountNumber,
                bankCode: verifyDto.bankCode,
            });
            bankAccount.status = bank_account_entity_1.BankAccountStatus.VERIFIED;
            bankAccount.resolvedAccountName = verificationResult.accountName;
            bankAccount.paystackRecipientCode = recipientResult.recipientCode;
            bankAccount.verifiedAt = new Date();
            return await this.bankAccountRepository.save(bankAccount);
        }
        catch (error) {
            bankAccount.status = bank_account_entity_1.BankAccountStatus.REJECTED;
            bankAccount.rejectionReason = error.message;
            bankAccount.rejectedAt = new Date();
            await this.bankAccountRepository.save(bankAccount);
            throw new common_1.BadRequestException(`Bank account verification failed: ${error.message}`);
        }
    }
    async getBankAccounts(agentId) {
        const agent = await this.agentRepository.findOne({
            where: { id: agentId },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return this.bankAccountRepository.find({
            where: { agentId },
            order: { createdAt: 'DESC' },
        });
    }
    async getDefaultBankAccount(agentId) {
        const account = await this.bankAccountRepository.findOne({
            where: {
                agentId,
                isDefault: true,
                status: bank_account_entity_1.BankAccountStatus.VERIFIED,
            },
        });
        return account || null;
    }
    async setDefaultBankAccount(agentId, bankAccountId) {
        const bankAccount = await this.bankAccountRepository.findOne({
            where: { id: bankAccountId, agentId },
        });
        if (!bankAccount) {
            throw new common_1.NotFoundException('Bank account not found');
        }
        if (bankAccount.status !== bank_account_entity_1.BankAccountStatus.VERIFIED) {
            throw new common_1.BadRequestException('Only verified accounts can be set as default');
        }
        await this.bankAccountRepository.update({ agentId, isDefault: true }, { isDefault: false });
        bankAccount.isDefault = true;
        return await this.bankAccountRepository.save(bankAccount);
    }
    async deleteBankAccount(agentId, bankAccountId) {
        const bankAccount = await this.bankAccountRepository.findOne({
            where: { id: bankAccountId, agentId },
        });
        if (!bankAccount) {
            throw new common_1.NotFoundException('Bank account not found');
        }
        if (bankAccount.isDefault) {
            throw new common_1.BadRequestException('Cannot delete default bank account. Set another account as default first.');
        }
        bankAccount.status = bank_account_entity_1.BankAccountStatus.REJECTED;
        bankAccount.rejectionReason = 'Deleted by user';
        bankAccount.rejectedAt = new Date();
        await this.bankAccountRepository.save(bankAccount);
    }
    async getRecipientCode(agentId) {
        const bankAccount = await this.getDefaultBankAccount(agentId);
        if (!bankAccount || !bankAccount.paystackRecipientCode) {
            throw new common_1.BadRequestException('No verified bank account found. Please verify your bank account first.');
        }
        return bankAccount.paystackRecipientCode;
    }
    async getAccountDetailsForWithdrawal(agentId) {
        const bankAccount = await this.getDefaultBankAccount(agentId);
        if (!bankAccount) {
            throw new common_1.BadRequestException('No verified bank account found for withdrawals');
        }
        return {
            accountNumber: bankAccount.accountNumber,
            bankName: bankAccount.bankName,
            accountHolderName: bankAccount.accountHolderName,
            resolvedName: bankAccount.resolvedAccountName || '',
        };
    }
    async validateWithdrawalEligibility(agentId) {
        const bankAccount = await this.getDefaultBankAccount(agentId);
        return !!bankAccount;
    }
    async registerBankAccountByUserId(userId, registerDto) {
        const agentId = await this.getAgentIdByUserId(userId);
        return this.registerBankAccount(agentId, registerDto);
    }
    async verifyBankAccountByUserId(userId, bankAccountId, verifyDto) {
        const agentId = await this.getAgentIdByUserId(userId);
        return this.verifyBankAccount(agentId, bankAccountId, verifyDto);
    }
    async getBankAccountsByUserId(userId) {
        const agentId = await this.getAgentIdByUserId(userId);
        return this.getBankAccounts(agentId);
    }
    async setDefaultBankAccountByUserId(userId, bankAccountId) {
        const agentId = await this.getAgentIdByUserId(userId);
        return this.setDefaultBankAccount(agentId, bankAccountId);
    }
    async deleteBankAccountByUserId(userId, bankAccountId) {
        const agentId = await this.getAgentIdByUserId(userId);
        return this.deleteBankAccount(agentId, bankAccountId);
    }
};
exports.BankAccountService = BankAccountService;
exports.BankAccountService = BankAccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(bank_account_entity_1.BankAccount)),
    __param(1, (0, database_module_1.InjectRepository)(agent_entity_1.Agent)),
    __metadata("design:paramtypes", [Object, Object, paystack_service_1.PaystackService])
], BankAccountService);
//# sourceMappingURL=bank-account.service.js.map