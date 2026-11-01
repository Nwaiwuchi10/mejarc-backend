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
exports.CreateMarketproductDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const marketproduct_entity_1 = require("../entities/marketproduct.entity");
class CreateMarketproductDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, category: { required: true, enum: require("../entities/marketproduct.entity").ProductCategory }, planType: { required: true, enum: require("../entities/marketproduct.entity").PlanType }, numBedrooms: { required: false, type: () => String }, numBathrooms: { required: false, type: () => String }, numFloors: { required: false, type: () => String }, area: { required: false, type: () => String }, price: { required: true, type: () => Number }, description: { required: true, type: () => String }, fileType: { required: true, enum: require("../entities/marketproduct.entity").FileTypeOption }, drawingSet: { required: false, type: () => [String] }, addOns: { required: false, type: () => [String] }, productImage: { required: false, type: () => [String] }, architecturalPlan: { required: false, type: () => [String] }, structuralPlan: { required: false, type: () => [String] }, electricalPlan: { required: false, type: () => [String] }, mechanicalPlan: { required: false, type: () => [String] }, architecturalPlanFileType: { required: false, type: () => String }, structuralPlanFileType: { required: false, type: () => String }, electricalPlanFileType: { required: false, type: () => String }, mechanicalPlanFileType: { required: false, type: () => String } };
    }
}
exports.CreateMarketproductDto = CreateMarketproductDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(marketproduct_entity_1.ProductCategory),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(marketproduct_entity_1.PlanType),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "planType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "numBedrooms", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "numBathrooms", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "numFloors", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "area", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateMarketproductDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(marketproduct_entity_1.FileTypeOption),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "fileType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMarketproductDto.prototype, "drawingSet", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMarketproductDto.prototype, "addOns", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMarketproductDto.prototype, "productImage", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMarketproductDto.prototype, "architecturalPlan", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMarketproductDto.prototype, "structuralPlan", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMarketproductDto.prototype, "electricalPlan", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMarketproductDto.prototype, "mechanicalPlan", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "architecturalPlanFileType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "structuralPlanFileType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "electricalPlanFileType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketproductDto.prototype, "mechanicalPlanFileType", void 0);
//# sourceMappingURL=create-marketproduct.dto.js.map