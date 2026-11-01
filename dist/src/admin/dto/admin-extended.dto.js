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
exports.ChangeAdminPasswordDto = exports.UpdateAdminProfileDto = exports.AssignRoleDto = exports.UpdateRoleDto = exports.CreateRoleDto = exports.AdminProjectActionDto = exports.AssignAgentDto = exports.AdminRequestChangeDto = exports.AdminMarketActionDto = exports.ReleasePayoutDto = exports.ApproveRefundDto = exports.ResolveDisputeDto = exports.AdminEscalateConversationDto = exports.AdminSendMessageDto = exports.UpdateUserStatusDto = exports.AdminPaginatedQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const class_validator_2 = require("class-validator");
class AdminPaginatedQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 20, minimum: 1 }, search: { required: false, type: () => String }, status: { required: false, type: () => String }, type: { required: false, type: () => String }, tab: { required: false, type: () => String }, userType: { required: false, type: () => String }, isApproved: { required: false, type: () => Object }, role: { required: false, type: () => String } };
    }
}
exports.AdminPaginatedQueryDto = AdminPaginatedQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_2.IsInt)(),
    (0, class_validator_2.Min)(1),
    __metadata("design:type", Number)
], AdminPaginatedQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_2.IsInt)(),
    (0, class_validator_2.Min)(1),
    __metadata("design:type", Number)
], AdminPaginatedQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminPaginatedQueryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminPaginatedQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminPaginatedQueryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminPaginatedQueryDto.prototype, "tab", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminPaginatedQueryDto.prototype, "userType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], AdminPaginatedQueryDto.prototype, "isApproved", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminPaginatedQueryDto.prototype, "role", void 0);
class UpdateUserStatusDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { reason: { required: false, type: () => String } };
    }
}
exports.UpdateUserStatusDto = UpdateUserStatusDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserStatusDto.prototype, "reason", void 0);
class AdminSendMessageDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { text: { required: true, type: () => String }, attachments: { required: false, type: () => [String] } };
    }
}
exports.AdminSendMessageDto = AdminSendMessageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminSendMessageDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AdminSendMessageDto.prototype, "attachments", void 0);
class AdminEscalateConversationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { reason: { required: true, type: () => String } };
    }
}
exports.AdminEscalateConversationDto = AdminEscalateConversationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminEscalateConversationDto.prototype, "reason", void 0);
class ResolveDisputeDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { resolution: { required: true, type: () => String }, refundTo: { required: false, enum: ["agent", "customer"] } };
    }
}
exports.ResolveDisputeDto = ResolveDisputeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResolveDisputeDto.prototype, "resolution", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResolveDisputeDto.prototype, "refundTo", void 0);
class ApproveRefundDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { notes: { required: false, type: () => String } };
    }
}
exports.ApproveRefundDto = ApproveRefundDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveRefundDto.prototype, "notes", void 0);
class ReleasePayoutDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { notes: { required: false, type: () => String } };
    }
}
exports.ReleasePayoutDto = ReleasePayoutDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReleasePayoutDto.prototype, "notes", void 0);
class AdminMarketActionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { reason: { required: false, type: () => String } };
    }
}
exports.AdminMarketActionDto = AdminMarketActionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminMarketActionDto.prototype, "reason", void 0);
class AdminRequestChangeDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { feedback: { required: true, type: () => String } };
    }
}
exports.AdminRequestChangeDto = AdminRequestChangeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminRequestChangeDto.prototype, "feedback", void 0);
class AssignAgentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { agentId: { required: true, type: () => String } };
    }
}
exports.AssignAgentDto = AssignAgentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignAgentDto.prototype, "agentId", void 0);
class AdminProjectActionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { reason: { required: false, type: () => String } };
    }
}
exports.AdminProjectActionDto = AdminProjectActionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminProjectActionDto.prototype, "reason", void 0);
class CreateRoleDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, department: { required: true, type: () => String }, permissions: { required: false, type: () => String } };
    }
}
exports.CreateRoleDto = CreateRoleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "department", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "permissions", void 0);
class UpdateRoleDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, department: { required: false, type: () => String }, permissions: { required: false, type: () => String } };
    }
}
exports.UpdateRoleDto = UpdateRoleDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "department", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "permissions", void 0);
class AssignRoleDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { roleId: { required: true, type: () => String }, department: { required: false, type: () => String } };
    }
}
exports.AssignRoleDto = AssignRoleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "roleId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "department", void 0);
class UpdateAdminProfileDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: false, type: () => String }, lastName: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, phoneNumber: { required: false, type: () => String }, profilePics: { required: false, type: () => String } };
    }
}
exports.UpdateAdminProfileDto = UpdateAdminProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdminProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdminProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateAdminProfileDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdminProfileDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdminProfileDto.prototype, "profilePics", void 0);
class ChangeAdminPasswordDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { currentPassword: { required: true, type: () => String }, newPassword: { required: true, type: () => String, minLength: 6 } };
    }
}
exports.ChangeAdminPasswordDto = ChangeAdminPasswordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangeAdminPasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], ChangeAdminPasswordDto.prototype, "newPassword", void 0);
//# sourceMappingURL=admin-extended.dto.js.map