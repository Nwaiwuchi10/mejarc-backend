"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const order_service_1 = require("./order.service");
const order_controller_1 = require("./order.controller");
const order_entity_1 = require("./entities/order.entity");
const user_entity_1 = require("../user/entities/user.entity");
const marketproduct_entity_1 = require("../marketproduct/entities/marketproduct.entity");
const admin_entity_1 = require("../admin/entities/admin.entity");
const paystack_service_1 = require("./paystack.service");
const mail_service_1 = require("./Services/mail.service");
const wallet_entity_1 = require("../wallet/entities/wallet.entity");
const wallet_transaction_entity_1 = require("../wallet/entities/wallet-transaction.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const notification_module_1 = require("../notification/notification.module");
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.TypeOrmModule.forFeature([
                order_entity_1.Order,
                order_item_entity_1.OrderItem,
                user_entity_1.User,
                marketproduct_entity_1.MarketProduct,
                admin_entity_1.Admin,
                wallet_entity_1.Wallet,
                wallet_transaction_entity_1.WalletTransaction,
            ]),
            notification_module_1.NotificationModule,
        ],
        controllers: [order_controller_1.OrderController],
        providers: [order_service_1.OrderService, mail_service_1.MailService, paystack_service_1.PaystackService],
    })
], OrderModule);
//# sourceMappingURL=order.module.js.map