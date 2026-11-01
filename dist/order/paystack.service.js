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
exports.PaystackService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const PaystackConstants_1 = require("./PaystackConstants");
const database_module_1 = require("../database/database.module");
const user_entity_1 = require("../user/entities/user.entity");
let PaystackService = class PaystackService {
    constructor(userRepository, configService) {
        this.userRepository = userRepository;
        this.configService = configService;
    }
    async initializePayment(userId, amount, redirect_url, email) {
        try {
            if (userId) {
                const user = await this.userRepository.findOne({
                    where: { id: userId },
                });
                if (!user) {
                    throw new common_1.BadRequestException('User not found');
                }
                email = user.email;
            }
            else {
                if (!email) {
                    throw new common_1.BadRequestException('Email is required for guest payments');
                }
                email = email;
            }
            const metadata = {
                app_name: 'Mejarc',
                custom_fields: [
                    {
                        display_name: 'App Name',
                        variable_name: 'app_name',
                        value: 'Mejarc',
                    },
                    {
                        display_name: 'App Name',
                        variable_name: 'app_name',
                        value: 'Mejarc',
                    },
                ],
            };
            const payload = {
                email,
                amount: Math.round(amount * 100),
                currency: 'NGN',
                callback_url: redirect_url,
                metadata,
            };
            const headers = {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            };
            const response = await axios_1.default.post(PaystackConstants_1.PAYSTACK_TRANSACTION_INI_URL, payload, {
                headers,
            });
            return {
                ...response.data,
                metadata,
            };
        }
        catch (err) {
            console.error('Paystack error:', err.response?.data || err.message);
            throw new common_1.BadRequestException(err.response?.data?.message || 'Payment initialization failed');
        }
    }
    async initializePayments(userId, grandTotal, redirect_url) {
        if (!this.configService) {
            throw new Error('ConfigService is not initialized');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.BadRequestException(`User with ID ${userId} not found`);
        const response = await axios_1.default.post(PaystackConstants_1.PAYSTACK_TRANSACTION_INI_URL, {
            email: user.email,
            amount: grandTotal * 100,
            currency: 'NGN',
            callback_url: redirect_url,
        }, {
            headers: {
                Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('Paystack Response:', response.data);
        if (!response.data.data.reference) {
            throw new common_1.BadRequestException('Paystack failed to generate a payment reference.');
        }
        return response.data;
    }
};
exports.PaystackService = PaystackService;
exports.PaystackService = PaystackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], PaystackService);
//# sourceMappingURL=paystack.service.js.map