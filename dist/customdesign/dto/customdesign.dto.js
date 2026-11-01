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
exports.CustomDesignResponseDto = exports.ReviewCustomDesignDto = exports.ListCustomDesignsQueryDto = exports.UpdateCustomDesignDto = exports.SubmitCustomDesignDto = exports.SaveStepDto = exports.InitializeCustomDesignDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const customdesign_types_1 = require("../customdesign.types");
class InitializeCustomDesignDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { serviceType: { required: true, enum: require("../customdesign.types").ServiceType }, serviceContext: { required: true, type: () => String }, selectionMethod: { required: false, enum: require("../customdesign.types").SelectionMethod } };
    }
}
exports.InitializeCustomDesignDto = InitializeCustomDesignDto;
__decorate([
    (0, class_validator_1.IsEnum)(customdesign_types_1.ServiceType),
    __metadata("design:type", String)
], InitializeCustomDesignDto.prototype, "serviceType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializeCustomDesignDto.prototype, "serviceContext", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(customdesign_types_1.SelectionMethod),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InitializeCustomDesignDto.prototype, "selectionMethod", void 0);
class SaveStepDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { step: { required: true, type: () => Number, minimum: 1, maximum: 6 }, data: { required: true, type: "object", additionalProperties: true } };
    }
}
exports.SaveStepDto = SaveStepDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], SaveStepDto.prototype, "step", void 0);
class SubmitCustomDesignDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { agentId: { required: false, type: () => String, format: "uuid" }, serviceType: { required: true, enum: require("../customdesign.types").ServiceType }, serviceContext: { required: true, type: () => String }, projectType: { required: false, type: () => String }, scopeDeliverables: { required: false, type: () => [String], description: "Contains base package title AND any addon titles" }, sizeComplexity: { required: false, type: () => String }, style: { required: false, type: () => String }, budget: { required: false, type: () => Number, minimum: 0 }, timeline: { required: false, type: () => String }, additionalInformation: { required: false, type: () => String }, attachedFiles: { required: false, type: () => [String] }, selectionMethod: { required: false, enum: require("../customdesign.types").SelectionMethod } };
    }
}
exports.SubmitCustomDesignDto = SubmitCustomDesignDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitCustomDesignDto.prototype, "agentId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(customdesign_types_1.ServiceType),
    __metadata("design:type", String)
], SubmitCustomDesignDto.prototype, "serviceType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitCustomDesignDto.prototype, "serviceContext", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitCustomDesignDto.prototype, "projectType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SubmitCustomDesignDto.prototype, "scopeDeliverables", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitCustomDesignDto.prototype, "sizeComplexity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitCustomDesignDto.prototype, "style", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SubmitCustomDesignDto.prototype, "budget", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitCustomDesignDto.prototype, "timeline", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitCustomDesignDto.prototype, "additionalInformation", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SubmitCustomDesignDto.prototype, "attachedFiles", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(customdesign_types_1.SelectionMethod),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitCustomDesignDto.prototype, "selectionMethod", void 0);
class UpdateCustomDesignDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { serviceType: { required: false, enum: require("../customdesign.types").ServiceType }, serviceContext: { required: false, type: () => String }, projectType: { required: false, type: () => String }, scopeDeliverables: { required: false, type: () => [String] }, sizeComplexity: { required: false, type: () => String }, style: { required: false, type: () => String }, budget: { required: false, type: () => Number, minimum: 0 }, timeline: { required: false, type: () => String }, additionalInformation: { required: false, type: () => String }, attachedFiles: { required: false, type: () => [String] } };
    }
}
exports.UpdateCustomDesignDto = UpdateCustomDesignDto;
__decorate([
    (0, class_validator_1.IsEnum)(customdesign_types_1.ServiceType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCustomDesignDto.prototype, "serviceType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCustomDesignDto.prototype, "serviceContext", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCustomDesignDto.prototype, "projectType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateCustomDesignDto.prototype, "scopeDeliverables", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCustomDesignDto.prototype, "sizeComplexity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCustomDesignDto.prototype, "style", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateCustomDesignDto.prototype, "budget", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCustomDesignDto.prototype, "timeline", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCustomDesignDto.prototype, "additionalInformation", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateCustomDesignDto.prototype, "attachedFiles", void 0);
class ListCustomDesignsQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { serviceType: { required: false, enum: require("../customdesign.types").ServiceType }, status: { required: false, enum: require("../customdesign.types").CustomDesignStatus }, page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 10, minimum: 1 } };
    }
}
exports.ListCustomDesignsQueryDto = ListCustomDesignsQueryDto;
__decorate([
    (0, class_validator_1.IsEnum)(customdesign_types_1.ServiceType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListCustomDesignsQueryDto.prototype, "serviceType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(customdesign_types_1.CustomDesignStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListCustomDesignsQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ListCustomDesignsQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ListCustomDesignsQueryDto.prototype, "limit", void 0);
class ReviewCustomDesignDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { notes: { required: false, type: () => String } };
    }
}
exports.ReviewCustomDesignDto = ReviewCustomDesignDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReviewCustomDesignDto.prototype, "notes", void 0);
class CustomDesignResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId: { required: true, type: () => String }, user: { required: false, type: () => Object }, agentId: { required: false, type: () => String }, agent: { required: false, type: () => Object }, serviceType: { required: true, enum: require("../customdesign.types").ServiceType }, selectionMethod: { required: true, enum: require("../customdesign.types").SelectionMethod }, serviceContext: { required: true, type: () => String, description: "Step 1" }, projectType: { required: false, type: () => String, description: "Step 2" }, scopeDeliverables: { required: true, type: () => [String], description: "Step 3 \u2013 base package + addons combined" }, sizeComplexity: { required: false, type: () => String, description: "Step 4" }, style: { required: false, type: () => String, description: "Step 5" }, budget: { required: false, type: () => Number, description: "Step 6" }, timeline: { required: false, type: () => String }, additionalInformation: { required: false, type: () => String }, attachedFiles: { required: true, type: () => [String] }, currentStep: { required: true, type: () => Number }, status: { required: true, enum: require("../customdesign.types").CustomDesignStatus }, isSubmitted: { required: true, type: () => Boolean }, submittedAt: { required: false, type: () => Date }, estimateCost: { required: false, type: () => Number, description: "Server-computed estimate" }, estimateTimeline: { required: false, type: () => String }, estimateNotes: { required: false, type: () => String }, payment: { required: false, type: () => Object, description: "Associated payment details" }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.CustomDesignResponseDto = CustomDesignResponseDto;
//# sourceMappingURL=customdesign.dto.js.map