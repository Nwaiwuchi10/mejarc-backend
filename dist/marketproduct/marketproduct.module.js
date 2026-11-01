"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketproductModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const marketproduct_service_1 = require("./marketproduct.service");
const marketproduct_controller_1 = require("./marketproduct.controller");
const marketproduct_entity_1 = require("./entities/marketproduct.entity");
const rating_entity_1 = require("./entities/rating.entity");
const agent_entity_1 = require("../agent/entities/agent.entity");
const agent_module_1 = require("../agent/agent.module");
const platform_express_1 = require("@nestjs/platform-express");
const mail_service_1 = require("./service/mail.service");
const notification_module_1 = require("../notification/notification.module");
let MarketproductModule = class MarketproductModule {
};
exports.MarketproductModule = MarketproductModule;
exports.MarketproductModule = MarketproductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.TypeOrmModule.forFeature([marketproduct_entity_1.MarketProduct, agent_entity_1.Agent, rating_entity_1.Rating]),
            agent_module_1.AgentModule,
            platform_express_1.MulterModule.register(),
            notification_module_1.NotificationModule,
        ],
        controllers: [marketproduct_controller_1.MarketproductController],
        providers: [marketproduct_service_1.MarketproductService, mail_service_1.MarketProductMailService],
        exports: [marketproduct_service_1.MarketproductService, mail_service_1.MarketProductMailService],
    })
], MarketproductModule);
//# sourceMappingURL=marketproduct.module.js.map