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
exports.PaystackService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const crypto = require("crypto");
let PaystackService = class PaystackService {
    constructor() {
        this.baseUrl = 'https://api.paystack.co';
        this.apiKey = process.env.PAYSTACK_SECRET_KEY || '';
        if (!this.apiKey) {
            console.warn('PAYSTACK_SECRET_KEY is not configured. Paystack features will be disabled until key is provided.');
        }
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }
    async verifyBankAccount(accountNumber, bankCode) {
        try {
            const response = await this.client.get(`/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`);
            if (!response.data.status) {
                throw new common_1.BadRequestException(`Account verification failed: ${response.data.message}`);
            }
            return {
                accountName: response.data.data?.account_name || 'Unknown',
            };
        }
        catch (error) {
            const message = error.response?.data?.message ||
                error.message ||
                'Bank verification failed';
            throw new common_1.BadRequestException(`Bank verification error: ${message}`);
        }
    }
    async createTransferRecipient(recipientData) {
        try {
            const payload = {
                type: recipientData.type || 'nuban',
                name: recipientData.name,
                account_number: recipientData.accountNumber,
                bank_code: recipientData.bankCode,
                currency: recipientData.currency || 'NGN',
            };
            const response = await this.client.post('/transferrecipient', payload);
            if (!response.data.status) {
                throw new common_1.BadRequestException(`Recipient creation failed: ${response.data.message}`);
            }
            return {
                recipientCode: response.data.data?.recipient_code || '',
            };
        }
        catch (error) {
            const message = error.response?.data?.message ||
                error.message ||
                'Recipient creation failed';
            throw new common_1.BadRequestException(`Paystack error: ${message}`);
        }
    }
    async initiateTransfer(recipientCode, amountInKobo, reason = 'Vendor Withdrawal') {
        try {
            const payload = {
                source: 'balance',
                amount: amountInKobo,
                recipient: recipientCode,
                reason: reason,
            };
            const response = await this.client.post('/transfer', payload);
            if (!response.data.status) {
                throw new common_1.BadRequestException(`Transfer initiation failed: ${response.data.message}`);
            }
            const transferData = response.data.data;
            return {
                reference: transferData?.reference || '',
                transferCode: transferData?.transfer_code || '',
                amount: transferData?.amount || 0,
                status: transferData?.status || 'pending',
            };
        }
        catch (error) {
            const message = error.response?.data?.message ||
                error.message ||
                'Transfer initiation failed';
            throw new common_1.BadRequestException(`Transfer error: ${message}`);
        }
    }
    verifyWebhookSignature(payload, signature) {
        const hash = crypto
            .createHmac('sha512', this.apiKey)
            .update(payload)
            .digest('hex');
        return hash === signature;
    }
    parseWebhookEvent(event) {
        const data = event.data || {};
        return {
            eventType: event.event || '',
            transferReference: data.reference || '',
            transferCode: data.transfer_code || '',
            amount: data.amount || 0,
            status: data.status || '',
            recipientCode: data.recipient?.recipient_code || '',
            reason: data.reason || '',
            createdAt: data.created_at || new Date().toISOString(),
        };
    }
    convertToKobo(amountInNaira) {
        return Math.round(amountInNaira * 100);
    }
    convertToNaira(amountInKobo) {
        return Math.round((amountInKobo / 100) * 100) / 100;
    }
    async getTransferDetails(transferCode) {
        try {
            const response = await this.client.get(`/transfer/verify/${transferCode}`);
            if (!response.data.status) {
                throw new common_1.BadRequestException(`Transfer lookup failed: ${response.data.message}`);
            }
            const data = response.data.data;
            return {
                reference: data?.reference || '',
                amount: data?.amount || 0,
                status: data?.status || '',
                reason: data?.reason || '',
            };
        }
        catch (error) {
            const message = error.response?.data?.message ||
                error.message ||
                'Transfer lookup failed';
            throw new common_1.BadRequestException(`Transfer lookup error: ${message}`);
        }
    }
    async getBankList() {
        try {
            const response = await this.client.get('/bank');
            if (!response.data.status) {
                throw new common_1.BadRequestException('Failed to fetch bank list');
            }
            return response.data.data || [];
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch banks');
        }
    }
};
exports.PaystackService = PaystackService;
exports.PaystackService = PaystackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PaystackService);
//# sourceMappingURL=paystack.service.js.map