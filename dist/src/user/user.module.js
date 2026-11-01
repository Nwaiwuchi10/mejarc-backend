"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const mail_service_1 = require("./service/mail.service");
const user_guard_1 = require("./guard/user.guard");
const database_module_1 = require("../database/database.module");
const user_entity_1 = require("./entities/user.entity");
const user_adress_entity_1 = require("./entities/user-adress.entity");
const user_notification_setting_entity_1 = require("./entities/user-notification-setting.entity");
const agent_entity_1 = require("../agent/entities/agent.entity");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                user_adress_entity_1.UserAddress,
                user_notification_setting_entity_1.UserNotificationSetting,
                agent_entity_1.Agent,
            ]),
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, mail_service_1.MailService, user_guard_1.UserAuthGuard],
        exports: [mail_service_1.MailService, user_guard_1.UserAuthGuard, user_service_1.UserService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map