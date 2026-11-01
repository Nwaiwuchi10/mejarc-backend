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
exports.OrderItem = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const order_entity_1 = require("./order.entity");
const marketproduct_entity_1 = require("../../marketproduct/entities/marketproduct.entity");
let OrderItem = class OrderItem {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, order: { required: true, type: () => require("./order.entity").Order }, orderId: { required: true, type: () => String }, product: { required: true, type: () => require("../../marketproduct/entities/marketproduct.entity").MarketProduct }, productId: { required: true, type: () => String }, totalQuantity: { required: true, type: () => Number }, totalPrice: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.OrderItem = OrderItem;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OrderItem.prototype, "id", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => order_entity_1.Order, (order) => order.orderItems, { onDelete: 'CASCADE' }),
    (0, database_module_1.JoinColumn)({ name: 'orderId' }),
    __metadata("design:type", order_entity_1.Order)
], OrderItem.prototype, "order", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], OrderItem.prototype, "orderId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => marketproduct_entity_1.MarketProduct, { eager: true, nullable: true }),
    (0, database_module_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", marketproduct_entity_1.MarketProduct)
], OrderItem.prototype, "product", void 0);
__decorate([
    (0, database_module_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "productId", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "totalQuantity", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "totalPrice", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OrderItem.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], OrderItem.prototype, "updatedAt", void 0);
exports.OrderItem = OrderItem = __decorate([
    (0, database_module_1.Entity)('order_items')
], OrderItem);
//# sourceMappingURL=order-item.entity.js.map