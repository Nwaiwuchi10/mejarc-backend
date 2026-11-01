"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const wallet_module_1 = require("../wallet/wallet.module");
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const admin_entity_1 = require("./entities/admin.entity");
const user_entity_1 = require("../user/entities/user.entity");
const agent_entity_1 = require("../agent/entities/agent.entity");
const order_entity_1 = require("../order/entities/order.entity");
const marketproduct_entity_1 = require("../marketproduct/entities/marketproduct.entity");
const conversation_entity_1 = require("../chat/entities/conversation.entity");
const message_entity_1 = require("../chat/entities/message.entity");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const admin_auth_guard_1 = require("./guards/admin-auth.guard");
const agent_module_1 = require("../agent/agent.module");
const user_module_1 = require("../user/user.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.TypeOrmModule.forFeature([
                admin_entity_1.Admin,
                user_entity_1.User,
                agent_entity_1.Agent,
                order_entity_1.Order,
                marketproduct_entity_1.MarketProduct,
                conversation_entity_1.Conversation,
                message_entity_1.Message,
            ]),
            agent_module_1.AgentModule,
            user_module_1.UserModule,
            (0, common_1.forwardRef)(() => wallet_module_1.WalletModule),
        ],
        providers: [admin_service_1.AdminService, admin_auth_guard_1.AdminAuthGuard],
        controllers: [admin_controller_1.AdminController],
        exports: [admin_service_1.AdminService, admin_auth_guard_1.AdminAuthGuard],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map