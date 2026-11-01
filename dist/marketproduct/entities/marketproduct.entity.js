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
exports.MarketProduct = exports.MarketProductStatus = exports.FileTypeOption = exports.PlanType = exports.ProductCategory = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const agent_entity_1 = require("../../agent/entities/agent.entity");
const rating_entity_1 = require("./rating.entity");
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["BUILDING_PLAN"] = "Building Plan";
    ProductCategory["INTERIOR_DESIGN"] = "Product Design";
    ProductCategory["LANDSCAPE_DESIGN"] = "Building Guide";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var PlanType;
(function (PlanType) {
    PlanType["RESIDENTIAL"] = "Residential";
    PlanType["COMMERCIAL"] = "Commercial";
    PlanType["INDUSTRIAL"] = "Industrial";
})(PlanType || (exports.PlanType = PlanType = {}));
var FileTypeOption;
(function (FileTypeOption) {
    FileTypeOption["PDF_ONLY"] = "PDF only";
    FileTypeOption["CAD_PDF"] = "CAD + PDF";
    FileTypeOption["THREE_D_CAD_PDF"] = "3D Model + CAD + PDF";
})(FileTypeOption || (exports.FileTypeOption = FileTypeOption = {}));
var MarketProductStatus;
(function (MarketProductStatus) {
    MarketProductStatus["PENDING_REVIEW"] = "pending_review";
    MarketProductStatus["APPROVED"] = "approved";
    MarketProductStatus["REJECTED"] = "rejected";
})(MarketProductStatus || (exports.MarketProductStatus = MarketProductStatus = {}));
let MarketProduct = class MarketProduct {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, productId: { required: true, type: () => String }, title: { required: true, type: () => String }, category: { required: true, enum: require("./marketproduct.entity").ProductCategory }, planType: { required: true, enum: require("./marketproduct.entity").PlanType }, numBedrooms: { required: false, type: () => String }, numBathrooms: { required: false, type: () => String }, numFloors: { required: false, type: () => String }, price: { required: true, type: () => Number }, description: { required: true, type: () => String }, area: { required: false, type: () => String }, designStyle: { required: false, type: () => String }, fileType: { required: true, enum: require("./marketproduct.entity").FileTypeOption }, drawingSet: { required: false, type: () => [String] }, addOns: { required: false, type: () => [String] }, productImage: { required: false, type: () => [String] }, architecturalPlan: { required: false, type: () => [String] }, structuralPlan: { required: false, type: () => [String] }, electricalPlan: { required: false, type: () => [String] }, mechanicalPlan: { required: false, type: () => [String] }, architecturalPlanFileType: { required: false, type: () => String }, structuralPlanFileType: { required: false, type: () => String }, electricalPlanFileType: { required: false, type: () => String }, mechanicalPlanFileType: { required: false, type: () => String }, status: { required: true, enum: require("./marketproduct.entity").MarketProductStatus }, ratings: { required: true, type: () => [require("./rating.entity").Rating] }, averageRating: { required: true, type: () => Number }, ratingCount: { required: true, type: () => Number }, agent: { required: true, type: () => require("../../agent/entities/agent.entity").Agent }, agentId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.MarketProduct = MarketProduct;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MarketProduct.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MarketProduct.prototype, "productId", void 0);
__decorate([
    (0, database_module_1.Column)(),
    __metadata("design:type", String)
], MarketProduct.prototype, "title", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: ProductCategory,
        default: ProductCategory.BUILDING_PLAN,
    }),
    __metadata("design:type", String)
], MarketProduct.prototype, "category", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: PlanType,
        default: PlanType.RESIDENTIAL,
    }),
    __metadata("design:type", String)
], MarketProduct.prototype, "planType", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MarketProduct.prototype, "numBedrooms", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MarketProduct.prototype, "numBathrooms", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MarketProduct.prototype, "numFloors", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], MarketProduct.prototype, "price", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], MarketProduct.prototype, "description", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MarketProduct.prototype, "area", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MarketProduct.prototype, "designStyle", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: FileTypeOption,
        default: FileTypeOption.PDF_ONLY,
    }),
    __metadata("design:type", String)
], MarketProduct.prototype, "fileType", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], MarketProduct.prototype, "drawingSet", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], MarketProduct.prototype, "addOns", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], MarketProduct.prototype, "productImage", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], MarketProduct.prototype, "architecturalPlan", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], MarketProduct.prototype, "structuralPlan", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], MarketProduct.prototype, "electricalPlan", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], MarketProduct.prototype, "mechanicalPlan", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], MarketProduct.prototype, "architecturalPlanFileType", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], MarketProduct.prototype, "structuralPlanFileType", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], MarketProduct.prototype, "electricalPlanFileType", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], MarketProduct.prototype, "mechanicalPlanFileType", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: MarketProductStatus,
        default: MarketProductStatus.PENDING_REVIEW,
    }),
    __metadata("design:type", String)
], MarketProduct.prototype, "status", void 0);
__decorate([
    (0, database_module_1.OneToMany)(() => rating_entity_1.Rating, (rating) => rating.product),
    __metadata("design:type", Array)
], MarketProduct.prototype, "ratings", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], MarketProduct.prototype, "averageRating", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], MarketProduct.prototype, "ratingCount", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => agent_entity_1.Agent, { nullable: false, onDelete: 'CASCADE' }),
    (0, database_module_1.JoinColumn)({ name: 'agentId' }),
    __metadata("design:type", agent_entity_1.Agent)
], MarketProduct.prototype, "agent", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], MarketProduct.prototype, "agentId", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MarketProduct.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MarketProduct.prototype, "updatedAt", void 0);
exports.MarketProduct = MarketProduct = __decorate([
    (0, database_module_1.Entity)('market_products')
], MarketProduct);
//# sourceMappingURL=marketproduct.entity.js.map