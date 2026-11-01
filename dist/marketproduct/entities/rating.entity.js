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
exports.Rating = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const user_entity_1 = require("../../user/entities/user.entity");
const marketproduct_entity_1 = require("./marketproduct.entity");
let Rating = class Rating {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, rating: { required: true, type: () => Number }, comment: { required: false, type: () => String }, user: { required: true, type: () => require("../../user/entities/user.entity").User }, userId: { required: true, type: () => String }, product: { required: true, type: () => require("./marketproduct.entity").MarketProduct }, productId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Rating = Rating;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Rating.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Rating.prototype, "rating", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Rating.prototype, "comment", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => user_entity_1.User, { nullable: false, onDelete: 'CASCADE' }),
    (0, database_module_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Rating.prototype, "user", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], Rating.prototype, "userId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => marketproduct_entity_1.MarketProduct, (product) => product.ratings, {
        nullable: false,
        onDelete: 'CASCADE',
    }),
    (0, database_module_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", marketproduct_entity_1.MarketProduct)
], Rating.prototype, "product", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], Rating.prototype, "productId", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Rating.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Rating.prototype, "updatedAt", void 0);
exports.Rating = Rating = __decorate([
    (0, database_module_1.Entity)('ratings')
], Rating);
//# sourceMappingURL=rating.entity.js.map