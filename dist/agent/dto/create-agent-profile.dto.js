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
exports.CreateAgentProfileDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const agent_profile_entity_1 = require("../entities/agent-profile.entity");
class CreateAgentProfileDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { yearsOfExperience: { required: true, type: () => Number, minimum: 0, maximum: 70 }, preferredTitle: { required: true, enum: require("../entities/agent-profile.entity").ProfessionalTitle }, licenseNumber: { required: false, type: () => String, description: "Required when preferredTitle is 'Architect' or 'Structural Engineer'." }, specialization: { required: true, type: () => [String] }, portfolioLink: { required: false, type: () => String }, profilePicture: { required: false, type: () => String }, phoneNumber: { required: false, type: () => String }, location: { required: false, type: () => String }, responseTime: { required: false, type: () => String }, completedProjectsCount: { required: false, type: () => Number } };
    }
}
exports.CreateAgentProfileDto = CreateAgentProfileDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(70),
    __metadata("design:type", Number)
], CreateAgentProfileDto.prototype, "yearsOfExperience", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(agent_profile_entity_1.ProfessionalTitle, {
        message: `preferredTitle must be one of: ${Object.values(agent_profile_entity_1.ProfessionalTitle).join(', ')}`,
    }),
    __metadata("design:type", String)
], CreateAgentProfileDto.prototype, "preferredTitle", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => agent_profile_entity_1.TITLES_REQUIRING_LICENSE.includes(o.preferredTitle)),
    (0, class_validator_1.IsNotEmpty)({ message: 'licenseNumber is required for your selected title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentProfileDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateAgentProfileDto.prototype, "specialization", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAgentProfileDto.prototype, "portfolioLink", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAgentProfileDto.prototype, "profilePicture", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAgentProfileDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAgentProfileDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAgentProfileDto.prototype, "responseTime", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAgentProfileDto.prototype, "completedProjectsCount", void 0);
//# sourceMappingURL=create-agent-profile.dto.js.map