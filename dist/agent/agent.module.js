"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentModule = void 0;
const common_1 = require("@nestjs/common");
const agent_service_1 = require("./agent.service");
const agent_controller_1 = require("./agent.controller");
const database_module_1 = require("../database/database.module");
const agent_entity_1 = require("./entities/agent.entity");
const agent_profile_entity_1 = require("./entities/agent-profile.entity");
const agent_bio_entity_1 = require("./entities/agent-bio.entity");
const agent_kyc_entity_1 = require("./entities/agent-kyc.entity");
const user_entity_1 = require("../user/entities/user.entity");
const admin_entity_1 = require("../admin/entities/admin.entity");
const marketproduct_entity_1 = require("../marketproduct/entities/marketproduct.entity");
const customdesign_entity_1 = require("../customdesign/entities/customdesign.entity");
const wallet_entity_1 = require("../wallet/entities/wallet.entity");
const wallet_transaction_entity_1 = require("../wallet/entities/wallet-transaction.entity");
const withdrawal_request_entity_1 = require("../wallet/entities/withdrawal-request.entity");
const notification_entity_1 = require("../notification/entities/notification.entity");
const agent_analytics_service_1 = require("./agent-analytics.service");
const platform_express_1 = require("@nestjs/platform-express");
const uverify_provider_1 = require("./provider/uverify.provider");
const mail_service_1 = require("./service/mail.service");
const user_module_1 = require("../user/user.module");
const notification_module_1 = require("../notification/notification.module");
let AgentModule = class AgentModule {
};
exports.AgentModule = AgentModule;
exports.AgentModule = AgentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register(),
            database_module_1.TypeOrmModule.forFeature([
                agent_entity_1.Agent,
                agent_profile_entity_1.AgentProfile,
                agent_bio_entity_1.AgentBio,
                agent_kyc_entity_1.AgentKyc,
                user_entity_1.User,
                admin_entity_1.Admin,
                marketproduct_entity_1.MarketProduct,
                customdesign_entity_1.CustomDesign,
                wallet_entity_1.Wallet,
                wallet_transaction_entity_1.WalletTransaction,
                withdrawal_request_entity_1.WithdrawalRequest,
                notification_entity_1.Notification,
            ]),
            user_module_1.UserModule,
            notification_module_1.NotificationModule,
        ],
        controllers: [agent_controller_1.AgentController],
        providers: [
            agent_service_1.AgentService,
            uverify_provider_1.UverifyKycProvider,
            mail_service_1.AgentMailService,
            agent_analytics_service_1.AgentAnalyticsService,
        ],
        exports: [agent_service_1.AgentService, mail_service_1.AgentMailService, agent_analytics_service_1.AgentAnalyticsService],
    })
], AgentModule);
//# sourceMappingURL=agent.module.js.map