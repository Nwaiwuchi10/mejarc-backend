"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModule = void 0;
const common_1 = require("@nestjs/common");
const wallet_service_1 = require("./wallet.service");
const wallet_controller_1 = require("./wallet.controller");
const database_module_1 = require("../database/database.module");
const wallet_entity_1 = require("./entities/wallet.entity");
const wallet_transaction_entity_1 = require("./entities/wallet-transaction.entity");
const withdrawal_request_entity_1 = require("./entities/withdrawal-request.entity");
const bank_account_entity_1 = require("./entities/bank-account.entity");
const withdrawal_audit_log_entity_1 = require("./entities/withdrawal-audit-log.entity");
const system_setting_entity_1 = require("./entities/system-setting.entity");
const user_module_1 = require("../user/user.module");
const user_entity_1 = require("../user/entities/user.entity");
const agent_entity_1 = require("../agent/entities/agent.entity");
const admin_entity_1 = require("../admin/entities/admin.entity");
const notification_module_1 = require("../notification/notification.module");
const admin_module_1 = require("../admin/admin.module");
const paystack_service_1 = require("./services/paystack.service");
const bank_account_service_1 = require("./services/bank-account.service");
const audit_log_service_1 = require("./services/audit-log.service");
const withdrawal_queue_service_1 = require("./services/withdrawal-queue.service");
let WalletModule = class WalletModule {
};
exports.WalletModule = WalletModule;
exports.WalletModule = WalletModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.TypeOrmModule.forFeature([
                wallet_entity_1.Wallet,
                wallet_transaction_entity_1.WalletTransaction,
                withdrawal_request_entity_1.WithdrawalRequest,
                bank_account_entity_1.BankAccount,
                withdrawal_audit_log_entity_1.WithdrawalAuditLog,
                system_setting_entity_1.SystemSetting,
                user_entity_1.User,
                agent_entity_1.Agent,
                admin_entity_1.Admin,
            ]),
            user_module_1.UserModule,
            notification_module_1.NotificationModule,
            (0, common_1.forwardRef)(() => admin_module_1.AdminModule),
        ],
        controllers: [wallet_controller_1.WalletController],
        providers: [
            wallet_service_1.WalletService,
            paystack_service_1.PaystackService,
            bank_account_service_1.BankAccountService,
            audit_log_service_1.AuditLogService,
            withdrawal_queue_service_1.WithdrawalQueueService,
        ],
        exports: [
            wallet_service_1.WalletService,
            paystack_service_1.PaystackService,
            bank_account_service_1.BankAccountService,
            audit_log_service_1.AuditLogService,
            withdrawal_queue_service_1.WithdrawalQueueService,
        ],
    })
], WalletModule);
//# sourceMappingURL=wallet.module.js.map