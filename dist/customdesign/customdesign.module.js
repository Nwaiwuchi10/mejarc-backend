"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDesignModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const customdesign_entity_1 = require("./entities/customdesign.entity");
const custom_design_payment_entity_1 = require("./entities/custom-design-payment.entity");
const customdesign_service_1 = require("./customdesign.service");
const customdesign_controller_1 = require("./customdesign.controller");
const user_module_1 = require("../user/user.module");
const agent_module_1 = require("../agent/agent.module");
const wallet_module_1 = require("../wallet/wallet.module");
const notification_module_1 = require("../notification/notification.module");
const admin_entity_1 = require("../admin/entities/admin.entity");
const agent_entity_1 = require("../agent/entities/agent.entity");
const project_milestone_entity_1 = require("./entities/project-milestone.entity");
const project_activity_entity_1 = require("./entities/project-activity.entity");
const project_file_entity_1 = require("./entities/project-file.entity");
const customdesign_workspace_controller_1 = require("./customdesign-workspace.controller");
const customdesign_workspace_service_1 = require("./customdesign-workspace.service");
let CustomDesignModule = class CustomDesignModule {
};
exports.CustomDesignModule = CustomDesignModule;
exports.CustomDesignModule = CustomDesignModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.TypeOrmModule.forFeature([
                customdesign_entity_1.CustomDesign,
                custom_design_payment_entity_1.CustomDesignPayment,
                admin_entity_1.Admin,
                agent_entity_1.Agent,
                project_milestone_entity_1.ProjectMilestone,
                project_activity_entity_1.ProjectActivity,
                project_file_entity_1.ProjectFile,
            ]),
            user_module_1.UserModule,
            agent_module_1.AgentModule,
            wallet_module_1.WalletModule,
            notification_module_1.NotificationModule,
        ],
        controllers: [customdesign_controller_1.CustomDesignController, customdesign_workspace_controller_1.CustomDesignWorkspaceController],
        providers: [customdesign_service_1.CustomDesignService, customdesign_workspace_service_1.CustomDesignWorkspaceService],
        exports: [customdesign_service_1.CustomDesignService, customdesign_workspace_service_1.CustomDesignWorkspaceService],
    })
], CustomDesignModule);
//# sourceMappingURL=customdesign.module.js.map